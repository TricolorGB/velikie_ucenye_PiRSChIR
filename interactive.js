// interactive.js - Интерактивные элементы для научных страниц

// ==================== ФИЗИКА ====================
function initPhysicsSimulator() {
    const field = document.getElementById('particle-field');
    if (!field) return;
    
    let particles = [];
    let gravity = 0.5;
    let gravityEnabled = true;
    let animationId = null;
    
    // Создание частицы
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Случайный цвет
        const hue = Math.floor(Math.random() * 360);
        particle.style.background = `radial-gradient(circle, hsl(${hue}, 80%, 70%), hsl(${hue}, 100%, 50%))`;
        
        // Случайная начальная скорость
        particle.vx = (Math.random() - 0.5) * 4;
        particle.vy = (Math.random() - 0.5) * 4;
        particle.x = x;
        particle.y = y;
        
        particle.addEventListener('click', (e) => {
            e.stopPropagation();
            particle.remove();
            particles = particles.filter(p => p !== particle);
        });
        
        field.appendChild(particle);
        particles.push(particle);
        
        if (!animationId) {
            animateParticles();
        }
    }
    
    // Анимация частиц
    function animateParticles() {
        const centerX = field.clientWidth / 2;
        const centerY = field.clientHeight / 2;
        
        particles.forEach(particle => {
            if (gravityEnabled) {
                // Применяем гравитацию к центру
                const dx = centerX - particle.x;
                const dy = centerY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 30) {
                    const force = gravity / (distance / 100);
                    particle.vx += (dx / distance) * force * 0.1;
                    particle.vy += (dy / distance) * force * 0.1;
                }
            }
            
            // Обновляем позицию
            particle.vx *= 0.99; // Сопротивление воздуха
            particle.vy *= 0.99;
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Отскок от границ
            if (particle.x <= 0 || particle.x >= field.clientWidth - 20) {
                particle.vx *= -0.8;
                particle.x = particle.x <= 0 ? 0 : field.clientWidth - 20;
            }
            
            if (particle.y <= 0 || particle.y >= field.clientHeight - 20) {
                particle.vy *= -0.8;
                particle.y = particle.y <= 0 ? 0 : field.clientHeight - 20;
            }
            
            particle.style.left = `${particle.x}px`;
            particle.style.top = `${particle.y}px`;
        });
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    // Обработчики событий
    field.addEventListener('click', (e) => {
        const rect = field.getBoundingClientRect();
        const x = e.clientX - rect.left - 10;
        const y = e.clientY - rect.top - 10;
        createParticle(x, y);
    });
    
    document.getElementById('add-particle')?.addEventListener('click', () => {
        const x = Math.random() * (field.clientWidth - 40) + 20;
        const y = Math.random() * (field.clientHeight - 40) + 20;
        createParticle(x, y);
    });
    
    document.getElementById('clear-particles')?.addEventListener('click', () => {
        particles.forEach(p => p.remove());
        particles = [];
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });
    
    document.getElementById('gravity-on')?.addEventListener('click', () => {
        gravityEnabled = true;
    });
    
    document.getElementById('gravity-off')?.addEventListener('click', () => {
        gravityEnabled = false;
    });
    
    document.getElementById('gravity-slider')?.addEventListener('input', (e) => {
        gravity = parseFloat(e.target.value);
        document.getElementById('gravity-value').textContent = gravity.toFixed(1);
    });
    
    // Создаем начальные частицы
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * (field.clientWidth - 40) + 20;
            const y = Math.random() * (field.clientHeight - 40) + 20;
            createParticle(x, y);
        }, i * 200);
    }
}

