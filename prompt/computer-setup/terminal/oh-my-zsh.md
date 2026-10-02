# 配置 Oh My Zsh

请按以下偏好配置 Zsh 环境。检查现有系统，备份将要修改的 `.zshrc`、`.zprofile`、`.p10k.zsh`，合并配置并保留无关设置；重复执行不应重复追加内容。按 [Oh My Zsh 官方说明](https://github.com/ohmyzsh/ohmyzsh) 安装 Zsh、Oh My Zsh，并将当前用户的默认 shell 设为 Zsh。

## 工具与插件

macOS 使用 Homebrew 安装现代终端工具（使用 fastfetch，不再安装 neofetch）：

```sh
brew install git curl wget tree htop btop ripgrep fd fzf bat eza fastfetch
```

在加载 Oh My Zsh 前完成 Homebrew `shellenv` 初始化，按实际安装路径适配 Apple Silicon / Intel，避免重复初始化。Linux 使用系统包管理器安装对应工具，处理 `batcat`、`fdfind` 等命令名称差异；不加载 macos 插件，未使用 Homebrew 时也不加载 brew 插件。

安装两个自定义插件，目录已存在时检查并复用：

```sh
git clone https://github.com/zsh-users/zsh-autosuggestions \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"
git clone https://github.com/zsh-users/zsh-syntax-highlighting \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting"
```

在 `.zshrc` 中设置以下插件，再加载 `source "$ZSH/oh-my-zsh.sh"`。保持语法高亮插件最后加载：

```zsh
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(
  git macos brew sudo history colored-man-pages command-not-found
  z extract fzf zsh-autosuggestions zsh-syntax-highlighting
)
```

这些插件提供 Git 别名、macOS 工具、Homebrew 补全、双击 Esc 添加 sudo、历史辅助、彩色 man、缺失命令安装建议、常用目录跳转、统一解压、模糊搜索、历史建议和语法高亮。`command-not-found` 需检查当前平台的后端支持。

## 额外 `.zshrc` 设置

```zsh
HISTFILE="$HOME/.zsh_history"
HISTSIZE=50000
SAVEHIST=50000
setopt APPEND_HISTORY SHARE_HISTORY HIST_IGNORE_DUPS HIST_IGNORE_SPACE
setopt HIST_REDUCE_BLANKS HIST_VERIFY
setopt AUTO_CD AUTO_PUSHD PUSHD_IGNORE_DUPS COMPLETE_IN_WORD
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'
zstyle ':completion:*' menu select

alias reload='source ~/.zshrc'
alias zshconfig='vim ~/.zshrc'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias c='clear'
alias mkdir='mkdir -p'
alias ls='eza'
alias ll='eza -lah --group-directories-first'
alias la='eza -a'
alias lt='eza --tree --level=2'
alias cat='bat'
alias grep='grep --color=auto'
alias brewup='brew update && brew upgrade && brew cleanup'

typeset -U path PATH
path=("$HOME/.local/bin" $path)
export PATH
```

仅在对应工具可用时启用别名；没有 Homebrew 时省略 `brewup`。fzf 补全和快捷键只初始化一次：优先由 Oh My Zsh 的 fzf 插件加载；若插件未提供，才补充 `source <(fzf --zsh)` 或当前版本支持的初始化方式。保留 `Ctrl+r` 搜索历史、`Ctrl+t` 选择文件、`Alt+c` 跳转目录。

## Powerlevel10k

按 [官方说明](https://github.com/romkatv/powerlevel10k) 将主题安装到 `${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k`，配置写入 `~/.p10k.zsh`。使用 Pure 风格的简洁单行提示符：

- 左侧依次为 `context dir vcs command_execution_time virtualenv prompt_char`；右侧为空，不额外插入空行。
- 透明背景，段落以空格分隔，无分段图标和装饰分隔符。
- 目录蓝色 `#57C7FF`；成功提示符 `❯` 为粉色 `#FF6AC1`，失败为红色 `#FF5C57`。
- `user@host` 仅在 SSH 或 root 时显示。Git 显示分支、脏状态 `*` 和 ahead/behind 箭头，不显示远端分支、tag、stash。
- 命令耗时达到 5 秒才显示，整数秒、黄色 `#F3F99D`；Python 虚拟环境显示名称，不显示 Python 版本。
- `POWERLEVEL9K_TRANSIENT_PROMPT=always`，`POWERLEVEL9K_INSTANT_PROMPT=verbose`。

将 instant prompt 初始化块放在 `.zshrc` 顶部附近，必须询问输入的初始化放在它之前；文件末尾加载 `[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh`。若使用 Ghostty，沿用 `Maple Mono NF` 字体；SSH 场景字体配置在本地终端。

## 验证与交付

运行 `zsh -n ~/.zshrc` 和 `zsh -n ~/.p10k.zsh`，检查新的交互式登录 shell 无报错或 instant prompt 警告。验证工具命令、主题、Tab 补全、历史建议、语法高亮和 fzf 快捷键；配置不能每次启动自动运行 fastfetch。不迁移旧历史、密钥或写死 旧电脑的用户路径。简述修改位置、验证结果及重开终端／`reload` 的使用方法。
