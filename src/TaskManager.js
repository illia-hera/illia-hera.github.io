import {
  AbstractStore
} from './AbstractStore';
import {
  Task
} from "./Task";

export class TaskManager {
  constructor(store) {
    if (!(store instanceof AbstractStore)) {
      throw new Error('stor should implements AbstractStore interface')
    }
    this._store = store;
  }

  async getTasks() {
    return await Promise.resolve(this._store.getTasks());
  }

  async getTask(id) {
    return await Promise.resolve(this._store.getTask(id));
  }

  async createTask(title) {
    const id = Math.random().toString(36).substr(2, 16);
    const task = new Task(id, title);
    return await Promise.resolve(this._store.saveTask(task));
  }

  async removeTask(task) {
    return await Promise.resolve(this._store.removeTask(task));
  }

  async updateTask(task) {
    task.toggle();
    return await Promise.resolve(this._store.updateTask(task));
  };
}