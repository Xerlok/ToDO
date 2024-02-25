/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import './styles.css';
import showModal from './showModal';
import cacheDOM from './dom';
import saveToStorage from './saveToStorage';
import loadFromStorage from './loadFromStorage';

(() => {
  const toDO = {
    dom: cacheDOM(),
    projects: [],
    rightClicks: 0,
    previousName: '',
    dragStartIndex: null,
    dragEndIndex: null,

    addListeners: function addListeners() {
      toDO.dom.backBtns.forEach((backBtn) => {
        backBtn.addEventListener('click', () => {
          toDO.backToProjects();
          backBtn.style.display = 'none';
        });
      });

      toDO.dom.projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProject = new toDO.CreateProject(toDO.dom.projectName.value);
        toDO.projects.unshift(newProject);
        toDO.renderProjects();
        toDO.dom.projectName.value = '';
        saveToStorage(toDO.projects);
      });

      toDO.dom.todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectName = toDO.dom.todoHeader.innerText;
        const currentProjIndx = toDO.getProject(projectName);
        const newTodo = new toDO.CreateTodo(toDO.dom.todoName.value, false);
        toDO.projects[currentProjIndx].todos.unshift(newTodo);
        toDO.renderTodos(currentProjIndx);
        toDO.dom.todoName.value = '';
        saveToStorage(toDO.projects);
      });
    },
    CreateProject: function Project(projectName) {
      this.projectName = projectName;
      this.todos = [];
    },
    CreateTodo: function Todo(todoName, todoDone) {
      this.todoName = todoName;
      this.todoDone = todoDone;
    },
    renderProjects: function renderProjects() {
      while (toDO.dom.projects.hasChildNodes()) {
        toDO.dom.projects.removeChild(toDO.dom.projects.firstChild);
      }

      for (let i = 0; i < toDO.projects.length; i += 1) {
        const newProject = toDO.dom.createProject(toDO.projects[i].projectName, i);
        toDO.addListenersProjects(newProject, i);
        toDO.dom.projects.append(newProject.project);
      }
    },
    renderTodos: function renderTodos(currentProjIndx) {
      while (toDO.dom.todos.hasChildNodes()) {
        toDO.dom.todos.removeChild(toDO.dom.todos.firstChild);
      }
      if (toDO.projects[currentProjIndx].todos !== '') {
        for (let i = 0; i < toDO.projects[currentProjIndx].todos.length; i += 1) {
          const newTodo = toDO.dom.createTodo(toDO.projects[currentProjIndx].todos[i].todoName, i, currentProjIndx);
          toDO.previousName = newTodo.todoName.innerText;
          toDO.addListenersTodos(newTodo, currentProjIndx, i);
          toDO.dom.todos.append(newTodo.todo);
        }
      }
    },
    getProject: function getProject(name) {
      const currentProjIndx = toDO.projects.findIndex((project) => project.projectName === name);
      return currentProjIndx;
    },
    getTodo: function getTodo(project, name) {
      const currentTodoIndx = toDO.projects[project].todos.findIndex((todo) => todo.todoName === name);
      return currentTodoIndx;
    },
    openProject: function openProject(e) {
      let currentProjIndx;
      if (e.target.classList[0] === 'project') {
        currentProjIndx = toDO.getProject(e.target.firstChild.innerText);
      } else if (e.target.classList[0] === 'project-name') {
        currentProjIndx = toDO.getProject(e.target.innerText);
      }

      toDO.dom.projectsContainer.style.display = 'none';
      toDO.dom.todoContainer.style.display = 'flex';
      toDO.dom.backBtns.forEach((backBtn) => {
        backBtn.style.display = 'block';
      });
      toDO.dom.todoHeader.innerText = toDO.projects[currentProjIndx].projectName;
      toDO.renderTodos(currentProjIndx);
    },
    backToProjects: function backToProjects() {
      toDO.dom.projectsContainer.style.display = 'flex';
      toDO.dom.todoContainer.style.display = 'none';
    },
    updateTodoCompletion: function updateTodoCompletion(e, todo) {
      const currentProjIndx = toDO.getProject(toDO.dom.todoHeader.innerText);
      const currentTodoIndx = toDO.getTodo(currentProjIndx, todo.innerText);
      if (e.target.checked) {
        toDO.projects[currentProjIndx].todos[currentTodoIndx].todoDone = true;
      } else {
        toDO.projects[currentProjIndx].todos[currentTodoIndx].todoDone = false;
      }
      saveToStorage(toDO.projects);
      toDO.renderTodos(currentProjIndx);
    },
    deleteElement: function deleteElement(type, obj) {
      if (type === 'project') {
        const currentProjIndx = toDO.getProject(obj.innerText);
        toDO.projects.splice(currentProjIndx, 1);
        saveToStorage(toDO.projects);
        toDO.renderProjects();
      } else if (type === 'todo') {
        const currentProjIndx = toDO.getProject(toDO.dom.todoHeader.innerText);
        const currentTodoIndx = toDO.getTodo(currentProjIndx, obj.innerText);
        toDO.projects[currentProjIndx].todos.splice(currentTodoIndx, 1);
        saveToStorage(toDO.projects);
        toDO.renderTodos(currentProjIndx);
      }
    },
    makeElementEditable: function makeElementEditable(type, obj) {
      if (type === 'project') {
        obj.projectName.contentEditable = true;
        obj.projectName.focus();
        obj.slideMenu.classList.remove('open');
        toDO.rightClicks = 0;
      } else if (type === 'todo') {
        toDO.previousName = obj.todoName.innerText;
        obj.todoName.contentEditable = true;
        obj.todoName.focus();
        obj.slideMenu.classList.remove('open');
        toDO.rightClicks = 0;
      }
    },
    changeElementsName: function changeElementsName(type, currentProjIndx, obj) {
      if (type === 'project') {
        obj.projectName.contentEditable = false;
        toDO.projects[currentProjIndx].projectName = obj.projectName.innerText;
        saveToStorage(toDO.projects);
        toDO.renderProjects();
      } else if (type === 'todo') {
        obj.todoName.contentEditable = false;
        const currentTodoIndx = toDO.getTodo(currentProjIndx, toDO.previousName);
        toDO.projects[currentProjIndx].todos[currentTodoIndx].todoName = obj.todoName.innerText;
        saveToStorage(toDO.projects);
        toDO.renderTodos(currentProjIndx);
      }
    },
    dropElement: function dropElement(e) {
      toDO.dragEndIndex = +e.target.getAttribute('data-index');
      const projectIndex = +e.target.getAttribute('data-project-index');
      const todoOne = toDO.projects[projectIndex].todos[toDO.dragStartIndex];
      const todoTwo = toDO.projects[projectIndex].todos[toDO.dragEndIndex];
      toDO.projects[projectIndex].todos[toDO.dragStartIndex] = todoTwo;
      toDO.projects[projectIndex].todos[toDO.dragEndIndex] = todoOne;
      e.target.classList.remove('over');
      toDO.renderTodos(projectIndex);
      saveToStorage(toDO.projects);
    },
    addListenersProjects: function addListenersProjects(newProject, i) {
      newProject.project.addEventListener('click', toDO.openProject);
      newProject.project.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (toDO.rightClicks > 0) {
          newProject.slideMenu.classList.remove('open');
          toDO.rightClicks = 0;
        } else {
          newProject.slideMenu.classList.add('open');
          toDO.rightClicks += 1;
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
        toDO.dragStartIndex = +e.target.getAttribute('data-index');
      });
      newProject.project.addEventListener('drop', (e) => {
        toDO.dragEndIndex = +e.target.getAttribute('data-index');
        const itemOne = toDO.projects[toDO.dragStartIndex];
        const itemTwo = toDO.projects[toDO.dragEndIndex];
        toDO.projects[toDO.dragStartIndex] = itemTwo;
        toDO.projects[toDO.dragEndIndex] = itemOne;
        e.target.classList.remove('over');
        toDO.renderProjects();
        saveToStorage(toDO.projects);
      });
      newProject.slideMenuBtnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        showModal('project', newProject.project, toDO);
      });
      newProject.slideMenuBtnEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        toDO.makeElementEditable('project', newProject);
      });
      newProject.projectName.addEventListener('blur', () => {
        toDO.changeElementsName('project', i, newProject);
      });
    },
    addListenersTodos: function addListenersTodos(newTodo, currentProjIndx, i) {
      newTodo.todoCheckbox.addEventListener('click', (e) => {
        toDO.updateTodoCompletion(e, newTodo.todo);
      });
      newTodo.todo.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (toDO.rightClicks > 0) {
          newTodo.slideMenu.classList.remove('open');
          toDO.rightClicks = 0;
        } else {
          newTodo.slideMenu.classList.add('open');
          toDO.rightClicks += 1;
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
        toDO.dragStartIndex = +e.target.getAttribute('data-index');
      });
      newTodo.todo.addEventListener('drop', (e) => {
        toDO.dropElement(e);
      });
      newTodo.slideMenuBtnDel.addEventListener('click', () => {
        showModal('todo', newTodo.todo, toDO);
      });
      newTodo.slideMenuBtnEdit.addEventListener('click', () => {
        toDO.makeElementEditable('todo', newTodo);
      });
      newTodo.todoName.addEventListener('blur', () => {
        toDO.changeElementsName('todo', currentProjIndx, newTodo);
      });
      if (toDO.projects[currentProjIndx].todos[i].todoDone === true) {
        newTodo.todo.classList.add('checked');
        newTodo.todoCheckbox.checked = true;
      }
    },
  };

  toDO.addListeners();
  toDO.projects = loadFromStorage();
  console.log(toDO.projects);
  toDO.renderProjects();
})();
