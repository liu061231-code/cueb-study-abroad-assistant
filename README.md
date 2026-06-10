# 首经贸留学助手

首经贸专属 AI 留学选校助手网页应用。当前版本使用 React + TypeScript + Tailwind CSS，聚焦高考进入首经贸的普通本科生毕业后申请海外硕士，不纳入国际本科/2+2/预科项目路径。案例库包含公开可追溯案例与模拟补充样本，共 35 条，用规则系统生成冲刺校、匹配校、保底校、成功率估计、推荐理由、材料清单和时间规划。

## 项目目录结构

```text
.
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ src
   ├─ App.tsx
   ├─ main.tsx
   ├─ styles.css
   ├─ components
   │  ├─ ArchitectureNotes.tsx
   │  ├─ CaseLibrary.tsx
   │  ├─ ChatPreview.tsx
   │  ├─ ExamplePromptBar.tsx
   │  ├─ Hero.tsx
   │  ├─ ProfileForm.tsx
   │  └─ ResultPanel.tsx
   ├─ data
   │  ├─ examplePrompts.ts
   │  └─ offerCases.ts
   ├─ lib
   │  ├─ mockAi.ts
   │  ├─ recommendation.test.ts
   │  └─ recommendation.ts
   ├─ test
   │  └─ setup.ts
   └─ types
      └─ application.ts
└─ scripts
   ├─ build.ps1
   ├─ dev.ps1
   └─ test.ps1
```

## 启动方式

```bash
npm install
npm run dev
```

打开 Vite 输出的本地地址，通常是 `http://127.0.0.1:5173`。

如果当前 Windows 环境没有全局 `node/npm`，但已经保留本项目的 `node_modules`，可以直接运行：

```powershell
.\scripts\dev.ps1
```

## 检查命令

```bash
npm run test
npm run build
```

当前 Windows 环境也可以使用：

```powershell
.\scripts\test.ps1
.\scripts\build.ps1
```

## 后续优化建议

- 增加账号体系，保存每位学生的背景档案和多轮方案版本。
- 给案例库加后台管理，支持按学院、专业、年份、地区和项目方向筛选。
- 把规则推荐拆成可配置权重，方便顾问调整不同地区的申请策略。
- 增加文书素材提纲、推荐信素材清单和申请进度看板。
- 增加免责声明和人工顾问复核入口，避免把概率估计误解为录取承诺。

## OpenAI API 接入位置

- `src/lib/mockAi.ts`：把 mock 回复替换为后端接口，例如 `/api/ai-advice`。
- 后端接口可以接收 `ApplicantProfile`、`AnalysisResult`、`matchedCases`，让模型生成更自然的解释、追问和文书建议。
- 推荐保留 `src/lib/recommendation.ts` 的规则结果作为模型输入，避免完全依赖大模型做确定性选校。

## 真实录取案例 Excel 接入位置

- 将 Excel 字段映射为 `src/types/application.ts` 中的 `OfferCase`。
- 建议 Excel 增加 `pathway`、`sourceType`、`sourceUrl`、`sourceTitle` 字段，区分普通本科公开案例、内部授权案例和模拟样本。
- 导入时过滤掉“国际本科”“2+2”“预科”“留学基地”等非普通本科路径。
- 用构建脚本或后台接口读取 Excel，替换 `src/data/offerCases.ts`。
- 后续可落库到 Postgres/Supabase，前端通过 API 获取案例，而不是打包进前端代码。
