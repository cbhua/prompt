# 配置 LazyVim

检查现有环境，备份已有 Neovim 配置，保留无关设置。按当前官方文档安装兼容的稳定版 Neovim、LazyVim 和所需依赖，不沿用历史版本号。

## 插件

使用 LazyVim 默认插件，提供文件搜索、补全、语法高亮、Git 标记、格式化、诊断和快捷键提示。

额外启用 Python、Markdown 和 mini-surround 支持，安装对应语言服务器、格式化工具，以及 ripgrep、fd、fzf、Tree-sitter CLI、lazygit 等辅助工具。Extras 应在默认插件之后、自定义插件之前导入。

## 黑色主题

使用 TokyoNight Night，自定义为：

- 主背景：`#0b0e14`。
- 侧栏背景：`#080b10`。
- 浮窗背景：`#10151c`。
- 前景：`#d8dee9`。
- 高亮采用 Nord 的蓝灰色系，与 herdr 深色界面协调。

启用 true color，保持不透明背景。只修改 Neovim 配色，保留 herdr 原配置。

## 浮动文件树

使用内置 Snacks Explorer，无需额外文件树插件。

将 `Space + e` 配置为打开项目根目录的居中浮动文件树：

- `layout = { preset = "default", preview = false }`
- `auto_close = true`
- `jump = { close = true }`

选中文件后关闭弹窗，在原编辑区域打开文件；平时不占用左侧空间。

保留 `Space + f + e` 的原侧栏行为。将浮动文件树快捷键覆盖放在独立 Lua 配置文件中，便于禁用和撤回。

启动行为也应统一：`nvim` 和 `nvim .` 默认打开居中浮动文件树，选中文件后自动关闭，并在原编辑区域打开。仅覆盖 `Space + e` 不会改变 `nvim .` 的默认侧栏行为，因此应将 Snacks Explorer 的默认布局设为浮窗，为无参数启动补充自动打开逻辑，并显式保留 `Space + f + e` 的侧栏配置。直接运行 `nvim 文件名` 时不弹出文件树。验证时覆盖这三种启动方式。

## 验证与交付

验证正常启动、主题生效、补全与语言服务器工作，以及 `Space + e` 弹窗和文件跳转自动关闭行为。

说明如何启动、常用快捷键和撤回方法。依赖版本与平台安装细节由执行 agent 根据当前环境确定。

## 配置 Render Markdown

使用 `MeanderingProgrammer/render-markdown.nvim`，默认在 Neovim 内渲染 Markdown。先检查 LazyVim Markdown Extra 是否已包含该插件，避免重复安装，并确保 `markdown`、`markdown_inline` Tree-sitter parser 可用。

将自定义配置放在独立 Lua 文件中：

- 默认开启渲染，普通模式预览、插入模式编辑源码。
- 设置 `anti_conceal = { enabled = false }`，普通模式下光标所在行也保持渲染。
- 显式启用标题层级标记、完整表格边框和任务复选框，避免沿用 LazyVim 隐藏标题图标的设置。
- 保留 `Space + u + m` 切换渲染。

关闭 Markdown 的 lint、语言服务器诊断和拼写检查，包括格式化流程中的 `markdownlint`；保留语法高亮和格式化，其他语言不受影响。

使用实际 README 验证两条路径：直接打开文件，以及 `nvim .` 后从文件树打开。检查标题、列表、表格和代码块，不能只确认插件加载成功。

说明渲染边界：支持标准 Markdown 排版，但不能像浏览器一样完整呈现 HTML 表格、图片布局和折叠组件；此类内容需要浏览器预览。
