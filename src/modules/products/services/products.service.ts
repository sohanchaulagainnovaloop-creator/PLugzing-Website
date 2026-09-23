import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { Product } from '../entities/product.entity';
import { QueryDto } from '../../../common/dto/query.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ReplaceProductDto } from '../dto/replace-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(queryDto: QueryDto) {
    const { page, limit, search, minPrice, maxPrice, sortBy, sortOrder } =
      queryDto;

    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Product> = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    const order: FindOptionsOrder<Product> = {
      [sortBy]: sortOrder,
    };

    const [items, total] = await this.productRepository.findAndCount({
      where,
      skip,
      take: limit,
      order,
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);

    return this.productRepository.save(product);
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  async replace(id: number, replaceProductDto: ReplaceProductDto) {
    const product = await this.findOne(id);

    product.name = replaceProductDto.name;
    product.price = replaceProductDto.price;

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);

    await this.productRepository.softRemove(product);

    return {
      message: 'Product deleted successfully',
    };
  }
}
