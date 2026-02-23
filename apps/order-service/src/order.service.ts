import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    // In a real app, you'd fetch menu items from catalog service to get prices
    // For now, we'll use mock data
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    // Calculate order totals
    for (const item of dto.items) {
      // In production, fetch from catalog service via Kafka/HTTP
      const price = 299; // Mock price
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        menuItemName: 'Mock Item', // Fetch from catalog
        price: price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
        subtotal: itemSubtotal,
      });
    }

    const deliveryFee = 50; // Fixed delivery fee
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + deliveryFee + tax;

    // Create order
    const order = this.orderRepository.create({
      userId,
      restaurantId: dto.restaurantId,
      restaurantName: 'Mock Restaurant', // Fetch from catalog
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress: dto.deliveryAddress,
      deliveryInstructions: dto.deliveryInstructions,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const itemsToSave = orderItems.map((item) => ({
      ...item,
      orderId: savedOrder.id,
    }));
    
    await this.orderItemRepository.save(itemsToSave as OrderItem[]);

    // Return order with items
    return this.getOrderById(savedOrder.id, userId);
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transition
    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.PICKED_UP, OrderStatus.CANCELLED],
      [OrderStatus.PICKED_UP]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowedStatuses = validTransitions[order.status];
    if (!allowedStatuses.includes(dto.status as OrderStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${dto.status}`,
      );
    }

    order.status = dto.status as OrderStatus;
    return this.orderRepository.save(order);
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      ![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)
    ) {
      throw new BadRequestException(
        'Order cannot be cancelled in current status',
      );
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }
}
