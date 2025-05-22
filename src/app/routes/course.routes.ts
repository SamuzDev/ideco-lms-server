import { Router } from 'express';
import * as controller from '@/app/controllers/course.controller.js';
import { validate } from '@/app/middlewares/validate.js';
import { createCourseSchema, courseIdParamSchema } from '@/app/validators/course.schema.js';

const router = Router();

router.post('/', validate({ body: createCourseSchema }), controller.createCourse);
router.get('/:courseId', validate({ params: courseIdParamSchema }), controller.getCourseById);

export default router;
