import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, ProductResponseDto, SuggestProductDto, SuggestResponseDto } from './products.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<{ success: boolean; data: ProductResponseDto }> {
    const product = await this.productsService.createProduct(dto);
    return { success: true, data: product };
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<{ success: boolean; data: ProductResponseDto | null }> {
    const product = await this.productsService.getProduct(id);
    return { success: true, data: product };
  }

  @Get()
  async list(
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 20
  ): Promise<{ success: boolean; data: ProductResponseDto[] }> {
    const products = await this.productsService.listProducts(category, minPrice, maxPrice, skip, take);
    return { success: true, data: products };
  }

  @Get('vendor/:address')
  async getByVendor(
    @Param('address') address: string,
    @Query('skip') skip = 0,
    @Query('take') take = 20
  ): Promise<{ success: boolean; data: ProductResponseDto[] }> {
    const products = await this.productsService.listByVendor(address, skip, take);
    return { success: true, data: products };
  }

  @Post('suggest')
  async suggest(@Body() dto: SuggestProductDto): Promise<{ success: boolean; data: SuggestResponseDto }> {
    const result = await this.productsService.suggestProducts(dto);
    return { success: true, data: result };
  }
}
