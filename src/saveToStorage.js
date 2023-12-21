export default function saveToStorage(array) {
  localStorage.setItem('projects', JSON.stringify(array));
}
