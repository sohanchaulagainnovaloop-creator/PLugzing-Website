import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ProductsService } from '../services/products.service';

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ReplaceProductDto } from '../dto/replace-product.dto';

import { QueryDto } from '../../../common/dto/query.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';

import { Roles } from '../../auth/decorators/roles.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';

import { UserRole } from '../../auth/enums/user-role.enum';
import { Permission } from '../../auth/enums/permission.enum';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ============================================================
  // GET ALL PRODUCTS
  // ============================================================

  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Permissions(Permission.PRODUCT_READ)
  @ApiOperation({
    summary: 'Get products with pagination, search, filter and sorting',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'laptop',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    example: 5000,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    example: 100000,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'price', 'createdAt'],
    example: 'price',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  findAll(@Query() queryDto: QueryDto) {
    return this.productsService.findAll(queryDto);
  }

  // ============================================================
  // GET PRODUCT BY ID
  // ============================================================

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Permissions(Permission.PRODUCT_READ)
  @ApiOperation({
    summary: 'Get product by ID',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.productsService.findOne(id);
  }

  // ============================================================
  // REPLACE PRODUCT
  // ============================================================

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.PRODUCT_UPDATE)
  @ApiOperation({
    summary: 'Replace product',
  })
  replace(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    replaceProductDto: ReplaceProductDto,
  ) {
    return this.productsService.replace(id, replaceProductDto);
  }

  // ============================================================
  // UPDATE PRODUCT
  // ============================================================

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.PRODUCT_UPDATE)
  @ApiOperation({
    summary: 'Partially update product',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.PRODUCT_DELETE)
  @ApiOperation({
    summary: 'Delete product',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.productsService.remove(id);
  }

  // ============================================================
  // CREATE PRODUCT
  // ============================================================

  @Post()
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.PRODUCT_CREATE)
  @ApiOperation({
    summary: 'Create product',
  })
  create(
    @Body()
    createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto);
  }
}
