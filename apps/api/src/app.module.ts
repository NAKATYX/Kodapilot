import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { FraudModule } from './fraud/fraud.module';

@Module({
  imports: [OrdersModule, ProductsModule, FraudModule],
})
export class AppModule {}
