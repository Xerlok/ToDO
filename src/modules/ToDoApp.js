/* eslint-disable */
import cacheDOM from './dom';
import showModal from './showModal';
import ToDO from './ToDo';
import ToDoProject from './ToDoProject';
import {
  saveToStorage,
  signUpUser,
  signInUser,
  signOutUser,
  listenToUserStatus } from './firebase';

const dom = cacheDOM();
let projects = [];
let rightClicks = 0;
let previousName = '';
let dragStartIndex = null;
let dragEndIndex = null;


function start() {
  addListeners();
  listenToUserStatus(renderProjects);
}

function addListeners() {
  dom.backBtns.forEach((backBtn) => {
    backBtn.addEventListener('click', () => {
      backToProjects();
      backBtn.style.display = 'none';
    });
  });

  dom.menuBtn.addEventListener('click', () => {
    dom.mainMenu.classList.add('open');
  });

  dom.closeMenuBtn.addEventListener('click', () => {
    dom.mainMenu.classList.remove('open');
  });

  dom.signUpBtn.addEventListener('click', () => {
    dom.authentication.style.display = 'flex';
    dom.signUpContainer.style.display = 'flex';
    dom.mainMenu.classList.remove('open');
  });

  dom.signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = dom.signUpForm['sign-up-email'].value;
    const pswrd = dom.signUpForm['sign-up-pswrd'].value;

    signUpUser(email, pswrd, dom);
  });

  dom.signUpCancelBtn.addEventListener('click', () => {
    dom.authentication.style.display = 'none';
    dom.signUpContainer.style.display = 'none';
    dom.signUpForm.reset();
  });

  dom.signInBtn.addEventListener('click', () => {
    dom.authentication.style.display = 'flex';
    dom.signInContainer.style.display = 'flex'
    dom.mainMenu.classList.remove('open');
  });

  dom.signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = dom.signInForm['sign-in-email'].value;
    const pswrd = dom.signInForm['sign-in-pswrd'].value;

    signInUser(email, pswrd, dom);
  });

  dom.signInCancelBtn.addEventListener('click', () => {
    dom.authentication.style.display = 'none';
    dom.signInContainer.style.display = 'none';
    dom.signInForm.reset();
  });

  dom.signOutBtn.addEventListener('click', () => {
    signOutUser(dom);
  });

  dom.projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProject = new ToDoProject(cleanString(dom.projectName.value));
    projects.unshift(newProject);
    renderProjects();
    dom.projectName.value = null;
    saveToStorage(projects);
  });

  dom.todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const projectName = dom.todoHeader.innerText;
    const currentProjIndx = getProject(projectName);
    const newTodo = new ToDO(cleanString(dom.todoName.value), false);
    projects[currentProjIndx].todos.unshift(newTodo);
    renderTodos(currentProjIndx);
    dom.todoName.value = null;
    saveToStorage(projects);
  });
}

function renderProjects(currentProjects) {
  if (currentProjects !== undefined) { projects = currentProjects; }
  while (dom.projects.hasChildNodes()) {
    dom.projects.removeChild(dom.projects.firstChild);
  }

  for (let i = 0; i < projects.length; i += 1) {
    const newProject = dom.createProject(projects[i].projectName, i);
    addListenersProjects(newProject, i);
    dom.projects.append(newProject.project);
  }
}

function renderTodos(currentProjIndx) {
  while (dom.todos.hasChildNodes()) {
    dom.todos.removeChild(dom.todos.firstChild);
  }
  if (projects[currentProjIndx].todos !== '') {
    for (let i = 0; i < projects[currentProjIndx].todos.length; i += 1) {
      const newTodo = dom.createTodo(projects[currentProjIndx].todos[i].todoName, i, currentProjIndx);
      previousName = newTodo.todoName.innerText;
      addListenersTodos(newTodo, currentProjIndx, i);
      dom.todos.append(newTodo.todo);
    }
  }
}

function getProject(name) {
  const currentProjIndx = projects.findIndex((project) => project.projectName === name);
  return currentProjIndx;
}

function getTodo(project, name) {
  const currentTodoIndx = projects[project].todos.findIndex((todo) => todo.todoName === name);
  return currentTodoIndx;
}

function openProject(e) {
  let currentProjIndx;
  if (e.target.classList[0] === 'project') {
    currentProjIndx = getProject(e.target.firstChild.innerText);
  } else if (e.target.classList[0] === 'project-name') {
    currentProjIndx = getProject(e.target.innerText);
  }

  dom.projectsContainer.style.display = 'none';
  dom.todoContainer.style.display = 'flex';
  dom.backBtns.forEach((backBtn) => {
    backBtn.style.display = 'block';
  });
  dom.todoHeader.innerText = projects[currentProjIndx].projectName;
  renderTodos(currentProjIndx);
}

function backToProjects() {
  dom.projectsContainer.style.display = 'flex';
  dom.todoContainer.style.display = 'none';
}

