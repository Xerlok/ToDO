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
            })
        },
        createProject: function Project(projectName) {
            this.projectName = projectName;
        }
    }

    toDO.addListeners();
    console.log(toDO.projects);
})();
