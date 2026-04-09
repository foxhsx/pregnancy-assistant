/**
 * 每周饮食指南 + 菜谱数据
 *
 * 数据来源：
 * - 《中国居民膳食指南（2022）》孕妇、乳母膳食指南（中国营养学会）
 * - ACOG（美国妇产科医师学会）孕期营养建议
 * - WHO 孕期营养指南
 *
 * meal 取值：breakfast / lunch / dinner / snack，一道菜可属于多个餐次
 */
export const dietGuide = {
  5: {
    focus: '叶酸、蛋白质',
    advice: '每天补充400μg叶酸，多吃富含叶酸的食物如菠菜、西兰花。蛋白质摄入充足，有助于胚胎发育。',
    keyNutrients: ['叶酸', '蛋白质', '维生素C'],
    avoid: ['生鱼片', '未经巴氏消毒的奶制品', '酒精'],
    recipes: [
      { name: '菠菜鸡蛋汤', meal: ['breakfast', 'lunch'], ingredients: '菠菜200g、鸡蛋2个、盐适量', steps: '菠菜洗净焯水，鸡蛋打散。锅中加水烧开，放入菠菜，倒入蛋液，调味即可。' },
      { name: '西兰花炒虾仁', meal: ['lunch', 'dinner'], ingredients: '西兰花200g、鲜虾仁100g、蒜末适量', steps: '西兰花焯水，虾仁滑炒至变色，加入西兰花翻炒，调味出锅。' },
      { name: '牛奶燕麦粥', meal: ['breakfast'], ingredients: '燕麦片50g、牛奶250ml、蓝莓适量', steps: '燕麦片加牛奶小火煮3分钟至浓稠，撒上蓝莓即可。' },
      { name: '番茄鸡蛋面', meal: ['lunch', 'dinner'], ingredients: '面条100g、番茄2个、鸡蛋2个、葱花', steps: '番茄去皮炒出汁，加水煮开放面条，打入鸡蛋花，撒葱花调味。' },
      { name: '香蕉酸奶杯', meal: ['breakfast', 'snack'], ingredients: '酸奶200ml、香蕉1根、核桃碎15g', steps: '香蕉切片铺底，倒入酸奶，撒核桃碎。简单快手。' },
      { name: '芦笋炒肉丝', meal: ['lunch', 'dinner'], ingredients: '芦笋200g、瘦肉丝100g、蒜片', steps: '肉丝用淀粉腌制，芦笋切段焯水。热油爆香蒜片，滑炒肉丝，加芦笋翻炒调味。' },
      { name: '蒸蛋羹', meal: ['breakfast', 'snack'], ingredients: '鸡蛋2个、温水适量、香油少许', steps: '鸡蛋打散加1.5倍温水搅匀，过滤后盖保鲜膜蒸10分钟，淋香油。' },
      { name: '橙子胡萝卜汁', meal: ['snack'], ingredients: '橙子1个、胡萝卜半根、蜂蜜少许', steps: '橙子去皮，胡萝卜切小块，一起放入榨汁机，加少许蜂蜜调味。' },
    ],
  },
  8: {
    focus: '缓解孕吐、碳水化合物',
    advice: '少食多餐，干稀分开。早晨起床前可吃几块苏打饼干。避免油腻、辛辣食物。维生素B6有助于缓解孕吐。',
    keyNutrients: ['维生素B6', '碳水化合物', '锌'],
    avoid: ['油炸食品', '过量咖啡因（每日≤200mg，约1杯咖啡）', '辛辣刺激'],
    recipes: [
      { name: '小米红枣粥', meal: ['breakfast'], ingredients: '小米100g、红枣5颗、枸杞适量', steps: '小米淘洗，红枣去核。加水大火烧开后转小火煮30分钟，加入枸杞再煮5分钟。' },
      { name: '柠檬蜂蜜水', meal: ['snack'], ingredients: '柠檬半个、蜂蜜1勺、温水300ml', steps: '柠檬切片放入温水中，加入蜂蜜搅拌均匀。晨起饮用有助缓解孕吐。' },
      { name: '苏打饼干配牛奶', meal: ['breakfast', 'snack'], ingredients: '苏打饼干4片、牛奶250ml', steps: '早晨起床前先吃几片苏打饼干，休息15分钟后再喝牛奶。' },
      { name: '土豆泥', meal: ['lunch', 'dinner'], ingredients: '土豆2个、牛奶50ml、黄油少许、盐', steps: '土豆去皮蒸熟，趁热加牛奶黄油压成泥，调味拌匀。' },
      { name: '清汤面', meal: ['lunch', 'dinner'], ingredients: '细面条100g、青菜适量、鸡蛋1个', steps: '清水煮开放面条，加青菜，打入鸡蛋，少许盐调味。清淡易消化。' },
      { name: '姜汁红糖水', meal: ['snack'], ingredients: '生姜3片、红糖15g', steps: '姜片加水煮10分钟，加入红糖搅拌融化。缓解晨吐。' },
      { name: '蒸南瓜', meal: ['breakfast', 'snack'], ingredients: '南瓜200g', steps: '南瓜去皮切块，上锅蒸15分钟至软糯。天然甜味，不油腻。' },
      { name: '白粥配酱瓜', meal: ['breakfast'], ingredients: '大米100g、酱瓜适量', steps: '大米淘洗加水煮40分钟至浓稠，配少量酱瓜开胃。' },
      { name: '苹果小米糊', meal: ['breakfast', 'snack'], ingredients: '苹果半个、小米30g、水适量', steps: '小米煮烂，苹果去皮切块一起用料理机打成糊。酸甜可口。' },
    ],
  },
  12: {
    focus: '蛋白质、铁、钙',
    advice: '孕早期结束，食欲逐渐恢复。增加优质蛋白摄入，开始注意补铁和钙。每天一杯牛奶或酸奶。',
    keyNutrients: ['蛋白质', '铁', '钙', '维生素D'],
    avoid: ['生肉生鱼', '含汞高的鱼类（鲨鱼、剑鱼）', '未经清洗的蔬果'],
    recipes: [
      { name: '番茄炖牛腩', meal: ['lunch', 'dinner'], ingredients: '牛腩300g、番茄2个、洋葱半个、姜片', steps: '牛腩焯水切块，番茄去皮切块。爆香姜片洋葱，加牛腩翻炒，放入番茄加水炖1.5小时。' },
      { name: '芝麻拌菠菜', meal: ['lunch', 'dinner'], ingredients: '菠菜300g、熟芝麻2勺、生抽醋适量', steps: '菠菜焯水切段，撒上芝麻，淋上生抽和醋调的汁即可。补铁补钙好选择。' },
      { name: '牛奶鸡蛋羹', meal: ['breakfast'], ingredients: '鸡蛋2个、牛奶200ml、少许糖', steps: '鸡蛋打散加入牛奶搅匀，过滤后盖保鲜膜蒸15分钟。嫩滑补钙。' },
      { name: '红豆薏米粥', meal: ['breakfast'], ingredients: '红豆50g、薏米30g、大米50g', steps: '红豆薏米提前浸泡，加水煮开后小火煮1小时至软烂。' },
      { name: '青椒炒鸡肝', meal: ['lunch', 'dinner'], ingredients: '鸡肝100g、青椒2个、蒜末', steps: '鸡肝切薄片焯水，青椒切块。热油爆香蒜末，快炒鸡肝和青椒，调味出锅。补铁佳品。' },
      { name: '奶酪三明治', meal: ['breakfast'], ingredients: '全麦面包2片、奶酪1片、番茄片、生菜', steps: '面包烤至微焦，依次铺生菜、番茄片、奶酪，对半切开。快手早餐。' },
      { name: '紫菜蛋花汤', meal: ['lunch', 'dinner'], ingredients: '紫菜10g、鸡蛋2个、虾皮适量、香油', steps: '水烧开后放入紫菜和虾皮，淋入蛋液，关火后滴几滴香油。' },
      { name: '酸奶水果碗', meal: ['breakfast', 'snack'], ingredients: '酸奶200ml、草莓5颗、蓝莓适量、燕麦片20g', steps: '酸奶倒入碗中，铺上草莓蓝莓，撒燕麦片。清爽营养。' },
      { name: '胡萝卜炖排骨', meal: ['lunch', 'dinner'], ingredients: '排骨300g、胡萝卜2根、姜片、料酒', steps: '排骨焯水，胡萝卜切块。排骨加姜料酒炖40分钟，加胡萝卜再炖20分钟。' },
    ],
  },
  16: {
    focus: '钙、维生素D、DHA',
    advice: '进入孕中期，宝宝骨骼快速发育，钙需求增加。孕中期每天需1000mg钙（孕晚期增至1200mg），配合维生素D促进吸收。适当补充DHA促进大脑发育。',
    keyNutrients: ['钙', '维生素D', 'DHA', '蛋白质'],
    avoid: ['高盐食品', '加工肉制品', '含酒精饮品'],
    recipes: [
      { name: '豆腐鲫鱼汤', meal: ['lunch', 'dinner'], ingredients: '鲫鱼1条、豆腐200g、姜片、葱花', steps: '鲫鱼煎至两面金黄，加开水和姜片大火煮20分钟至汤色奶白，放入豆腐再煮10分钟，撒葱花。' },
      { name: '核桃酸奶杯', meal: ['breakfast', 'snack'], ingredients: '酸奶200ml、核桃碎30g、蓝莓适量、燕麦片20g', steps: '酸奶倒入杯中，撒上核桃碎和燕麦片，摆上蓝莓即可。补钙补DHA。' },
      { name: '芝麻酱拌面', meal: ['lunch', 'dinner'], ingredients: '面条150g、芝麻酱2勺、黄瓜丝、醋', steps: '面条煮熟过凉水，芝麻酱用温水调开拌入，加黄瓜丝和醋调味。高钙主食。' },
      { name: '虾仁蒸蛋', meal: ['breakfast', 'lunch'], ingredients: '鸡蛋3个、鲜虾仁50g、香葱', steps: '鸡蛋打散加1.5倍温水，过滤后倒入碗中，放虾仁，蒸12分钟，撒葱花。' },
      { name: '黑豆排骨汤', meal: ['lunch', 'dinner'], ingredients: '黑豆50g、排骨300g、姜片、枸杞', steps: '黑豆提前浸泡4小时，排骨焯水。一起加水炖1.5小时，出锅前加枸杞。补钙补肾。' },
      { name: '牛奶麦片', meal: ['breakfast'], ingredients: '即食麦片50g、牛奶250ml、坚果碎15g', steps: '麦片用牛奶泡软，撒上坚果碎。最简补钙早餐。' },
      { name: '清炒小白菜', meal: ['lunch', 'dinner'], ingredients: '小白菜300g、蒜末、盐', steps: '热油爆香蒜末，大火快炒小白菜至断生，加盐调味。绿叶菜补钙。' },
      { name: '三文鱼牛油果饭团', meal: ['lunch', 'dinner'], ingredients: '米饭1碗、三文鱼50g、牛油果半个、海苔', steps: '三文鱼煎熟碎，牛油果切片，包入饭团用海苔裹好。DHA满满。' },
      { name: '芝麻糊', meal: ['snack'], ingredients: '黑芝麻粉30g、糯米粉15g、冰糖适量', steps: '黑芝麻粉和糯米粉加水搅匀，小火煮至浓稠，加冰糖调味。' },
    ],
  },
  20: {
    focus: '铁、蛋白质、碘',
    advice: '血容量增加，容易出现生理性贫血。多吃富含铁的食物（红肉、动物肝脏每周1-2次，每次约50g），搭配维C促进铁吸收。',
    keyNutrients: ['铁', '维生素C', '蛋白质', '碘'],
    avoid: ['浓茶（影响铁吸收）', '生食', '过量维生素A'],
    recipes: [
      { name: '猪肝炒青椒', meal: ['lunch', 'dinner'], ingredients: '猪肝80g、青椒2个、蒜末、生抽', steps: '猪肝切薄片用料酒淀粉腌制，青椒切块。热油爆炒猪肝至变色盛出，炒青椒后回锅翻炒调味。每周1-2次。' },
      { name: '紫菜蛋花汤', meal: ['lunch', 'dinner'], ingredients: '紫菜10g、鸡蛋2个、虾皮适量、香油', steps: '水烧开后放入紫菜和虾皮，淋入蛋液，关火后滴几滴香油。补碘补铁。' },
      { name: '红豆花生粥', meal: ['breakfast'], ingredients: '红豆50g、花生30g、大米80g、红糖适量', steps: '红豆花生提前浸泡，加大米煮1小时，加红糖调味。补血养血。' },
      { name: '番茄鸡蛋面', meal: ['lunch', 'dinner'], ingredients: '面条100g、番茄2个、鸡蛋2个、菠菜', steps: '番茄炒出汁加水煮面，打入蛋花，加菠菜烫熟。铁+维C搭配。' },
      { name: '牛肉炒西兰花', meal: ['lunch', 'dinner'], ingredients: '牛肉150g、西兰花200g、蚝油', steps: '牛肉切片腌制，西兰花焯水。滑炒牛肉至变色，加西兰花蚝油翻炒。' },
      { name: '猕猴桃酸奶', meal: ['breakfast', 'snack'], ingredients: '猕猴桃2个、酸奶200ml、蜂蜜少许', steps: '猕猴桃去皮切块，倒入酸奶拌匀。维C促进铁吸收。' },
      { name: '木耳炒鸡蛋', meal: ['lunch', 'dinner'], ingredients: '干木耳10g、鸡蛋3个、葱花', steps: '木耳泡发撕小朵，鸡蛋炒熟盛出，炒木耳后回锅。补铁清爽。' },
      { name: '五红汤', meal: ['snack'], ingredients: '红豆20g、红枣5颗、红花生20g、枸杞、红糖', steps: '红豆花生浸泡后加水煮1小时，加红枣枸杞红糖再煮10分钟。经典补血方。' },
      { name: '菠菜猪肝粥', meal: ['breakfast', 'lunch'], ingredients: '大米80g、猪肝60g、菠菜100g、姜丝', steps: '大米煮粥，猪肝薄片腌制，粥好时加入猪肝和菠菜煮熟。每周1-2次。' },
    ],
  },
  24: {
    focus: '控制糖分、膳食纤维',
    advice: '糖耐量试验前后，注意控制精制糖摄入。增加膳食纤维，预防便秘。水果每天200-350g，选择低GI水果（如苹果、柚子、草莓）。',
    keyNutrients: ['膳食纤维', '优质蛋白', '钙', '铁'],
    avoid: ['蛋糕甜点', '含糖饮料', '精制糖', '白粥（升糖快）'],
    recipes: [
      { name: '杂粮饭配清蒸鲈鱼', meal: ['lunch', 'dinner'], ingredients: '糙米+小米+藜麦共200g、鲈鱼1条、葱姜', steps: '杂粮提前浸泡2小时后煮饭。鲈鱼处理干净，铺葱姜蒸8-10分钟，淋蒸鱼豉油。' },
      { name: '芹菜拌腐竹', meal: ['lunch', 'dinner'], ingredients: '芹菜200g、腐竹100g、蒜末、香醋', steps: '腐竹泡发焯水，芹菜切段焯水，拌入蒜末和香醋调味。高纤维低GI。' },
      { name: '荞麦面沙拉', meal: ['lunch'], ingredients: '荞麦面100g、鸡胸肉80g、生菜、圣女果、油醋汁', steps: '荞麦面煮熟过凉水，鸡胸肉煮熟撕丝，拌入蔬菜和油醋汁。低GI主食。' },
      { name: '燕麦牛奶碗', meal: ['breakfast'], ingredients: '燕麦片50g、牛奶250ml、奇亚籽10g、草莓', steps: '燕麦和奇亚籽用牛奶浸泡一夜，早上加草莓即可。高纤维控糖。' },
      { name: '苦瓜炒蛋', meal: ['lunch', 'dinner'], ingredients: '苦瓜1根、鸡蛋3个、盐', steps: '苦瓜去瓤切片焯水去苦味，鸡蛋炒熟，回锅翻炒。辅助控糖。' },
      { name: '清炒莴笋丝', meal: ['lunch', 'dinner'], ingredients: '莴笋300g、蒜末、盐', steps: '莴笋去皮切丝，热油爆香蒜末，大火快炒莴笋丝至断生。低热量高纤维。' },
      { name: '无糖豆浆', meal: ['breakfast', 'snack'], ingredients: '黄豆50g、水800ml', steps: '黄豆提前浸泡，用豆浆机打成豆浆，不加糖。优质植物蛋白。' },
      { name: '杂蔬鸡胸肉卷', meal: ['lunch', 'dinner'], ingredients: '全麦饼皮1张、鸡胸肉80g、生菜、黄瓜、胡萝卜', steps: '鸡胸肉煎熟切片，蔬菜切丝，铺在饼皮上卷紧切段。' },
      { name: '柚子茶', meal: ['snack'], ingredients: '柚子半个、蜂蜜2勺、温水', steps: '柚子取果肉，加蜂蜜和温水调匀。低GI水果饮品。' },
    ],
  },
  28: {
    focus: '蛋白质、钙、铁、控制体重',
    advice: '孕晚期开始，每周体重增长控制在0.5kg以内。孕晚期钙需求增至每天1200mg。增加蛋白质摄入，继续补铁。少食多餐，避免胃部不适。',
    keyNutrients: ['蛋白质', '钙', '铁', '维生素K'],
    avoid: ['高糖高油', '过量水果', '生冷食物', '暴饮暴食'],
    recipes: [
      { name: '虾仁豆腐煲', meal: ['lunch', 'dinner'], ingredients: '鲜虾200g、嫩豆腐1块、香菇5朵、白菜适量', steps: '香菇切片，白菜切段。砂锅加水烧开，放入香菇和豆腐煮10分钟，加虾仁和白菜煮熟调味。' },
      { name: '红枣山药粥', meal: ['breakfast'], ingredients: '山药150g、红枣6颗、大米100g', steps: '山药去皮切块，红枣去核。大米加水煮开后放入山药和红枣，小火煮40分钟。健脾养胃。' },
      { name: '清蒸鳕鱼', meal: ['lunch', 'dinner'], ingredients: '鳕鱼200g、姜丝、葱段、蒸鱼豉油', steps: '鳕鱼解冻用厨房纸吸干，铺姜葱蒸8分钟，淋蒸鱼豉油。高蛋白低脂。' },
      { name: '牛奶芝麻糊', meal: ['breakfast', 'snack'], ingredients: '黑芝麻糊粉30g、牛奶200ml', steps: '芝麻糊粉用温牛奶冲开搅拌均匀。双倍补钙。' },
      { name: '鸡丝凉面', meal: ['lunch'], ingredients: '荞麦面100g、鸡胸肉100g、黄瓜丝、芝麻酱', steps: '鸡胸肉煮熟撕丝，面条煮熟过凉水，拌入黄瓜丝鸡丝和稀释的芝麻酱。' },
      { name: '豆腐菌菇汤', meal: ['lunch', 'dinner'], ingredients: '嫩豆腐1块、金针菇50g、香菇3朵、葱花', steps: '菌菇洗净，豆腐切块。水烧开煮菌菇5分钟，加豆腐再煮3分钟，撒葱花。' },
      { name: '蒸红薯', meal: ['breakfast', 'snack'], ingredients: '红薯1个（约200g）', steps: '红薯洗净，上锅蒸20分钟至软烂。膳食纤维丰富，代替精制主食。' },
      { name: '牛奶炖蛋', meal: ['breakfast', 'snack'], ingredients: '鸡蛋2个、牛奶200ml、少许糖', steps: '鸡蛋加牛奶打散过滤，盖保鲜膜蒸12分钟。嫩滑补钙。' },
      { name: '凉拌木耳黄瓜', meal: ['lunch', 'dinner'], ingredients: '木耳10g、黄瓜1根、蒜末、香醋', steps: '木耳泡发焯水，黄瓜拍碎，拌入蒜末香醋调味。清爽低脂。' },
    ],
  },
  32: {
    focus: '优质蛋白、DHA、维生素',
    advice: '宝宝大脑发育高峰期，多摄入DHA（深海鱼每周2次）和优质蛋白。注意胎动次数。',
    keyNutrients: ['DHA', '蛋白质', '钙', '维生素E'],
    avoid: ['含汞鱼类', '生食', '酒精', '过量咖啡因'],
    recipes: [
      { name: '三文鱼牛油果沙拉', meal: ['lunch', 'dinner'], ingredients: '三文鱼100g、牛油果1个、生菜、柠檬汁', steps: '三文鱼煎熟或蒸熟切块，牛油果切块，生菜撕小片，淋上柠檬汁和橄榄油拌匀。' },
      { name: '牛奶鸡蛋羹', meal: ['breakfast', 'snack'], ingredients: '鸡蛋2个、牛奶200ml、少许糖', steps: '鸡蛋打散加入牛奶搅拌均匀，过滤后倒入碗中，盖保鲜膜蒸15分钟。补钙补蛋白。' },
      { name: '核桃红枣粥', meal: ['breakfast'], ingredients: '核桃仁30g、红枣6颗、大米80g', steps: '核桃仁掰碎，红枣去核，大米煮粥至浓稠后加入核桃红枣再煮10分钟。补脑养血。' },
      { name: '清蒸鲈鱼配西兰花', meal: ['lunch', 'dinner'], ingredients: '鲈鱼1条、西兰花150g、蒸鱼豉油', steps: '鲈鱼蒸8分钟，西兰花焯水摆盘，淋蒸鱼豉油。高蛋白DHA。' },
      { name: '虾仁炒蛋', meal: ['lunch', 'dinner'], ingredients: '鲜虾仁100g、鸡蛋3个、葱花', steps: '虾仁滑炒至变色，倒入打散的蛋液，翻炒至凝固，撒葱花。' },
      { name: '花生猪蹄汤', meal: ['lunch', 'dinner'], ingredients: '猪蹄1只、花生50g、姜片、红枣', steps: '猪蹄焯水，花生浸泡。一起炖2小时至猪蹄软烂。胶原蛋白丰富。' },
      { name: '黑芝麻汤圆', meal: ['breakfast', 'snack'], ingredients: '糯米粉100g、黑芝麻馅适量', steps: '糯米粉加温水和面，包入芝麻馅搓圆，煮至浮起。补钙补DHA。' },
      { name: '南瓜小米粥', meal: ['breakfast'], ingredients: '南瓜200g、小米80g', steps: '南瓜去皮切块，小米淘洗。一起加水煮30分钟至浓稠。养胃好消化。' },
      { name: '腰果西芹', meal: ['lunch', 'dinner'], ingredients: '西芹200g、腰果50g、盐', steps: '西芹切段焯水，腰果小火炒香，一起翻炒调味。补脑益智。' },
    ],
  },
  36: {
    focus: '易消化、蓄积体力',
    advice: '接近分娩，饮食宜清淡易消化，储备分娩所需体力。多吃富含维生素K的食物有助凝血。',
    keyNutrients: ['维生素K', '碳水化合物', '蛋白质', '铁'],
    avoid: ['大补之物', '过量脂肪', '不易消化食物'],
    recipes: [
      { name: '菠菜猪肝面', meal: ['lunch', 'dinner'], ingredients: '面条100g、猪肝80g、菠菜100g、姜丝', steps: '猪肝切薄片腌制，菠菜焯水。面条煮熟捞出，猪肝快速汆烫，一起放入面汤中，加菠菜和姜丝。' },
      { name: '红豆薏米粥', meal: ['breakfast'], ingredients: '红豆50g、薏米30g、大米50g', steps: '红豆薏米提前浸泡，加水煮开后小火煮1小时至软烂。利水消肿。' },
      { name: '番茄鸡蛋疙瘩汤', meal: ['lunch', 'dinner'], ingredients: '面粉80g、番茄1个、鸡蛋2个、菠菜', steps: '面粉加少量水搅成小疙瘩，番茄炒出汁加水煮开，倒入疙瘩和蛋液，加菠菜。易消化。' },
      { name: '蒸蛋配全麦面包', meal: ['breakfast'], ingredients: '鸡蛋2个、温水适量、全麦面包2片', steps: '鸡蛋加1.5倍温水蒸10分钟，配全麦面包。好消化营养足。' },
      { name: '丝瓜蛋汤', meal: ['lunch', 'dinner'], ingredients: '丝瓜1根、鸡蛋2个、虾皮', steps: '丝瓜去皮切片煮软，打入蛋花，加虾皮调味。清淡利水。' },
      { name: '小米南瓜粥', meal: ['breakfast', 'snack'], ingredients: '小米80g、南瓜150g', steps: '南瓜切块，小米淘洗，一起煮30分钟。养胃易消化。' },
      { name: '藕粉羹', meal: ['snack'], ingredients: '藕粉30g、红糖适量、桂花少许', steps: '藕粉用凉水调开，冲入沸水搅拌至透明，加红糖桂花。待产能量好帮手。' },
      { name: '鸡汤面', meal: ['lunch', 'dinner'], ingredients: '细面条100g、鸡汤1碗、青菜、鸡肉丝', steps: '鸡汤煮开放入面条，加鸡肉丝和青菜，调味即可。温补好消化。' },
      { name: '香蕉牛奶奶昔', meal: ['breakfast', 'snack'], ingredients: '香蕉1根、牛奶200ml、蜂蜜1勺', steps: '香蕉和牛奶放入搅拌机打匀，加蜂蜜调味。快速补充能量。' },
    ],
  },
  40: {
    focus: '待产能量补充',
    advice: '随时可能发动！准备易消化的高能量食物（巧克力、藕粉、电解质水）。少食多餐，保持体力。',
    keyNutrients: ['碳水化合物', '水分', '电解质'],
    avoid: ['大鱼大肉', '不易消化食物', '产气食物'],
    recipes: [
      { name: '红糖藕粉', meal: ['breakfast', 'snack'], ingredients: '藕粉30g、红糖适量、热水', steps: '藕粉用少量凉水调开，冲入沸水快速搅拌至透明，加入红糖调味。待产好帮手。' },
      { name: '香蕉燕麦奶昔', meal: ['breakfast', 'snack'], ingredients: '香蕉1根、燕麦30g、牛奶200ml', steps: '所有材料放入搅拌机打匀即可。快速补充能量。' },
      { name: '蜂蜜水', meal: ['snack'], ingredients: '蜂蜜2勺、温水300ml', steps: '蜂蜜用温水冲开，小口慢饮。分娩中补充体力。' },
      { name: '全麦面包配花生酱', meal: ['breakfast', 'snack'], ingredients: '全麦面包2片、花生酱适量', steps: '面包抹花生酱即可。高能量快手持久。' },
      { name: '小米粥', meal: ['breakfast', 'lunch'], ingredients: '小米100g', steps: '小米淘洗加水，大火煮开转小火30分钟。最易消化的主食。' },
      { name: '番茄面片汤', meal: ['lunch', 'dinner'], ingredients: '面片80g、番茄1个、鸡蛋1个、青菜', steps: '番茄炒出汁加水煮开，下面片和青菜，打入蛋花。温暖好消化。' },
      { name: '电解质水', meal: ['snack'], ingredients: '温水500ml、盐少许、蜂蜜1勺、柠檬汁', steps: '所有材料混合溶解。分娩出汗后及时补充电解质。' },
      { name: '蒸苹果', meal: ['snack'], ingredients: '苹果1个', steps: '苹果去皮切块蒸15分钟至软。易消化，提供持久能量。' },
    ],
  },
};

