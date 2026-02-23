import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ZodValidationPipe } from '@app/common';
import { CreateOrderSchema, CreateOrderDto, UpdateOrderStatusSchema, UpdateOrderStatusDto } from './dto/order.dto';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body(new ZodValidationPipe(CreateOrderSchema)) dto: CreateOrderDto,
    @Request() req: any,
  ) {
    // In production, get userId from JWT token
    const userId = req.headers['x-user-id'] || 'mock-user-id';
    return this.orderService.createOrder(userId, dto);
  }

  @Get()
  async getUserOrders(@Request() req: any) {
    const userId = req.headers['x-user-id'] || 'mock-user-id';
    return this.orderService.getUserOrders(userId);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string, @Request() req: any) {
    const userId = req.headers['x-user-id'] || 'mock-user-id';
    return this.orderService.getOrderById(id, userId);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateOrderStatusSchema))
    dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, dto);
  }

  @Patch(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Request() req: any) {
    const userId = req.headers['x-user-id'] || 'mock-user-id';
    return this.orderService.cancelOrder(id, userId);
  }
}