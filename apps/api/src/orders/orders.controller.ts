import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, ConfirmDeliveryDto, ReleaseDto, OrderResponseDto } from './orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<{ success: boolean; data: OrderResponseDto }> {
    const order = await this.ordersService.createOrder(dto);
    return { success: true, data: order };
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<{ success: boolean; data: OrderResponseDto | null }> {
    const order = await this.ordersService.getOrder(id);
    return { success: true, data: order };
  }

  @Post(':id/confirm-delivery')
  async confirmDelivery(
    @Param('id') id: string,
    @Body() _dto: ConfirmDeliveryDto
  ): Promise<{ success: boolean; data: OrderResponseDto }> {
    const order = await this.ordersService.confirmDelivery(id);
    return { success: true, data: order };
  }

  @Post(':id/release')
  async release(
    @Param('id') id: string,
    @Body() _dto: ReleaseDto
  ): Promise<{ success: boolean; data: OrderResponseDto }> {
    const order = await this.ordersService.release(id);
    return { success: true, data: order };
  }

  @Post(':id/refund')
  async refund(
    @Param('id') id: string,
    @Body() dto: { reason: string }
  ): Promise<{ success: boolean; data: OrderResponseDto }> {
    const order = await this.ordersService.refund(id, dto.reason);
    return { success: true, data: order };
  }

  @Get('buyer/:address')
  async getByBuyer(@Param('address') address: string): Promise<{ success: boolean; data: OrderResponseDto[] }> {
    const orders = await this.ordersService.getOrdersByBuyer(address);
    return { success: true, data: orders };
  }

  @Get('vendor/:address')
  async getByVendor(@Param('address') address: string): Promise<{ success: boolean; data: OrderResponseDto[] }> {
    const orders = await this.ordersService.getOrdersByVendor(address);
    return { success: true, data: orders };
  }
}
