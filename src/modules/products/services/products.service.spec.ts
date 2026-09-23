
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a product when product exists', async () => {
      const product = {
        id: 1,
        name: 'Laptop',
        price: 50000,
      } as Product;

      repository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(result).toEqual(product);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and save a product', async () => {
      const dto = {
        name: 'Laptop',
        price: 50000,
      };

      const product = {
        id: 1,
        ...dto,
      } as Product;

      repository.create.mockReturnValue(product);
      repository.save.mockResolvedValue(product);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(product);
      expect(result).toEqual(product);
    });
  });

  describe('remove', () => {
    it('should soft delete a product', async () => {
      const product = {
        id: 1,
        name: 'Laptop',
        price: 50000,
      } as Product;

      repository.findOne.mockResolvedValue(product);
      repository.softRemove.mockResolvedValue(product);

      const result = await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(repository.softRemove).toHaveBeenCalledWith(product);

      expect(result).toEqual({
        message: 'Product deleted successfully',
      });
    });
  });
});
