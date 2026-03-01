/**
 * 孕期教育网站 - 主脚本
 * 包含导航、交互和无障碍功能
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initKeyboardNavigation();
    initCurrentPageHighlight();
});

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active');
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
}

function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const menu = document.querySelector('.nav-menu');
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
            }
        }
    });

    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
    breadcrumbLinks.forEach(function(link, index, links) {
        if (index === links.length - 1) {
            link.setAttribute('aria-current', 'page');
            link.removeAttribute('href');
        }
    });
}

function initCurrentPageHighlight() {
    let currentPage = window.location.pathname.split('/').pop();
    
    if (!currentPage || currentPage === '' || currentPage.includes('file://')) {
        currentPage = 'index.html';
    }
    
    const navLinks = document.querySelectorAll('.nav-menu a');
    if (navLinks.length === 0) return;
    
    const pageToNavMap = {
        'first-trimester': 'first-trimester.html',
        'second-trimester': 'second-trimester.html', 
        'third-trimester': 'third-trimester.html',
        'family-support': 'family-support.html',
        'cases': 'cases.html',
        'about': 'about.html'
    };
    
    let targetNavHref = currentPage;
    
    for (const [key, href] of Object.entries(pageToNavMap)) {
        if (currentPage.startsWith(key) && currentPage !== href) {
            targetNavHref = href;
            break;
        }
    }
    
    navLinks.forEach(function(link) {
        link.removeAttribute('aria-current');
        
        if (link.getAttribute('href') === targetNavHref) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        console.log('搜索:', query);
    });
}

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function initFontSize() {
    const decreaseBtn = document.querySelector('.font-decrease');
    const increaseBtn = document.querySelector('.font-increase');
    
    let fontSize = 16;

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            if (fontSize > 12) {
                fontSize -= 2;
                document.documentElement.style.fontSize = fontSize + 'px';
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            if (fontSize < 24) {
                fontSize += 2;
                document.documentElement.style.fontSize = fontSize + 'px';
            }
        });
    }
}

function initHighContrast() {
    const contrastBtn = document.querySelector('.contrast-toggle');
    if (!contrastBtn) return;

    contrastBtn.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('highContrast', isHighContrast);
    });

    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
}

function initAnalytics() {
    console.log('孕期教育网站 - 分析已初始化');
}
