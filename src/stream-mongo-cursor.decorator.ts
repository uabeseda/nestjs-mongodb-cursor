import { ClassConstructor } from 'class-transformer';

export const StreamMongoCursor = ({ type }: { type?: ClassConstructor<any> } = {}) => (
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) => {
  Reflect.defineMetadata('mongoCursor', true, descriptor.value);
  if (type) {
    Reflect.defineMetadata('cursorType', type, descriptor.value);
  }
};
