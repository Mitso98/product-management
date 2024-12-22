import { Product } from './product.entity';

describe('ProductEntity', () => {
  it('should be defined', () => {
    expect(new Product()).toBeDefined();
  });
});
