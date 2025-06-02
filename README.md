# OneKey 产品反馈系统

这是一个简单的产品反馈系统，允许用户提交对 OneKey 产品的反馈和建议。

## 功能特点

- 用户无需登录即可提交反馈
- 类似推特的界面设计
- 管理员后台支持评论管理
- 支持评论分类和状态标记

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL (Neon)

## 开发环境设置

1. 克隆项目
```bash
git clone [项目地址]
cd fuckonekey
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env` 文件并添加以下配置：
```
DATABASE_URL="postgresql://your-username:your-password@your-neon-host/your-database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. 初始化数据库
```bash
npx prisma db push
```

5. 启动开发服务器
```bash
npm run dev
```

## 部署

1. 在 Vercel 上创建新项目
2. 连接 GitHub 仓库
3. 配置环境变量
4. 部署

## 管理员访问

访问 `/admin` 路径进入管理后台，默认密码为 `admin123`（请在生产环境中修改）。

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT
