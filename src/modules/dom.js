/* eslint-disable no-shadow */
export default function cacheDOM() {
  const backBtns = document.querySelectorAll('.back-img');
  const menuBtn = document.querySelector('.main-menu-img');
  const projectsContainer = document.querySelector('.projects-container');
  const todoContainer = document.querySelector('.todo-container');
  const projectForm = document.querySelector('.project-form');
  const todoForm = document.querySelector('.todo-form');
  const projectName = document.getElementById('projectName');
  const todoName = document.getElementById('todoName');
  const projects = document.querySelector('.projects');
  const todoHeader = document.querySelector('.todo-h1');
  const todos = document.querySelector('.todos');
  const authentication = document.querySelector('.authentication');
  const signUpForm = document.querySelector('.sign-up-form');
  const signUpCancelBtn = document.querySelector('.sign-up-cancel');
  const signUpCreateBtn = document.querySelector('.sign-up-create');
  const signInForm = document.querySelector('.sign-in-form');
  const signInCancelBtn = document.querySelector('.sign-in-cancel');
  const signInFormBtn = document.querySelector('.sign-in-form-btn');
  const mainMenu = document.querySelector('.main-menu');

  function createProject(name, indx) {
    const project = document.createElement('div');
    project.className = 'project';
    project.draggable = true;
    project.dataset.index = indx;

    const projectName = document.createElement('div');
    projectName.className = 'project-name';
    projectName.innerText = name;

    const slideMenu = document.createElement('div');
    slideMenu.className = 'slideMenu-container-proj';

    const slideMenuBtnEdit = document.createElement('img');
    slideMenuBtnEdit.className = 'slideMenu-img slideMenu-btn-edit';
    slideMenuBtnEdit.src = './img/edit.svg';

    const slideMenuBtnDel = document.createElement('img');
    slideMenuBtnDel.className = 'slideMenu-img slideMenu-btn-del';
    slideMenuBtnDel.src = './img/delete.svg';

    slideMenu.append(slideMenuBtnEdit);
    slideMenu.append(slideMenuBtnDel);
    project.append(projectName);
    project.append(slideMenu);

    return {
      project,
      projectName,
      slideMenu,
      slideMenuBtnEdit,
      slideMenuBtnDel,
    };
  }

  function createTodo(name, indx, projIndx, dueDate) {
    const todo = document.createElement('div');
    todo.className = 'todo';
    todo.dataset.index = indx;
    todo.dataset.projectIndex = projIndx;
    todo.draggable = true;

    const checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'checkbox-control';

    const todoCheckbox = document.createElement('input');
    todoCheckbox.type = 'checkbox';
    todoCheckbox.className = 'todo-checkbox';

    const todoName = document.createElement('div');
    todoName.className = 'todo-name';
    todoName.innerText = name;

    const todoDue = document.createElement('div');
    todoDue.className = 'due-date';
    todoDue.innerText = dueDate;

    const slideMenu = document.createElement('div');
    slideMenu.className = 'slideMenu-container-todo';

    const slideMenuBtnEdit = document.createElement('img');
    slideMenuBtnEdit.className = 'slideMenu-img slideMenu-btn-edit';
    slideMenuBtnEdit.src = './img/edit.svg';

    const slideMenuBtnDel = document.createElement('img');
    slideMenuBtnDel.className = 'slideMenu-img slideMenu-btn-del';
    slideMenuBtnDel.src = './img/delete.svg';

    checkboxLabel.append(todoCheckbox);
    slideMenu.append(slideMenuBtnEdit);
    slideMenu.append(slideMenuBtnDel);
    todo.append(todoDue);
    todo.append(todoName);
    todo.append(checkboxLabel);
    todo.append(slideMenu);

    return {
      todo,
      todoName,
      todoCheckbox,
      slideMenu,
      slideMenuBtnEdit,
      slideMenuBtnDel,
    };
  }

  return {
    menuBtn,
    backBtns,
    projectsContainer,
    todoContainer,
    todoHeader,
    projectForm,
    todoForm,
    projectName,
    todoName,
    projects,
    createProject,
    todos,
    createTodo,
    authentication,
    signUpCancelBtn,
    signUpCreateBtn,
    signUpForm,
    signInCancelBtn,
    signInFormBtn,
    signInForm,
    mainMenu,
  };
}
