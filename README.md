# Event Horizon Web

个人资料网站 - Next.js 版本

## 部署到 Vercel

### 步骤：

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Add New Project"
3. 选择 GitHub 仓库：`event-horizon-web`
4. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://mernrimzejytokybgbhc.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (从 Supabase 获取你的匿名密钥)
5. 点击 "Deploy"

### 环境变量说明：

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名密钥（可在 Supabase 控制台的 Settings > API 找到）

## 本地开发（需要修复 npm 问题）

```bash
# 安装依赖
npm install

# 创建 .env.local 文件
cp .env.local.example .env.local
# 编辑 .env.local 填入你的 Supabase 密钥

# 运行开发服务器
npm run dev
```

## 技术栈

- Next.js 14.1.0
- React 18.2.0
- TypeScript
- Tailwind CSS
- Supabase (数据库 + 存储)

## 注意事项

- 头像上传功能需要 Supabase Storage bucket "avatars"
- 数据库需要 "profiles" 表
