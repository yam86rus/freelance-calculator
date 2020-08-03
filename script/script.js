// получение элементов
const startButton = document.querySelector('.start-button');
const firstScreen = document.querySelector('.first-screen');
const mainForm = document.querySelector('.main-form');
const formCalculate = document.querySelector('.form-calculate');
const endButton = document.querySelector('.end-button');
const total = document.querySelector('.total');
const fastRange = document.querySelector('.fast-range');


// === функции ===
function showElem(elem) {
    elem.style.display = 'block';
}

function hideElem(elem) {
    elem.style.display = 'none';
}

function handlerCallBackForm(event) {
    const target = event.target;

    // === check-box 'хочу быстрее' ===
    if (target.classList.contains('want-faster')) {
        target.checked ? showElem(fastRange) : hideElem(fastRange);
    }
    // === / check-box 'хочу быстрее' ===
}

// === / функции ===



// === события ===

// кнопка 'Рассчитать...'
startButton.addEventListener('click', function () {
    showElem(mainForm);
    hideElem(firstScreen);
});

// Кнопка 'Отправить заявку'
endButton.addEventListener('click', function () {

    for (const elem of formCalculate.elements) {
        if (elem.tagName === 'FIELDSET') {
            hideElem(elem);
        }
    }
    showElem(total);
});

// Любые изменения в форме
formCalculate.addEventListener('change', handlerCallBackForm);