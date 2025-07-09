import taskRepository from '../../infrastructure/repositories/task.repository.js';

export const getUserTasks = async (userId) => {
  return taskRepository.findByUser(userId);
};
