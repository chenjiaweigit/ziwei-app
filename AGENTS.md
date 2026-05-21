# 紫微命盘 (Ziwei Master)

## 项目简介
倪海夏《天纪》体系的紫微斗数排盘 Web 应用，支持命盘计算、四化系统、格局知识库、AI 解盘、合盘分析、用户系统。

- **仓库**: https://github.com/chenjiaweigit/ziwei-app
- **许可**: MIT
- **语言**: 简体中文
- **当前阶段**: Phase 1 核心功能完成 + 天纪模块详情页开发完成，`npm run build` 通过

## 技术栈
- **框架**: Next.js 15 (App Router, TypeScript 5)
- **样式**: Tailwind CSS 3.4 + CSS 变量 (暗/亮主题)
- **排盘引擎**: `iztro` ^2.5.8 + `lunar-javascript` ^1.7.3
- **AI**: OpenAI 兼容协议 (默认 DeepSeek/OpenRouter)，SSE 流式输出
- **动画**: Framer Motion ^11.3
- **数据库**: JSON 文件 (`data/db.json`)，无外部依赖
- **认证**: JWT (`jsonwebtoken` ^9.0.3)
- **部署**: Cloudflare Pages (支持 `npm run build:cf`)

## 目录结构
```
app/                # Next.js App Router 页面和 API 路由
  ├── api/          # 后端 API (auth, generate, interpret, heming, payment, user/history)
  ├── chart/        # 排盘页面 (表单 -> 命盘 -> AI 解读)
  ├── heming/       # 合盘分析页面
  ├── knowledge/    # 知识库 (14主星 x 13宫位 = 182 静态页面)
  ├── library/      # 古籍库 (紫微斗数全书/全集, 骨髓赋)
  ├── preview/      # 滚动介绍页面
  ├── terms/        # 服务条款
  ├── privacy/      # 隐私政策
  ├── tianji/       # 天纪模块（含 [slug] 详情 + episodes 课程序幕）
  ├── diji/         # 地纪模块（模块列表）
  ├── renji/        # 人纪模块（模块列表）
  └── me/           # 个人中心（占位页）
components/         # React 组件 (BirthForm, ChartBoard, PalaceCell, InsightPanel 等)
lib/
  ├── ziwei/        # 核心排盘引擎、类型、常量、四化、格局、城市数据
  ├── ai/           # LLM 客户端、提示词、解盘上下文提取
  ├── classics/     # 古籍数据 (3本) + 全文搜索
  ├── nihai/        # 倪海夏课程体系 (天/地/人纪)
  ├── seo/          # SEO 辅助
  ├── auth.ts       # JWT 工具
  └── db.ts         # JSON 文件数据库 CRUD
data/               # db.json 自动生成
```

## 常用命令
| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (localhost:3000) |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run build:cf` | 构建 Cloudflare Pages |
| `npm run preview:cf` | 预览 Cloudflare Pages |

## 启动方式
```bash
npm install
cp .env.example .env.local  # 配置 AI API Key
npm run dev
```

## 环境变量

### AI 服务（多 slot 容灾）
支持 **3 个 provider slot**，依次切换：`PRIMARY → PROVIDER1 → PROVIDER2`。  
每个 slot 内按 `{SLOT}_AI_RETRY_COUNT` 重试，失败后无感切到下一个。

| 变量 | 示例 | 说明 |
|------|------|------|
| `PRIMARY_PROVIDER` | `deepseek` | 标识名，仅用于日志 |
| `PRIMARY_BASE_URL` | `https://api.deepseek.com/v1` | API 地址（必填） |
| `PRIMARY_API_KEY` | `sk-xxx` | API Key（必填） |
| `PRIMARY_MODEL` | `deepseek-chat` | 模型名，默认 `gpt-4o-mini` |
| `PRIMARY_RETRY_COUNT` | `1` | 失败后重试次数（默认 `1`） |

`PROVIDER1_*` / `PROVIDER2_*` 同结构，不配置即跳过。

### 旧版变量（已弃用）
- `AI_PROVIDER` / `DEEPSEEK_API_KEY` / `AI_MODEL` → 自动映射到 `PRIMARY_*`
- `MIMO_API_KEY` / `MIMO_BASE_URL` → 自动映射到 `PROVIDER1_*`

### 其他
- `JWT_SECRET` - JWT 密钥 (生产环境必改)
- `NEXT_PUBLIC_SITE_URL` - 站点 URL

## 核心流程
1. **排盘**: BirthForm -> formToBirthInfo() -> POST /api/generate -> iztro.astro.bySolar() -> ZiweiChart -> ChartBoard 渲染
2. **AI 解盘**: POST /api/interpret -> extractChartContext() -> LLM SSE 流式输出 -> InsightPanel 展示
3. **格局检测**: lib/ziwei/patterns.ts (~35个格局, 分优秀/良好/普通/警示四级)
4. **四化**: 支持本命/大限/流年/流月四化, 自化追踪, 来因宫追查

## 会员体系
| 功能 | 免费 | Pro (29.9/月) | 终身 (99.9) |
|------|------|---------------|-------------|
| 排盘 | 3次/天 | 不限 | 不限 |
| AI解盘 | 3次/天 | 不限 | 不限 |
| 合盘 | - | ✓ | ✓ |
| 云历史 | - | ✓ | ✓ |

## API 路由
- `POST /api/generate` - 排盘 (无需认证)
- `POST /api/interpret` - AI 解盘 SSR (可选认证, 限流)
- `POST /api/heming` - AI 合盘 SSR (无需认证)
- `POST /api/auth/register|login` - 注册/登录
- `GET /api/auth/me` - 获取当前用户 (需认证)
- `GET|POST|DELETE /api/user/history` - 历史记录 CRUD (需认证)
- `POST|GET /api/payment` - 支付/查询会员状态 (需认证)

## 注意事项
- 无测试框架，无测试文件
- pre-commit hooks: 中文标点 lint (`scripts/zh-punct-lint.mjs`)
- CSS 设计系统在 `globals.css`，含金色主题色和四化语义色
- 使用 `.npmrc` 启用 `legacy-peer-deps=true`
