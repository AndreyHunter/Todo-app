function renderTask(selector, data) {
    const element = document.querySelector(selector);
    element.innerHTML = '';

    for (let key of data) {
        const {id, taskText, status} = key;
        const isDone = status ? 'active' : '';

        const taskHTML = `
            <li class="todo__item ${isDone}" id="${id}">
              <div class="todo__item-task">
                    <div class="todo__item-check-wrapper">
                        <div class="todo__item-check ${isDone}"></div>
                    </div>
                    ${taskText}
              </div>
                <div class="action-icons">
                        <svg class="icon change-icon" data-action="change">
                            <use href="./images/svgsprite/sprite.symbol.svg#change"></use>
                        </svg>

                        <svg class="icon trash-icon" data-action="remove">
                            <use href="./images/svgsprite/sprite.symbol.svg#trash"></use>
                        </svg>
                </div>
            </li>
        `;

        element.insertAdjacentHTML('beforeend', taskHTML);
    }
}

export { renderTask };