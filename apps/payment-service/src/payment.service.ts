import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async initiatePayment(userId: string, dto: CreatePaymentDto) {
    // Check if payment already exists for this order
    const existingPayment = await this.paymentRepository.findOne({
      where: { orderId: dto.orderId, status: PaymentStatus.COMPLETED },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already completed for this order');
    }

    // Create payment record
    const payment = this.paymentRepository.create({
      orderId: dto.orderId,
      userId,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod as PaymentMethod,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Handle Cash on Delivery
    if (dto.paymentMethod === 'CASH_ON_DELIVERY') {
      return {
        paymentId: savedPayment.id,
        status: PaymentStatus.PENDING,
        message: 'Cash on delivery order placed successfully',
      };
    }

    // Simulate payment gateway integration
    const gatewayResponse = await this.processPaymentWithGateway(dto);

    // Update payment with transaction details
    savedPayment.transactionId = gatewayResponse.transactionId;
    savedPayment.status = PaymentStatus.PROCESSING;
    savedPayment.gatewayResponse = JSON.stringify(gatewayResponse);

    await this.paymentRepository.save(savedPayment);

    return {
      paymentId: savedPayment.id,
      transactionId: gatewayResponse.transactionId,
      status: PaymentStatus.PROCESSING,
      message: 'Payment initiated successfully',
    };
  }

  async verifyPayment(paymentId: string, dto: VerifyPaymentDto) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      return {
        status: PaymentStatus.COMPLETED,
        message: 'Payment already verified',
      };
    }

    // Simulate gateway verification
    const isVerified = await this.verifyWithGateway(
      payment.transactionId,
      dto.transactionId,
    );

    if (isVerified) {
      payment.status = PaymentStatus.COMPLETED;
      payment.completedAt = new Date();
    } else {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Payment verification failed';
    }

    await this.paymentRepository.save(payment);

    // TODO: Emit event to order service via Kafka to update order status

    return {
      status: payment.status,
      message:
        payment.status === PaymentStatus.COMPLETED
          ? 'Payment verified successfully'
          : 'Payment verification failed',
    };
  }

  async getPaymentById(paymentId: string, userId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId, userId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentByOrderId(orderId: string, userId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { orderId, userId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for this order');
    }

    return payment;
  }

  async getUserPayments(userId: string) {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async refundPayment(paymentId: string, dto: RefundPaymentDto) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      throw new BadRequestException('Payment already refunded');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    // Simulate refund processing with payment gateway
    const refundAmount = dto.amount || payment.amount;
    
    if (refundAmount > payment.amount) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    // Process refund with gateway
    const refundResponse = await this.processRefundWithGateway(
      payment.transactionId,
      refundAmount,
    );

    payment.status = PaymentStatus.REFUNDED;
    payment.failureReason = dto.reason;

    await this.paymentRepository.save(payment);

    // TODO: Emit event to order service via Kafka

    return {
      status: PaymentStatus.REFUNDED,
      refundAmount,
      message: 'Refund processed successfully',
    };
  }

  // Mock payment gateway methods
  private async processPaymentWithGateway(dto: CreatePaymentDto) {
    // Simulate payment gateway API call
    // In production, integrate with Razorpay, Stripe, PayPal, etc.
    
    await this.simulateDelay(1000);

    return {
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(7)}`,
      gatewayOrderId: `ORDER${Date.now()}`,
      status: 'initiated',
    };
  }

  private async verifyWithGateway(
    storedTransactionId: string,
    providedTransactionId: string,
  ): Promise<boolean> {
    // Simulate gateway verification
    // In production, verify signature and transaction with payment gateway
    
    await this.simulateDelay(500);

    // For demo, always return true if transaction IDs match
    return storedTransactionId === providedTransactionId;
  }

  private async processRefundWithGateway(
    transactionId: string,
    amount: number,
  ) {
    // Simulate refund API call
    await this.simulateDelay(1000);

    return {
      refundId: `REFUND${Date.now()}`,
      status: 'processed',
    };
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}