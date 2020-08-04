const DAY_STRING = ['день', 'дня', 'дней'];

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

const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range'),
    totalPriceSum = document.querySelector('.total_price__sum'),

    adapt = document.getElementById('adapt'),
    mobileTemplates = document.getElementById('mobileTemplates'),
    desktopTemplates = document.getElementById('desktopTemplates'),
    editable = document.getElementById('editable'),

    adaptValue = document.querySelector('.adapt_value'),
    mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
    desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
    editableValue = document.querySelector('.editable_value'),
    typeSite = document.querySelector('.type-site'),
    maxDeadline = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value'),
    calcDescription = document.querySelector('.calc-description'),

    metrikaYandex = document.getElementById('metrikaYandex'),
    analyticsGoogle = document.getElementById('analyticsGoogle'),
    sendOrder = document.getElementById('sendOrder'),
    cardHead = document.querySelector('.card-head'),
    totalPrice = document.querySelector('.total_price'),
    firstFieldset = document.querySelector('.first-fieldset');


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

// склонение дней
function declOfNum(n, titles) {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
        0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}
function moveBackTotal(){
    if (document.documentElement.getBoundingClientRect().bottom >
    document.documentElement.clientHeight + 200) {
        totalPrice.classList.remove('totalPriceButtom');
        firstFieldset.after(totalPrice);
        window.removeEventListener('scroll',moveBackTotal);
        window.addEventListener('scroll',moveTotal);
    }
}

function moveTotal() {
    if (document.documentElement.getBoundingClientRect().bottom <
        document.documentElement.clientHeight + 200) {
        totalPrice.classList.add('totalPriceButtom');
        endButton.before(totalPrice);
        window.removeEventListener('scroll',moveTotal);
        window.addEventListener('scroll',moveBackTotal);
    }
}
// вывод текста внизу страницы "допполнительные функции'
function dopOptionString() {
    // Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.
    let str = '';
    if (metrikaYandex.checked || analyticsGoogle.checked || sendOrder.checked) {
        str += 'Подключим';

        if (metrikaYandex.checked) {
            str += ' Яндекс Метрику';

            if (analyticsGoogle.checked && sendOrder.checked) {
                str += ', Гугл Аналитику и отправку заявок на почту.';
                return;
            }
            if (analyticsGoogle.checked || sendOrder.checked) {
                str += ' и';
            }
        }
        if (analyticsGoogle.checked) {
            str += ' Гугл Аналитику';
            if (sendOrder.checked) {
                str += ' и';
            }
            if (sendOrder.checked) {
                str += ' отправку заявок на почту';
            }
            str += '.';
        }
    }
    return str;
}

// рендеринг содержимого
function renderTextContent(total, site, maxDay, minDay) {
    totalPriceSum.textContent = total; // выводим итого в html
    typeSite.textContent = site; //выводим тип сайта внизу в html 
    maxDeadline.textContent = declOfNum(maxDay, DAY_STRING); //выводим максимальное число дней
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

    adaptValue.textContent = adapt.checked ? 'Да' : 'Нет';
    mobileTemplatesValue.textContent = mobileTemplates.checked ? 'Да' : 'Нет';
    desktopTemplatesValue.textContent = desktopTemplates.checked ? 'Да' : 'Нет';
    editableValue.textContent = editable.checked ? 'Да' : 'Нет';

    calcDescription.textContent = `
    Сделаем ${site}${adapt.checked ? ', адаптированный под мобильные устройства и планшеты': ''}
    ${editable.checked ? 'Установим панель админстратора, чтобы вы могли самостоятельно менять содержание на сайте без разработчика':''}.
    ${dopOptionString()}
    `;
}

// функция расчета стоимости проекта
function priceCalculation(elem = {}) {
    let result = 0, // по умолчанию итоговая сумма равна нулю
        index = 0, // по умолчанию индекс равен нулю
        options = [], // сюда будут записаны value, отмеченные в чек баксах пользователем
        site = '', // хранения текста для вывода на низ страницы
        maxDeadLineDay = DATA.deadlineDay[index][1],
        minDeadLineDay = DATA.deadlineDay[index][0],
        overPercent = 0; //переплата в процентах

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
            site = item.dataset.site; // смена надписи внизу страницы
            maxDeadLineDay = DATA.deadlineDay[index][1];
            minDeadLineDay = DATA.deadlineDay[index][0];
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        } else if (item.classList.contains('want-faster') && item.checked) {
            const overDay = maxDeadLineDay - rangeDeadline.value; // количество дней на которое нужео выполнить работу быстрее
            overPercent = overDay * (DATA.deadlinePercent[index] / 100); // переплата за скорость
        }
    }
    result += DATA.price[index]; // цена по индексу

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
                result += DATA[key][index];
            }
        }
    });



    result += result * overPercent;
    renderTextContent(result, site, maxDeadLineDay, minDeadLineDay); //рендерим страницу

}

// любые изменения события
function handlerCallBackForm(event) {
    const target = event.target;

    // скрытие check box mobileTemplates в зависимости от check box adap
    if (adapt.checked) {
        mobileTemplates.disabled = false;
    } else {
        mobileTemplates.disabled = true;
        mobileTemplates.checked = false;

    }

    // === check-box 'хочу быстрее' ===
    if (target.classList.contains('want-faster')) {
        target.checked ? showElem(fastRange) : hideElem(fastRange);
        priceCalculation(target);
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
    window.addEventListener('scroll', moveTotal);
});

// Кнопка 'Отправить заявку'
endButton.addEventListener('click', function () {

    for (const elem of formCalculate.elements) {
        if (elem.tagName === 'FIELDSET') {
            hideElem(elem);
        }
    }
    // Меняем заголовок
    cardHead.textContent = 'Заявка на разработку сайта'; 
    // Прячем цену
    hideElem(totalPrice);
    // Выводим блок 'total'
    showElem(total);
});

// Любые изменения в форме
formCalculate.addEventListener('change', handlerCallBackForm);

priceCalculation();