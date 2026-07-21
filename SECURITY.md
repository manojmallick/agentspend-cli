# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in agentspend, please do **not** open a public GitHub issue. Instead, email us at **manoj.mallick079@gmail.com** with:

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (optional)

We will acknowledge your report within 48 hours and work with you to fix the issue.

## Security Best Practices

### For Users

- Keep agentspend updated to the latest version
- All state (`spend` entries, `sync` profiles) is stored locally in `~/.agentspend` (or `$AGENTSPEND_HOME` if set) — nothing is sent over the network
- `sync save`/`sync load` copy files as-is; do not save profiles containing secrets you wouldn't want copied to another machine unencrypted
- Do not commit `~/.agentspend` contents to version control

### For Contributors

- Follow OWASP Top 10 security guidelines
- Validate all external inputs (CLI arguments, file paths)
- Avoid hardcoding secrets
- Run `pnpm test` and `pnpm typecheck` before submitting PRs

## Disclosure Timeline

1. Vulnerability reported
2. We acknowledge receipt (48 hours)
3. We develop a fix
4. We release a patch version
5. We publicly disclose the issue if warranted

## Supported Versions

| Version | Security Support |
|---------|------------------|
| v0.x    | Current release  |

## Minimal Dependencies

agentspend has a single runtime dependency ([commander](https://www.npmjs.com/package/commander), for CLI argument parsing):
- No network calls — all data stays on the local filesystem
- Small, well-audited dependency surface
- No install scripts — nothing runs automatically on `npm install`
