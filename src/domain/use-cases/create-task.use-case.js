import taskRepository from '../../infrastructure/repositories/task.repository.js';

export const createTask = async ({ title, description, user }) => {
  return taskRepository.create({ title, description, user });
};
