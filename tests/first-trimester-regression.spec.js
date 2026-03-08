import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const evidenceDir = path.join(process.cwd(), '.sisyphus', 'evidence', 'task-7-final-regression');

fs.mkdirSync(evidenceDir, { recursive: true });

const detailPages = [
  {
    slug: 'safety',
    route: '/first-trimester-safety.html',
    title: /孕早期孕妈安全/,
    h1: '孕早期孕妈安全指南',
    requiredTexts: ['检查时间线与阶段安排', 'NT 时间窗与就诊准备', '建档常见时间与材料', '异常症状分级动作'],
    regionCue: /不同地区差异很大|不同城市、不同医院/,
    sourceCue: /国家卫生健康委员会|妇幼保健院/
  },
  {
    slug: 'family',
    route: '/first-trimester-family.html',
    title: /孕早期家庭支持/,
    h1: '孕早期家庭支持指南',
    requiredTexts: ['建档协助怎么帮最有效', '陪诊前准备与当天分工', '就医包整理与紧急联系人清单'],
    regionCue: /地区、医院和名额不同而变化/,
    sourceCue: /权威来源清单/
  },
  {
    slug: 'diet',
    route: '/first-trimester-diet.html',
    title: /孕早期饮食安全/,
    h1: '孕早期饮食安全指南',
    requiredTexts: ['一日饮食示例（可执行）', '孕吐高发时段应对策略'],
    regionCue: null,
    sourceCue: /权威来源清单/
  },
  {
    slug: 'mental',
    route: '/first-trimester-mental.html',
    title: /孕早期心理健康/,
    h1: '孕早期心理健康指南',
    requiredTexts: ['情绪管理与情绪监测', '专业求助时机'],
    regionCue: null,
    sourceCue: /权威来源清单/
  }
];

const entryPage = {
  slug: 'entry',
  route: '/first-trimester.html',
  title: /孕早期 - 孕期教育网站/,
  h1: '孕早期',
  safetySummary: '检查时间线梳理、建档准备提醒、异常情况应急判断与日常安全边界'
};

async function collectImageAltAudit(page) {
  return page.evaluate(() => {
    const images = [...document.querySelectorAll('img')];
    return {
      count: images.length,
      missingAlt: images
        .map((img, index) => ({
          index,
          src: img.getAttribute('src') || '',
          alt: img.getAttribute('alt')
        }))
        .filter((img) => !img.alt || !img.alt.trim())
    };
  });
}

async function collectDesktopStickyMetrics(page) {
  return page.evaluate(async () => {
    const sidebar = document.querySelector('.article-layout__sidebar');
    const navInner = document.querySelector('.article-nav__inner');

    if (!sidebar || !navInner) {
      return { present: false };
    }

    const read = () => ({
      navTop: navInner.getBoundingClientRect().top,
      sidebarPosition: window.getComputedStyle(sidebar).position,
      sidebarTop: window.getComputedStyle(sidebar).top,
      navHeight: navInner.getBoundingClientRect().height,
      pageHeight: document.documentElement.scrollHeight
    });

    window.scrollTo(0, 420);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const first = read();

    window.scrollTo(0, 980);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const second = read();

    return {
      present: true,
      ...first,
      secondNavTop: second.navTop,
      delta: Math.abs(second.navTop - first.navTop)
    };
  });
}

async function collectMobileLayoutMetrics(page) {
  return page.evaluate(() => {
    const layout = document.querySelector('.article-layout');
    const sidebar = document.querySelector('.article-layout__sidebar');
    const content = document.querySelector('.article-layout__content');

    const layoutStyle = layout ? window.getComputedStyle(layout) : null;
    const sidebarRect = sidebar?.getBoundingClientRect();
    const contentRect = content?.getBoundingClientRect();

    return {
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      layoutDisplay: layoutStyle?.display || null,
      layoutFlexDirection: layoutStyle?.flexDirection || null,
      layoutColumns: layoutStyle?.gridTemplateColumns || null,
      sidebarTop: sidebarRect?.top ?? null,
      contentTop: contentRect?.top ?? null,
      sidebarLeft: sidebarRect?.left ?? null,
      contentLeft: contentRect?.left ?? null,
      contentWidth: contentRect?.width ?? null,
      viewportWidth: window.innerWidth
    };
  });
}

test.describe.configure({ mode: 'serial' });

test('desktop regression covers content, sources, image accessibility, and sticky baseline', async ({ page }) => {
  const results = [];

  for (const item of detailPages) {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto(item.route, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(item.title);
    await expect(page.getByRole('heading', { level: 1, name: item.h1 })).toBeVisible();

    for (const text of item.requiredTexts) {
      await expect(page.getByText(text, { exact: false })).toBeVisible();
    }

    await expect(page.getByRole('heading', { level: 3, name: '免责声明' })).toBeVisible();

    if (item.regionCue) {
      await expect(page.locator('body')).toContainText(item.regionCue);
    }

    await expect(page.locator('body')).toContainText(item.sourceCue);

    const imageAudit = await collectImageAltAudit(page);
    expect(imageAudit.missingAlt, `${item.slug} images should all have non-empty alt text`).toEqual([]);

    let sticky = null;
    if (item.slug === 'diet' || item.slug === 'mental') {
      sticky = await collectDesktopStickyMetrics(page);
      expect(sticky.present).toBeTruthy();
      expect(sticky.sidebarPosition).toBe('sticky');
      expect(Number.parseFloat(sticky.sidebarTop)).toBeGreaterThan(0);
      expect(sticky.delta).toBeLessThanOrEqual(6);
    }

    await page.screenshot({
      path: path.join(evidenceDir, `${item.slug}-desktop.png`),
      fullPage: true
    });

    results.push({
      page: item.route,
      imageAudit,
      sticky
    });
  }

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(entryPage.route, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(entryPage.title);
  await expect(page.getByRole('heading', { level: 1, name: entryPage.h1 })).toBeVisible();
  await expect(page.getByText(entryPage.safetySummary, { exact: false })).toBeVisible();
  await page.screenshot({
    path: path.join(evidenceDir, `${entryPage.slug}-desktop.png`),
    fullPage: true
  });

  fs.writeFileSync(
    path.join(evidenceDir, 'desktop-regression.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        viewport: { width: 1440, height: 1200 },
        detailPages: results,
        entryPage: {
          route: entryPage.route,
          safetySummary: entryPage.safetySummary
        }
      },
      null,
      2
    )
  );
});

test.describe('mobile regression', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile layout holds for five target pages', async ({ page }) => {
    const results = [];

    for (const item of detailPages) {
      await page.goto(item.route, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1, name: item.h1 })).toBeVisible();

      const metrics = await collectMobileLayoutMetrics(page);
      expect(metrics.hasHorizontalOverflow, `${item.slug} should not overflow horizontally on mobile`).toBeFalsy();
      expect(metrics.sidebarTop).not.toBeNull();
      expect(metrics.contentTop).not.toBeNull();
      expect(metrics.sidebarTop).toBeLessThan(metrics.contentTop);
      expect(Math.abs((metrics.sidebarLeft ?? 0) - (metrics.contentLeft ?? 0))).toBeLessThanOrEqual(16);

      await page.screenshot({
        path: path.join(evidenceDir, `${item.slug}-mobile.png`),
        fullPage: true
      });

      results.push({ page: item.route, metrics });
    }

    await page.goto(entryPage.route, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: entryPage.h1 })).toBeVisible();
    await expect(page.getByText(entryPage.safetySummary, { exact: false })).toBeVisible();

    const entryMetrics = await page.evaluate(() => ({
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      cardCount: document.querySelectorAll('.article-list li').length,
      viewportWidth: window.innerWidth
    }));

    expect(entryMetrics.hasHorizontalOverflow).toBeFalsy();
    expect(entryMetrics.cardCount).toBeGreaterThanOrEqual(5);

    await page.screenshot({
      path: path.join(evidenceDir, `${entryPage.slug}-mobile.png`),
      fullPage: true
    });

    fs.writeFileSync(
      path.join(evidenceDir, 'mobile-regression.json'),
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          viewport: { width: 390, height: 844 },
          detailPages: results,
          entryPage: entryMetrics
        },
        null,
        2
      )
    );
  });
});
