export interface CheckFraudDto {
  vendor: string; // address
  amount: string; // wei as string
}

export interface FraudResponseDto {
  score: number; // 0-100
  reason: string;
  proof: string; // TEE attestation
  flagged: boolean; // true if score > 70
}
