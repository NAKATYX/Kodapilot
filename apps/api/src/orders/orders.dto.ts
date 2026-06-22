export interface CreateOrderDto {
  buyer: string; // address
  vendor: string; // address
  reseller: string; // address (optional, can be zero)
  amount: string; // wei as string (for precision)
  productId?: string;
}

export interface ConfirmDeliveryDto {
  buyer: string;
}

export interface ReleaseDto {
  buyer: string;
}

export interface OrderResponseDto {
  orderId: string; // bytes32
  buyer: string;
  vendor: string;
  reseller: string;
  amount: string; // wei
  status: number; // 0=ESCROWED, 1=DELIVERED, 2=RELEASED, 3=REFUNDED, 4=DISPUTED
  depositedAt: number;
  deliveredAt: number;
  releasedAt: number;
  txHash?: string;
}
