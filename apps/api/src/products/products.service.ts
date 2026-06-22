import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, ProductResponseDto, SuggestProductDto, SuggestResponseDto } from './products.dto';
import { ethers } from 'ethers';
import { ComputeClient } from '@kodapilot/zerog';

@Injectable()
export class ProductsService {
  private computeClient: ComputeClient;

  constructor(private prisma: PrismaService) {
    const routerUrl = process.env.OG_COMPUTE_ROUTER || 'https://router-api-testnet.integratenetwork.work/v1';
    const apiKey = process.env.OG_COMPUTE_API_KEY || '';
    this.computeClient = new ComputeClient(routerUrl, apiKey);
  }

  async createProduct(dto: CreateProductDto): Promise<ProductResponseDto> {
    const description = dto.description || (await this.generateCopy(dto.name, 500));

    const product = await (this.prisma as any).product.create({
      data: {
        id: ethers.id(`${dto.vendorId}:${dto.name}:${Date.now()}`),
        name: dto.name,
        price: dto.price,
        description,
        category: dto.category,
        vendor: ethers.getAddress(dto.vendorId),
        authenticityScore: 50, // Start neutral
      },
    });

    return this.formatProduct(product);
  }

  async getProduct(id: string): Promise<ProductResponseDto | null> {
    const product = await (this.prisma as any).product.findUnique({
      where: { id },
    });

    if (!product) return null;
    return this.formatProduct(product);
  }

  async listProducts(
    category?: string,
    minPrice?: string,
    maxPrice?: string,
    skip = 0,
    take = 20
  ): Promise<ProductResponseDto[]> {
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = minPrice;
      }
      if (maxPrice) {
        where.price.lte = maxPrice;
      }
    }

    const products = await (this.prisma as any).product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p: any) => this.formatProduct(p));
  }

  async listByVendor(vendor: string, skip = 0, take = 20): Promise<ProductResponseDto[]> {
    const products = await (this.prisma as any).product.findMany({
      where: { vendor: ethers.getAddress(vendor) },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p: any) => this.formatProduct(p));
  }

  async suggestProducts(dto: SuggestProductDto): Promise<SuggestResponseDto> {
    const budgetEth = Number(dto.budget) / 1e18;
    const count = dto.count || 3;

    try {
      const result = await this.computeClient.suggestProduct(dto.category, budgetEth, count);
      return {
        products: result.products,
        proof: result.proof,
      };
    } catch (err) {
      console.error('Error suggesting products:', err);
      // Return fallback suggestions
      return {
        products: [
          { name: `${dto.category} Item 1`, price: budgetEth * 0.5, margin_bps: 5000 },
          { name: `${dto.category} Item 2`, price: budgetEth * 0.6, margin_bps: 4000 },
          { name: `${dto.category} Item 3`, price: budgetEth * 0.7, margin_bps: 3000 },
        ],
        proof: 'fallback',
      };
    }
  }

  private async generateCopy(productName: string, marginBps: number): Promise<string> {
    try {
      const result = await this.computeClient.generateListingCopy(productName, marginBps);
      return result.copy;
    } catch (err) {
      console.error('Error generating copy:', err);
      return `Premium ${productName} - High margin resale opportunity`;
    }
  }

  private formatProduct(product: any): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category,
      vendor: product.vendor,
      margin_bps: 5000, // Placeholder, would come from Listing
      authenticity_score: product.authenticityScore,
      created_at: Math.floor(product.createdAt.getTime() / 1000),
    };
  }
}
