# 紫微命盘 · 倪海夏正宗紫微斗数

基于 **倪海夏《天纪》** 教学体系的紫微斗数命理小程序，包含完整排盘算法、四化系统、格局知识库、AI 命盘解读、合盘分析、用户系统。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + CSS Variables 设计系统 + 暗色/亮色主题 |
| 排盘核心 | iztro + lunar-javascript |
| AI | OpenAI 兼容协议（默认 DeepSeek） |
| 存储 | JSON 文件数据库（data/db.json） |
| 认证 | JWT |
| 动画 | Framer Motion |

## 快速开始

```bash
# 克隆
git clone https://github.com/chenjiaweigit/ziwei-app.git
cd ziwei-app

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 AI API Key

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
├── app/
│   ├── api/
│   │   ├── generate/route.ts      # 命盘生成接口
│   │   ├── interpret/route.ts     # AI 命盘解读（SSE 流式）
│   │   ├── heming/route.ts        # 合盘分析（SSE 流式）
│   │   ├── auth/
│   │   │   ├── register/route.ts  # 手机号注册
│   │   │   ├── login/route.ts     # 手机号登录
│   │   │   └── me/route.ts        # 获取当前用户
│   │   ├── user/history/route.ts  # 命盘历史 CRUD
│   │   └── payment/route.ts       # 会员支付
│   ├── page.tsx                   # 首页
│   ├── chart/page.tsx             # 排盘页
│   ├── heming/page.tsx            # 合盘页
│   ├── knowledge/                 # 命理百科（14主星×13宫位）
│   └── library/                   # 古籍阅读器
├── components/
│   ├── BirthForm.tsx              # 出生日期表单
│   ├── ChartBoard.tsx             # 命盘棋盘
│   ├── InsightPanel.tsx           # AI 解读面板
│   ├── PatternsCard.tsx           # 格局展示卡
│   └── ...
├── lib/
│   ├── ziwei/
│   │   ├── algorithm.ts           # 排盘算法引擎
│   │   ├── constants.ts           # 星曜/天干地支常量
│   │   ├── patterns.ts            # 1100+行格局知识库
│   │   ├── sihua.ts               # 四化系统
│   │   ├── heming-knowledge.ts    # 合盘知识库
│   │   └── types.ts               # TypeScript 类型定义
│   ├── ai/
│   │   ├── prompts.ts             # AI 提示词模板
│   │   ├── knowledge.ts           # 命盘上下文提取
│   │   └── interpret.ts           # LLM 客户端封装
│   ├── auth.ts                    # JWT 认证
│   └── db.ts                      # JSON 文件数据库
├── data/db.json                   # 数据存储文件（自动生成）
└── .env.local                     # 环境变量配置
```

## 环境变量

| 变量 | 说明 | 默认值 |
|---|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | - |
| `AI_PROVIDER` | AI 提供商（deepseek/mimo） | deepseek |
| `MIMO_API_KEY` | 其他 OpenAI 兼容 API 密钥 | - |
| `MIMO_BASE_URL` | 自定义 API 地址 | - |
| `AI_MODEL` | AI 模型名 | deepseek-chat |
| `JWT_SECRET` | JWT 签名密钥 | dev-secret-change-in-production |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL | http://localhost:3000 |

## API 接口一览

| 方法 | 路径 | 说明 | 认证 |
|---|---|---|---|
| POST | /api/generate | 生成紫微命盘 | 否 |
| POST | /api/interpret | AI 命盘解读（SSE 流式） | 可选 |
| POST | /api/heming | 合盘分析（SSE 流式） | 否 |
| POST | /api/auth/register | 手机号注册 | 否 |
| POST | /api/auth/login | 手机号登录 | 否 |
| GET | /api/auth/me | 获取当前用户 | 是 |
| GET | /api/user/history | 命盘历史列表 | 是 |
| POST | /api/user/history | 保存命盘历史 | 是 |
| DELETE | /api/user/history | 删除命盘历史 | 是 |
| POST | /api/payment | 会员支付/升级 | 是 |
| GET | /api/payment | 查询会员状态 | 是 |

## 会员体系

| 功能 | 免费版 | Pro 会员 |
|---|---|---|
| 紫微排盘 | 每日 3 次 | 无限次 |
| AI 解读 | 每日 1 次 | 全主题无限 |
| 合盘分析 | ❌ | ✅ |
| 云端历史 | ❌ | ✅ |

## 开源协议

MIT License
