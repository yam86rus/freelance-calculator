const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDay: [
        [2, 7],
        [3, 10],
        [7, 14]
    ],
    deadlinePercent: [20, 17, 15]
};

// =================== получение элементов ===================

const startButton = document.querySelector('.start-button');
const firstScreen = document.querySelector('.first-screen');
const mainForm = document.querySelector('.main-form');
const formCalculate = document.querySelector('.form-calculate');
const endButton = document.querySelector('.end-button');
const total = document.querySelector('.total');
const fastRange = document.querySelector('.fast-range');
const totalPriceSum = document.querySelector('.total_price__sum');

// =================== / получение элементов ===================


// ========================= функции =========================

// показать элемент
function showElem(elem) {
    elem.style.display = 'block';
}

// скрыть элемент
function hideElem(elem) {
    elem.style.display = 'none';
}

// функция расчета стоимости проекта
function priceCalculation(elem) {
    let result = 0; // по умолчанию итоговая сумма равна нулю
    let index = 0; // по умолчанию индекс равен нулю
    let options = []; // сюда будут записаны value, отмеченные в чек баксах пользователем

    if (elem.name === 'whichSite') {
        for (const item of formCalculate.elements) {
            if (item.type === 'checkbox') {
                item.checked = false;
            }
        }
        hideElem(fastRange);
    }
    // перебор значений чек боксов 'Какой сайт вам нужен?'
    for (const item of formCalculate.elements) {
        if (item.name === 'whichSite' && item.checked) {
            index = DATA.whichSite.indexOf(item.value); // получаем индекс whichSite
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        }
    }

    options.forEach(function (key) {
        if (typeof (DATA[key]) === 'number') {
            if (key === 'sendOrder') {
                result += DATA[key];
            } else {
                result += DATA.price[index] * DATA[key] / 100;
            }
        } else {
            if (key === 'desktopTemplates') {
                result += DATA.price[index] * DATA[key][index] / 100;
            } else {
                result += DATA[key][index]
            }
        }
    });

    result += DATA.price[index]; // цена по индексу

    totalPriceSum.textContent = result; // выводим итого в html
}

// любые изменения события
function handlerCallBackForm(event) {
    const target = event.target;

    // === check-box 'хочу быстрее' ===
    if (target.classList.contains('want-faster')) {
        target.checked ? showElem(fastRange) : hideElem(fastRange);
    }
    // === / check-box 'хочу быстрее' ===

    // проходим по всем классам с названием 'calc-handler'
    if (target.classList.contains('calc-handler')) {
        priceCalculation(target);
    }
}

// ========================= / функции =========================




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