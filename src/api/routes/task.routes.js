import { Router } from 'express';
import protect from '../../infrastructure/middlewares/auth.middleware.js';
import {
  createTaskCtrl,
  getTasksCtrl,
  updateTaskCtrl,
  deleteTaskCtrl
} from '../controllers/task.controller.js';

const router = Router();

router.use(protect);

router.route('/').post(createTaskCtrl).get(getTasksCtrl);
router.route('/:id').put(updateTaskCtrl).delete(deleteTaskCtrl);

export default router;
