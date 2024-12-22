import 'reflect-metadata';
import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, Public } from './public.decorator';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn().mockImplementation((key, value) => {
    return (target: any, propertyKey: string) => {
      Reflect.defineMetadata(key, value, target, propertyKey);
    };
  }),
}));

describe('PublicDecorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(Public).toBeDefined();
  });

  it('should call SetMetadata with correct parameters', () => {
    Public();
    expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
  });

  it('should set metadata correctly when applied to a method', () => {
    class TestClass {
      @Public()
      testMethod() {}
    }

    const instance = new TestClass();
    const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, instance, 'testMethod');
    expect(metadata).toBe(true);
  });
});
