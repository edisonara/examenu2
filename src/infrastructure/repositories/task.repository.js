import Task from '../../domain/models/task.model.js';

class TaskRepository {
  async create(taskData) {
    const task = new Task(taskData);
    return task.save();
  }

  async findByUser(userId) {
    return Task.find({ user: userId });
  }

  async findById(taskId) {
    return Task.findById(taskId);
  }

  async update(taskId, updateData) {
    return Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true
    });
  }

  async delete(taskId) {
    return Task.findByIdAndDelete(taskId);
  }
}

export default new TaskRepository();
