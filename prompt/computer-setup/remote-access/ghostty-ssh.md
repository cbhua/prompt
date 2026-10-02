# 配置 SSH 服务器的 Ghostty 终端支持

请为指定 SSH 服务器安装 Ghostty 的 terminfo，让远端终端程序正确识别 `xterm-ghostty`。先确认本地安装了 Ghostty、`infocmp` 可读取其 terminfo，且远端有 `tic`。

将下面的 `<server_name>` 替换为实际 SSH 主机别名，在运行 Ghostty 的本地电脑执行：

```bash
infocmp -x xterm-ghostty | ssh <server_name> 'mkdir -p ~/.terminfo && tic -x -o ~/.terminfo -'
```

保留现有 terminfo 条目；若即将覆盖同名条目，先备份。仅安装到远端当前用户的 `~/.terminfo`，不在纯 SSH 服务器安装 Ghostty GUI，不复制 SSH 私钥或本地配置中的凭据。

重新连接后，检查远端 `echo "$TERM"` 和 `infocmp -x xterm-ghostty`，验证常用终端程序不再报 unknown terminal。说明目标主机、修改位置、验证结果与恢复方法；不要把真实主机地址或凭据写回公共 prompt。
