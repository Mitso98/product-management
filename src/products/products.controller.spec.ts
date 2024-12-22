import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';
import { Product } from './entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createProductDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
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

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(query)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(query);
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

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
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

      const result: Product = {
        id: '1',
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateProductDto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('1', updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
