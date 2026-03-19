// Основной JavaScript файл


document.addEventListener('DOMContentLoaded', function() {
    // Анимация карточек при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Применяем анимацию к карточкам
    const cards = document.querySelectorAll('.discipline-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Добавляем класс для анимации
    const style = document.createElement('style');
    style.textContent = `
        .discipline-card.animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Обработка навигации
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Функция для показа случайной цитаты на главной странице
    const quotes = [
        {
            text: "Наука — это организованное знание. Мудрость — это организованная жизнь.",
            author: "Иммануил Кант"
        },
        {
            text: "В науке слава достается тому, кто убедил мир, а не тому, кто первым натолкнулся на идею.",
            author: "Фрэнсис Дарвин"
        },
        {
            text: "Самое прекрасное, что мы можем испытать – это ощущение тайны. Она источник всякого подлинного искусства и науки.",
            author: "Альберт Эйнштейн"
        },
        {
            text: "Наука не является и никогда не будет являться законченной книгой.",
            author: "Альберт Эйнштейн"
        },
        {
            text: "Наука не знает границ, потому что знание принадлежит человечеству и является факелом, освещающим мир.",
            author: "Луи Пастер"
        },
        {
            text: "Я принадлежу к тем, кто считает, что наука обладает великой красотой.",
            author: "Мария Кюри"
        },
        {
            text: "Наука — это организованное знание; мудрость — это организованная жизнь.",
            author: "Иммануил Кант"
        },
        {
            text: "Наука является основой всякого прогресса, облегчающего жизнь человечества и уменьшающего его страдания.",
            author: "Мария Кюри"
        },
        {
            text: "Более мудр во всякой науке тот, кто более точен и более способен научить выявлению причин.",
            author: "Аристотель"
        },
        {
            text: "Вооружённый пятью чувствами, человек исследует окружающую его вселенную и называет это приключение наукой.",
            author: "Эдвин Пауэлл Хаббл"
        }
    ];

    const quoteElement = document.querySelector('.quote p');
    const quoteAuthorElement = document.querySelector('.quote-author');
    
    if (quoteElement && quoteAuthorElement) {
        // Меняем цитату каждые 10 секунд
        let quoteIndex = 0;
        
        function changeQuote() {
            quoteIndex = (quoteIndex + 1) % quotes.length;
            quoteElement.style.opacity = 0;
            quoteAuthorElement.style.opacity = 0;
            
            setTimeout(() => {
                quoteElement.textContent = quotes[quoteIndex].text;
                quoteAuthorElement.textContent = `— ${quotes[quoteIndex].author}`;
                
                quoteElement.style.opacity = 1;
                quoteAuthorElement.style.opacity = 1;
            }, 500);
        }
        
        // Анимация появления цитаты
        quoteElement.style.transition = 'opacity 0.5s ease';
        quoteAuthorElement.style.transition = 'opacity 0.5s ease';
        
        setInterval(changeQuote, 10000);
    }

    // Добавляем интерактивность к карточкам
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.card-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Выделение активной страницы в навигации
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

// Определение текущей темы на основе активной страницы
function setThemeBasedOnPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Удаляем все классы тем
    document.body.classList.remove('physics-theme', 'it-theme', 'biology-theme', 'home-theme');
    
    // Добавляем соответствующий класс
    if (currentPage === 'physics.html') {
        document.body.classList.add('physics-theme');
        updateMetaThemeColor('#4a148c'); // Фиолетовый для физики
    } else if (currentPage === 'it.html') {
        document.body.classList.add('it-theme');
        updateMetaThemeColor('#004d40'); // Бирюзовый для IT
    } else if (currentPage === 'biology.html') {
        document.body.classList.add('biology-theme');
        updateMetaThemeColor('#1b5e20'); // Зеленый для биологии
    } else if (currentPage === 'math.html') {
        document.body.classList.add('math-theme'); // Добавляем класс для математики
        updateMetaThemeColor('#0d47a1'); // Синий для математики
    } else {
        document.body.classList.add('home-theme');
        updateMetaThemeColor('#1a237e'); // Синий для главной
    }
}

// Обновление мета-тега theme-color для мобильных браузеров
function updateMetaThemeColor(color) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = color;
}

// Вызываем функцию при загрузке страницы
setThemeBasedOnPage();

// Также вызываем при клике по навигационным ссылкам
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Небольшая задержка для применения темы после перехода
        setTimeout(setThemeBasedOnPage, 100);
    });
});

// Анимация для футера при скролле
const footer = document.querySelector('footer');
if (footer) {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(footer);
}

// ============================================
// ПРЕДПРОСМОТР ТЕМ ПРИ НАВЕДЕНИИ НА ГЛАВНОЙ СТРАНИЦЕ
// ============================================
const mainPageCards = document.querySelectorAll('.home-theme .discipline-card');
const originalBodyClass = document.body.className;

// Сохраняем исходную тему при загрузке
let savedTheme = originalBodyClass;

// Функция для применения темы при наведении
function applyHoverTheme(themeClass) {
    // Удаляем все классы тем
    document.body.classList.remove('physics-theme', 'it-theme', 'biology-theme', 'math-theme', 'home-theme');
    // Добавляем новую тему
    document.body.classList.add(themeClass);
}

// Функция для восстановления исходной темы
function restoreOriginalTheme() {
    document.body.className = savedTheme;
}

// Добавляем обработчики для карточек на главной странице
if (mainPageCards.length > 0) {
    mainPageCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            // Определяем тему в зависимости от карточки
            let themeClass = '';
            
            // По тексту или другим признакам определяем, какая это карточка
            const cardTitle = this.querySelector('h3')?.textContent || '';
            
            if (cardTitle.includes('Математика')) {
                themeClass = 'math-theme';
            } else if (cardTitle.includes('Физика')) {
                themeClass = 'physics-theme';
            } else if (cardTitle.includes('Информационные технологии')) {
                themeClass = 'it-theme';
            } else if (cardTitle.includes('Биология')) {
                themeClass = 'biology-theme';
            }
            
            if (themeClass) {
                applyHoverTheme(themeClass);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            restoreOriginalTheme();
        });
    });
}

});