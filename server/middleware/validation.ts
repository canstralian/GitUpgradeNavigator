
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validateInput(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params
      });

      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        });
      }

      req.validatedData = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // In production, validate against a secure API key store
  if (process.env.NODE_ENV === 'production' && !process.env.VALID_API_KEYS?.split(',').includes(apiKey as string)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}
