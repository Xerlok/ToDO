'use strict'
export default function cacheDOM() {
    const menuBtn = document.querySelector('.main-menu');
    const projectsContainer = document.querySelector('.projects-container');
    const todoContainer = document.querySelector('.todo-container');
    const projectForm = document.querySelector('.project-form');
    const todoForm = document.querySelector('.todo-form');
    const projectName = document.getElementById('projectName');
    const todoName = document.getElementById('todoName');
    const projects = document.querySelector('.projects');
    const todoHeader = document.querySelector('.todo-h1');
    const todos = document.querySelector('.todos');

    const projectTemplate = document.createElement('div');
    projectTemplate.classList.add('project');

    function createProject(name) {
        let project = document.createElement('div');
        project.className = 'project';
        project.innerText = name;

        return project;
    }

    function createTodo(name, dueDate) {
        let todo = document.createElement('div');
        todo.className = 'todo';

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

        checkboxLabel.append(todoCheckbox);
        todo.append(todoDue);
        todo.append(todoName);
        todo.append(checkboxLabel);

        return {todo, todoCheckbox};
    }

    return {menuBtn, projectsContainer, todoContainer, todoHeader, projectForm, todoForm, projectName, todoName, 
    projectTemplate, projects, createProject, todos, createTodo};
}