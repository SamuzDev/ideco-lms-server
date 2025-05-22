import { Request, Response } from 'express';
import * as categoryService from '@/app/services/category.service.js';
import { categoryIdParamSchema, createCategorySchema } from '@/app/validators/category.schema.js';
import { UUID } from 'node:crypto';

export const createCategory = async (req: Request, res: Response) => {
  const data = createCategorySchema.parse(req.body);
  const category = await categoryService.createCategory(data);
  res.status(201).json({ message: 'Categoría creada', category });
};

export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  res.json({ categories });
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { categoryId } = categoryIdParamSchema.parse(req.params);
  const category = await categoryService.getCategoryById(categoryId as UUID);
  res.json({ category });
};
