import { z } from 'zod';

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

export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;