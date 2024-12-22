import { Product } from './product.entity';

describe('ProductEntity', () => {
  it('should be defined', () => {
    expect(new Product()).toBeDefined();
  });

  it('should have the correct default values', () => {
    const product = new Product();
    expect(product.id).toBeUndefined();
    expect(product.name).toBeUndefined();
    expect(product.description).toBeUndefined();
    expect(product.price).toBeUndefined();
    expect(product.stock).toBeUndefined();
    expect(product.createdAt).toBeUndefined();
    expect(product.updatedAt).toBeUndefined();
  });

  it('should allow setting and getting properties', () => {
    const product = new Product();
    product.id = '1';
    product.name = 'Test Product';
    product.description = 'Test Description';
    product.price = 100;
    product.stock = 10;
    product.createdAt = new Date('2024-01-01');
    product.updatedAt = new Date('2024-01-02');

    expect(product.id).toBe('1');
    expect(product.name).toBe('Test Product');
    expect(product.description).toBe('Test Description');
    expect(product.price).toBe(100);
    expect(product.stock).toBe(10);
    expect(product.createdAt).toEqual(new Date('2024-01-01'));
    expect(product.updatedAt).toEqual(new Date('2024-01-02'));
  });
});
