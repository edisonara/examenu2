import { createTask } from '../../domain/use-cases/create-task.use-case.js';
import { getUserTasks } from '../../domain/use-cases/get-user-tasks.use-case.js';
import { updateTask } from '../../domain/use-cases/update-task.use-case.js';
import { deleteTask } from '../../domain/use-cases/delete-task.use-case.js';

export const createTaskCtrl = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const task = await createTask({ title, description, user: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasksCtrl = async (req, res, next) => {
  try {
    const tasks = await getUserTasks(req.user.id);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTaskCtrl = async (req, res, next) => {
  try {
    const task = await updateTask(req.params.id, req.user.id, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTaskCtrl = async (req, res, next) => {
  try {
    await deleteTask(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
