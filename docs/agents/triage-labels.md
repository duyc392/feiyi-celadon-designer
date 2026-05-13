# Triage Labels

五个 triage state machine labels 映射：

| Role | GitHub Label |
|---|---|
| `needs-triage` | `待评估` |
| `needs-info` | `待补充` |
| `ready-for-agent` | `AI可接手` |
| `ready-for-human` | `需人工` |
| `wontfix` | `不处理` |

## 状态流转

```
未标记 → 待评估 → 待补充 / AI可接手 / 需人工 / 不处理
待补充 → (reporter回复后) → 待评估
```

- `bug` 和 `enhancement` 是 category labels，与 state labels 并存
- 每个 issue 同时携带一个 category 和一个 state
