import { z } from 'zod';
import { createCourseSchema } from '@/app/validators/course.schema.js';
import { prisma } from '@/lib/prisma.js';

type CreateCourseDTO = z.infer<typeof createCourseSchema>;

export const createCourse = async (data: CreateCourseDTO) => {
  const course = await prisma.course.create({
    data,
  });
  return course;
};

export const findCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id: String(id) },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  return course;
};