// ==================== МАТЕМАТИКА ====================
function initMathCalculator() {
    const canvas = document.getElementById('math-graph');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let currentFunction = 'Math.sin(x)';
    let xRange = 10;
    let yRange = 5;
    
    // Отрисовка координатной сетки
    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Фон
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--card-bg');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scaleX = canvas.width / (2 * xRange);
        const scaleY = canvas.height / (2 * yRange);
        
        // Сетка
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color');
        ctx.lineWidth = 0.5;
        
        // Вертикальные линии
        for (let x = -xRange; x <= xRange; x += 1) {
            if (x === 0) continue;
            const screenX = centerX + x * scaleX;
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, canvas.height);
            ctx.stroke();
        }
        
        // Горизонтальные линии
        for (let y = -yRange; y <= yRange; y += 1) {
            if (y === 0) continue;
            const screenY = centerY - y * scaleY;
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(canvas.width, screenY);
            ctx.stroke();
        }
        
        // Оси
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
        ctx.lineWidth = 2;
        
        // Ось X
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();
        
        // Ось Y
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
        
        // Подписи осей
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
        ctx.font = '14px Arial';
        ctx.fillText('X', canvas.width - 10, centerY - 10);
        ctx.fillText('Y', centerX + 10, 20);
        
        // Деления на осях
        ctx.font = '12px Arial';
        for (let x = -xRange + 1; x < xRange; x++) {
            if (x === 0) continue;
            const screenX = centerX + x * scaleX;
            ctx.fillText(x.toString(), screenX - 5, centerY + 15);
        }
        
        for (let y = -yRange + 1; y < yRange; y++) {
            if (y === 0) continue;
            const screenY = centerY - y * scaleY;
            ctx.fillText(y.toString(), centerX + 10, screenY + 5);
        }
    }
    
    // Отрисовка графика функции
    function plotFunction() {
        drawGrid();
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scaleX = canvas.width / (2 * xRange);
        const scaleY = canvas.height / (2 * yRange);
        
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--secondary-color');
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        let hasPoints = false;
        
        for (let screenX = 0; screenX < canvas.width; screenX++) {
            const x = (screenX - centerX) / scaleX;
            
            try {
                // Безопасное вычисление функции
                const safeFunction = currentFunction
                    .replace(/Math\./g, 'Math.')
                    .replace(/x/g, `(${x})`);
                
                const y = eval(safeFunction);
                
                if (isFinite(y)) {
                    const screenY = centerY - y * scaleY;
                    
                    if (screenX === 0) {
                        ctx.moveTo(screenX, screenY);
                    } else {
                        ctx.lineTo(screenX, screenY);
                    }
                    hasPoints = true;
                }
            } catch (e) {
                // Пропускаем точки с ошибками
            }
        }
        
        if (hasPoints) {
            ctx.stroke();
            updateGraphInfo();
        } else {
            document.getElementById('graph-info').innerHTML = 
                '<p>Не удалось построить график. Проверьте правильность функции.</p>';
        }
    }
    
    // Обновление информации о графике
    function updateGraphInfo() {
        const info = document.getElementById('graph-info');
        info.innerHTML = `
            <p><strong>Функция:</strong> f(x) = ${currentFunction}</p>
            <p><strong>Область определения:</strong> x ∈ [${-xRange}, ${xRange}]</p>
            <p><strong>Область значений:</strong> y ∈ [${-yRange}, ${yRange}]</p>
        `;
    }
    
    // Обработчики событий
    document.getElementById('plot-function')?.addEventListener('click', () => {
        currentFunction = document.getElementById('function-input').value;
        plotFunction();
    });
    
    document.getElementById('function-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentFunction = e.target.value;
            plotFunction();
        }
    });
    
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFunction = btn.dataset.func;
            document.getElementById('function-input').value = currentFunction;
            plotFunction();
        });
    });
    
    document.getElementById('x-range')?.addEventListener('input', (e) => {
        xRange = parseInt(e.target.value);
        document.getElementById('x-range-value').textContent = `[-${xRange}, ${xRange}]`;
        plotFunction();
    });
    
    document.getElementById('y-range')?.addEventListener('input', (e) => {
        yRange = parseInt(e.target.value);
        document.getElementById('y-range-value').textContent = `[-${yRange}, ${yRange}]`;
        plotFunction();
    });
    
    // Инициализация
    drawGrid();
    plotFunction();
}

