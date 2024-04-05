import { Modal } from './modules/modal';
import { renderTask, todoEmpty } from './modules/render';
import { getItem, setItem } from './modules/local-storage';

// import 'simplebar';
// import 'simplebar/dist/simplebar.css';

// Отображения тасков при старте страници

let tasksArray = getItem('task') || [];
renderTask('.todo__list', tasksArray);

checkTodoListLength('.todo__list');

// Модальное окно 
const modal = new Modal(
	'.todo__add-taskBtn',
	'.todo-modal',
	'.todo-modal__content',
	'active',
	'active'
);

window.addEventListener('click', (e) => {
	const target = e.target;
	const overlay = document.querySelector('.todo-modal');
	if (!overlay.classList.contains('active')) return;

	if (target.classList.contains('todo-modal')) modal.closeModal();
	if (target.getAttribute('data-modal-btn') === 'chancel') modal.closeModal();
});

document.addEventListener('keydown', e => e.code === 'Escape' ? modal.closeModal() : null);

// Добавления задач 

const todoForm = document.querySelector('.todo-modal__form');
todoForm.addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();

    const todoInput = document.querySelector('.todo-modal__input');
    const todoInputValue = todoInput.value.trim();

    if (!todoInputValue) return;

    const taskInfo = {
        id: Date.now(),
        taskText: todoInputValue,
        status: false
    };

    tasksArray.push(taskInfo);
    setItem('task', tasksArray);
    renderTask('.todo__list', tasksArray);
    todoForm.reset();
    checkTodoListLength('.todo__list');
}

// Отметка завершённой задачи

const todoList = document.querySelector('.todo__list');
todoList.addEventListener('click', handleTaskAction);

function handleTaskAction(e) {
    const target = e.target;

    const done = target.closest('.todo__item-check-wrapper');
    const taskText = target.closest('.todo__item-task');

    const taskItem = target.closest('.todo__item');
    if (!taskItem) return;
    const id = +taskItem.id;

    const taskIndex = tasksArray.findIndex(task => task.id === id);

    if (target === taskText || target === done) {
        tasksArray[taskIndex].status = !tasksArray[taskIndex].status;
        taskText.closest('.todo__item').classList.toggle('active');
        taskText.querySelector('.todo__item-check').classList.toggle('active');
    }

    if (target.dataset.action === 'remove') {
        tasksArray.splice(taskIndex, 1);
        taskItem.remove();
        checkTodoListLength('.todo__list');
    }

    setItem('task', tasksArray);
}

// Проверка на пустой список 

function checkTodoListLength(arr) {
    const el = document.querySelector(arr);

    if (el.children.length === 0 && tasksArray.length === 0) {
        todoEmpty('.container');
    } else {
        const emptyMessage = document.querySelector('.empty');
        if (emptyMessage) emptyMessage.remove();
    }
}