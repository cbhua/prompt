# 配置 rget：从剪贴板下载服务器文件

请在 MacBook 的 `~/.zshrc` 中添加以下 `rget` 函数，让 `rget <server_name>` 读取 macOS 剪贴板中的远端文件绝对路径，通过 `scp` 下载到本地 `~/Downloads/`。修改前备份 `.zshrc`，保留现有配置；若已有 `rget` 函数，检查并更新，避免重复定义。

## 配置函数

```zsh
rget() {
    local host="$1"
    local remote_path="$(pbpaste)"

    if [[ -z "$host" || -z "$remote_path" ]]; then
        echo "Usage: rget <ssh-host>"
        return 1
    fi

    scp "${host}:${remote_path}" "$HOME/Downloads/"
}
```

确认本地可用 `pbpaste`、`scp`，且 `~/Downloads/` 存在。配置完成后运行 `zsh -n ~/.zshrc` 检查语法，再执行 `source ~/.zshrc` 或重开终端，使函数生效。

## 使用方法

1. 在服务器上运行 `realpath <filename>`，快速打印文件的绝对路径。将 `<filename>` 替换为实际文件名；文件名包含空格时使用引号，例如 `realpath "my report.pdf"`。
2. 将输出的绝对路径复制到 MacBook 剪贴板，仅复制路径本身，不包含提示符或额外引号。
3. 在 MacBook 的本地终端运行 `rget <server_name>`，将 `<server_name>` 替换为可通过 SSH 连接的主机名或 `~/.ssh/config` 中的主机别名。
4. 下载完成后，在本地 `~/Downloads/` 中查看文件。

例如，在服务器上执行：

```sh
realpath report.pdf
```

假设输出为 `/home/user/project/report.pdf`，复制该路径后，在 MacBook 上执行（假设 SSH 主机别名为 `myserver`）：

```zsh
rget myserver
```

文件会保存为 `~/Downloads/report.pdf`。此函数用于下载单个文件；目标目录中存在同名文件时，`scp` 会覆盖它。

## 验证与交付

检查 `rget` 已加载，且不传主机参数时会显示 `Usage: rget <ssh-host>`。使用指定服务器上的一个测试文件验证下载，并确认文件出现在 `~/Downloads/`。简述修改位置、语法检查和下载验证结果。