// ==================== IT ====================
function initITCodeEditor() {
    const editor = document.getElementById('code-editor');
    const output = document.getElementById('code-output');
    if (!editor || !output) return;
    
    // Обновление номеров строк
    function updateLineNumbers() {
        const lineNumbers = document.querySelector('.line-numbers');
        if (!lineNumbers) return;
        
        const lines = editor.value.split('\n').length;
        lineNumbers.innerHTML = '';
        
        for (let i = 1; i <= lines; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.textContent = i;
            lineNumbers.appendChild(lineNumber);
        }
    }
    
    // Выполнение кода
    function executeCode() {
        const code = editor.value;
        output.innerHTML = '';
        
        // Перехватываем console.log
        const originalLog = console.log;
        const logs = [];
        
        console.log = (...args) => {
            logs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
            originalLog.apply(console, args);
        };
        
        try {
            // Безопасное выполнение кода
            const result = eval(code);
            
            if (result !== undefined && !code.includes('console.log')) {
                logs.push(String(result));
            }
            
            if (logs.length === 0) {
                output.innerHTML = '<p style="color: var(--text-light)">Код выполнен успешно, но ничего не выведено.</p>';
            } else {
                logs.forEach(log => {
                    const line = document.createElement('div');
                    line.textContent = log;
                    line.style.padding = '0.3rem 0';
                    line.style.borderBottom = '1px solid var(--border-color)';
                    output.appendChild(line);
                });
            }
            
            // Добавляем сообщение об успехе
            const success = document.createElement('div');
            success.innerHTML = '<p style="color: #4caf50; margin-top: 1rem;"><i class="fas fa-check-circle"></i> Код выполнен без ошибок</p>';
            output.appendChild(success);
            
        } catch (error) {
            output.innerHTML = `
                <div style="color: #f44336;">
                    <p><i class="fas fa-exclamation-circle"></i> Ошибка выполнения:</p>
                    <p><strong>${error.name}:</strong> ${error.message}</p>
                </div>
            `;
        } finally {
            console.log = originalLog; // Восстанавливаем оригинальный console.log
        }
    }
    
    // Примеры кода
    const examples = {
        fibonacci: `// Числа Фибоначчи
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Первые 15 чисел Фибоначчи:");
for (let i = 0; i < 15; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,

        sorting: `// Сортировка массива
const numbers = [42, 17, 8, 99, 23, 56, 1, 74];

console.log("Исходный массив:", numbers);

// Сортировка пузырьком
function bubbleSort(arr) {
    const sorted = [...arr];
    for (let i = 0; i < sorted.length; i++) {
        for (let j = 0; j < sorted.length - 1; j++) {
            if (sorted[j] > sorted[j + 1]) {
                [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
            }
        }
    }
    return sorted;
}

console.log("Отсортированный массив:", bubbleSort(numbers));`,

        animation: `// Анимация с использованием setInterval
console.log("Анимация запущена! Остановите её через 5 секунд.");

let counter = 0;
const intervalId = setInterval(() => {
    counter++;
    console.log(\`Прошло \${counter} секунд\`);
    
    if (counter >= 5) {
        clearInterval(intervalId);
        console.log("Анимация остановлена!");
    }
}, 1000);`,

        calculator: `// Простой калькулятор
function calculator(a, b, operation) {
    switch(operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 'Ошибка: деление на ноль';
        default: return 'Неизвестная операция';
    }
}

// Тестируем калькулятор
console.log("10 + 5 =", calculator(10, 5, '+'));
console.log("10 - 5 =", calculator(10, 5, '-'));
console.log("10 * 5 =", calculator(10, 5, '*'));
console.log("10 / 5 =", calculator(10, 5, '/'));
console.log("10 / 0 =", calculator(10, 0, '/'));`,

        game: `// Простая угадайка
function guessNumberGame() {
    const secret = Math.floor(Math.random() * 100) + 1;
    console.log("Я загадал число от 1 до 100. Попробуй угадать!");
    
    // Это упрощенная версия - в реальной игре нужно было бы
    // использовать prompt или другой способ ввода
    let attempts = 0;
    
    // Симуляция нескольких попыток
    const guesses = [50, 25, 75, 88, 92, 95, 97, 99, 100];
    
    for (let guess of guesses) {
        attempts++;
        if (guess === secret) {
            console.log(\`Поздравляю! Ты угадал число \${secret} за \${attempts} попыток!\`);
            return;
        } else if (guess < secret) {
            console.log(\`\${guess} - слишком мало!\`);
        } else {
            console.log(\`\${guess} - слишком много!\`);
        }
    }
    
    console.log(\`К сожалению, ты не угадал. Число было: \${secret}\`);
}

guessNumberGame();`
    };
    
    // Обработчики событий
    document.getElementById('run-code')?.addEventListener('click', executeCode);
    
    document.getElementById('reset-code')?.addEventListener('click', () => {
        editor.value = examples.fibonacci;
        updateLineNumbers();
        output.innerHTML = '<p>Нажмите "Выполнить код", чтобы увидеть результат</p>';
    });
    
    document.getElementById('clear-output')?.addEventListener('click', () => {
        output.innerHTML = '<p>Вывод очищен</p>';
    });
    
    document.getElementById('share-code')?.addEventListener('click', () => {
        const code = editor.value;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code).then(() => {
                alert('Код скопирован в буфер обмена!');
            });
        } else {
            // Fallback для старых браузеров
            editor.select();
            document.execCommand('copy');
            alert('Код скопирован в буфер обмена!');
        }
    });
    
    editor.addEventListener('input', updateLineNumbers);
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 4;
            updateLineNumbers();
        }
    });
    
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const example = examples[btn.dataset.example];
            if (example) {
                editor.value = example;
                updateLineNumbers();
                output.innerHTML = '<p>Пример загружен. Нажмите "Выполнить код", чтобы увидеть результат</p>';
            }
        });
    });
    
    // Инициализация
    updateLineNumbers();
}

