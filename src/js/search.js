/**
 * 孕期教育网站 - 搜索功能
 * 基于静态内容的客户端搜索
 */

(function() {
    'use strict';

    // 搜索索引数据
    const searchIndex = [
        {
            title: '孕早期饮食安全指南',
            url: 'first-trimester-diet.html',
            excerpt: '叶酸补充、营养均衡、忌口食物、早孕反应饮食建议',
            category: '孕早期',
            tags: ['饮食安全', '叶酸', '营养']
        },
        {
            title: '孕早期孕妈安全指南',
            url: 'first-trimester.html',
            excerpt: '早孕反应应对、产检安排、风险识别、日常生活安全',
            category: '孕早期',
            tags: ['孕妈安全', '产检', '早孕反应']
        },
        {
            title: '孕早期心理健康指南',
            url: 'first-trimester.html',
            excerpt: '情绪管理、焦虑缓解、角色适应、放松技巧',
            category: '孕早期',
            tags: ['心理健康', '情绪', '焦虑']
        },
        {
            title: '孕早期家庭支持指南',
            url: 'first-trimester.html',
            excerpt: '准爸爸角色、沟通技巧、家庭准备、陪伴产检',
            category: '孕早期',
            tags: ['家庭支持', '准爸爸', '沟通']
        },
        {
            title: '孕中期饮食安全指南',
            url: 'second-trimester.html',
            excerpt: '钙铁补充，体重管理、DHA摄入、营养均衡',
            category: '孕中期',
            tags: ['饮食安全', '钙', '铁', 'DHA']
        },
        {
            title: '孕中期孕妈安全指南',
            url: 'second-trimester.html',
            excerpt: '产检安排、胎动监测、运动建议、妊娠纹防护',
            category: '孕中期',
            tags: ['孕妈安全', '产检', '胎动']
        },
        {
            title: '孕中期心理健康指南',
            url: 'second-trimester.html',
            excerpt: '情绪管理、自我关爱、胎教、产前课程',
            category: '孕中期',
            tags: ['心理健康', '胎教']
        },
        {
            title: '孕中期家庭支持指南',
            url: 'second-trimester.html',
            excerpt: '陪同产检、感受胎动、宝宝用品准备、产前课程',
            category: '孕中期',
            tags: ['家庭支持', '产检', '宝宝用品']
        },
        {
            title: '孕晚期饮食安全指南',
            url: 'third-trimester.html',
            excerpt: '分娩能量准备、临产饮食、产后饮食安排',
            category: '孕晚期',
            tags: ['饮食安全', '分娩', '产后']
        },
        {
            title: '孕晚期孕妈安全指南',
            url: 'third-trimester.html',
            excerpt: '临产征兆、分娩方式选择、产后护理、待产包准备',
            category: '孕晚期',
            tags: ['孕妈安全', '分娩', '临产', '待产包']
        },
        {
            title: '孕晚期心理健康指南',
            url: 'third-trimester.html',
            excerpt: '产前焦虑、放松技巧、分娩心理准备',
            category: '孕晚期',
            tags: ['心理健康', '产前焦虑', '分娩']
        },
        {
            title: '孕晚期家庭支持指南',
            url: 'third-trimester.html',
            excerpt: '陪产准备、待产包、紧急情况应对、产后照顾',
            category: '孕晚期',
            tags: ['家庭支持', '陪产', '待产包']
        }
    ];

    // DOM 元素
    let searchInput = null;
    let searchResults = null;
    let searchContainer = null;

    /**
     * 初始化搜索功能
     */
    function init() {
        // 检查是否已存在搜索框，避免重复创建
        if (document.querySelector('.search-container')) {
            bindEvents();
            return;
        }
        createSearchUI();
        bindEvents();
    }

    /**
     * 创建搜索UI
     */
    function createSearchUI() {
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;

        // 创建搜索容器
        searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <form class="search-form" role="search">
                <input 
                    type="search" 
                    class="search-input" 
                    placeholder="搜索文章..." 
                    aria-label="搜索文章"
                    autocomplete="off"
                >
                <button type="submit" class="search-btn" aria-label="搜索">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                </button>
            </form>
            <div class="search-results" role="listbox"></div>
        `;

        const navRight = navContainer.querySelector('.nav-right');
        if (navRight) {
            navRight.appendChild(searchContainer);
        }
        if (navMenu) {
            navContainer.insertBefore(searchContainer, navMenu.nextSibling);
        }

        searchInput = searchContainer.querySelector('.search-input');
        searchResults = searchContainer.querySelector('.search-results');
    }

    /**
     * 绑定事件
     */
    function bindEvents() {
        // 获取已有的搜索框元素
        searchContainer = document.querySelector('.search-container');
        searchInput = document.querySelector('.search-input');
        searchResults = document.querySelector('.search-results');

        if (!searchInput || !searchResults) return;

        // 输入事件
        searchInput.addEventListener('input', debounce(handleSearch, 300));

        // 表单提交
        const searchForm = searchContainer.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', handleFormSubmit);
        }

        // 点击外部关闭
        document.addEventListener('click', handleClickOutside);

        // ESC 关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSearchResults();
            }
        });
    }

    /**
     * 处理搜索
     */
    function handleSearch(e) {
        const query = e.target.value.trim().toLowerCase();

        if (query.length < 2) {
            closeSearchResults();
            return;
        }

        showLoading();

        const results = performSearch(query);

        displayResults(results, query);
    }

    /**
     * 执行搜索
     */
    function performSearch(query) {
        return searchIndex.filter(function(item) {
            const searchableText = [
                item.title,
                item.excerpt,
                item.category,
                item.tags.join(' ')
            ].join(' ').toLowerCase();

            return searchableText.includes(query);
        });
    }

    /**
     * 显示搜索结果
     */
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results"><p>未找到相关结果</p></div>';
            searchResults.classList.add('active');
            return;
        }

        const displayResults = results.slice(0, 10);

        let html = '<div class="search-results-header">找到 ' + results.length + ' 个结果</div>';

        displayResults.forEach(function(item) {
            const highlightedTitle = highlightText(item.title, query);
            const highlightedExcerpt = highlightText(item.excerpt, query);

            html += '<div class="search-result-item" role="option">';
            html += '<div class="search-result-title"><a href="' + item.url + '">' + highlightedTitle + '</a></div>';
            html += '<div class="search-result-excerpt">' + highlightedExcerpt + '</div>';
            html += '<div class="search-result-meta"><span class="tag">' + item.category + '</span></div>';
            html += '</div>';
        });

        if (results.length > 10) {
            html += '<div class="search-no-results"><p>更多结果请使用站内搜索...</p></div>';
        }

        searchResults.innerHTML = html;
        searchResults.classList.add('active');
    }

    /**
     * 高亮文本
     */
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp('(' + query + ')', 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * 显示加载状态
     */
    function showLoading() {
        searchResults.innerHTML = '<div class="search-loading">搜索中...</div>';
        searchResults.classList.add('active');
    }

    /**
     * 关闭搜索结果
     */
    function closeSearchResults() {
        if (searchResults) {
            searchResults.classList.remove('active');
        }
    }

    /**
     * 处理表单提交
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query.length >= 2) {
            console.log('搜索:', query);
        }
    }

    /**
     * 处理点击外部
     */
    function handleClickOutside(e) {
        if (searchContainer && !searchContainer.contains(e.target)) {
            closeSearchResults();
        }
    }

    /**
     * 防抖函数
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const later = function() {
                clearTimeout(timeout);
                func();
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
