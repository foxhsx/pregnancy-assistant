
## [2026-03-05] 回归问题：JS语法错误

**问题：** 之前的尝试破坏了 `src/js/main.js` 语法，导致 "Unexpected end of input"

**影响：** 阻塞所有后续任务的执行

**解决方案：**
1. 识别缺失的函数闭合大括号
2. 在 `initKeyboardNavigation()` 函数末尾添加 `}`
3. 验证 `node --check` 通过

**状态：** ✅ 已解决

**预防措施：** 
- 修改JS后必须运行 `node --check` 验证语法
- 使用 LSP diagnostics 在编辑后立即检查

## [2026-03-08] 验证环境问题：HTML 的 LSP diagnostics 无法启动

**问题：** `lsp_diagnostics` 检查 `src/first-trimester-safety.html` 时，工作区配置指向 `biome`，但当前环境未安装该命令。

**影响：** 本次 HTML 改动无法拿到工具级 LSP clean 结果，只能先用 HTML 解析和关键词检查补位验证。

**已采取措施：**
1. 运行 `HTMLParser` 做结构解析，确认标记未破坏
2. 运行关键词检查，确认 `NT`、`建档`、`检查时间线/阶段安排` 与异常动作词都存在

**后续建议：**
- 若后续还要对 HTML 做 LSP 校验，需要先安装 `@biomejs/biome`，否则 `lsp_diagnostics` 会继续直接失败
