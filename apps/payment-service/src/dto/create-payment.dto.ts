import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum([
    'CREDIT_CARD',
    'DEBIT_CARD',
    'UPI',
    'NET_BANKING',
    'WALLET',
    'CASH_ON_DELIVERY',
  ]),
  // Payment details based on method
  cardDetails: z
    .object({
      cardNumber: z.string().regex(/^[0-9]{16}$/, 'Invalid card number'),
      expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid month'),
      expiryYear: z.string().regex(/^[0-9]{4}$/, 'Invalid year'),
      cvv: z.string().regex(/^[0-9]{3,4}$/, 'Invalid CVV'),
      cardHolderName: z.string().min(2, 'Cardholder name required'),
    })
    .optional(),
  upiDetails: z
    .object({
      vpa: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Invalid UPI ID'),
    })
    .optional(),
  walletDetails: z
    .object({
      walletProvider: z.enum(['PAYTM', 'PHONEPE', 'GPAY', 'AMAZON_PAY']),
      walletId: z.string(),
    })
    .optional(),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;
