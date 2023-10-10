'use strict'
import './styles.css';
import '../node_modules/webcimes-modal/dist/css/webcimes-modal.css';
import cacheDOM from './dom';
import { WebcimesModal } from "webcimes-modal";

const App = (() => {
    const toDO = {
        dom: cacheDOM(),
        projects: [],
        timesClicked: 0,

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
                let newTodo = new toDO.createTodo(toDO.dom.todoName.value, false);
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
        createTodo: function Todo(todoName, todoDone) {
            this.todoName = todoName;
            this.todoDone = todoDone;
        },
        renderProjects: function renderProjects() {
            while(toDO.dom.projects.hasChildNodes()) {
                toDO.dom.projects.removeChild(toDO.dom.projects.firstChild);
            }

            for (let i = 0; i < toDO.projects.length; i++) {
                let project = toDO.dom.createProject(toDO.projects[i].projectName);
                project.addEventListener('click', toDO.addProjectClick);
                project.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    toDO.showModal('project', project);
                })
                toDO.dom.projects.append(project);
            }
        },
        renderTodos: function renderTodos(currentProject) {
            while(toDO.dom.todos.hasChildNodes()) {
                toDO.dom.todos.removeChild(toDO.dom.todos.firstChild);
            }
            if (toDO.projects[currentProject].todos != '') {
                for (let i = 0; i < toDO.projects[currentProject].todos.length; i++) {
                    let newTodo = toDO.dom.createTodo(toDO.projects[currentProject].todos[i].todoName);
                    newTodo.todoCheckbox.addEventListener('click', (e) => {
                        toDO.checkboxClick(e, newTodo.todo);
                    });
                    newTodo.todo.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        if (toDO.timesClicked > 0) {
                            newTodo.slideMenu.classList.remove('open')
                            toDO.timesClicked = 0;
                        }
                        else {
                            newTodo.slideMenu.classList.add('open');
                            toDO.timesClicked++;
                        }
                    });
                    newTodo.slideMenuBtnDel.addEventListener('click', () => {
                        toDO.showModal('todo', newTodo.todo);
                    });
                    newTodo.slideMenuBtnEdit.addEventListener('click', () => {
                        newTodo.todo.contentEditable = true;
                    })
                    if (toDO.projects[currentProject].todos[i].todoDone === true) {
                        newTodo.todo.style.backgroundColor = 'grey';
                        newTodo.todo.style.textDecoration = 'line-through';
                        newTodo.todoCheckbox.checked = true;
                    }
                    toDO.dom.todos.append(newTodo.todo);
                }
            }

        },
        getProject: function getProject(name) {
            let currentProject = toDO.projects.findIndex(project => project.projectName === name);
            return currentProject;
        },
        getTodo: function getTodo(project, name) {
            let currentTodo = toDO.projects[project].todos.findIndex(todo => todo.todoName === name);
            return currentTodo;
        },
        addProjectClick: function addProjectClick(e) {
            let currentProject = toDO.getProject(e.target.innerText);
            toDO.dom.projectsContainer.style.display = 'none';
            toDO.dom.todoContainer.style.display = 'flex';
            toDO.dom.todoHeader.innerText = toDO.projects[currentProject].projectName;
            toDO.renderTodos(currentProject);
        },
        checkboxClick: function checkboxClick(e, todo) {
            let currentProject = toDO.getProject(toDO.dom.todoHeader.innerText);
            let currentTodo = toDO.getTodo(currentProject, todo.innerText);
            if (e.target.checked) {
                toDO.projects[currentProject].todos[currentTodo].todoDone = true;
            }
            else {
                toDO.projects[currentProject].todos[currentTodo].todoDone = false;
            }
            toDO.saveToStorage();
            toDO.renderTodos(currentProject);
        },
        todoRightClick: function todoRightClick(todo) {
            let currentProject = toDO.getProject(toDO.dom.todoHeader.innerText);
            let currentTodo = toDO.getTodo(currentProject, todo.innerText);
            toDO.projects[currentProject].todos.splice(currentTodo, 1);
            toDO.saveToStorage();
            toDO.renderTodos(currentProject);
        },
        projectRightClick: function projectRightClick(project) {
            let currentProject = toDO.getProject(project.innerText);
            toDO.projects.splice(currentProject, 1);
            toDO.saveToStorage();
            toDO.renderProjects();
        },
        saveToStorage: function saveToStorage() {
            localStorage.setItem('projects', JSON.stringify(toDO.projects));
        },
        loadFromStorage: function loadFromStorage() {
            if (localStorage.getItem('projects') != null) {
                toDO.projects = JSON.parse(localStorage.getItem('projects'));
            }
        },
        showModal: function showModal(type, obj) {
            const myModal = new WebcimesModal({
                setId: null, // set a specific id on the modal. default "null" 
                setClass: null, // set a specific class on the modal, default "null"
                width: 'auto', // width (specify unit), default "auto"
                height: 'auto', // height (specify unit), default "auto"
                titleHtml: "<span style='color:red'>Delete?</span>", // html for title, default "null"
                bodyHtml: null, // html for body, default "null"
                buttonCancelHtml: "Cancel", // html for cancel button, default "null"
                buttonConfirmHtml: "Confirm", // html for confirm button, default "null"
                closeOnCancelButton: true, // close modal after trigger cancel button, default "true"
                closeOnConfirmButton: true, // close modal after trigger confirm button, default "true"
                showCloseButton: true, // show close button, default "true"
                allowCloseOutside: true, // allow the modal to close when clicked outside, default "true"
                allowMovement: true, // ability to move modal, default "true"
                moveFromHeader: true, // if allowMovement is set to "true", ability to move modal from header, default "true"
                moveFromBody: false, // if allowMovement is set to "true", ability to move modal from body, default "false"
                moveFromFooter: true, // if allowMovement is set to "true", ability to move modal from footer, default "true"
                stickyHeader: true, // keep header sticky (visible) when scrolling, default "true"
                stickyFooter: true, // keep footer sticky (visible) when scrolling, default "true"
                style: "background:#fd8d8d;", // add extra css style to modal, default null
                animationOnShow: 'animDropDown', // "animDropDown" or "animFadeIn" for show animation, default "animDropDown"
                animationOnDestroy: 'animDropUp', // "animDropUp" or "animFadeOut" for destroy animation, default "animDropUp"
                animationDuration: 500, // animation duration in ms, default "500"
                beforeShow: () => {}, // callback before show modal
                afterShow: () => {}, // callback after show modal
                beforeDestroy: () => {}, // callback before destroy modal
                afterDestroy: () => {}, // callback after destroy modal
                onCancelButton: () => {}, // callback after triggering cancel button
                onConfirmButton: () => {
                    if (type === 'project') {
                        toDO.projectRightClick(obj);
                    }
                    else if (type === 'todo') {
                        toDO.todoRightClick(obj);
                    }
                }, // callback after triggering confirm button
            });
        }
    }

    toDO.addListeners();
    toDO.loadFromStorage();
    toDO.renderProjects();
})();
