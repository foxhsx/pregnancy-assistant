export const SYMPTOM_CATEGORIES = [
  { key: 'digestive', label: '消化系统', icon: '🤢' },
  { key: 'systemic', label: '全身症状', icon: '😵' },
  { key: 'sleep', label: '睡眠问题', icon: '😴' },
  { key: 'physical', label: '身体不适', icon: '💪' },
  { key: 'emotional', label: '心理情绪', icon: '😢' },
];

export const SYMPTOMS_BY_CATEGORY = {
  digestive: ['孕吐（晨吐）', '孕吐（全天吐）', '反胃', '食欲不振', '食欲亢进', '胃灼热', '腹胀', '便秘'],
  systemic: ['疲劳', '头晕', '头痛', '发热', '乏力', '心悸'],
  sleep: ['失眠', '嗜睡', '夜醒', '多梦', '打鼾'],
  physical: ['水肿', '抽筋', '腰背痛', '乳房胀痛', '骨盆痛', '呼吸困难', '皮肤瘙痒'],
  emotional: ['焦虑', '情绪波动', '注意力不集中', '抑郁倾向', '易怒'],
};

export const SEVERITY_LABELS = ['', '😊轻微', '😟较轻', '😐中等', '😣较重', '😭严重'];

export const TRIGGERS = [
  { key: 'food', label: '饮食' },
  { key: 'exercise', label: '运动' },
  { key: 'emotion', label: '情绪' },
  { key: 'environment', label: '环境' },
  { key: 'time', label: '时间因素' },
  { key: 'other', label: '其他' },
];
