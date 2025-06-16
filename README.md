# Teacher Tools

一个基于 Electron + React + TypeScript 开发的教师工具桌面应用。

## 技术栈

- Electron
- React 19
- TypeScript
- TailwindCSS
- Vite
- React Router DOM
- docx (文档处理)
- xlsx (表格处理)

## 开发环境要求

- Node.js (推荐使用 pnpm 作为包管理器)
- VSCode (推荐)
  - ESLint 插件
  - Prettier 插件
  - Tailwind CSS IntelliSense 插件

## 项目设置

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 类型检查

```bash
# 检查 Node 端类型
pnpm typecheck:node

# 检查 Web 端类型
pnpm typecheck:web

# 检查所有类型
pnpm typecheck
```

### 代码格式化

```bash
pnpm format
```

### 代码检查

```bash
pnpm lint
```

## 构建应用

### 开发构建（不打包）

```bash
pnpm build:unpack
```

### 生产构建

```bash
# Windows
pnpm build:win

# macOS
pnpm build:mac

# Linux
pnpm build:linux
```

## 发布新版本

```bash
pnpm release
```

## 项目结构

```
src/
├── main/        # Electron 主进程代码
├── preload/     # 预加载脚本
├── renderer/    # React 渲染进程代码
└── shared/      # 共享代码和类型定义
```

## 主要功能

- 文档处理（基于 docx）
- 表格处理（基于 xlsx）
- 自动更新
- 数据持久化（electron-store）
