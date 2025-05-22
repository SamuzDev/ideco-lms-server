import { Router } from 'express';
import * as controller from '@/app/controllers/category.controller.js';
import { validate } from '@/app/middlewares/validate.js';
import { createCategorySchema, categoryIdParamSchema } from '@/app/validators/category.schema.js';

const router = Router();

router.post('/', validate({ body: createCategorySchema }), controller.createCategory);
router.get('/', controller.getAllCategories);
router.get('/:categoryId', validate({ params: categoryIdParamSchema }), controller.getCategoryById);

export default router;
