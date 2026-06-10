# 首经贸留学助手

首经贸专属 AI 留学选校助手网页应用。项目使用 React + TypeScript + Tailwind CSS，聚焦通过高考进入首经贸的普通本科生毕业后申请海外硕士，不纳入国际本科、2+2、预科项目路径。

当前版本包含：

- 多页滑动式使用介绍
- 注册/登录 UI 占位
- 学业背景填写表单
- 多国家/地区选择
- 规则系统生成冲刺校、匹配校、保底校
- 学校中文名、英文名、官网链接、项目/招生链接
- 本地 35 条案例库 mock 数据
- DeepSeek AI 深度分析接口
- Vercel Serverless API
- EdgeOne Pages Functions 适配，用于中国大陆更友好的访问部署

## 项目结构

```text
.
├── api
│   └── deepseek-analysis.ts
├── cloud-functions
│   └── api
│       └── deepseek-analysis
│           └── index.ts
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   ├── components
│   │   ├── IntroCarousel.tsx
│   │   ├── LoginModal.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── ResultPanel.tsx
│   │   └── SideMenu.tsx
│   ├── data
│   │   ├── formOptions.ts
│   │   ├── offerCases.ts
│   │   └── schoolDatabase.ts
│   ├── lib
│   │   ├── deepseekPrompt.ts
│   │   ├── recommendation.test.ts
│   │   └── recommendation.ts
│   └── types
│       └── application.ts
├── scripts
│   ├── build.ps1
│   ├── dev.ps1
│   └── test.ps1
├── vercel.json
└── vite.config.ts
```

## 本地启动

```bash
npm install
npm run dev
```

如果当前 Windows 环境没有全局 `node/npm`，但项目依赖已经安装，可以运行：

```powershell
.\scripts\dev.ps1
```

## 测试与构建

```bash
npm run test
npm run build
```

当前 Windows 环境也可以使用：

```powershell
.\scripts\test.ps1
.\scripts\build.ps1
```

## 环境变量

```env
DEEPSEEK_API_KEY=你的 DeepSeek Key
```

不要把这个 Key 写进前端代码，也不要提交到 Git。

## Vercel 部署

Vercel 支持本项目的 `/api/deepseek-analysis`，但在中国大陆网络下访问可能不稳定。

配置：

- Framework Preset: `Vite`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Environment Variable: `DEEPSEEK_API_KEY`

当前 Vercel 地址：

```text
https://cueb-study-abroad-assistant.vercel.app/
```

## 中国大陆访问方案

如果用户主要在中国大陆访问，不建议只依赖 Vercel 或 GitHub Pages。推荐使用腾讯云 EdgeOne Pages：

1. 打开腾讯云 EdgeOne Pages。
2. 选择从 GitHub 导入仓库 `cueb-study-abroad-assistant`。
3. 构建命令填写：

```bash
pnpm install --frozen-lockfile && pnpm build
```

4. 输出目录填写：

```text
dist
```

5. 在环境变量中添加：

```text
DEEPSEEK_API_KEY=你的 DeepSeek Key
```

6. EdgeOne 会读取 `cloud-functions/api/deepseek-analysis/index.ts`，提供同名接口：

```text
/api/deepseek-analysis
```

7. 前端无需改代码，按钮仍然请求 `/api/deepseek-analysis`。

说明：

- 如果使用中国大陆服务器或大陆 CDN 绑定自有域名，通常需要 ICP 备案。
- 如果暂时没有备案，可以先使用 EdgeOne Pages 分配的默认域名或香港/海外线路。
- 最稳的长期方案是：自有域名备案后接入国内 CDN，同时后端函数继续保护 DeepSeek Key。

## DeepSeek AI 接入点

- 前端按钮位于推荐结果下方的“AI 留学分析助手”模块。
- 前端请求路径：`/api/deepseek-analysis`
- Vercel 后端文件：`api/deepseek-analysis.ts`
- EdgeOne 后端文件：`cloud-functions/api/deepseek-analysis/index.ts`
- 共享提示词逻辑：`src/lib/deepseekPrompt.ts`
- 模型：`deepseek-chat`

AI 分析输入包括：

- 用户填写的 GPA、专业、语言成绩、预算、地区
- 当前系统推荐出的冲刺校、匹配校、保底校
- 本地案例库数据

AI 被约束为不编造录取案例；如果案例库没有对应样本，必须明确提示“案例库暂无对应样本”。

## 真实录取案例 Excel 接入位置

- 将 Excel 字段映射到 `src/types/application.ts` 中的 `OfferCase`。
- 建议 Excel 增加 `pathway`、`sourceType`、`sourceUrl`、`sourceTitle` 字段。
- 导入时过滤“国际本科”“2+2”“预科”“留学基地”等非普通本科路径。
- 早期可用脚本生成 `src/data/offerCases.ts`。
- 后期建议落库到 Postgres/Supabase，再通过 API 获取案例。