// ==================== БИОЛОГИЯ ====================
function initBiologySimulator() {
    const dnaStrand = document.getElementById('dna-strand');
    const dnaCanvas = document.getElementById('dna-canvas');
    if (!dnaStrand || !dnaCanvas) return;
    
    let dnaSequence = [];
    const ctx = dnaCanvas.getContext('2d');
    
    // Добавление нуклеотида
    function addNucleotide(nucleotide) {
        dnaSequence.push(nucleotide);
        updateDNADisplay();
        drawDNA();
    }
    
    // Обновление отображения ДНК
    function updateDNADisplay() {
        dnaStrand.innerHTML = '';
        
        if (dnaSequence.length === 0) {
            dnaStrand.innerHTML = '<div class="empty-dna"><p>ДНК последовательность пуста. Добавьте нуклеотиды!</p></div>';
        } else {
            dnaSequence.forEach((nuc, index) => {
                const element = document.createElement('div');
                element.className = `nucleotide ${nuc}`;
                element.textContent = nuc;
                element.title = `Позиция ${index + 1}: ${nuc}`;
                dnaStrand.appendChild(element);
            });
        }
        
        // Обновляем статистику
        const counts = {
            A: dnaSequence.filter(n => n === 'A').length,
            T: dnaSequence.filter(n => n === 'T').length,
            C: dnaSequence.filter(n => n === 'C').length,
            G: dnaSequence.filter(n => n === 'G').length
        };
        
        document.getElementById('dna-length').textContent = dnaSequence.length;
        document.getElementById('count-A').textContent = counts.A;
        document.getElementById('count-T').textContent = counts.T;
        document.getElementById('count-C').textContent = counts.C;
        document.getElementById('count-G').textContent = counts.G;
    }
    
    // Отрисовка двойной спирали ДНК
    function drawDNA() {
        ctx.clearRect(0, 0, dnaCanvas.width, dnaCanvas.height);
        
        if (dnaSequence.length === 0) return;
        
        const centerY = dnaCanvas.height / 2;
        const segmentWidth = Math.min(30, dnaCanvas.width / dnaSequence.length);
        
        // Цвета для нуклеотидов
        const colors = {
            A: '#e91e63',
            T: '#2196f3',
            C: '#4caf50',
            G: '#ff9800'
        };
        
        // Рисуем две цепочки
        for (let i = 0; i < dnaSequence.length; i++) {
            const x = i * segmentWidth + 20;
            const nuc = dnaSequence[i];
            
            // Верхняя цепочка
            ctx.beginPath();
            ctx.arc(x, centerY - 30, 10, 0, Math.PI * 2);
            ctx.fillStyle = colors[nuc] + '80'; // Полупрозрачный
            ctx.fill();
            ctx.strokeStyle = colors[nuc];
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Нижняя цепочка (комплементарная)
            let complementary;
            switch(nuc) {
                case 'A': complementary = 'T'; break;
                case 'T': complementary = 'A'; break;
                case 'C': complementary = 'G'; break;
                case 'G': complementary = 'C'; break;
            }
            
            ctx.beginPath();
            ctx.arc(x, centerY + 30, 10, 0, Math.PI * 2);
            ctx.fillStyle = colors[complementary] + '80';
            ctx.fill();
            ctx.strokeStyle = colors[complementary];
            ctx.stroke();
            
            // Соединяющая линия (водородные связи)
            ctx.beginPath();
            ctx.moveTo(x, centerY - 20);
            ctx.lineTo(x, centerY + 20);
            ctx.strokeStyle = nuc === 'A' || nuc === 'T' ? '#ff9800' : '#2196f3';
            ctx.lineWidth = nuc === 'A' || nuc === 'T' ? 1 : 2; // Двойные и тройные связи
            ctx.stroke();
            
            // Подписи нуклеотидов
            ctx.fillStyle = colors[nuc];
            ctx.font = 'bold 14px Arial';
            ctx.fillText(nuc, x - 4, centerY - 33);
            
            ctx.fillStyle = colors[complementary];
            ctx.fillText(complementary, x - 4, centerY + 43);
        }
        
        // Спиральные линии
        ctx.beginPath();
        ctx.strokeStyle = '#9c27b0';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < dnaSequence.length; i++) {
            const x = i * segmentWidth + 20;
            const angle = i * 0.5;
            const y1 = centerY - 30 + Math.sin(angle) * 10;
            
            if (i === 0) {
                ctx.moveTo(x, y1);
            } else {
                ctx.lineTo(x, y1);
            }
        }
        ctx.stroke();
        
        ctx.beginPath();
        for (let i = 0; i < dnaSequence.length; i++) {
            const x = i * segmentWidth + 20;
            const angle = i * 0.5;
            const y2 = centerY + 30 + Math.sin(angle) * 10;
            
            if (i === 0) {
                ctx.moveTo(x, y2);
            } else {
                ctx.lineTo(x, y2);
            }
        }
        ctx.stroke();
    }
    
    // Симулятор эволюции
    function initEvolutionSimulator() {
        const canvas = document.getElementById('evolution-canvas');
        if (!canvas) return;
        
        const evolutionCtx = canvas.getContext('2d');
        let creatures = [];
        let generation = 0;
        let animationId = null;
        let isRunning = false;
        let mutationRate = 5;
        let selectionPressure = 2; // 1-слабое, 2-среднее, 3-сильное
        
        // Класс существа
        class Creature {
            constructor(x, y, size, speed, color) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.speed = speed;
                this.color = color;
                this.fitness = this.calculateFitness();
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.age = 0;
                this.maxAge = 100 + Math.random() * 100; // Случайная продолжительность жизни
            }
            
            calculateFitness() {
                // Приспособленность: большие и быстрые особи лучше выживают
                // Но есть компромисс: слишком большие медленные, слишком быстрые маленькие
                const sizeScore = this.size / 20; // Нормализуем к 1
                const speedScore = this.speed / 2; // Нормализуем к 1
                
                // Оптимальная приспособленность - баланс размера и скорости
                return (sizeScore * 0.6 + speedScore * 0.4) * 100;
            }
            
            draw() {
                evolutionCtx.beginPath();
                evolutionCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                evolutionCtx.fillStyle = this.color;
                evolutionCtx.fill();
                evolutionCtx.strokeStyle = '#333';
                evolutionCtx.lineWidth = 1;
                evolutionCtx.stroke();
                
                // Глаза (только у живых существ)
                evolutionCtx.beginPath();
                evolutionCtx.arc(this.x - this.size/3, this.y - this.size/3, this.size/4, 0, Math.PI * 2);
                evolutionCtx.arc(this.x + this.size/3, this.y - this.size/3, this.size/4, 0, Math.PI * 2);
                evolutionCtx.fillStyle = 'white';
                evolutionCtx.fill();
                
                // Зрачки
                evolutionCtx.beginPath();
                evolutionCtx.arc(this.x - this.size/3, this.y - this.size/3, this.size/8, 0, Math.PI * 2);
                evolutionCtx.arc(this.x + this.size/3, this.y - this.size/3, this.size/8, 0, Math.PI * 2);
                evolutionCtx.fillStyle = '#333';
                evolutionCtx.fill();
            }
            
            update() {
                if (!this.alive) return;
                
                this.age++;
                
                // Старение: после достижения maxAge шанс умереть увеличивается
                if (this.age > this.maxAge) {
                    const deathChance = (this.age - this.maxAge) / 50;
                    if (Math.random() < deathChance) {
                        this.alive = false;
                        return;
                    }
                }
                
                // Движение с небольшой случайностью
                this.vx += (Math.random() - 0.5) * 0.1;
                this.vy += (Math.random() - 0.5) * 0.1;
                
                // Ограничение скорости
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > this.speed * 2) {
                    this.vx = (this.vx / speed) * this.speed;
                    this.vy = (this.vy / speed) * this.speed;
                }
                
                this.x += this.vx;
                this.y += this.vy;
                
                // Отскок от границ
                if (this.x < this.size || this.x > canvas.width - this.size) {
                    this.vx *= -0.8;
                    this.x = this.x < this.size ? this.size : canvas.width - this.size;
                }
                
                if (this.y < this.size || this.y > canvas.height - this.size) {
                    this.vy *= -0.8;
                    this.y = this.y < this.size ? this.size : canvas.height - this.size;
                }
                
                // Случайная смерть (естественные причины)
                if (Math.random() < 0.001) {
                    this.alive = false;
                }
            }
            
            reproduce() {
                // Мутации
                let newSize = this.size + (Math.random() - 0.5) * (mutationRate / 20);
                let newSpeed = this.speed + (Math.random() - 0.5) * (mutationRate / 50);
                
                // Ограничения
                newSize = Math.max(5, Math.min(25, newSize));
                newSpeed = Math.max(0.3, Math.min(2.5, newSpeed));
                
                // Новый цвет с мутацией
                const colorMatch = this.color.match(/\d+/g);
                let r = parseInt(colorMatch[0]) + (Math.random() - 0.5) * 50;
                let g = parseInt(colorMatch[1]) + (Math.random() - 0.5) * 50;
                let b = parseInt(colorMatch[2]) + (Math.random() - 0.5) * 50;
                
                r = Math.max(0, Math.min(255, r));
                g = Math.max(0, Math.min(255, g));
                b = Math.max(0, Math.min(255, b));
                
                const newColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
                
                return new Creature(
                    this.x + (Math.random() - 0.5) * 50,
                    this.y + (Math.random() - 0.5) * 50,
                    newSize,
                    newSpeed,
                    newColor
                );
            }
        }
        
        // Создание начальной популяции
        function createInitialPopulation() {
            creatures = [];
            const populationSize = 30;
            
            for (let i = 0; i < populationSize; i++) {
                creatures.push(new Creature(
                    Math.random() * (canvas.width - 40) + 20,
                    Math.random() * (canvas.height - 40) + 20,
                    Math.random() * 10 + 8, // Размер 8-18
                    Math.random() * 1.2 + 0.8, // Скорость 0.8-2.0
                    `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
                ));
            }
            
            // Помечаем всех как живых
            creatures.forEach(c => c.alive = true);
            updateStats();
        }
        
        // Естественный отбор - теперь реально работает!
        function naturalSelection() {
            // Удаляем мертвых существ
            creatures = creatures.filter(c => c.alive);
            
            if (creatures.length === 0) {
                createInitialPopulation();
                return;
            }
            
            // Сортируем по приспособленности
            creatures.sort((a, b) => b.fitness - a.fitness);
            
            // Определяем, сколько выживет в зависимости от давления отбора
            let survivalRate;
            switch(selectionPressure) {
                case 1: survivalRate = 0.7; break; // Слабое давление - выживает 70%
                case 2: survivalRate = 0.5; break; // Среднее давление - выживает 50%
                case 3: survivalRate = 0.3; break; // Сильное давление - выживает 30%
                default: survivalRate = 0.5;
            }
            
            const survivorsCount = Math.max(3, Math.floor(creatures.length * survivalRate));
            
            // Оставляем наиболее приспособленных
            const survivors = creatures.slice(0, survivorsCount);
            
            // Конкуренция за ресурсы: самые приспособленные получают больше потомства
            const newCreatures = [];
            
            survivors.forEach((creature, index) => {
                // Количество потомства зависит от приспособленности и положения в иерархии
                const rankFactor = (survivorsCount - index) / survivorsCount; // 1 для лучшего, 0 для худшего
                const fitnessFactor = creature.fitness / 100;
                
                // Особи в середине иерархии получают больше потомства (стабильная популяция)
                const offspringCount = Math.floor(
                    (1 + rankFactor * fitnessFactor * 2) * (selectionPressure === 3 ? 3 : 2)
                );
                
                for (let i = 0; i < offspringCount; i++) {
                    const offspring = creature.reproduce();
                    offspring.alive = true;
                    newCreatures.push(offspring);
                }
            });
            
            // Ограничиваем популяцию
            const maxPopulation = 50;
            creatures = newCreatures.slice(0, maxPopulation);
            
            generation++;
            updateStats();
        }
        
        // Обновление статистики
        function updateStats() {
            const aliveCreatures = creatures.filter(c => c.alive);
            const totalCreatures = creatures.length;
            
            document.getElementById('generation').textContent = generation;
            document.getElementById('population').textContent = aliveCreatures.length;
            
            if (aliveCreatures.length > 0) {
                // Средняя приспособленность
                const avgFitness = aliveCreatures.reduce((sum, c) => sum + c.fitness, 0) / aliveCreatures.length;
                document.getElementById('fitness').textContent = avgFitness.toFixed(1) + '%';
                
                // Выживаемость
                const survivalRate = totalCreatures > 0 ? (aliveCreatures.length / totalCreatures * 100) : 0;
                document.getElementById('survival').textContent = survivalRate.toFixed(1) + '%';
                
                // Показываем лучшую приспособленность
                const bestFitness = Math.max(...aliveCreatures.map(c => c.fitness));
                document.getElementById('best-fitness').textContent = bestFitness.toFixed(1) + '%';
            } else {
                document.getElementById('fitness').textContent = '0%';
                document.getElementById('survival').textContent = '0%';
                document.getElementById('best-fitness').textContent = '0%';
            }
        }
        
        // Анимация
        function animate() {
            evolutionCtx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Рисуем фон
            evolutionCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--card-bg');
            evolutionCtx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Рисуем ресурсы (пищу) - зеленые кружки
            if (Math.random() < 0.05 && creatures.length < 40) {
                evolutionCtx.beginPath();
                evolutionCtx.arc(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    3,
                    0,
                    Math.PI * 2
                );
                evolutionCtx.fillStyle = '#4CAF50';
                evolutionCtx.fill();
            }
            
            // Обновляем и рисуем существ
            creatures.forEach(creature => {
                creature.update();
                if (creature.alive) {
                    creature.draw();
                }
            });
            
            // Каждые 150 кадров - естественный отбор
            if (frameCount % 150 === 0 && isRunning) {
                naturalSelection();
            }
            
            // Каждые 50 кадров обновляем статистику
            if (frameCount % 50 === 0) {
                updateStats();
            }
            
            frameCount++;
            if (isRunning) {
                animationId = requestAnimationFrame(animate);
            }
        }
        
        let frameCount = 0;
        
        // Обработчики событий
        document.getElementById('start-evolution')?.addEventListener('click', () => {
            if (!isRunning) {
                isRunning = true;
                frameCount = 0;
                animate();
                document.getElementById('start-evolution').innerHTML = '<i class="fas fa-play"></i> Продолжить';
            }
        });
        
        document.getElementById('pause-evolution')?.addEventListener('click', () => {
            isRunning = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
        
        document.getElementById('reset-evolution')?.addEventListener('click', () => {
            isRunning = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            generation = 0;
            frameCount = 0;
            createInitialPopulation();
            updateStats();
            
            // Перерисовываем статичную сцену
            evolutionCtx.clearRect(0, 0, canvas.width, canvas.height);
            evolutionCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--card-bg');
            evolutionCtx.fillRect(0, 0, canvas.width, canvas.height);
            creatures.forEach(creature => {
                creature.alive = true;
                creature.draw();
            });
        });
        
        document.getElementById('mutation-rate')?.addEventListener('input', (e) => {
            mutationRate = parseInt(e.target.value);
            document.getElementById('mutation-value').textContent = mutationRate + '%';
        });
        
        document.getElementById('selection-pressure')?.addEventListener('input', (e) => {
            selectionPressure = parseInt(e.target.value);
            const labels = ['Слабое', 'Среднее', 'Сильное'];
            document.getElementById('selection-value').textContent = labels[selectionPressure - 1];
        });
        
        // Инициализация
        createInitialPopulation();
        animate(); // Начальная отрисовка
    }
    
    // Обработчики событий для ДНК
    document.querySelectorAll('.nuc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            addNucleotide(btn.dataset.nucleotide);
        });
    });
    
    document.getElementById('clear-dna')?.addEventListener('click', () => {
        dnaSequence = [];
        updateDNADisplay();
        drawDNA();
    });
    
    document.getElementById('random-dna')?.addEventListener('click', () => {
        dnaSequence = [];
        const nucleotides = ['A', 'T', 'C', 'G'];
        for (let i = 0; i < 20; i++) {
            dnaSequence.push(nucleotides[Math.floor(Math.random() * 4)]);
        }
        updateDNADisplay();
        drawDNA();
    });
    
    // Инициализация
    updateDNADisplay();
    drawDNA();
    initEvolutionSimulator();
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', function() {
    // Определяем текущую страницу и инициализируем соответствующий модуль
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'physics.html':
            initPhysicsSimulator();
            break;
        case 'math.html':
            initMathCalculator();
            break;
        case 'it.html':
            initITCodeEditor();
            break;
        case 'biology.html':
            initBiologySimulator();
            break;
    }
});