# Prompt 页面原样模板

此目录直接复用**当前 Prompt 项目**，不重新设计其 CSS。

## 使用

给 coding agent：

> 使用 artifacts_template 模板，先读 TEMPLATE.md 和 AGENTS.md；将 template.html 作为新项目的 index.html，替换任务内容。原始 CSS 不修改；只有我明确要求的调整才写入 css/settings.css。

复制整个目录到新项目即可。index.html 是 DeepSeek-V3 参考页，template.html 是起始页。CONTENT.md 是参考页正文的可编辑 Markdown 副本；目前不自动同步 HTML。资源使用目录内相对路径，运行不依赖父项目。

## 原样复制的资源

- vendor/bootstrap/css/bootstrap.min.css：与当前项目逐字节一致。
- css/main.css：与当前项目逐字节一致，包括正文、标题、链接、列表、代码、高亮、表格、Footer 等规则。
- css/font-family.css：与当前项目逐字节一致，保留原始文件；页面不显示字体偏好组件。
- vendor/font-awesome/：当前项目的原始 CSS 与资源。
- 字体生成脚本、字体源配置、字体偏好和代码高亮脚本也直接复制当前项目。

source-manifest.json 记录复制资源的 SHA256。验证或同步：

```sh
python3 artifacts_template/scripts/sync_source_assets.py --check --source-root /path/to/prompt
python3 artifacts_template/scripts/sync_source_assets.py --source-root /path/to/prompt
```

同步后重新生成字体子集。已复制的模板运行不需要源项目。

## 明确要求的扩展

用户要求 Header 左侧为 Template，右侧为 Contents；不显示正文目录。js/contents.js 从 H2/H3 生成目录并处理弹出、关闭、跳转。css/template.css **只**负责弹出定位、滚动和手机上的两个控件显示，不定义正文、字号、字重、配色、阴影或报告组件样式。弹出菜单复用现成的 Bootstrap dropdown-menu。

正文结构使用当前项目已有的 success / container / row / col-lg-12 / page-main / setup-content，表格使用 setup-table，图片使用 Bootstrap img-responsive。

css/report.css 单独承载用户指定的 Claudette 元素：红色（#bb3322）的装饰引号和细竖线，引用使用 Lucida Italic，整个引用与正文同为 1em；表头浅底、8px 圆角，表格按内容定宽并居中，图表 caption 统一为正文区域等宽、文字居中；cite 使用正文字号、斜体、正常文字颜色；红色只用于引用装饰。表格放在 figure.report-table 中，figcaption.table-caption 位于 setup-table 滚动容器之外，并通过 aria-labelledby 关联表格。这里只借用这两类组件，不引入 Claudette 的其他排版或交互效果。

可在 report.css 顶部调整引号颜色、竖线颜色、表头底色、圆角、行间公式字号（默认 1.2em）和表格下方间距（默认 1.5em）。H1 下方复用源站 Scientific Writing 的 1px #888888 细线及 0.5em 底部留白；行间公式居中且不显示序号。其余组件沿用源站。

## 手动调整

css/settings.css 中的规则**全部留空**，按正文、标题、列表、代码、表格和 Header 分区。只有你手动填写时才覆盖源站，避免另一份默认参数与源站发生漂移。不要直接修改 css/main.css 或 Bootstrap 的复制文件。

TEMPLATE.md 是可编辑的内容约束；默认只记录已经明确提出的要求。

参考页和起始页均不显示底部“字体偏好与许可”区域；字体许可文件和底层本机 IPA 字体替换支持仍保留。

## 字体子集

完整字体不随包分发。字体路径在 scripts/font-sources.json；HTML 修改完后运行目录自己的脚本：

```sh
python3 -m venv /private/tmp/artifact-fonts-venv
/private/tmp/artifact-fonts-venv/bin/pip install -r artifacts_template/scripts/requirements-fonts.txt
/private/tmp/artifact-fonts-venv/bin/python artifacts_template/scripts/build_font_subsets.py
python3 artifacts_template/scripts/build_font_subsets.py --check
```

复制到新项目后换成该项目的脚本路径。字体原件不存在时不能生成缺失字形，应说明并使用系统回退，不把已有子集当完整字库。保留字体许可；Lucida 分发须在已有 Webfont 授权范围内。

## 预览

```sh
python3 -m http.server 8765 --directory artifacts_template
```

打开 http://localhost:8765/ 。SOURCE.md 记录参考页的报告、表格和图片来源。
