# 配置备用 Vim

请按以下偏好配置 Vim，作为 LazyVim / Neovim 之外的备用编辑器。检查已有环境，备份并合并 `~/.vimrc`，保留无关设置。安装当前稳定版 Vim（macOS 用 Homebrew，Linux 用系统包管理器），不安装第三方插件，不修改 Neovim 配置或将 `vim` 别名到 `nvim`。

## 基础设置

在 `~/.vimrc` 中启用以下配置：

```vim
set nocompatible
filetype plugin indent on
syntax enable
set encoding=utf-8
set fileencodings=utf-8,ucs-bom,gb18030,gbk,big5,latin1
set noerrorbells visualbell
set t_vb=

set number relativenumber cursorline laststatus=2 showcmd showmode showmatch
if has('termguicolors')
  set termguicolors
endif
set background=dark
colorscheme habamax
set scrolloff=5 sidescrolloff=5
set list
set listchars=tab:»·,trail:·,extends:›,precedes:‹,nbsp:␣
set nowrap wildmenu wildmode=longest:full,full

set expandtab shiftwidth=4 softtabstop=4 tabstop=4
set autoindent smartindent shiftround breakindent
set incsearch hlsearch ignorecase smartcase wrapscan
set backspace=indent,eol,start
set whichwrap+=<,>,h,l
set hidden mouse=a
if has('clipboard')
  set clipboard=unnamed
endif
set timeout timeoutlen=500 ttimeoutlen=20
set splitbelow splitright
let mapleader=" "
let maplocalleader=" "
```

创建 `~/.vim/undo`、`~/.vim/backup`、`~/.vim/swap`，启用以下设置；不迁移旧机器的历史、备份或 swap 文件：

```vim
if has('persistent_undo')
  set undofile
  set undodir=~/.vim/undo//
endif
set backup writebackup
set backupdir=~/.vim/backup//
set directory=~/.vim/swap//
```

## 快捷键

使用非递归映射，Leader 是空格：

| 按键 | 行为 |
| --- | --- |
| `Space w` / `Space q` / `Space x` | 保存 / 退出 / 保存并退出 |
| `Esc`（普通模式） | 清除搜索高亮 |
| `Space ev` / `Space sv` | 编辑 / 重新加载 `$MYVIMRC` |
| `<` / `>`（可视模式） | 缩进后保持选区，用 `<gv` / `>gv` |
| `J` / `K`（可视模式） | 选中行下移 / 上移，保持选区并重新缩进 |
| `n` / `N` | 搜索跳转后居中并展开折叠，用 `nzzzv` / `Nzzzv` |
| `Ctrl+d` / `Ctrl+u` | 半页移动后居中 |
| `Ctrl+h/j/k/l` | 切换分屏 |
| `Ctrl+↑/↓` | 分屏高度增加 / 减少 2 行 |
| `Ctrl+←/→` | 分屏宽度减少 / 增加 2 列 |
| `Space v` / `Space s` | 左右分屏 / 上下分屏 |
| `Space bn` / `Space bp` / `Space bd` | 下一个 / 上一个 / 删除 buffer |
| `Q` 和四个方向键（普通模式） | 映射为 `<Nop>`，使用 hjkl 移动 |

## 文件类型

使用带 `autocmd!` 的独立 augroup，确保重复加载不叠加：

- Python：4 空格缩进。
- JavaScript、TypeScript、JSON、HTML、CSS、YAML：`tabstop`、`shiftwidth`、`softtabstop` 均为 2。
- Markdown：`setlocal wrap linebreak spell`。
- Makefile：`setlocal noexpandtab`，使用真实 Tab。

## 验证与交付

检查 Vim 加载配置无错误，验证主题、快捷键、各文件类型缩进，以及关闭后重新打开仍可撤销。确认备份和 swap 写入指定目录。SSH 服务器没有系统剪贴板时保留功能判断并说明限制。交付时简述配置路径、验证结果和主要快捷键。
