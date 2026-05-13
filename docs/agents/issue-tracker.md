# Issue Tracker

Issues 存放在 GitHub Issues 中，通过 `gh` CLI 操作。

## Repository

- Owner: duyc392
- Repo: 待创建（当前为本地 git 仓库，尚未关联 GitHub remote）
- CLI: `gh issue` (v2.92.0+)

## Commands

```
gh issue list        # 列出所有 issues
gh issue view <num>  # 查看单个 issue
gh issue create      # 创建新 issue
gh issue comment <num> --body "..."  # 评论
gh issue edit <num> --add-label "label"  # 加 label
gh issue close <num> # 关闭 issue
```

## Labels

参见 `docs/agents/triage-labels.md`。
