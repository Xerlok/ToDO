/* eslint-disable */
import cacheDOM from './dom';
import showModal from './showModal';
import ToDO from './ToDo';
import ToDoProject from './ToDoProject';
import { firebase, loadFromStorage, saveToStorage } from './firebase';

export default class ToDoApp {
  constructor() {
    this.dom = cacheDOM();
    this.projects = [];
    this.rightClicks = 0;
    this.previousName = '';
    this.dragStartIndex = null;
    this.dragEndIndex = null;
  }

  start() {
    loadFromStorage().then((data) => {
      this.projects = data.projects;
      this.renderProjects();
    });
    this.addListeners();
  }

  addListeners() {
    this.dom.backBtns.forEach((backBtn) => {
      backBtn.addEventListener('click', () => {
        this.backToProjects();
        backBtn.style.display = 'none';
      });
    });

    this.dom.signUpBtn.addEventListener('click', () => {
      this.dom.authentication.style.display = 'flex';
    });

    this.dom.signUpCancelBtn.addEventListener('click', () => {
      this.dom.authentication.style.display = 'none';
    });

    this.dom.signUpCreateBtn.addEventListener('click', () => {
      alert('Account created!');
    });

    this.dom.projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newProject = new ToDoProject(this.dom.projectName.value);
      this.projects.unshift(newProject);
      this.renderProjects();
      this.dom.projectName.value = null;
      saveToStorage(this.projects);
    });

    this.dom.todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectName = this.dom.todoHeader.innerText;
      const currentProjIndx = this.getProject(projectName);
      console.log(currentProjIndx);
      const newTodo = new ToDO(this.dom.todoName.value, false);
      this.projects[currentProjIndx].todos.unshift(newTodo);
      this.renderTodos(currentProjIndx);
      this.dom.todoName.value = null;
      saveToStorage(this.projects);
    });
  }

  renderProjects() {
    while (this.dom.projects.hasChildNodes()) {
      this.dom.projects.removeChild(this.dom.projects.firstChild);
    }

    for (let i = 0; i < this.projects.length; i += 1) {
      const newProject = this.dom.createProject(this.projects[i].projectName, i);
      this.addListenersProjects(newProject, i);
      this.dom.projects.append(newProject.project);
    }
  }

  renderTodos(currentProjIndx) {
    while (this.dom.todos.hasChildNodes()) {
      this.dom.todos.removeChild(this.dom.todos.firstChild);
    }
    if (this.projects[currentProjIndx].todos !== '') {
      for (let i = 0; i < this.projects[currentProjIndx].todos.length; i += 1) {
        const newTodo = this.dom.createTodo(this.projects[currentProjIndx].todos[i].todoName, i, currentProjIndx);
        this.previousName = newTodo.todoName.innerText;
        this.addListenersTodos(newTodo, currentProjIndx, i);
        this.dom.todos.append(newTodo.todo);
      }
    }
  }

  getProject(name) {
    const currentProjIndx = this.projects.findIndex((project) => project.projectName === name);
    return currentProjIndx;
  }

  getTodo(project, name) {
    const currentTodoIndx = this.projects[project].todos.findIndex((todo) => todo.todoName === name);
    return currentTodoIndx;
  }

  openProject(e) {
    let currentProjIndx;
    if (e.target.classList[0] === 'project') {
      currentProjIndx = this.getProject(e.target.firstChild.innerText);
    } else if (e.target.classList[0] === 'project-name') {
      currentProjIndx = this.getProject(e.target.innerText);
    }

    this.dom.projectsContainer.style.display = 'none';
    this.dom.todoContainer.style.display = 'flex';
    this.dom.backBtns.forEach((backBtn) => {
      backBtn.style.display = 'block';
    });
    this.dom.todoHeader.innerText = this.projects[currentProjIndx].projectName;
    this.renderTodos(currentProjIndx);
  }

  backToProjects() {
    this.dom.projectsContainer.style.display = 'flex';
    this.dom.todoContainer.style.display = 'none';
  }

  updateTodoCompletion(e, todo) {
    const currentProjIndx = this.getProject(this.dom.todoHeader.innerText);
    const currentTodoIndx = this.getTodo(currentProjIndx, todo.innerText);
    if (e.target.checked) {
      this.projects[currentProjIndx].todos[currentTodoIndx].todoDone = true;
    } else {
      this.projects[currentProjIndx].todos[currentTodoIndx].todoDone = false;
    }
    saveToStorage(this.projects);
    this.renderTodos(currentProjIndx);
  }

  deleteElement(type, obj) {
    if (type === 'project') {
      const currentProjIndx = this.getProject(obj.innerText);
      this.projects.splice(currentProjIndx, 1);
      saveToStorage(this.projects);
      this.renderProjects();
    } else if (type === 'todo') {
      const currentProjIndx = this.getProject(this.dom.todoHeader.innerText);
      const currentTodoIndx = this.getTodo(currentProjIndx, obj.innerText);
      this.projects[currentProjIndx].todos.splice(currentTodoIndx, 1);
      saveToStorage(this.projects);
      this.renderTodos(currentProjIndx);
    }
  }

  makeElementEditable(type, obj) {
    if (type === 'project') {
      obj.projectName.contentEditable = true;
      obj.projectName.focus();
      obj.slideMenu.classList.remove('open');
      this.rightClicks = 0;
    } else if (type === 'todo') {
      this.previousName = obj.todoName.innerText;
      obj.todoName.contentEditable = true;
      obj.todoName.focus();
      obj.slideMenu.classList.remove('open');
      this.rightClicks = 0;
    }
  }

  changeElementsName(type, currentProjIndx, obj) {
    if (type === 'project') {
      obj.projectName.contentEditable = false;
      this.projects[currentProjIndx].projectName = obj.projectName.innerText;
      saveToStorage(this.projects);
      this.renderProjects();
    } else if (type === 'todo') {
      obj.todoName.contentEditable = false;
      const currentTodoIndx = this.getTodo(currentProjIndx, this.previousName);
      this.projects[currentProjIndx].todos[currentTodoIndx].todoName = obj.todoName.innerText;
      saveToStorage(this.projects);
      this.renderTodos(currentProjIndx);
    }
  }

  dropElement(e) {
    this.dragEndIndex = +e.target.getAttribute('data-index');
    const projectIndex = +e.target.getAttribute('data-project-index');
    const todoOne = this.projects[projectIndex].todos[this.dragStartIndex];
    const todoTwo = this.projects[projectIndex].todos[this.dragEndIndex];
    this.projects[projectIndex].todos[this.dragStartIndex] = todoTwo;
    this.projects[projectIndex].todos[this.dragEndIndex] = todoOne;
    e.target.classList.remove('over');
    this.renderTodos(projectIndex);
    saveToStorage(this.projects);
  }

  addListenersProjects(newProject, i) {
    newProject.project.addEventListener('click', (e) => {
      this.openProject(e);
    });
    newProject.project.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this.rightClicks > 0) {
        newProject.slideMenu.classList.remove('open');
        this.rightClicks = 0;
      } else {
        newProject.slideMenu.classList.add('open');
        this.rightClicks += 1;
      }
    });
    newProject.project.addEventListener('dragenter', (e) => {
      e.target.classList.add('over');
    });
    newProject.project.addEventListener('dragleave', (e) => {
      e.target.classList.remove('over');
    });
    newProject.project.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    newProject.project.addEventListener('dragstart', (e) => {
      this.dragStartIndex = +e.target.getAttribute('data-index');
    });
    newProject.project.addEventListener('drop', (e) => {
      this.dragEndIndex = +e.target.getAttribute('data-index');
      const itemOne = this.projects[this.dragStartIndex];
      const itemTwo = this.projects[this.dragEndIndex];
      this.projects[this.dragStartIndex] = itemTwo;
      this.projects[this.dragEndIndex] = itemOne;
      e.target.classList.remove('over');
      this.renderProjects();
      saveToStorage(this.projects);
    });
    newProject.slideMenuBtnDel.addEventListener('click', (e) => {
      e.stopPropagation();
      showModal('project', newProject.project, this);
    });
    newProject.slideMenuBtnEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      this.makeElementEditable('project', newProject);
    });
    newProject.projectName.addEventListener('blur', () => {
      this.changeElementsName('project', i, newProject);
    });
  }

  addListenersTodos(newTodo, currentProjIndx, i) {
    newTodo.todoCheckbox.addEventListener('click', (e) => {
      this.updateTodoCompletion(e, newTodo.todo);
    });
    newTodo.todo.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this.rightClicks > 0) {
        newTodo.slideMenu.classList.remove('open');
        this.rightClicks = 0;
      } else {
        newTodo.slideMenu.classList.add('open');
        this.rightClicks += 1;
      }
    });
    newTodo.todo.addEventListener('dragenter', (e) => {
      e.target.classList.add('over');
    });
    newTodo.todo.addEventListener('dragleave', (e) => {
      e.target.classList.remove('over');
    });
    newTodo.todo.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    newTodo.todo.addEventListener('dragstart', (e) => {
      this.dragStartIndex = +e.target.getAttribute('data-index');
    });
    newTodo.todo.addEventListener('drop', (e) => {
      this.dropElement(e);
    });
    newTodo.slideMenuBtnDel.addEventListener('click', () => {
      showModal('todo', newTodo.todo, this);
    });
    newTodo.slideMenuBtnEdit.addEventListener('click', () => {
      this.makeElementEditable('todo', newTodo);
    });
    newTodo.todoName.addEventListener('blur', () => {
      this.changeElementsName('todo', currentProjIndx, newTodo);
    });
    if (this.projects[currentProjIndx].todos[i].todoDone === true) {
      newTodo.todo.classList.add('checked');
      newTodo.todoCheckbox.checked = true;
    }
  }
}