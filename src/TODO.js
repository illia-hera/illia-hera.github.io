export class TODO {
  constructor(taskManager, render) {
    this._taskManager = taskManager;
    this._render = render;
  }

  async init() {
    this._render.clearTaskList();
    const tasks = await this._taskManager.getTasks();
    tasks.forEach(task => {
      this._render.renderTask(task);
    });
  }

  async deleteTask(task) {
    await this._taskManager.removeTask(task);
    this._render.removeTask(task);
  }

  async deleteAll(task) {
    const tasks = await this._taskManager.getTasks();
    this._render.clearTaskList();
    tasks.forEach(task => {
      this._taskManager.removeTask(task);
    });
  }

  async addTask(title) {
    this._render.clearInput();
    this._render.renderTask(await this._taskManager.createTask(title));
  }

  async toggleTask(id) {
    const task = await this._taskManager.getTask(id);
    this._taskManager.updateTask(task);
    this._render.updateTask(task);
  }

  // async deleteAll() {
  //   const tasks = await this._taskManager.getTasks();
  //   tasks.forEach(task => {
  //     this._taskManager.removeTask(task).then(task => this._render.renderTask(task));
  //   });
  // }

  // async updateAll() {
  //   const tasks = await this._taskManager.getTasks();
  //   tasks.forEach(task => {
  //     this._taskManager.updateTask(task).then(task => this._render.renderTask(task));
  //   });
  // }
}