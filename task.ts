import { Job, scheduleJob } from 'node-schedule';

export class Task {
  private task: Job | null;
  private taskStatusElement: HTMLElement | null;
  private stopButton: HTMLElement | null;
  private scheduleInput: HTMLInputElement | null;
  private changeScheduleButton: HTMLElement | null;
  private taskList: HTMLUListElement | null;
  private tasks: string[];

  constructor() {
    this.task = null;
    this.taskStatusElement = null;
    this.stopButton = null;
    this.scheduleInput = null;
    this.changeScheduleButton = null;
    this.taskList = null;
    this.tasks = [];
  }

  public init() {
    this.taskStatusElement = document.getElementById('task-status');
    this.stopButton = document.getElementById('stop-button');
    this.scheduleInput = document.getElementById('schedule-input') as HTMLInputElement;
    this.changeScheduleButton = document.getElementById('change-schedule-button');
    this.taskList = document.getElementById('task-list') as HTMLUListElement;

    if (!this.taskStatusElement || !this.stopButton || !this.scheduleInput || !this.changeScheduleButton || !this.taskList) {
      console.error('Не удалось найти один или несколько элементов на странице.');
      return;
    }

    this.stopButton.addEventListener('click', this.stopTask.bind(this));
    this.changeScheduleButton.addEventListener('click', this.changeSchedule.bind(this));
    this.scheduleInput.addEventListener('keydown', this.handleKeyPress.bind(this));

    this.loadTasks();
    this.renderTaskList();
  }

  private performTask() {
    if (this.taskStatusElement) {
      this.taskStatusElement.innerText = 'Задача выполняется...';
    }
    console.log('Выполняется задача...');
  }

  private startTask(schedule: string) {
    this.task = scheduleJob(schedule, () => {
      this.performTask();
    });
    console.log('Запущена задача:', schedule);
  }

  private stopTask() {
    if (this.task) {
      this.task.cancel();
      this.task = null;
    }
    if (this.taskStatusElement) {
      this.taskStatusElement.innerText = 'Расписание остановлено.';
    }
    console.log('Расписание остановлено.');
  }

  private changeSchedule() {
    if (this.scheduleInput && this.taskList) {
      const newSchedule = this.scheduleInput.value;
      this.stopTask();
      this.startTask(newSchedule);
      this.scheduleInput.value = '';
      this.addTask(newSchedule);
      console.log('Расписание изменено:', newSchedule);
    }
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.changeSchedule();
    }
  }

  private addTask(schedule: string) {
    this.tasks.push(schedule);
    this.saveTasks();
    this.renderTaskList();
  }

  private deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.saveTasks();
    this.renderTaskList();
  }

  private renderTaskList() {
    if (this.taskList) {
      this.taskList.innerHTML = '';
      this.tasks.forEach((schedule, index) => {
        const li = document.createElement('li');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => {
          this.deleteTask(index);
        });
        li.textContent = schedule;
        li.appendChild(deleteButton);
        this.taskList?.appendChild(li);
      });
    }
  }

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  private loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }
}
