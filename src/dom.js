'use strict'
export default function cacheDOM() {
    const menuBtn = document.querySelector('.main-menu');
    const projectsContainer = document.querySelector('.projects-container');
    const todoContainer = document.querySelector('.todo-container');
    const projectForm = document.querySelector('.project-form');
    const projectName = document.getElementById('projectName');

    return {menuBtn, projectsContainer, todoContainer, projectForm, projectName};
}