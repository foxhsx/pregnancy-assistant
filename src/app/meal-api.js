/**
 * TheMealDB API 封装
 *
 * - 从 TheMealDB 获取中国菜谱（图片 + 基本信息）
 * - 用中文映射表覆盖英文内容
 * - 结果缓存到 localStorage（24小时有效）
 * - API 失败时返回 null，调用方使用静态兜底数据
 */

const CACHE_KEY = 'yunqi_mealdb_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 小时

/**
 * TheMealDB 中国菜 ID → 中文名文映射
 * 包含菜名、适合餐次、中文食材描述、简要做法
 */
const CHINESE_MAP = {
  52947: { name: '麻婆豆腐', meal: ['lunch', 'dinner'], desc: '嫩豆腐配肉末，麻辣鲜香', ingredients: '豆腐450g、肉末100g、豆瓣酱、花椒粉、葱花' },
  52945: { name: '宫保鸡丁', meal: ['lunch', 'dinner'], desc: '鸡肉丁配花生米，甜辣口味', ingredients: '鸡胸肉300g、花生米50g、干辣椒、花椒、葱姜蒜' },
  52946: { name: '宫保虾仁', meal: ['lunch', 'dinner'], desc: '鲜虾仁配花生米，微辣鲜香', ingredients: '鲜虾200g、花生米40g、干辣椒、葱姜蒜' },
  52948: { name: '馄饨', meal: ['breakfast', 'lunch'], desc: '薄皮鲜肉馄饨，鲜美汤底', ingredients: '馄饨皮、猪肉馅200g、虾皮、紫菜、葱花' },
  52949: { name: '糖醋里脊', meal: ['lunch', 'dinner'], desc: '外酥里嫩，酸甜可口', ingredients: '猪里脊300g、番茄酱、白糖、醋、淀粉' },
  52950: { name: '水煮牛肉', meal: ['lunch', 'dinner'], desc: '麻辣鲜香，牛肉嫩滑', ingredients: '牛肉300g、豆芽、莴笋、干辣椒、花椒' },
  52951: { name: '左宗棠鸡', meal: ['lunch', 'dinner'], desc: '炸鸡配甜辣酱，外脆里嫩', ingredients: '鸡腿肉400g、干辣椒、淀粉、酱油、糖醋' },
  52952: { name: '牛肉捞面', meal: ['lunch', 'dinner'], desc: '鲜牛肉配宽面条，酱香浓郁', ingredients: '宽面条200g、牛肉150g、豆芽、青菜、酱油' },
  52953: { name: '干炒河粉', meal: ['lunch', 'dinner'], desc: '河粉配虾仁，广式经典', ingredients: '河粉200g、虾仁100g、豆芽、韭菜、酱油' },
  52954: { name: '酸辣汤', meal: ['lunch', 'dinner'], desc: '酸辣开胃，暖身暖胃', ingredients: '豆腐、木耳、鸡蛋、笋丝、醋、胡椒粉' },
  52955: { name: '蛋花汤', meal: ['lunch', 'dinner'], desc: '清淡鲜美，百搭汤品', ingredients: '鸡蛋2个、番茄1个、紫菜、虾皮、香油' },
  52956: { name: '鸡肉粥', meal: ['breakfast'], desc: '鸡肉软烂，粥底绵密', ingredients: '大米100g、鸡胸肉150g、姜丝、葱花、盐' },
  53365: { name: '陈皮鸡', meal: ['lunch', 'dinner'], desc: '橙香鸡块，酸甜诱人', ingredients: '鸡腿肉400g、橙汁、陈皮、淀粉、酱油' },
  53366: { name: '西兰花牛肉', meal: ['lunch', 'dinner'], desc: '牛肉配西兰花，营养均衡', ingredients: '牛肉200g、西兰花200g、蚝油、蒜末' },
  53367: { name: '蛋炒饭', meal: ['lunch', 'dinner'], desc: '粒粒分明，简单经典', ingredients: '米饭1碗、鸡蛋2个、青豆、胡萝卜丁、葱花' },
  53368: { name: '星洲炒米粉', meal: ['lunch', 'dinner'], desc: '米粉配虾仁咖喱，南洋风味', ingredients: '米粉200g、虾仁100g、咖喱粉、豆芽、鸡蛋' },
  53369: { name: '凉拌豆腐', meal: ['lunch', 'dinner'], desc: '嫩豆腐配芝麻酱油，清爽可口', ingredients: '嫩豆腐1块、芝麻油、酱油、葱花' },
  53370: { name: '芙蓉蛋', meal: ['breakfast', 'lunch'], desc: '鸡蛋配豆芽蔬菜，松软鲜香', ingredients: '鸡蛋3个、豆芽、蘑菇、葱、酱油' },
  53371: { name: '干煸四季豆', meal: ['lunch', 'dinner'], desc: '四季豆煸至微焦，香辣入味', ingredients: '四季豆300g、肉末50g、干辣椒、蒜末' },
  53372: { name: '番茄炒蛋', meal: ['lunch', 'dinner'], desc: '国民家常菜，酸甜下饭', ingredients: '番茄2个、鸡蛋3个、白糖少许、葱花' },
  53373: { name: '炸蛋卷', meal: ['breakfast', 'snack'], desc: '酥脆外皮，蔬菜肉馅', ingredients: '春卷皮、猪肉馅、白菜、胡萝卜' },
  53374: { name: '鱼香茄子', meal: ['lunch', 'dinner'], desc: '茄子软糯，鱼香味浓', ingredients: '茄子2根、肉末50g、豆瓣酱、葱姜蒜' },
  53375: { name: '虾仁荷兰豆', meal: ['lunch', 'dinner'], desc: '鲜虾配脆嫩荷兰豆，清淡爽口', ingredients: '虾仁150g、荷兰豆200g、蒜片、盐' },
  53376: { name: '糖醋鸡', meal: ['lunch', 'dinner'], desc: '鸡块裹酸甜酱，色泽红亮', ingredients: '鸡腿肉400g、青椒、菠萝、番茄酱、糖醋' },
  53377: { name: '虾米白菜', meal: ['lunch', 'dinner'], desc: '白菜配虾干，鲜甜清淡', ingredients: '大白菜300g、虾干20g、蒜末、盐' },
  53378: { name: '芝麻黄瓜', meal: ['lunch', 'dinner'], desc: '黄瓜拍碎拌芝麻，清脆爽口', ingredients: '黄瓜2根、芝麻、香油、醋' },
  53383: { name: '拉面配溏心蛋', meal: ['lunch', 'dinner'], desc: '浓郁汤底配溏心蛋，日式风味', ingredients: '拉面1份、鸡蛋1个、叉烧、海苔、葱花' },
};

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