function updateTodoCompletion(e, todo) {
  const currentProjIndx = getProject(dom.todoHeader.innerText);
  const currentTodoIndx = getTodo(currentProjIndx, todo.innerText);
  if (e.target.checked) {
    projects[currentProjIndx].todos[currentTodoIndx].todoDone = true;
  } else {
    projects[currentProjIndx].todos[currentTodoIndx].todoDone = false;
  }
  saveToStorage(projects);
  renderTodos(currentProjIndx);
}

function deleteElement(type, obj) {
  if (type === 'project') {
    const currentProjIndx = getProject(obj.innerText);
    projects.splice(currentProjIndx, 1);
    saveToStorage(projects);
    renderProjects();
  } else if (type === 'todo') {
    const currentProjIndx = getProject(dom.todoHeader.innerText);
    const currentTodoIndx = getTodo(currentProjIndx, obj.innerText);
    projects[currentProjIndx].todos.splice(currentTodoIndx, 1);
    saveToStorage(projects);
    renderTodos(currentProjIndx);
  }
}

function makeElementEditable(type, obj) {
  if (type === 'project') {
    obj.projectName.contentEditable = true;
    obj.projectName.focus();
    obj.slideMenu.classList.remove('open');
    rightClicks = 0;
  } else if (type === 'todo') {
    previousName = obj.todoName.innerText;
    obj.todoName.contentEditable = true;
    obj.todoName.focus();
    obj.slideMenu.classList.remove('open');
    rightClicks = 0;
  }
}

function changeElementsName(type, currentProjIndx, obj) {
  if (type === 'project') {
    obj.projectName.contentEditable = false;
    projects[currentProjIndx].projectName = cleanString(obj.projectName.innerText);
    saveToStorage(projects);
    renderProjects();
  } else if (type === 'todo') {
    obj.todoName.contentEditable = false;
    const currentTodoIndx = getTodo(currentProjIndx, previousName);
    projects[currentProjIndx].todos[currentTodoIndx].todoName = cleanString(obj.todoName.innerText);
    saveToStorage(projects);
    renderTodos(currentProjIndx);
  }
}

function dropElement(e) {
  dragEndIndex = +e.target.getAttribute('data-index');
  const projectIndex = +e.target.getAttribute('data-project-index');
  const todoOne = projects[projectIndex].todos[dragStartIndex];
  const todoTwo = projects[projectIndex].todos[dragEndIndex];
  projects[projectIndex].todos[dragStartIndex] = todoTwo;
  projects[projectIndex].todos[dragEndIndex] = todoOne;
  e.target.classList.remove('over');
  renderTodos(projectIndex);
  saveToStorage(projects);
}

function addListenersProjects(newProject, i) {
  newProject.project.addEventListener('click', (e) => {
    openProject(e);
  });
  newProject.project.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (rightClicks > 0) {
      newProject.slideMenu.classList.remove('open');
      rightClicks = 0;
    } else {
      newProject.slideMenu.classList.add('open');
      rightClicks += 1;
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
    dragStartIndex = +e.target.getAttribute('data-index');
  });
  newProject.project.addEventListener('drop', (e) => {
    dragEndIndex = +e.target.getAttribute('data-index');
    const itemOne = projects[dragStartIndex];
    const itemTwo = projects[dragEndIndex];
    projects[dragStartIndex] = itemTwo;
    projects[dragEndIndex] = itemOne;
    e.target.classList.remove('over');
    renderProjects();
    saveToStorage(projects);
  });
  newProject.slideMenuBtnDel.addEventListener('click', (e) => {
    e.stopPropagation();
    showModal('project', newProject.project, deleteElement);
  });
  newProject.slideMenuBtnEdit.addEventListener('click', (e) => {
    e.stopPropagation();
    makeElementEditable('project', newProject);
  });
  newProject.projectName.addEventListener('blur', () => {
    changeElementsName('project', i, newProject);
  });
}

function addListenersTodos(newTodo, currentProjIndx, i) {
  newTodo.todoCheckbox.addEventListener('click', (e) => {
    updateTodoCompletion(e, newTodo.todo);
  });
  newTodo.todo.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const slideMenus = document.querySelectorAll('.slideMenu-container-todo');
    if (rightClicks > 0) {
      slideMenus.forEach((slideMenu) => { slideMenu.classList.remove('open'); })
      rightClicks = 0;
    } else {
      slideMenus.forEach((slideMenu) => { slideMenu.classList.add('open'); })
      rightClicks += 1;
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
    dragStartIndex = +e.target.getAttribute('data-index');
  });
  newTodo.todo.addEventListener('drop', (e) => {
    dropElement(e);
  });
  newTodo.slideMenuBtnDel.addEventListener('click', () => {
    showModal('todo', newTodo.todo, deleteElement);
  });
  newTodo.slideMenuBtnEdit.addEventListener('click', () => {
    makeElementEditable('todo', newTodo);
  });
  newTodo.todoName.addEventListener('blur', () => {
    changeElementsName('todo', currentProjIndx, newTodo);
  });
  if (projects[currentProjIndx].todos[i].todoDone === true) {
    newTodo.todo.classList.add('checked');
    newTodo.todoCheckbox.checked = true;
  }
}

function cleanString(string) {
  let cleanedString = string.replace(/\s+/g, ' ').trim();

  return cleanedString;
}

export { 
  start,
};
