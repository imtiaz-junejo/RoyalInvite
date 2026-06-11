# OpenCLI Browser Tool

Use OpenCLI for browser automation in this workspace.

Start or verify the browser bridge:

```bash
scripts/start-opencli-browser.sh
```

Common commands:

```bash
opencli doctor
opencli browser open "https://example.com"
opencli browser state
opencli browser click <selector-or-index>
opencli browser type <selector-or-index> "text"
opencli browser screenshot
```

Notes:

- OpenCLI uses Chromium with the unpacked extension in `.opencli-browser-extension/unpacked`.
- Keep the Chromium window running while using `opencli browser ...` commands.
- If the extension disconnects, rerun `scripts/start-opencli-browser.sh`.
