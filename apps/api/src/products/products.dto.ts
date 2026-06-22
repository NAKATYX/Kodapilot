export interface CreateProductDto {
  name: string;
  price: string; // wei as string
  description?: string;
  category: string;
  vendorId: string; // address
}

export interface SuggestProductDto {
  category: string;
  budget: string; // wei as string
  count?: number;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  price: string; // wei
  description: string;
  category: string;
  vendor: string; // address
  margin_bps: number;
  authenticity_score: number;
  created_at: number; // unix timestamp
}

export interface SuggestResponseDto {
  products: Array<{
    name: string;
    price: number;
    margin_bps: number;
  }>;
  proof: string; // TEE attestation from ComputeClient
}
