import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  instructorId: z.string().uuid().optional(),
});

export const courseIdParamSchema = z.object({
  courseId: z.string().uuid(),
});
