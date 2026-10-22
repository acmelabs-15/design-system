@AGENTS.md

## Claude Code

The imported project rules are shared with other coding agents. Both workflow plugins are enabled in the project settings.

| Phase | Claude command |
| --- | --- |
| Specification | /brain:spec |
| Planning | /brain:plan |
| Implementation | /brain:build, or /brain:build auto within an approved plan |
| Diagnosis and verification | /brain:test |
| Review | /brain:review |
| Shipping | /brain:ship |

The shared instructions define the user-started boundary. Its Claude commands are /brain:setup-brain, /brain:wait-what, /brain:handoff, /brain:triage and /brain:wayfinder.

Project settings name the addy-agent-skills and acmelabs marketplaces. Installed plugin versions come from the host, not a cached version in this file.
