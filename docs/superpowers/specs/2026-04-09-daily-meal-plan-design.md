# 饮食页面 - 每日三餐推荐功能设计

## 1. 目标

在现有饮食页面顶部新增「今日三餐推荐」模块，根据当前孕周从菜谱池中随机抽取早/中/晚三道菜，提供一键刷新。

## 2. 数据设计

每道菜谱新增 `meal` 字段标注适合餐次：

```js
{ name: '菠菜鸡蛋汤', meal: ['breakfast', 'lunch'], ingredients: '...', steps: '...' }
```

`meal` 取值：`breakfast`（早餐）、`lunch`（午餐）、`dinner`（晚餐）、`snack`（加餐），一道菜可属于多个餐次。

每个孕周段扩充至 8-12 道菜。

## 3. 随机算法

- 用当天日期字符串 `"2026-04-09"` 做 seed 生成初始推荐
- 刷新时用递增 counter 打破 seed，产生新组合
- 同一餐次内不重复（早餐池抽1道、午餐池抽1道、晚餐池抽1道）

```js
function pickMealPlan(recipes, seed) {
  const breakfast = shuffle(recipes.filter(r => r.meal.includes('breakfast')), seed);
  const lunch = shuffle(recipes.filter(r => r.meal.includes('lunch')), seed + 1);
  const dinner = shuffle(recipes.filter(r => r.meal.includes('dinner')), seed + 2);
  return {
    breakfast: breakfast[0],
    lunch: lunch[0],
    dinner: dinner[0],
  };
}
```

seed 由 `today日期字符串.hashCode() + refreshCount` 计算。

## 4. UI 设计

在现有「本周饮食重点」上方插入新模块：

```
┌─────────────────────────────────┐
│ 🍽 今日三餐推荐        [🔄 换一批] │
├─────────────────────────────────┤
│ 🌅 早餐                        │
│ 菠菜鸡蛋汤                      │
│ 食材：菠菜200g、鸡蛋2个          │
│ 做法：...                       │
├─────────────────────────────────┤
│ ☀️ 午餐                        │
│ 番茄炖牛腩                      │
│ 食材：...                       │
├─────────────────────────────────┤
│ 🌙 晚餐                        │
│ 豆腐鲫鱼汤                      │
│ 食材：...                       │
└─────────────────────────────────┘
```

- 卡片样式复用现有 `.recipe-detail-card`
- 三个餐次竖排，每个显示菜名 + 食材 + 简要做法
- 「换一批」按钮：圆角 pill 样式，点击后 `refreshCount++` 触发重算

## 5. 修改文件

1. **`diet-data.js`**：扩充菜谱数据，每道菜加 `meal` 字段，增加 `pickMealPlan()` 函数和简易 seed 随机
2. **`DietPage.jsx`**：新增三餐推荐模块，加 `refreshCount` state
3. **`app.css`**：新增 `.daily-meal-card` 等样式

## 6. 不改动的部分

- 现有「本周饮食重点」「重点补充营养素」「需要避免」模块不变
- 「全孕期菜谱参考」不变
- `getDietGuide()` 函数签名不变
