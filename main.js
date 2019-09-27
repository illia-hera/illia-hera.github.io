class TodoApp {
  execute() {
    const store = new StoreLS();

    const taskManager = new TaskManager(store);

    const taskContainer = document.getElementsByClassName('created-task--item-group')[0];
    const titleInputRef = document.getElementById('task-title');
    const taskDebugBtnRef = document.getElementById('task-debug-button');
    const errorContainer = titleInputRef.value;
    const render = new RealRender(taskContainer, errorContainer);

    const todo = new TODO(taskManager, render);

    render.deleteTaskFunction = todo.deleteTask.bind(todo);
    render.toggleTaskFunction = todo.toggleTask.bind(todo);

    taskDebugBtnRef.addEventListener('click', () => todo.init());

    document.querySelector('#task-title').addEventListener('keypress', (e) => {
      if (e.keyCode === 13) {
        if (!titleInputRef.value) {
          render.renderError(errorContainer)
        } else {
          render.removeError(titleInputRef);
          todo.addTask(titleInputRef.value);
        }
      }
    });

    document.querySelector('#task-create-button').addEventListener('click', () => {
      if (!titleInputRef.value) {
        render.renderError(errorContainer)
      } else {
        render.removeError(titleInputRef);
        todo.addTask(titleInputRef.value);
      }
    });
  }
}


class TODO {
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
 

class TaskManager {
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


class Task {
  constructor(id,
    title,
    isDone = false,
    creationMoment = Date.now()
  ) {
    this._id = id;
    this._title = title;
    this._isDone = isDone;
    this._creationMoment = creationMoment;
  }

  get id() {
    return this._id
  }
  get title() {
    return this._title
  }
  get isDone() {
    return this._isDone
  }
  get creationMoment() {
    return this._creationMoment
  }

  toggle() {
    return this._isDone = !this._isDone
  }

  static toJSON(task) {
    return JSON.stringify({
      id: task.id,
      title: task.title,
      isDone: task.isDone,
      creationMoment: task.creationMoment
    })
  }

  static fromJSON(json) {
    let obj = null;
    try {
      obj = JSON.parse(json);
    } catch (error) {
      throw new Error(`invalid json: ${json}`, error.message);
    }

    return new Task(
      obj.id,
      obj.title,
      obj.isDone,
      obj.creationMoment
    );
  }

  copy() {
    return new Task(
      this.id,
      this.title,
      this.isDone,
      this.creationMoment
    )

  }
}


class AbstractRender {
  renderTask(task) {
    throw new Error('not implemented');
  }

  updateTask(task) {
    throw new Error('not implemented');
  }

  removeTask(task) {
    throw new Error('not implemented');
  }
}


class RealRender extends AbstractRender {
  constructor(taskContainer, errorContainer) {
    super();
    this.taskContainer = taskContainer;
    this.errorContainer = errorContainer;
  }
  set deleteTaskFunction(func) {
    this._deleteTaskFunction = func;
  }

  set toggleTaskFunction(func) {
    this._toggleTaskFunction = func;
  }

  renderTask(task) {

    const li = document.createElement('li');
    const div = document.createElement('div');
    const p = document.createElement('p');
    const divBtnWrapp = document.createElement('div');
    const btnPositive = document.createElement('button');
    const btnNegative = document.createElement('button');

    li.setAttribute('class', 'created-task--item');
    li.setAttribute('id', task.id);
    div.setAttribute('class', 'task');
    p.innerText = task.title;
    p.setAttribute('id', task.id);
    p.setAttribute('class', 'task--content task--content_color');
    divBtnWrapp.setAttribute('class', 'task--action-btn-wrapper');
    btnPositive.innerText = 'Toggle';
    btnPositive.setAttribute('class', 'task--action-btn task--action-btn_toggle toggle-btn');
    btnNegative.innerText = 'Delete';
    btnNegative.setAttribute('class', 'task--action-btn task--action-btn_negative delete-btn');

    li.addEventListener('click', (event) => {
      const target = event.target;

      if (target.innerText === "Delete") {
        this._deleteTaskFunction(task);
      } else if (target.innerText === "Toggle") {
        const id = task.id;
        this._toggleTaskFunction(id);
      }
    })

    this.taskContainer.append(li);
    li.append(div);
    div.append(p);
    div.append(divBtnWrapp);
    divBtnWrapp.append(btnPositive);
    divBtnWrapp.append(btnNegative);
  }

  updateTask(task) {
    const div = this.taskContainer.querySelector(`#${task.id}`);
    div.style.textDecoration = 'line-through';
  }

  clearTaskList() {
    return document.getElementById(`task-item-group`)
      .innerHTML = '';
  }

  clearInput() {
    const input = document.getElementById('task-title');
    input.value = '';
    return input.focus();
  }

  removeTask(task) {
    const div = this.taskContainer.querySelector(`#${task.id}`);
    div.remove();
  }

  removeError(title) {
    title.classList.remove('todo-app--input_error');
  }
  renderError(error) {
    error.setAttribute('class', 'todo-app--input_error todo-app--input todo-app--input_size');
  }
}


class AbstractStore {
  getTasks() {
    throw new Error('not implemented')
  }
  saveTasks(task) {
    throw new Error('not implemented')
  }
}


class Store extends AbstractStore {
  constructor() {
    super();
    this._store = [];
  }

  async getTask(id) {
    const task = this._store.find(task => task.id === id)
    if (!task) {
      return Promise.reject(new Error(`there is no task with id = ${id}`))
    }

    return Promise.resolve(task.copy());
  }

