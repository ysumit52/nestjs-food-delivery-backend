import { z } from 'zod';

export const OrderItemSchema = z.object({
  menuItemId: z.uuid('Invalid menu item ID'),
  quantity: z.number().int().positive('Quantity must be positive'),
  specialInstructions: z.string().max(500).optional(),
});

export const CreateOrderSchema = z.object({
  restaurantId: z.uuid('Invalid restaurant ID'),
  items: z.array(OrderItemSchema).min(1, 'Order must contain at least one item'),
  deliveryAddress: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^[0-9]{6}$/, 'Invalid zip code'),
    landmark: z.string().optional(),
  }),
  deliveryInstructions: z.string().max(500).optional(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'PICKED_UP',
    'DELIVERED',
    'CANCELLED',
  ]),
});

export type OrderItemDto = z.infer<typeof OrderItemSchema>;
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;
