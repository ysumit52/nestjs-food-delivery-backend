import { z } from 'zod';

export const CreateOrderSchema = z.object({
  restaurantId: z.string().uuid('Invalid restaurant ID'),
  items: z.array(z.object({
    menuItemId: z.string().uuid('Invalid menu item ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
  })),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
