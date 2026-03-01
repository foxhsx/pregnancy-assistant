/**
 * 孕期教育网站 - 主脚本
 * 包含导航、交互和无障碍功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化
    initMobileMenu();
    initSmoothScroll();
    initKeyboardNavigation();
});

/**
 * 移动端菜单
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
    });

    // 点击菜单项后关闭菜单
    menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active');
        });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active');
        }
    });
}

/**
 * 平滑滚动
 */
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
                // 设置焦点以支持键盘导航
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
}

/**
 * 键盘导航增强
 */
function initKeyboardNavigation() {
    // ESC 关闭移动端菜单
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

    // 面包屑导航键盘支持
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
    breadcrumbLinks.forEach(function(link, index, links) {
        // 最后一个链接（当前页面）不可点击
        if (index === links.length - 1) {
            link.setAttribute('aria-current', 'page');
            link.removeAttribute('href');
        }
    });
}

/**
 * 搜索功能（预留）
 */
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        // TODO: 实现搜索功能
        const query = this.value.toLowerCase();
        console.log('搜索:', query);
    });
}

/**
 * 主题切换（预留）
 */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // 加载保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

/**
 * 字体大小调整（无障碍）
 */
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

/**
 * 高对比度模式（无障碍）
 */
function initHighContrast() {
    const contrastBtn = document.querySelector('.contrast-toggle');
    if (!contrastBtn) return;

    contrastBtn.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('highContrast', isHighContrast);
    });

    // 加载保存的高对比度设置
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
}

/**
 * 页面分析（预留）
 */
function initAnalytics() {
    // TODO: 添加网站分析代码
    console.log('孕期教育网站 - 分析已初始化');
}
