import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ZodValidationPipe } from '@app/common';
import { CreatePaymentSchema, CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentSchema, VerifyPaymentDto } from './dto/verify-payment.dto';
import { RefundPaymentSchema, RefundPaymentDto } from './dto/refund-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(
    @Body(new ZodValidationPipe(CreatePaymentSchema)) dto: CreatePaymentDto,
    @Request() req: any,
  ) {
    const userId = req.headers['x-user-id'] || 'mock-user-id';
    return this.paymentService.initiatePayment(userId, dto);
  }

  @Post(':id/verify')
  async verifyPayment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(VerifyPaymentSchema)) dto: VerifyPaymentDto,
  ) {
    return this.paymentService.verifyPayment(id, dto);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string, @Request() req: any) {
    const userId = req.headers['x-user-id'] || 'mock-user-id';
    return this.paymentService.getPaymentById(id, userId);
  }

  @Get('order/:orderId')
  async getPaymentByOrderId(
    @Param('orderId') orderId: string,
    @Request() req: any,
  ) {
    const userId = req.headers['x-user-id'] || 'mock-user-id';
    return this.paymentService.getPaymentByOrderId(orderId, userId);
  }

  @Get()
  async getUserPayments(@Request() req: any) {
    const userId = req.headers['x-user-id'] || 'mock-user-id';
    return this.paymentService.getUserPayments(userId);
  }

  @Post(':id/refund')
  async refundPayment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(RefundPaymentSchema)) dto: RefundPaymentDto,
  ) {
    return this.paymentService.refundPayment(id, dto);
  }
}
