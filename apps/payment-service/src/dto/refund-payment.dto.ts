import { z } from 'zod';

export const RefundPaymentSchema = z.object({
  reason: z.string().min(5, 'Refund reason required'),
  amount: z.number().positive('Amount must be positive').optional(),
});

export type RefundPaymentDto = z.infer<typeof RefundPaymentSchema>;