// Инициализация компонента прогресса
const progress = new ProgressBlock('progress');

//ограничение значения инпута
const valueInput = document.getElementById('value');
valueInput.addEventListener('change', function() {
    this.value = Math.min(100, Math.max(0, this.value));
});

// Настройка обработчиков событий

// Обработчик изменения значения прогресса
document.getElementById('value').addEventListener('input', (e) => {
    const value = Math.min(100, Math.max(0, Number(e.target.value)));
    progress.setValue(value);
});

// Обработчик включения/выключения анимации
document.getElementById('animate').addEventListener('change', (e) => {
    progress.setAnimate(e.target.checked);
});

// Обработчик показа/скрытия компонента
document.getElementById('hidden').addEventListener('change', (e) => {
    progress.setHidden(e.target.checked);
});



//Имитация загрузки прогресса
// let value = 0;
// const interval = setInterval(() => {
//     progress.incrementProgress(value)
//     value += 1;
//     if (progress.settings.value === 100) {
//         clearInterval(interval);
//     }
// }, 100)


// Пример использования метода destroy (Раскомментируйте для удаления компонента)
// setTimeout(() => {
//     progress.destroy();
// }, 5000);
