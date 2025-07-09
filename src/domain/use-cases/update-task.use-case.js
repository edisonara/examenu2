import taskRepository from '../../infrastructure/repositories/task.repository.js';

export const updateTask = async (taskId, userId, updateData) => {
  const task = await taskRepository.findById(taskId);
  if (!task) throw new Error('Task not found');
  if (task.user.toString() !== userId.toString()) throw new Error('Unauthorized');
  return taskRepository.update(taskId, updateData);
};
