# Dotfiles migration review

Reviewed the current contents of all seven tracked files in `dotfiles`: README, Ghostty, Herdr, LazyVim, macOS, Oh My Zsh, and Vim. Git metadata, history, runtime configuration files, and machine state were not imported.

## Privacy findings

- No actual API tokens, passwords, SSH private keys, personal email addresses, private hostnames/IP addresses, or absolute user home paths were found in the imported content.
- Generalized references to “my MBP” and the old machine; retained the requested appearance and keyboard preferences.
- Retained public upstream documentation/repository URLs and generic configuration paths such as `~/.config`, `$HOME`, and `~/Github`.
- Retained `user@host` as an explanatory format and `<server_name>` as an explicit placeholder. Neither contains a real identity or host.
- Instructions not to migrate secrets, sessions, or old shell history remain in the relevant prompts.

## Content changes

- Grouped existing scientific-paper prompts and imported setup prompts by topic under `prompt/`.
- Preserved existing paper preview URLs and form behavior; corrected five pre-existing relative script paths on the introduction page.
- Converted the README's SSH terminfo command into a standalone remote-access prompt with prerequisite checks and verification.
- Removed the duplicated LazyVim background-color bullet and completed the truncated startup-verification sentence and final punctuation.
- Kept the six application/system prompts independently usable, with their backup and verification instructions.
- Added all twelve prompt links to one home-page list for manual organization.

This is a review of the imported current files, not an audit of either repository's historical commits. No software installation instructions were executed as part of the migration, and tool-specific configuration advice was retained rather than revalidated against current upstream releases.
