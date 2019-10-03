import {TaskManager} from './TaskManager';
import {Store} from './BaseStore';
import {StoreLS} from './StoreLS';
import {StoreJSON} from './StoreJSON';
import {TODO} from './TODO';
import {RealRender} from './RealRender';

export class TodoApp {
  execute() {
    const store = new StoreLS();

    const taskManager = new TaskManager(store);

    const taskContainer = document.getElementsByClassName('created-task--item-group')[0];
    const titleInputRef = document.getElementById('task-title');
    const taskDebugBtnRef = document.getElementById('task-debug-button');
    const taskDeleteAllBtnRef = document.getElementById('task-deleteAll-button');
    const errorContainer = titleInputRef;
    const render = new RealRender(taskContainer, errorContainer);

    const todo = new TODO(taskManager, render);

    render.deleteTaskFunction = todo.deleteTask.bind(todo);
    render.toggleTaskFunction = todo.toggleTask.bind(todo);

    taskDebugBtnRef.addEventListener('click', () => todo.init());
    taskDeleteAllBtnRef.addEventListener('click', () => todo.deleteAll());

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
