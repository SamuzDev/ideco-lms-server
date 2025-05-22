import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

type ValidationOptions = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validate = (schemas: ValidationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) schemas.body.parse(req.body);
      if (schemas.params) schemas.params.parse(req.params);
      if (schemas.query) schemas.query.parse(req.query);
      next();
    } catch (err: unknown) {
      res.status(400).json({
        message: 'Validation error',
        issues: (err as { errors: unknown[] }).errors,
      });
    }
  };
};
