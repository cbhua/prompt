# 配置 Herdr

请在这台服务器上按以下偏好配置 Herdr。检查系统与已有安装，备份将要修改的配置，保留无关设置。

1. 按 [Herdr 官方指南](https://herdr.dev/agent-guide.md) 安装适合当前系统和架构的最新稳定版，使用 stable 更新通道，不固定历史版本。优先安装到 `~/.local/bin`，确保交互式 shell 的 PATH 包含该目录，使用当前用户运行。
2. 将以下配置合并到 `~/.config/herdr/config.toml`；若设置了 `HERDR_CONFIG_PATH`，使用实际配置路径：

```toml
onboarding = false

[ui]
sidebar_collapsed_mode = "compact"

[theme]
name = "vesper"
auto_switch = false
```

3. 其余使用 Herdr 默认设置，包括快捷键与 shell 行为。侧栏折叠后显示窄状态栏，不强制启动时折叠。
   本地终端使用 `MapleMono-NF-CN-unhinted` 字体版本（包含中文和 Nerd Font 特殊符号）。字体安装并配置在运行 Herdr 客户端的本地电脑上；使用 Ghostty 时确认实际字体 family 名称并设置 `font-family`，纯 SSH 服务器无需安装字体。
4. 为已安装的 agent 安装或更新官方状态集成：Codex CLI 使用 `herdr integration install codex`，Claude Code 使用 `herdr integration install claude`。保留已有 agent 配置；在 Herdr pane 内运行 `codex` 或 `claude`，确认侧栏能识别 agent 并显示状态。无需额外安装其他 agent 的集成。
5. 已有 Herdr 服务时执行 `herdr server reload-config`，避免中断现有会话。验证版本、stable 通道、配置加载，以及 `herdr integration status` 中对应集成的状态；在可用的交互式终端中验证启动、Vesper 主题、侧栏折叠和 detach 后重新连接。

不迁移 旧电脑的会话、日志、socket、项目路径或密钥，也不额外配置开机自启。交付时简述修改位置和验证结果，并说明用 `herdr` 启动／连接持久会话、`Ctrl+b` 后按 `q` 脱离会话。
