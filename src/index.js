
import  {TodoApp}  from "./TodoApp";

document.getElementById('task-title').focus();
const app = new TodoApp();
app.execute();

 

























// class AbstractLogger {
//   constructor(config) {
//     this._logLevel = config.logLevel;
//   }

//   log(message) {
//     throw new Error('not implemented');
//   }
// }

// class Logger extends AbstractLogger {
//   constructor(config) {
//     super(config);
//   }

//   log(message) {
//     switch (this._logLevel) {
//       case 'debug':
//         console.log(`${new Date().toISOString()}: ${message}`);
//         break;

//       case 'production':
//         break;
//     }
//   }
// }

// class LoggerWithHistory extends AbstractLogger {
//   constructor(config) {
//     super(config);
//     this._history = [];
//   }

//   get history() {
//     return this._history;
//   }

//   log(message) {
//     this._history.push(`${new Date().toISOString()}: ${message}`);
//   }
// }

// class LoggerableTODO extends TODO {
//   constructor(logger) {
//     super()
//     this.logger = logger;
//   }

//   addTask(title) {
//     this._logger.log(`TODO startedd adding a task - ${title}`);
//     return super.addTask(title);
//   }

//   deleteAll() {
//     this._logger.log(`TODO startedd deleting all tasks`);
//     return super.deleteAll();
//   }

//   updateAll() {
//     this._logger.log(`TODO started updating all tasks`);
//     return  super.updateAll();
//   }

//   init() {
//     this._logger.log(`TODO startedd initialize all tasks`);
//     return  super.init();
//   }
// }

// class LoggerableTaskManager extends TaskManager {
//   constructor() {
//     super(store, logger);
//     this.logger = logger;
//   }

//   updateTask(task) {
//     task.toggle();
//     return Promise.resolve(this._store.updateTask(task));
//   };

//   createTask(title) {
//     this._logger.log(`Task Manager started creating task - ${title}`);
//     return Promise.resolve(super.createTask());
//   }

//   removeTask(task) {
//     this._logger.log(`Task Manager started removing task - ${title}`);
//     return Promise.resolve(super.removeTask());
//   }

//   getTasks() {
//     this._logger.log(`Task Manager getting task - ${title}`);
//     return Promise.resolve(super.getTasks());
//   }

//   updateTask() {
//     this._logger.log(`Task Manager togglid task - ${title}`);
//     return Promise.resolve(super.updateTask());
//   }
// }


