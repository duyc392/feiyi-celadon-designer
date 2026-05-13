# Domain Docs

## Layout: Single-context

```
/
├── CONTEXT.md          ← 领域术语表
└── docs/
    ├── adr/            ← 架构决策记录
    └── agents/         ← Agent skills 配置（本目录）
```

## Consumer rules

以下 skills 会读取这些文件：

- `improve-codebase-architecture` — 读取 CONTEXT.md 和 docs/adr/，用领域语言命名 deep modules，遵守既有 ADR
- `grill-with-docs` — 对照 CONTEXT.md 术语表挑战计划中的模糊语言
- `diagnose` — 读取 CONTEXT.md 理解代码中的领域概念
- `tdd` — 读取 CONTEXT.md 确保测试描述使用领域语言
- `to-issues` / `to-prd` — 读取 CONTEXT.md，issue/PRD 中使用规范术语
- `triage` — 读取 CONTEXT.md 和 docs/adr/，评估 issue 时提供领域上下文
