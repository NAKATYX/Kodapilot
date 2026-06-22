import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, OrderResponseDto } from './orders.dto';
import { ethers } from 'ethers';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    // Generate orderId as keccak256 hash of buyer + vendor + timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    const orderId = ethers.id(
      `${dto.buyer}:${dto.vendor}:${timestamp}`
    );

    // Save to DB
    const order = await (this.prisma as any).order.create({
      data: {
        id: orderId,
        buyer: ethers.getAddress(dto.buyer),
        vendor: ethers.getAddress(dto.vendor),
        reseller: dto.reseller ? ethers.getAddress(dto.reseller) : ethers.ZeroAddress,
        amount: dto.amount,
        status: 'ESCROWED',
        depositedAt: new Date(timestamp * 1000),
        ...(dto.productId && {
          listing: { connect: { id: dto.productId } },
        }),
      },
    });

    return this.formatOrder(order);
  }

  async getOrder(id: string): Promise<OrderResponseDto | null> {
    const order = await (this.prisma as any).order.findUnique({
      where: { id },
    });

    if (!order) return null;
    return this.formatOrder(order);
  }

  async confirmDelivery(id: string): Promise<OrderResponseDto> {
    const order = await (this.prisma as any).order.update({
      where: { id },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
      },
    });

    return this.formatOrder(order);
  }

  async release(id: string): Promise<OrderResponseDto> {
    const order = await (this.prisma as any).order.update({
      where: { id },
      data: {
        status: 'RELEASED',
        releasedAt: new Date(),
      },
    });

    return this.formatOrder(order);
  }

  async refund(id: string, reason: string): Promise<OrderResponseDto> {
    const order = await (this.prisma as any).order.update({
      where: { id },
      data: {
        status: 'REFUNDED',
        refundReason: reason,
      },
    });

    return this.formatOrder(order);
  }

  async getOrdersByBuyer(buyer: string): Promise<OrderResponseDto[]> {
    const orders = await (this.prisma as any).order.findMany({
      where: { buyer: ethers.getAddress(buyer) },
      orderBy: { depositedAt: 'desc' },
    });

    return orders.map((o: any) => this.formatOrder(o));
  }

  async getOrdersByVendor(vendor: string): Promise<OrderResponseDto[]> {
    const orders = await (this.prisma as any).order.findMany({
      where: { vendor: ethers.getAddress(vendor) },
      orderBy: { depositedAt: 'desc' },
    });

    return orders.map((o: any) => this.formatOrder(o));
  }

  private formatOrder(order: any): OrderResponseDto {
    return {
      orderId: order.id,
      buyer: order.buyer,
      vendor: order.vendor,
      reseller: order.reseller,
      amount: order.amount,
      status: this.statusToNumber(order.status),
      depositedAt: Math.floor(order.depositedAt.getTime() / 1000),
      deliveredAt: order.deliveredAt ? Math.floor(order.deliveredAt.getTime() / 1000) : 0,
      releasedAt: order.releasedAt ? Math.floor(order.releasedAt.getTime() / 1000) : 0,
    };
  }

  private statusToNumber(status: string): number {
    const statuses: Record<string, number> = {
      ESCROWED: 0,
      DELIVERED: 1,
      RELEASED: 2,
      REFUNDED: 3,
      DISPUTED: 4,
    };
    return statuses[status] || 0;
  }
}
