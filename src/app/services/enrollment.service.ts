import { z } from 'zod';
import { createEnrollmentSchema } from '@/app/validators/enrollment.schema.js';
import { prisma } from '@/lib/prisma.js';

type CreateEnrollmentDTO = z.infer<typeof createEnrollmentSchema>;

export const createEnrollment = async (data: CreateEnrollmentDTO) => {
  const enrollment = await prisma.enrollment.create({
    data,
  });
  return enrollment;
};

export const findEnrollmentById = async (id: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: String(id) },
  });

  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  return enrollment;
};
