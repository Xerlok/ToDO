'use strict'
export default function cacheDOM() {
    const backBtn = document.querySelector('.back-img')
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

    function createProject(name, indx) {
        let project = document.createElement('div');
        project.className = 'project';
        project.draggable = true;
        project.dataset.index = indx;

        let projectName = document.createElement('div');
        projectName.className = 'project-name';
        projectName.innerText = name;

        let slideMenu = document.createElement('div');
        slideMenu.className = 'slideMenu-container-proj';

        let slideMenuBtnEdit = document.createElement('img');
        slideMenuBtnEdit.className = 'slideMenu-img slideMenu-btn-edit';
        slideMenuBtnEdit.src = './img/edit.svg';

        let slideMenuBtnDel = document.createElement('img');
        slideMenuBtnDel.className = 'slideMenu-img slideMenu-btn-del';
        slideMenuBtnDel.src = './img/delete.svg';

        slideMenu.append(slideMenuBtnEdit);
        slideMenu.append(slideMenuBtnDel);
        project.append(projectName);
        project.append(slideMenu);

        return {project, projectName, slideMenu, slideMenuBtnEdit, slideMenuBtnDel};
    }

    function createTodo(name, indx, projIndx, dueDate) {
        let todo = document.createElement('div');
        todo.className = 'todo';
        todo.dataset.index = indx;
        todo.dataset.projectIndex = projIndx;
        todo.draggable = true;

        let checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox-control'

        let todoCheckbox = document.createElement('input');
        todoCheckbox.type = 'checkbox';
        todoCheckbox.className = 'todo-checkbox';

        let todoName = document.createElement('div');
        todoName.className = 'todo-name';
        todoName.innerText = name;

        let todoDue = document.createElement('div');
        todoDue.className = 'due-date';
        todoDue.innerText = dueDate;

        let slideMenu = document.createElement('div');
        slideMenu.className = 'slideMenu-container-todo';

        let slideMenuBtnEdit = document.createElement('img');
        slideMenuBtnEdit.className = 'slideMenu-img slideMenu-btn-edit';
        slideMenuBtnEdit.src = './img/edit.svg';

        let slideMenuBtnDel = document.createElement('img');
        slideMenuBtnDel.className = 'slideMenu-img slideMenu-btn-del';
        slideMenuBtnDel.src = './img/delete.svg';

        checkboxLabel.append(todoCheckbox);
        slideMenu.append(slideMenuBtnEdit);
        slideMenu.append(slideMenuBtnDel);
        todo.append(todoDue);
        todo.append(todoName);
        todo.append(checkboxLabel);
        todo.append(slideMenu);

        return {todo, todoName, todoCheckbox, slideMenu, slideMenuBtnEdit, slideMenuBtnDel};
    }

    return {menuBtn, backBtn, projectsContainer, todoContainer, todoHeader, projectForm, todoForm, projectName, todoName, 
    projects, createProject, todos, createTodo};
}