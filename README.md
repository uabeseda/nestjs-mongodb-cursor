# @uabeseda/nestjs-mongodb-cursor

## Description

`@uabeseda/nestjs-mongodb-cursor` is a NestJS library that provides a decorator and an interceptor to stream MongoDB or Mongoose cursors directly to the HTTP response. This allows for efficient data transfer, especially when dealing with large datasets.

## Installation

Install the package via npm:

```bash
npm install @uabeseda/nestjs-mongodb-cursor
```

## Usage

### Global Setup

To apply the cursor streaming interceptor globally across your application

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { StreamMongoCursorInterceptor } from '@uabeseda/nestjs-mongodb-cursor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StreamMongoCursorInterceptor,
    },
  ],
})
export class AppModule {}
```

### Per-Controller Setup

If you prefer to apply the interceptor to specific controllers, use the @UseInterceptors() decorator

```typescript
import { Controller, UseInterceptors } from '@nestjs/common';
import { StreamMongoCursorInterceptor } from '@uabeseda/nestjs-mongodb-cursor';

@Controller('users')
@UseInterceptors(StreamMongoCursorInterceptor)
export class UserController {
  // Controller methods here
}
```

### Using the @StreamMongoCursor() Decorator

Mark any controller method that should return a streamed cursor with the @StreamMongoCursor() decorator. It can be used with or without a type parameter for serialization.

#### Basic usage

```typescript
import { StreamMongoCursor } from '@uabeseda/nestjs-mongodb-cursor';

@Controller('users')
export class UserController {
  constructor(private readonly dataService: DataService) {
  }

  @Get()
  @StreamMongoCursor()
  getData() {
    return this.dataService.getCursor();
  }
}
```

#### Custom Serialization

You can provide a type for custom serialization using class-transformer:

```typescript
import { StreamMongoCursor } from '@uabeseda/nestjs-mongodb-cursor';
import { YourResponseType } from './your-response-type';

@Controller('users')
export class UserController {
  constructor(private readonly dataService: DataService) {
  }

  @Get()
  @StreamMongoCursor({ type: YourResponseType })
  async getData() {
    return this.dataService.getCursor();
  }
}
```
