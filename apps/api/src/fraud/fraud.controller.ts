import { Controller, Post, Body } from '@nestjs/common';
import { FraudService } from './fraud.service';
import { CheckFraudDto, FraudResponseDto } from './fraud.dto';

@Controller('fraud')
export class FraudController {
  constructor(private fraudService: FraudService) {}

  @Post('check')
  async check(@Body() dto: CheckFraudDto): Promise<{ success: boolean; data: FraudResponseDto }> {
    const result = await this.fraudService.checkFraud(dto);
    return { success: true, data: result };
  }

  @Post('verify-proof')
  async verifyProof(@Body() dto: { proof: string }): Promise<{ success: boolean; data: { valid: boolean } }> {
    const valid = await this.fraudService.verifyProof(dto.proof);
    return { success: true, data: { valid } };
  }
}
