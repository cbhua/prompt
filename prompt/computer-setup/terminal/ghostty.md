# 配置 Ghostty

请按以下偏好配置 Ghostty。检查系统和已有安装，备份将要修改的配置，保留无关设置。按官方方式安装当前稳定版 Ghostty 和 `Maple Mono NF` 字体，不固定历史版本。

按 [官方配置文档](https://ghostty.org/docs/config) 将以下内容合并到 `~/.config/ghostty/config.ghostty`（设置了 `XDG_CONFIG_HOME` 时使用对应路径）。macOS 还需检查 `~/Library/Application Support/com.mitchellh.ghostty/` 下的配置，避免后加载的设置覆盖这些值。

```ini
font-family = Maple Mono NF
font-size = 14
font-thicken = true
font-feature = +calt
font-feature = +liga

theme = dark:GitHub Dark,light:GitHub Dark
window-theme = dark
macos-titlebar-style = tabs
window-padding-x = 12
window-padding-y = 10
window-padding-balance = true
background-opacity = 0.96
background-blur = macos-glass-clear

cursor-style = block
cursor-style-blink = false
cursor-click-to-move = true
mouse-hide-while-typing = true
copy-on-select = false

shell-integration = zsh
window-inherit-working-directory = true
tab-inherit-working-directory = true
split-inherit-working-directory = true
window-inherit-font-size = true
confirm-close-surface = true

macos-option-as-alt = true
macos-window-shadow = true

keybind = cmd+shift+r=reload_config
keybind = cmd+d=new_split:right
keybind = cmd+shift+d=new_split:down
keybind = cmd+alt+left=goto_split:left
keybind = cmd+alt+right=goto_split:right
keybind = cmd+alt+up=goto_split:up
keybind = cmd+alt+down=goto_split:down
```

以上以 macOS + zsh 为目标；其他桌面系统按官方文档适配平台专属选项和快捷键，shell 集成匹配实际 shell。纯 SSH 服务器无需安装 Ghostty GUI，应在本地电脑配置终端。

验证配置无错误、字体实际可用，检查深色主题、连字、透明背景、分屏快捷键和工作目录继承。重新加载后仍需新窗口或重启才能生效的设置应说明。交付时简述配置路径、验证结果和常用快捷键。