/**
 * 从缓存读取或从 API 获取中国菜列表
 * @returns {Promise<Array|null>} 菜谱数组或 null（失败时）
 */
export async function fetchChineseMeals() {
  // 先检查缓存
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL && data?.length) {
        return enrichWithChinese(data);
      }
    }
  } catch { /* cache corrupt, fetch fresh */ }

  // 调用 API
  try {
    const res = await fetch(`${API_BASE}/filter.php?a=Chinese`);
    if (!res.ok) return null;
    const json = await res.json();
    const meals = json.meals;
    if (!Array.isArray(meals) || meals.length === 0) return null;

    // 缓存原始数据
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: meals,
    }));

    return enrichWithChinese(meals);
  } catch {
    return null;
  }
}

/**
 * 将英文 API 数据与中文映射合并
 */
function enrichWithChinese(meals) {
  return meals.map((m) => {
    const cn = CHINESE_MAP[m.idMeal];
    return {
      id: m.idMeal,
      image: m.strMealThumb,
      // 有中文映射用中文，否则用英文原名
      name: cn?.name ?? m.strMeal,
      meal: cn?.meal ?? ['lunch', 'dinner'],
      desc: cn?.desc ?? '',
      ingredients: cn?.ingredients ?? '',
      hasImage: true,
    };
  });
}

/**
 * 获取单道菜的详情（含做法步骤）
 * 不缓存，按需调用
 */
export async function fetchMealDetail(id) {
  try {
    const res = await fetch(`${API_BASE}/lookup.php?i=${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.meals?.[0] ?? null;
  } catch {
    return null;
  }
}
