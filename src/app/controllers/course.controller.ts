import { Request, Response } from 'express';
import * as courseService from '@/app/services/course.service.js';
import { courseIdParamSchema, createCourseSchema } from '@/app/validators/course.schema.js';

export const createCourse = async (req: Request, res: Response) => {
  const data = createCourseSchema.parse(req.body);
  const course = await courseService.createCourse(data);
  res.status(201).json({ message: 'Curso creado', data: course });
};

export const getCourseById = async (req: Request, res: Response) => {
  const parsed = courseIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.format() });
    return;
  }

  try {
    const course = await courseService.findCourseById(parsed.data.courseId);
    res.status(200).json({ course });
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
};
