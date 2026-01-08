import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod"; // Change AnyZodObject to ZodSchema

// We use ZodSchema (or ZodType) to cover objects, effects, and refinements
export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      return res.status(400).json({
        status: "fail",
        errors: e.errors,
      });
    }
  };
