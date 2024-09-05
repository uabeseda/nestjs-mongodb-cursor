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

Mark any controller method that should return a streamed cursor with the @StreamMongoCursor() decorator.

#### Example with Mongoose

Here’s how to stream a Mongoose cursor:

```typescript
import { Controller, Get } from '@nestjs/common';
import { StreamMongoCursor } from '@uabeseda/nestjs-mongodb-cursor';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

@Controller('users')
export class UserController {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Get('stream')
  @StreamMongoCursor()
  async streamUsers() {
    return this.userModel.find().cursor();
  }
}
```

#### Example with Native MongoDB

If you are working with the native MongoDB driver:
    
```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import { StreamMongoCursor } from '@uabeseda/nestjs-mongodb-cursor';
import { Db } from 'mongodb';

@Controller('users')
export class UserController {
  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  @Get('stream')
  @StreamMongoCursor()
  async streamUsers() {
    const collection = this.db.collection('users');
    return collection.find().stream();
  }
}
```
