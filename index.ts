import { Task } from './task';

// Create an instance of the Task class
const taskManager = new Task();

// Execute initialization after the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
  taskManager.init();
});
