class ProgressBlock {
    /**
     * Конструктор компонента прогресса
     * @param {string} canvasId - ID элемента canvas, в котором будет отрисовываться прелоадер
     * @param {Object} [options={}] - Объект с настройками прелоадера
     * @param {HTMLCanvasElement} [options.canvas] - Элемент canvas (будет найден по canvasId если не указан)
     * @param {CanvasRenderingContext2D} [options.ctx] - Контекст рисования canvas
     * @param {number} [options.value=0] - Начальное значение прогресса (0-100)
     * @param {boolean} [options.animate=false] - Включить ли анимацию изменения прогресса
     * @param {boolean} [options.hidden=false] - Скрыт ли прелоадер изначально
     * @param {number} [options.rotation=0] - Угол поворота прелоадера в градусах
     * @param {number|null} [options.animationFrame=null] - ID кадра анимации (для внутреннего использования)
     */
    constructor(canvasId, options = {}) {
       const defaults = {
           canvas: document.getElementById(canvasId),
           ctx: document.getElementById(canvasId).getContext('2d'),
           value: 0,
           animate: false,
           hidden: false,
           rotation: 0,
           animationFrame: null,
       }

        // Объединение настроек с defaults
        this.settings = { ...defaults, ...options };

        // Установка начального размера canvas
        this.setCanvasSize();

        // Обработчик изменения размера окна
        this.handleResize = () => this.setCanvasSize();
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * Устанавливает размер canvas
     * Вычисляет оптимальный размер на основе ширины окна браузера
     * Максимальный размер ограничен 200 пикселями
     * После изменения размера перерисовывает компонент
     */
    setCanvasSize() {
        const size = Math.min(window.innerWidth * 0.8, 200);
        this.settings.canvas.width = size;
        this.settings.canvas.height = size;
        this.draw();
    }

    /**
     * Устанавливает значение прогресса
     * @param {number} value - Значение прогресса (0-100)
     *
     * Ограничивает значение в диапазоне 0-100
     * После установки значения перерисовывает компонент
     */
    setValue(value) {
        this.settings.value = Math.min(100, Math.max(0, value));
        this.draw();
    }

    /**
     * Управляет состоянием анимации
     * @param {boolean} animate - Включить/выключить анимацию
     *
     * При включении запускает анимацию вращения
     * При выключении останавливает анимацию
     */
    setAnimate(animate) {
        this.settings.animate = animate;
        if (animate) {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    /**
     * Управляет видимостью компонента
     * @param {boolean} hidden - Скрыть/показать компонент
     *
     * Изменяет CSS свойство display для canvas
     */
    setHidden(hidden) {
        this.settings.hidden = hidden;
        //this.settings.canvas.style.display = hidden ? 'none' : 'block';
        this.settings.canvas.style.visibility = hidden ? 'hidden' : 'visible';
    }

    /**
     * Отрисовывает компонент прогресса
     * @param {number} rotation - Угол поворота для анимации (в радианах)
     *
     * Рисует:
     * 1. Фоновый серый круг
     * 2. Фиолетовую дугу прогресса
     * Учитывает:
     * - Текущее значение прогресса
     * - Угол поворота для анимации
     * - Размеры canvas
     */
    draw(rotation = 0) {
        if (this.settings.hidden) return;

        const width = this.settings.canvas.width;
        const height = this.settings.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2.5 - 10;

        // Очистка canvas
        this.settings.ctx.clearRect(0, 0, width, height);

        // Рисование фонового круга
        this.settings.ctx.beginPath();
        this.settings.ctx.strokeStyle = '#E5E7EB';
        this.settings.ctx.lineWidth = 10;
        this.settings.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.settings.ctx.stroke();

        // Рисование дуги прогресса
        this.settings.ctx.beginPath();
        this.settings.ctx.strokeStyle = 'blue';
        this.settings.ctx.lineWidth = 10;
        const startAngle = -Math.PI / 2 + rotation;
        const endAngle = startAngle + (this.settings.value / 100) * (2 * Math.PI);
        this.settings.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.settings.ctx.stroke();
    }

    /**
     * Запускает анимацию вращения
     *
     * Использует requestAnimationFrame для плавной анимации
     * Увеличивает угол поворота на каждом кадре
     * Сохраняет идентификатор анимации для возможности её остановки
     */
    startAnimation() {
        const animate = () => {
            this.settings.rotation += 0.02;
            this.draw(this.settings.rotation);
            this.settings.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }

    /**
     * Останавливает анимацию вращения
     *
     * Отменяет текущий кадр анимации
     * Сбрасывает угол поворота
     * Перерисовывает компонент в исходном положении
     */
    stopAnimation() {
        if (this.settings.animationFrame) {
            cancelAnimationFrame(this.settings.animationFrame);
        }
        this.settings.rotation = 0;
        this.draw();
    }

    /**
     * Включает/выключает автоматическое увеличение значения
     * @param {number} value - Новое значение прогресса
     *
     */
    incrementProgress(value) {
        if (this.settings.value < 100) {
            this.setValue(this.settings.value = value);
            // Обновляем значение в инпуте
            const input = document.getElementById('value');
            if (input) input.value = this.settings.value;
        }
    }

    /**
     * Удаляет компонент и очищает все ресурсы
     *
     * - Останавливает анимацию если она запущена
     * - Удаляет обработчик изменения размера окна
     * - Очищает canvas
     * - Удаляет элемент canvas из DOM
     */
    destroy() {
        this.stopAnimation();
        window.removeEventListener('resize', this.handleResize);
        this.settings.ctx.clearRect(0, 0, this.settings.canvas.width, this.settings.canvas.height);

        if (this.settings.canvas.parentNode) {
            this.settings.canvas.parentNode.removeChild(this.settings.canvas);
        }

        this.canvas = null;
        this.settings.ctx = null;
    }
}
