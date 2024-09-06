import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Readable } from 'stream';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StreamMongoCursorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return new Observable((observer) => {
      next.handle().subscribe({
        next: async (data) => {
          const isMongoStream = Reflect.getMetadata('mongoCursor', context.getHandler());
          const type = Reflect.getMetadata('cursorType', context.getHandler());

          if (isMongoStream && this.isStreamable(data)) {
            const response = context.switchToHttp().getResponse();
            response.setHeader('Content-Type', 'application/json');
            try {
              response.write('[');
              let first = true;

              if (typeof data.stream === 'function') {
                data = data.stream();
              }
              for await (const doc of data) {
                if (!first) {
                  response.write(',');
                }
                const serializedDoc = type
                  ? JSON.stringify(plainToInstance(type, doc, { excludeExtraneousValues: true }))
                  : JSON.stringify(doc);
                response.write(serializedDoc);
                first = false;
              }

              response.write(']');
              response.end();
            } catch (e) {
              console.error('Error in stream processing:', e);
              if (!response.headersSent) {
                response.status(500).json({ error: 'An error occurred while processing the stream' });
              }
              observer.error(e);
            }
          } else {
            observer.next(data);
            observer.complete();
          }
        },
        error: (err) => observer.error(err),
      });
    });
  }

  /*
    private isStreamable1(data: any): boolean {
      return (
        data instanceof Readable ||
        data instanceof FindCursor ||
        data instanceof AggregationCursor ||
        data instanceof MongooseCursor
      );
    }
  */

  private isStreamable(data: any): boolean {
    return (
      data instanceof Readable ||
      (typeof data[Symbol.asyncIterator] === 'function') ||
      (typeof data.stream === 'function')
    );
  }
}
