import { z } from 'zod';
import { createCategorySchema } from '@/app/validators/category.schema.js';
import { prisma } from '@/lib/prisma.js';
import { UUID } from 'node:crypto';
import { Prisma } from '@prisma/client';

type CreateCategoryDTO = z.infer<typeof createCategorySchema>;

export const createCategory = async (data: CreateCategoryDTO) => {
  try {
    return await prisma.category.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('Ya existe una categoría con ese nombre.');
    }
    throw error;
  }
};

export const getAllCategories = async () => {
  return prisma.category.findMany();
};

export const getCategoryById = async (id: UUID) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error('Category not found');
  return category;
};
