'use strict'
export default function cacheDOM() {
    const menuBtn = document.querySelector('.main-menu');
    const projectsContainer = document.querySelector('.projects-container');
    const todoContainer = document.querySelector('.todo-container');
    const projectForm = document.querySelector('.project-form');
    const projectName = document.getElementById('projectName');
    const projects = document.querySelector('.projects');

    const projectTemplate = document.createElement('div');
    projectTemplate.classList.add('project');

    function createProject(name) {
        let project = document.createElement('div');
        project.className = 'project';
        project.innerText = name;

        return project;
    }

    return {menuBtn, projectsContainer, todoContainer, projectForm, projectName, projectTemplate, projects, createProject};
}