# 产品展示与管理系统 - 单文件版

这是一个完全独立的单文件HTML应用，无需安装任何依赖，可以直接双击`index.html`文件在浏览器中运行。

## 功能特性

- **产品展示**：展示各种分类的产品信息，支持图片、标题、描述和链接
- **分类浏览**：按不同分类浏览产品
- **后台管理**：登录后可添加、编辑和删除产品
- **响应式设计**：适配各种屏幕尺寸
- **深色模式支持**：根据系统设置或用户偏好自动切换

## 如何运行

非常简单！直接双击根目录下的`index.html`文件即可在浏览器中打开应用。

## 管理账户

后台管理账户信息：
- 用户名：admin
- 密码：password

## 技术实现

- 纯HTML + CSS + JavaScript实现
- 使用localStorage进行数据存储（不依赖服务器）
- 内置模拟数据，首次打开即可看到产品展示
- 响应式设计，支持移动端和桌面端
- 现代UI设计，包含动画和交互效果

## 注意事项

- 由于浏览器的安全限制，某些功能（如本地文件读取）在不同浏览器中可能有所差异
- 使用localStorage存储数据，清除浏览器缓存或使用隐私模式可能导致数据丢失
- 如需部署到服务器，只需将`index.html`文件上传到您的Web服务器即可

这是一个基于 React + TypeScript + Vite 构建的现代化产品展示与管理系统，具有前后台分离的架构设计。

## 项目功能

- 🎯 产品展示：精美的产品卡片布局，支持分类浏览
- 🛠️ 后台管理：完整的产品CRUD操作（添加、查看、编辑、删除）
- 🔒 用户认证：管理员登录系统
- 💡 响应式设计：适配各种屏幕尺寸
- 🌙 深色模式：支持系统主题切换

## 项目结构

```
├── src/                  # 源代码目录
│   ├── components/       # 可复用组件
│   ├── contexts/         # React Context
│   ├── hooks/            # 自定义Hooks
│   ├── lib/              # 工具函数
│   ├── models/           # 数据模型
│   ├── pages/            # 页面组件
│   ├── services/         # API服务和数据处理
│   ├── App.tsx           # 应用入口组件
│   ├── index.css         # 全局样式
│   └── main.tsx          # 应用渲染入口
├── index.html            # HTML入口文件
├── package.json          # 项目依赖配置
├── tailwind.config.js    # Tailwind CSS配置
└── vite.config.ts        # Vite配置文件
```

## 技术栈

- **前端框架**: React 18+
- **编程语言**: TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **路由管理**: React Router
- **图标库**: Font Awesome
- **表单验证**: Zod
- **数据可视化**: Recharts (可选)
- **状态管理**: React Context API

## 快速开始

### 前提条件

确保您的系统已安装以下软件：

- Node.js (推荐 v16.x 或更高版本)
- npm、yarn 或 pnpm (本项目推荐使用 pnpm)

### 安装依赖

```bash
# 使用 pnpm
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

开发服务器启动后，打开浏览器访问 http://localhost:3000 即可查看应用。

### 构建生产版本

```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build

# 或使用 yarn
yarn build
```

构建后的文件会生成在 `dist` 目录中。

## 管理员账户

默认管理员账户信息：
- 用户名：admin
- 密码：password

## 为什么不能直接点击 index.html 运行？

这是因为：

1. **ES模块系统**：现代前端项目使用 ES 模块系统组织代码，浏览器在 file:// 协议下有安全限制，无法直接加载模块
2. **路由配置**：React Router 等路由库需要在服务器环境下才能正常工作
3. **构建过程**：项目需要经过构建、编译、打包等过程才能在浏览器中正确运行

因此，您需要通过开发服务器（如上述的 `pnpm dev` 命令）来运行项目。

## 浏览器兼容性

- Chrome (推荐最新版本)
- Firefox (推荐最新版本)
- Safari (推荐最新版本)
- Edge (推荐最新版本)

## License

MIT