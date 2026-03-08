import path from 'node:path';
import { test, expect } from '@playwright/test';

test('first trimester safety page renders core content and captures evidence', async ({ page }) => {
  await page.goto('/first-trimester-safety.html', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/孕早期孕妈安全/);
  await expect(page.getByRole('heading', { level: 1, name: '孕早期孕妈安全指南' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: '核心要点' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: '1. 检查时间线与阶段安排' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: '4. 异常症状分级动作' })).toBeVisible();
  await expect(page.getByText('进入 NT 检查时间窗。', { exact: false })).toBeVisible();
  await expect(page.getByText('建档没有全国统一死规定。', { exact: false })).toBeVisible();
  await expect(page.getByText('国家卫生健康委员会', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: '孕妈安全' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { level: 3, name: '免责声明' })).toBeVisible();

  const evidencePath = path.join(process.cwd(), '.sisyphus', 'evidence', 'task-2-first-trimester-safety.png');
  await page.screenshot({ path: evidencePath, fullPage: true });
});
