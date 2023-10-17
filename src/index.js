'use strict'
import './styles.css';
import '../node_modules/webcimes-modal/dist/css/webcimes-modal.css';
import cacheDOM from './dom';
import { WebcimesModal } from "webcimes-modal";

const App = (() => {
    const toDO = {
        dom: cacheDOM(),
        projects: [],
        rightClicks: 0,
        previousName: '',
        dragStartIndex: null,
        dragEndIndex: null,

        backToProjects: function backToProjects() {
            toDO.dom.projectsContainer.style.display = 'flex';
            toDO.dom.todoContainer.style.display = 'none';
        },
        addListeners: function addListeners() {
            toDO.dom.backBtn.addEventListener('click', () => {
                toDO.backToProjects();
                toDO.dom.backBtn.style.display = 'none';
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
                let currentProjIndx = toDO.getProject(projectName);
                let newTodo = new toDO.createTodo(toDO.dom.todoName.value, false);
                toDO.projects[currentProjIndx].todos.push(newTodo);
                toDO.renderTodos(currentProjIndx);
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
                let newProject = toDO.dom.createProject(toDO.projects[i].projectName, i);
                newProject.project.addEventListener('click', toDO.openProject);
                newProject.project.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    if (toDO.rightClicks > 0) {
                        newProject.slideMenu.classList.remove('open')
                        toDO.rightClicks = 0;
                    }
                    else {
                        newProject.slideMenu.classList.add('open');
                        toDO.rightClicks++;
                    }
                });
                newProject.project.addEventListener('dragenter', (e) => {
                    if (e.target.classList[0] !== 'project') return;
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
                    console.log(this.dragStartIndex);
                });
                newProject.project.addEventListener('drop', (e) => {
                    toDO.dragEndIndex = +e.target.getAttribute('data-index');
                    console.log(this.dragEndIndex);

                    let itemOne = toDO.projects[toDO.dragStartIndex];
                    let itemTwo = toDO.projects[toDO.dragEndIndex];
                    toDO.projects[toDO.dragStartIndex] = itemTwo;
                    toDO.projects[toDO.dragEndIndex] = itemOne;
                    e.target.classList.remove('over');
                    toDO.renderProjects();
                    toDO.saveToStorage();
                });
                newProject.slideMenuBtnDel.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toDO.showModal('project', newProject.project);
                });
                newProject.slideMenuBtnEdit.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toDO.makeElementEditable('project', newProject);
                });
                newProject.projectName.addEventListener('blur', () => {
                    toDO.changeElementsName('project', i, newProject);
                });
                toDO.dom.projects.append(newProject.project);
            }
        },
        renderTodos: function renderTodos(currentProjIndx) {
            while(toDO.dom.todos.hasChildNodes()) {
                toDO.dom.todos.removeChild(toDO.dom.todos.firstChild);
            }
            if (toDO.projects[currentProjIndx].todos != '') {
                for (let i = 0; i < toDO.projects[currentProjIndx].todos.length; i++) {
                    let newTodo = toDO.dom.createTodo(toDO.projects[currentProjIndx].todos[i].todoName, i);
                    toDO.previousName = newTodo.todoName.innerText;
                    newTodo.todoCheckbox.addEventListener('click', (e) => {
                        toDO.updateTodoCompletion(e, newTodo.todo);
                    });
                    newTodo.todo.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        if (toDO.rightClicks > 0) {
                            newTodo.slideMenu.classList.remove('open')
                            toDO.rightClicks = 0;
                        }
                        else {
                            newTodo.slideMenu.classList.add('open');
                            toDO.rightClicks++;
                        }
                    });
                    newTodo.slideMenuBtnDel.addEventListener('click', () => {
                        toDO.showModal('todo', newTodo.todo);
                    });
                    newTodo.slideMenuBtnEdit.addEventListener('click', () => {
                        toDO.makeElementEditable('todo', newTodo);
                    });
                    newTodo.todoName.addEventListener('blur', () => {
                        toDO.changeElementsName('todo', currentProjIndx, newTodo);
                    });
                    if (toDO.projects[currentProjIndx].todos[i].todoDone === true) {
                        newTodo.todo.style.backgroundColor = 'grey';
                        newTodo.todo.style.textDecoration = 'line-through';
                        newTodo.todoCheckbox.checked = true;
                    }
                    toDO.dom.todos.append(newTodo.todo);
                }
            }

        },
        getProject: function getProject(name) {
            let currentProjIndx = toDO.projects.findIndex(project => project.projectName === name);
            return currentProjIndx;
        },
        getTodo: function getTodo(project, name) {
            let currentTodoIndx = toDO.projects[project].todos.findIndex(todo => todo.todoName === name);
            return currentTodoIndx;
        },
        openProject: function openProject(e) {
            let currentProjIndx;
            if (e.target.classList[0] === 'project') {
                currentProjIndx = toDO.getProject(e.target.firstChild.innerText);
            }
            else if (e.target.classList[0] === 'project-name') {
                currentProjIndx = toDO.getProject(e.target.innerText);
            }

            toDO.dom.projectsContainer.style.display = 'none';
            toDO.dom.todoContainer.style.display = 'flex';
            toDO.dom.backBtn.style.display = 'block';
            toDO.dom.todoHeader.innerText = toDO.projects[currentProjIndx].projectName;
            toDO.renderTodos(currentProjIndx);
        },
        updateTodoCompletion: function updateTodoCompletion(e, todo) {
            let currentProjIndx = toDO.getProject(toDO.dom.todoHeader.innerText);
            let currentTodoIndx = toDO.getTodo(currentProjIndx, todo.innerText);
            if (e.target.checked) {
                toDO.projects[currentProjIndx].todos[currentTodoIndx].todoDone = true;
            }
            else {
                toDO.projects[currentProjIndx].todos[currentTodoIndx].todoDone = false;
            }
            toDO.saveToStorage();
            toDO.renderTodos(currentProjIndx);
        },
        deleteElement: function deleteElement (type, obj) {
            if (type === 'project') {
                let currentProjIndx = toDO.getProject(obj.innerText);
                toDO.projects.splice(currentProjIndx, 1);
                toDO.saveToStorage();
                toDO.renderProjects();
            }
            else if (type === 'todo') {
                let currentProjIndx = toDO.getProject(toDO.dom.todoHeader.innerText);
                let currentTodoIndx = toDO.getTodo(currentProjIndx, obj.innerText);
                toDO.projects[currentProjIndx].todos.splice(currentTodoIndx, 1);
                toDO.saveToStorage();
                toDO.renderTodos(currentProjIndx);
            }
        },
        makeElementEditable: function makeElementEditable (type, obj) {
            if (type === 'project') {
                obj.projectName.contentEditable = true;
                obj.projectName.focus();
                obj.slideMenu.classList.remove('open')
                toDO.rightClicks = 0;
            }
            else if (type === 'todo') {
                toDO.previousName = obj.todoName.innerText;
                obj.todoName.contentEditable = true;
                obj.todoName.focus();
                obj.slideMenu.classList.remove('open')
                toDO.rightClicks = 0;
            }
        },
        changeElementsName: function changeElementsName (type, currentProjIndx, obj) {
            if (type === 'project') {
                obj.projectName.contentEditable = false;
                toDO.projects[currentProjIndx].projectName = obj.projectName.innerText;
                toDO.saveToStorage();
                toDO.renderProjects();
            }
            else if (type === 'todo') {
                obj.todoName.contentEditable = false;
                let currentTodoIndx = toDO.getTodo(currentProjIndx, toDO.previousName);
                toDO.projects[currentProjIndx].todos[currentTodoIndx].todoName = obj.todoName.innerText;
                toDO.saveToStorage();
                toDO.renderTodos(currentProjIndx);
            }
        },
        saveToStorage: function saveToStorage() {
            localStorage.setItem('projects', JSON.stringify(toDO.projects));
        },
        loadFromStorage: function loadFromStorage() {
            if (localStorage.getItem('projects') != null) {
                toDO.projects = JSON.parse(localStorage.getItem('projects'));
            }
            console.log(this.projects);
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
                onConfirmButton: () => {toDO.deleteElement(type, obj);}, // callback after triggering confirm button
            });
        }
    }

    toDO.addListeners();
    toDO.loadFromStorage();
    toDO.renderProjects();
})();
