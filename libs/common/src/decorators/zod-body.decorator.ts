import { UsePipes } from '@nestjs/common';
import { ZodType } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

export const ZodBody = (schema: ZodType<any>) => {
  return UsePipes(new ZodValidationPipe(schema));
};
