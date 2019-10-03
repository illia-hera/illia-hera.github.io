import {AbstractRender} from "./AbstractRender";

export class RealRender extends AbstractRender {
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