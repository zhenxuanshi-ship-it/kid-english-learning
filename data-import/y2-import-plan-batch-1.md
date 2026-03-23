# Y2 第一批实际导入清单（针对当前线上产品）

## 目标
不是一次性导入 `84` 个词，而是先导入**最稳、最容易验收、最能带动句式模块**的一小批内容。

建议第一批正式进代码：**24 个词**。

---

## 为什么先导这 24 个
优先满足这几个条件：

1. **与现有词库重合少 / 不会造成太多重复维护**
2. **和当前句式模块强联动**
3. **高度儿童友好、容易配图**
4. **覆盖多个核心主题，而不是只塞某一个分类**
5. **上线后容易验证效果**

---

## 第一批正式导入（24 个）

### 1) Fruits / 食物链路（6）
适合接 `I like ...`

- peach｜桃子
- grapes｜葡萄（建议代码层统一成 `grape` 还是保留复数，先定规则）
- watermelon｜西瓜
- pear｜梨
- burger｜汉堡
- juice｜果汁

### 2) Animals / 动物链路（6）
适合接 `This is ...` / `What is this?`

- panda｜熊猫
- elephant｜大象
- zebra｜斑马
- tiger｜老虎
- monkey｜猴子
- lion｜狮子

### 3) Body / 身体链路（4）
适合接 `I have ...`

- head｜头
- mouth｜嘴巴
- ears / ear｜耳朵（需和现有单复数规则统一）
- hair｜头发

### 4) School / 学校链路（4）
适合接 `I have ...` / `This is ...`

- eraser｜橡皮
- crayon｜蜡笔
- classroom｜教室
- sticker｜贴纸

### 5) Weather / 天气链路（4）
适合接 `It is ...`

- umbrella｜伞
- puddle｜水坑
- rainbow｜彩虹（如果保留现有 weather 里的 rainbow，则不重复导入）
- cloud｜云（如果保留现有 weather 里的 cloud，则不重复导入）

---

## 第二优先批（下一批再导）
这批也很好，但不一定要立刻进：

### Clothes
- shirt
- pants
- dress
- jacket
- skirt
- socks
- raincoat

### Family
- brother
- sister
- grandma
- grandpa

### Food 增补
- rice
- noodles
- milk
- water
- bread
- pizza
- ice cream

### Playground / Celebrations（做主题扩展时再上）
- balloon
- gift
- seesaw
- slide
- swing
- playground

---

## 暂缓导入
这些现在先别急着进：

### 1. 有歧义的
- orange（颜色 / 水果）

### 2. 多词短语较重的
- how many
- living room
- dining room
- monkey bars
- sea turtle
- wash my face
- brush my teeth
- go to bed

### 3. 需要更强动作交互支撑的
- shake
- touch
- cut
- fold
- kick
- throw
- go up
- go down

### 4. 海洋动物整组
- seal
- shark
- starfish
- seahorse
- jellyfish
- whale
- dolphin
- sea turtle
- seaweed

这组很适合以后做一个“海洋主题包”，现在先不急。

---

## 导入前需要统一的规则

### 1. 单复数规则
当前数据里有一些是复数来源：

- grapes
- eyes
- hands
- feet
- ears
- shoes
- socks

建议先决定：

- **产品词库默认用单数 canonical form**
- 句式/展示里再按需要生成复数

如果这样定，那么像：
- grapes -> grape
- eyes -> eye
- ears -> ear
- shoes -> shoe
- socks -> sock

这样后面数据会更稳。

### 2. 中文风格统一
现有项目里中文有时是名词本体，有时是偏口语，有时是性质词：

例如：
- 红色 / 红色的
- 黑色 / 黑色的
- 家 / 家庭
- 下雨 / 雨

建议第一批导入时统一一套风格，不然后面句式会乱。

---

## 和当前线上产品的联动建议

### 句式联动优先关系
- `I like ...` ← peach / grape / watermelon / burger / juice
- `This is ...` ← panda / elephant / zebra / classroom / sticker
- `What is this?` ← tiger / monkey / lion / eraser / crayon
- `I have ...` ← head / mouth / hair / eraser / crayon
- `It is ...` ← weather 场景 + colors 继续使用现有词

---

## 第一批导入的开发顺序（建议）

### Step 1
先导 **12 个最稳的名词**

- peach
- watermelon
- panda
- elephant
- zebra
- tiger
- monkey
- lion
- eraser
- crayon
- umbrella
- puddle

### Step 2
再导 **8 个句式联动强的补充词**

- burger
- juice
- head
- mouth
- hair
- classroom
- sticker
- rainbow（若不重复）

### Step 3
最后补 **剩下 4 个边界词**

- grapes / grape（需定单复数规则）
- pear
- cloud（若不重复）
- ears / ear（需定单复数规则）

---

## 结论
如果现在开始往产品里接内容，建议：

- **不要一下子导 84 个**
- **先导 24 个**
- **再拆成 12 + 8 + 4 三步**

这样最稳，也最适合你当前已经在线上的产品节奏。
