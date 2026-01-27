import { z } from 'zod';

export const VerifyPaymentSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID required'),
  signature: z.string().optional(),
});

export type VerifyPaymentDto = z.infer<typeof VerifyPaymentSchema>;