/**
 * 简易字符串 hash（用于 seed 随机）
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * 基于 seed 的洗牌（Fisher-Yates）
 */
function shuffleWithSeed(arr, seed) {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 从菜谱池中按餐次随机抽取三餐推荐
 * @param {Array} recipes - 当前周的菜谱列表
 * @param {string} dateStr - 日期字符串如 "2026-04-09"
 * @param {number} refreshCount - 刷新次数
 * @returns {{ breakfast, lunch, dinner }}
 */
export function pickMealPlan(recipes, dateStr, refreshCount = 0) {
  const baseSeed = hashCode(dateStr) + refreshCount * 997;

  const breakfastPool = recipes.filter(r => r.meal.includes('breakfast'));
  const lunchPool = recipes.filter(r => r.meal.includes('lunch'));
  const dinnerPool = recipes.filter(r => r.meal.includes('dinner'));

  const shuffledB = shuffleWithSeed(breakfastPool, baseSeed);
  const shuffledL = shuffleWithSeed(lunchPool, baseSeed + 1);
  const shuffledD = shuffleWithSeed(dinnerPool, baseSeed + 2);

  return {
    breakfast: shuffledB[0] || null,
    lunch: shuffledL[0] || null,
    dinner: shuffledD[0] || null,
  };
}

/**
 * 获取最接近的饮食指南（向下取到最近的key）
 */
export function getDietGuide(week) {
  const weeks = Object.keys(dietGuide).map(Number).sort((a, b) => a - b);
  let best = weeks[0];
  for (const w of weeks) {
    if (w <= week) best = w;
    else break;
  }
  return dietGuide[best];
}
