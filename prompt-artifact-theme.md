# Prompt Artifact

主题文件：[prompt-artifact.css](prompt-artifact.css)。以当前 `artifacts_template` 的实际样式为基准，映射到 Typora 的 `#write`、CodeMirror 和 MathJax 结构，没有导入 Claudette 的其他风格。

## 安装

在 Typora 的「偏好设置 → 外观 → 打开主题文件夹」中放入 `prompt-artifact.css`，重启 Typora，再选择 **Prompt Artifact**。只需要这一份 CSS，不需要复制网站目录；本次只保存到项目根目录，没有修改已安装的 Typora 主题。

此电脑的主题目录为 `/Users/cbhua/Library/Application Support/abnerworks.Typora/themes/`。[Typora 官方主题说明](https://theme.typora.io/doc/Write-Custom-Theme/)记录了主题命名、安装及原生组件选择器。

## 保留的样式

- 正文：Lucida Grande，中文沿用系统黑体；响应式 12–14px，400 字重，1.75 行高，`#333333` 文字、`#FAF8EC` 背景。没有额外放大字号或加粗。
  - 测试文字，dot 间距是不是有一点太大了
    - 三级列表测试
- 宽度：与网页相同的 720–920px 响应式上限及两侧各 15px 内边距；窄窗口随可用宽度收缩。
- H1 / H2 / H3：原字号、字重、行距和间距；H1 下方 `1px #888888` 细线。
- 列表与链接：原缩进、间距、蓝色列表标记与粗体蓝色链接。
- 引用：整体正文 `1em`，Lucida Italic，`#BB3322` 竖线与淡色装饰引号，引用文字正常颜色。
- 表格：按内容定宽、居中，原 8px 单元格内边距、`#ddd` 网格线、浅色表头、8px 圆角、1.5em 底部间距。
- 图表说明：正文等宽、居中、`#777`、上下 8px 留白。
- 代码：Maple Mono，原字号、`#555555` 基础文字、灰色代码框及语法配色；把网站 Highlight.js 的分类对应到 Typora CodeMirror 的分类。
- 行间公式：居中、1.2em，不新增序号；MathJax 保留其数学符号字体。正文中的 `.font-serif` 使用 CMU Serif 与霞鹜新致宋。
- 页面没有字体偏好与许可 Footer，没有新增卡片、阴影或打印主题。

## 字体

主题使用 `local()` 调用本机完整字体，字体名称从当前网站使用的字体原件中读取；不导入只覆盖网页现有内容的子集，也不联网下载字体。Lucida 的普通、粗体、斜体和粗斜体分别声明，代码的拉丁字符与中文字体通过 `unicode-range` 分开。

需安装 Lucida Grande（含 Italic / Bold Italic）、CMU Serif、霞鹜新致宋、Maple Mono 和 Maple Mono NF CN。缺少字体时按 CSS 中声明的系统字体顺序回退；中文黑体保持系统字体。主题不分发字体原件。

## Typora 与网页结构的对应

网页的固定 Header、Template 标题与 Contents 弹出是网页导航；Typora 使用自己的标题栏与大纲。本主题没有用伪元素制造不可操作的导航，也没有覆盖编辑器的按钮、光标和语言选择控件。

原生 Markdown 没有通用 caption 语法，因此主题不会把任意相邻段落误判为图注。已有 HTML `figcaption` 可直接使用，也可在 Markdown 中明确写：

```html
<p class="caption">图 1. 图片说明与来源。</p>
```

表格说明也使用相同写法，放在表格前面。这样 caption 独立于表格的内容宽度，与正文等宽。继续使用参考页的 `figure.report-table` / `figcaption.table-caption` / `div.setup-table` / `table` HTML 结构也可。

公式用 `$$ ... $$`，不写 `\tag` 或自动编号命令；主题不通过隐藏公式 DOM 来删除作者写入的数学内容。网站中的手写 CMU 公式和 Typora 的 MathJax 排版器结构不同，数学符号的具体字形由 MathJax 决定。

## 手动调整

CSS 顶部 `:root` 集中放置字号、宽度、颜色、表头背景、圆角、公式字号和表格间距。文件末尾预留覆盖区域。默认值均对应当前模板。

### 验证范围

使用本机 Typora 自带的 `base.css` 加载本主题，在浏览器中与当前模板逐项对照字体、字号、字重、行距、配色、边框和间距，并检查六种窗口宽度。另检查 Typora 原生表格包装、CodeMirror 代码结构和公式容器。此验证不等同于已在 Typora 原生应用中安装并检查；不同平台的编辑控件与 MathJax 字形也不属于网页 DOM 的像素级复刻范围。

# Hello

使用本机 Typora 自带的 `base.css` 加载本主题，在浏览器中与当前模板逐项对照字体、字号、字重、行距、配色、边框和间距，并检查六种窗口宽度。另检查 Typora 原生表格包装、CodeMirror 代码结构和公式容器。此验证不等同于已在 Typora 原生应用中安装并检查；不同平台的编辑控件与 MathJax 字形也不属于网页 DOM 的像素级复刻范围。

训练语料规模为 14.8T tokens。报告按预训练、上下文扩展和训练后对齐三个阶段列出了 H800 GPU 使用量。<sup>[[1]](#ref-1)</sup>

表 1. 训练成本数据，摘录自原报告第 5 页 Table 1:

| 阶段       | H800 GPU 小时 | 估算费用 / USD |
| ---------- | ------------- | -------------- |
| 预训练     | 2,664,000     | $5,328,000     |
| 上下文扩展 | 119,000       | $238,000       |
| 训练后对齐 | 5,000         | $10,000        |
| 合计       | 2,788,000     | $5,576,000     |

> **统计口径。** 费用按每 H800 GPU 小时 2 美元估算，仅涵盖正式训练，不包括先前研究和消融实验。[来源 ↗](https://arxiv.org/pdf/2412.19437v2#page=5)