  async getTasks() {
    return Promise.resolve(this._store
      .map(task => {
        return task.copy();
      }));
  }

  async updateTask(newTask) {
    await this.removeTask(await this.getTask(newTask.id));
    return Promise.resolve(this.saveTask(newTask));
  }

  removeTask(task) {
    this._store = this._store.filter(storeTask => storeTask.id !== task.id)
    return Promise.resolve(`Task with title: '${task.title}' was deleted`);
  }

  saveTask(task) {
    this._store.push(task);
    return Promise.resolve(task.copy());
  }
};


class StoreLS extends AbstractStore {
  constructor() {
    super();
    this._prefix = 'strLS'
  }

  async getTask(id) {
    const key = `${this._prefix}${id}`;
    const taskJson = localStorage.getItem(key);
    if (!taskJson) {
      return Promise.reject(new Error(`there is no task with id = ${id}`));
    }
    let task = null

    try {
      task = Task.fromJSON(taskJson);
    } catch (error) {
      return Promise.reject(new Error(`inpossible get task with id = ${id}`, error.message))
    }

    return Promise.resolve(task)
  }

  getTasks() {
    const tasks = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);

      if (key.includes(this._prefix)) {
        let task = null

        try {
          task = Task.fromJSON(localStorage.getItem(key));
        } catch (error) {
          return Promise.reject(new Error(`inpossible get task with id = ${id}`, error.message))
        }
        tasks.push(task);
      }
    }

    return Promise.resolve(tasks);
  }

  saveTask(task) {
    const key = `${this._prefix}${task.id}`;
    const json = Task.toJSON(task);
    localStorage.setItem(key, json);
    let taskCopy = null

    try {
      taskCopy = Task.fromJSON(localStorage.getItem(key));
    } catch (error) {
      return Promise.reject(new Error(`inpossible get task with id = ${id}`, error.message))
    }

    return Promise.resolve(taskCopy);
  }

  async updateTask(newTask) {
    this.removeTask(await this.getTask(newTask.id))
    return Promise.resolve(this.saveTask(newTask));
  }

  removeTask(task) {
    localStorage.removeItem(`${this._prefix}${task.id}`);

    return Promise.resolve({});
  }
}


class StoreJSON extends AbstractStore {
  constructor() {
    super();
    this._headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Method': 'GET, POST, PUT, DELETE, PATCH'
    }
  }

  async saveTask(task) {
    const response = await fetch(
      `http://localhost:3000/tasks`, {
        headers: this.headers,
        method: 'POST',
        body: Task.toJSON(task)
      }
    );

    return Promise.resolve(response.json());
  }

  async getTask(id) {
    const response = await fetch(`http://localhost:3000/tasks/${id}`);
    return Promise.resolve(Task.fromJSON(await resp.text(response.json())));
  }

  async getTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = [];
    let tasksArr = await response.json();
    tasksArr.forEach(taskProto => {
      tasks.push(Task.fromJSON(JSON.stringify(taskProto)))
    })

    return Promise.resolve(tasks);
  };

  async removeTask(task) {
    const response = await fetch(
      `http://localhost:3000/tasks/${task.id}`, {
        headers: this._headers,
        method: 'DELETE'
      }
    );

    return Promise.resolve(response.json());
  }

  async updateTask(task) {
    const response = await fetch(
      `http://localhost:3000/tasks/${task.id}`, {
        headers: this._headers,
        method: 'PUT',
        body: Task.toJSON(task)
      }
    );

    return Promise.resolve(response.json());
  }
}



class AbstractLogger {
  constructor(config) {
    this._logLevel = config.logLevel;
  }

  log(message) {
    throw new Error('not implemented');
  }
}

class Logger extends AbstractLogger {
  constructor(config) {
    super(config);
  }

  log(message) {
    switch (this._logLevel) {
      case 'debug':
        console.log(`${new Date().toISOString()}: ${message}`);
        break;

      case 'production':
        break;
    }
  }
}

class LoggerWithHistory extends AbstractLogger {
  constructor(config) {
    super(config);
    this._history = [];
  }

  get history() {
    return this._history;
  }

  log(message) {
    this._history.push(`${new Date().toISOString()}: ${message}`);
  }
}

class LoggerableTODO extends TODO {
  constructor(logger) {
    super()
    this.logger = logger;
  }

  addTask(title) {
    this._logger.log(`TODO startedd adding a task - ${title}`);
    return super.addTask(title);
  }

  deleteAll() {
    this._logger.log(`TODO startedd deleting all tasks`);
    return super.deleteAll();
  }

  updateAll() {
    this._logger.log(`TODO started updating all tasks`);
    return  super.updateAll();
  }

  init() {
    this._logger.log(`TODO startedd initialize all tasks`);
    return  super.init();
  }
}

class LoggerableTaskManager extends TaskManager {
  constructor() {
    super(store, logger);
    this.logger = logger;
  }

  updateTask(task) {
    task.toggle();
    return Promise.resolve(this._store.updateTask(task));
  };

  createTask(title) {
    this._logger.log(`Task Manager started creating task - ${title}`);
    return Promise.resolve(super.createTask());
  }

  removeTask(task) {
    this._logger.log(`Task Manager started removing task - ${title}`);
    return Promise.resolve(super.removeTask());
  }

  getTasks() {
    this._logger.log(`Task Manager getting task - ${title}`);
    return Promise.resolve(super.getTasks());
  }

  updateTask() {
    this._logger.log(`Task Manager togglid task - ${title}`);
    return Promise.resolve(super.updateTask());
  }
}



document.getElementById('task-title').focus();
const app = new TodoApp();
app.execute();