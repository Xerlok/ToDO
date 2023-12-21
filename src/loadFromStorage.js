export default function loadFromStorage(array) {
  if (localStorage.getItem('projects') != null) {
    array = JSON.parse(localStorage.getItem('projects'));
  }
}
