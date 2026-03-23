# Supabase 后端接入指南

## 第一步：创建 Supabase 项目

1. 打开 https://supabase.com/dashboard
2. 点击 **New Project**
3. 填写：
   - Organization: 选择你的组织（或个人）
   - Name: `kid-english-learning`
   - Database Password: 生成一个强密码（记住它）
   - Region: 选择亚太区域（**Asia - Singapore** 或 **Asia - Tokyo**），延迟最低
4. 点击 **Create new project**，等待约 2 分钟

---

## 第二步：获取 API 密钥

项目创建完成后：

1. 进入 **Project Settings** → **API**
2. 找到以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon / public** key: `eyJhbGciOiJIUzI1...`

---

## 第三步：创建 `.env` 文件

```bash
cp .env.example .env
```

编辑 `.env`，填入刚才的 URL 和 anon key：

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
```

⚠️ **重要**：`.env` 文件不要提交到 GitHub！确认 `.gitignore` 里包含 `.env`。

---

## 第四步：创建数据库表

1. 进入 Supabase Dashboard → **SQL Editor**
2. 点击 **New Query**
3. 打开 `supabase/schema.sql`，复制全部内容，粘贴到 SQL Editor
4. 点击 **Run**，等待执行完成

---

## 第五步：配置认证提供商（可选，推荐 Google 登录）

1. 进入 **Authentication** → **Providers** → **Google**
2. 开启 Google OAuth
3. 需要 Google Cloud Console 创建 OAuth 2.0 Client ID
4. 填入 Client ID 和 Client Secret

如果只用邮箱登录，这一步可以跳过。

---

## 第六步：在 Vercel 配置环境变量

1. 进入 Vercel Dashboard → 你的项目 → **Settings** → **Environment Variables**
2. 添加两个变量：
   - `VITE_SUPABASE_URL` = 你的 Project URL
   - `VITE_SUPABASE_ANON_KEY` = 你的 anon key
3. Redeploy

---

## 第七步：合并到 main

测试没问题后：

```bash
git checkout main
git merge backend
git push origin main
```

Vercel 会自动部署。

---

## 数据库结构说明

| 表名 | 用途 |
|---|---|
| `profiles` | 家长账号，关联 auth.users |
| `children` | 孩子档案（一个家长可以有多个孩子） |
| `word_progress` | 每个孩子的单词掌握进度 |
| `daily_records` | 每日学习记录（打卡、正确率） |
| `sentence_progress` | 句式练习进度 |
| `learning_sessions` | 每次学习会话记录 |
| `children_summary` | 统计视图，家长报告用 |

## Row Level Security (RLS)

所有表都配置了 RLS，确保：
- 家长只能看到自己孩子的数据
- 无法跨用户访问数据
- auth.uid() 自动识别当前登录用户
