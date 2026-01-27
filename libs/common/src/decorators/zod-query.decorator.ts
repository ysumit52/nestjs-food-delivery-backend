import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { ZodType, ZodError } from 'zod';

export const ZodQuery = createParamDecorator(
  (schema: ZodType<any>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    
    try {
      return schema.parse(query);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Query validation failed',
          errors: error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      throw new BadRequestException('Query validation failed');
    }
  },
);
