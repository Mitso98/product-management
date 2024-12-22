import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([
        [
          /* array of products */
        ],
        1,
      ]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const result: Product = {
        id: '1',
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(result);
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.create(createProductDto)).toEqual(result);
      expect(repository.create).toHaveBeenCalledWith(createProductDto);
      expect(repository.save).toHaveBeenCalledWith(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const query: QueryProductDto = { search: 'test', page: 1, limit: 10 };
      const result = {
        items: [
          {
            id: '1',
            name: 'Test Product',
            description: 'Test Description',
            price: 100,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        lastPage: 1,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([result.items, result.total]),
      } as any);

      expect(await service.findAll(query)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne('1')).toEqual(result);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 5,
      };

      const existingProduct: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProduct: Product = {
        ...existingProduct,
        ...updateProductDto,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingProduct);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedProduct);

      expect(await service.update('1', updateProductDto)).toEqual(
        updatedProduct,
      );
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(repository.save).toHaveBeenCalledWith(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      jest.spyOn(repository, 'remove').mockResolvedValue(product);

      await service.remove('1');
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(repository.remove).toHaveBeenCalledWith(product);
    });

    it('should not throw an error if product not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove('1')).resolves.toBeUndefined();
    });
  });
});
