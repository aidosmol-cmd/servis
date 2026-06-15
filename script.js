/* ==========================================
   HUNTER GARAGE — Script
   ========================================== */

(function () {
    let lang = 'ru';

    // --- Language toggle ---
    const toggleBtn = document.getElementById('langToggle');

    function switchLang(newLang) {
        lang = newLang;
        toggleBtn.textContent = lang === 'ru' ? 'KZ' : 'RU';
        document.documentElement.lang = lang === 'ru' ? 'ru' : 'kk';

        document.querySelectorAll('[data-ru]').forEach(el => {
            el.textContent = el.getAttribute('data-' + lang);
        });

        document.querySelectorAll('[data-ru-placeholder]').forEach(el => {
            el.placeholder = el.getAttribute('data-' + lang + '-placeholder');
        });

        document.querySelectorAll('select option[data-ru]').forEach(el => {
            el.textContent = el.getAttribute('data-' + lang);
        });
    }

    toggleBtn.addEventListener('click', () => {
        switchLang(lang === 'ru' ? 'kz' : 'ru');
    });

    // --- Burger menu ---
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(
        '.service-card, .stat, .price-card, .location-card, .about__text, .cta__inner, .contact__form'
    ).forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // --- Counter animation ---
    function animateCounters() {
        document.querySelectorAll('.stat__number[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count);
            const duration = 1500;
            const start = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.about__stats');
    if (statsSection) statsObserver.observe(statsSection);

    // --- Header shadow on scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 50
            ? '0 2px 20px rgba(0,0,0,0.5)'
            : 'none';
    }, { passive: true });

    // --- Contact form ---
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const data = new FormData(this);
        const name = data.get('name');
        const phone = data.get('phone');
        const service = data.get('service');
        const city = data.get('city');

        const text = encodeURIComponent(
            `Заявка с сайта Hunter Garage\n\nИмя: ${name}\nТелефон: ${phone}\nУслуга: ${service}\nГород: ${city}`
        );
        window.open(`https://wa.me/77001234567?text=${text}`, '_blank');

        const btn = this.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = lang === 'ru' ? 'Отправлено ✓' : 'Жіберілді ✓';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
            this.reset();
        }, 3000);
    });
})();
