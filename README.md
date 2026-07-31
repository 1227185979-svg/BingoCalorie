# BingoCalorie 🔥

智能饮食热量追踪应用 - 支持食物图片上传识别、每日热量计算、周月年统计和身体数据管理。

## 功能

- 📸 上传饮食照片，AI 智能识别食物
- 🔥 自动计算每餐热量
- 📊 周/月/年度热量统计图表
- 📅 日历视图查看历史记录
- ⚖️ BMR/TDEE 计算（基于身高体重年龄等）
- 🎯 减重目标规划

## 本地运行

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建生产版本
pnpm run build

# 预览构建结果
pnpm run preview
```

## 部署到 Vercel

1. Fork 或 Push 本项目到你的 GitHub
2. 在 [Vercel](https://vercel.com) 导入该仓库
3. Framework Preset 选择 `Vite`
4. 点击 Deploy，等待部署完成

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts
- localStorage（离线数据存储）
