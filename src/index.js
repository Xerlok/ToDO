'use strict'
import './styles.css';
import cacheDOM from './dom';

const App = (() => {
    const toDO = {
        dom: cacheDOM(),
        projects: [],

        switchPage: function switchPage() {
            if (window.getComputedStyle(toDO.dom.projectsContainer).display === 'flex') {
                toDO.dom.projectsContainer.style.display = 'none';
                toDO.dom.todoContainer.style.display = 'flex';
            }

            else if (window.getComputedStyle(toDO.dom.projectsContainer).display === 'none') {
                toDO.dom.projectsContainer.style.display = 'flex';
                toDO.dom.todoContainer.style.display = 'none';
            }
        },
        addListeners: function addListeners() {
            toDO.dom.menuBtn.addEventListener('click', () => {
                toDO.switchPage();
            })

            toDO.dom.projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                let newProject = new toDO.createProject(toDO.dom.projectName.value);
                toDO.projects.push(newProject);
                toDO.renderProjects();
                toDO.dom.projectName.value = '';
                toDO.saveToStorage();
            })

            toDO.dom.todoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                let projectName = toDO.dom.todoHeader.innerText;
                let currProjIndx = toDO.getProject(projectName);
                let newTodo = new toDO.createTodo(toDO.dom.todoName.value);
                toDO.projects[currProjIndx].todos.push(newTodo);
                toDO.renderTodos(currProjIndx);
                toDO.dom.todoName.value = '';
                toDO.saveToStorage();
            })
            
        },
        createProject: function Project(projectName) {
            this.projectName = projectName;
            this.todos = [];
        },
        createTodo: function Todo(todoName) {
            this.todoName = todoName;
        },
        renderProjects: function renderProjects() {
            while(toDO.dom.projects.hasChildNodes()) {
                toDO.dom.projects.removeChild(toDO.dom.projects.firstChild);
            }

            for (let i = 0; i < toDO.projects.length; i++) {
                let project = toDO.dom.createProject(toDO.projects[i].projectName);
                project.addEventListener('click', (e) => {
                    let currentProject = toDO.getProject(e.target.innerText);
                    toDO.dom.projectsContainer.style.display = 'none';
                    toDO.dom.todoContainer.style.display = 'flex';
                    toDO.dom.todoHeader.innerText = this.projects[currentProject].projectName;
                    toDO.renderTodos(currentProject);
                })
                toDO.dom.projects.append(project);
            }
        },
        renderTodos: function renderTodos(currentProject) {
            while(toDO.dom.todos.hasChildNodes()) {
                toDO.dom.todos.removeChild(toDO.dom.todos.firstChild);
            }
            if (toDO.projects[currentProject].todos != '') {
                for (let i = 0; i < toDO.projects[0].todos.length; i++) {
                    let todo = toDO.dom.createTodo(toDO.projects[currentProject].todos[i].todoName);
                    toDO.dom.todos.append(todo);
                }
            }

        },
        getProject: function getProject(name) {
            let currentProject = toDO.projects.findIndex(project => project.projectName === name)
            return currentProject;
        },
        saveToStorage: function saveToStorage() {
            localStorage.setItem('projects', JSON.stringify(toDO.projects));
        },
        loadFromStorage: function loadFromStorage() {
            if (localStorage.getItem('projects') != null) {
                toDO.projects = JSON.parse(localStorage.getItem('projects'));
            }
        }
    }

    toDO.addListeners();
    toDO.loadFromStorage();
    toDO.renderProjects();
})();
