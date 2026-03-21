# 儿童英语单词学习应用 MVP

一个面向 1-3 年级儿童的英语单词学习应用，使用 React + TypeScript + Vite 构建。

## 已实现功能

- 3 种学习模式
  - 英译中选择
  - 中译英拼写
  - 留空补全
- 儿童化 UI
- 正确 / 错误反馈动画
- 连胜庆祝浮层
- 答错二次重试
- 错题回练入口
- 首页学习统计
- 结算页统计摘要
- 学习设置
  - 每轮题数
  - 主题分类
  - 音效开关
  - 自动发音开关
- 浏览器原生英文发音
- 轻量提示音效
- 本地持久化进度
- 70 个基础英语单词词库

## 技术栈

- React 18
- TypeScript
- Vite
- Zustand
- Framer Motion

## 本地启动

```bash
npm install
npm run dev
```

打开 Vite 输出的本地地址即可。

## 生产构建

```bash
npm run build
npm run preview
```

## 项目结构

```text
src/
├─ app/
├─ components/
│  ├─ common/
│  ├─ game/
│  └─ summary/
├─ data/
│  └─ words/
├─ features/
│  ├─ game/
│  └─ progress/
├─ lib/
├─ pages/
├─ store/
└─ types/
```

## 核心说明

### 发音
- 使用浏览器 `speechSynthesis`
- 不依赖外部 TTS 服务
- 适合 MVP 快速验证

### 音效
- 使用 Web Audio API 动态生成
- 无需额外音频素材文件

### 数据持久化
- 使用 localStorage 保存：
  - 总星星数
  - 当前模式
  - 单词练习记录
  - 学习设置

## 后续建议

### 优先级高
- 增加更完整的词库分级
- 为分类显示中文名称
- 补充真实图片资源
- 优化移动端细节和触控反馈

### 可继续扩展
- 模式4：完整拼写挑战
- 家长视图 / 学习报告
- 连续学习天数
- 成就系统
- 云端同步

## 当前状态

这是一个**可运行、可演示、可继续扩展**的 MVP。
