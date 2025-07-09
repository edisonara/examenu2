import taskRepository from '../../infrastructure/repositories/task.repository.js';

export const deleteTask = async (taskId, userId) => {
  const task = await taskRepository.findById(taskId);
  // Diagnostic log to verify owner vs authenticated user
  console.log('deleteTask check:', {
    taskUser: task ? task.user?.toString() : null,
    tokenUser: userId
  });
  if (!task) throw new Error('Task not found');
  if (task.user.toString() !== userId.toString()) throw new Error('Unauthorized');
  await taskRepository.delete(taskId);
};
