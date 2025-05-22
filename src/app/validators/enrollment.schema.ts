import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
});

export const enrollmentIdParamSchema = z.object({
  enrollmentId: z.string().uuid(),
});
