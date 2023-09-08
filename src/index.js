'use strict'
import './styles.css';
import cacheDOM from './dom';

const App = (() => {
    const toDO = {
        dom: cacheDOM(),
        projects: [],
        todos: [],

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

                let projectName = toDO.dom.projectName.value;
                let newProject = new toDO.createProject(projectName);
                toDO.projects.push(newProject);
                toDO.renderProjects(projectName);
            })
        },
        createProject: function Project(projectName) {
            this.projectName = projectName;
        },
        renderProjects: function renderProjects(name) {
            while(toDO.dom.projects.hasChildNodes()) {
                toDO.dom.projects.removeChild(toDO.dom.projects.firstChild);
            }

            for (let i = 0; i < toDO.projects.length; i++) {
                let project = toDO.dom.createProject(toDO.projects[i].projectName);

                toDO.dom.projects.append(project);
            }
        }
    }

    toDO.addListeners();
    console.log(toDO.projects);
})();
