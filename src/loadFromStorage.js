export default function loadFromStorage() {
  if (localStorage.getItem('projects') != null) {
    const array = JSON.parse(localStorage.getItem('projects'));
    return array;
  }
  return [];
}
