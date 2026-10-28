# Website importer: repository source import

Repository: https://github.com/phuocnhtvietcasa-code/team-records-hub-96
Commit: 052d3c7
Live reference redirects to https://vietcasa-sale-kpi.vercel.app/auth. Imported repository code directly instead of capturing the GitHub repository webpage.

| Route | Viewport | Control | Expected and observed source result | Status | Evidence |
|---|---|---|---|---|---|
| /auth | 1280x1800 | Initial | Sign-in, branding, email and password | pass | /tmp/browser/team-records/source_desktop.png |
| /auth | 1280x1800 | Registration | Create account email/password form | pass | /tmp/browser/team-records/source_signup.png |
| /auth | 1280x1800 | Forgot password | Email recovery form | pass | /tmp/browser/team-records/source_reset.png |
| /auth | 390x844 | Initial | Phone sign-in form and logo | pass | /tmp/browser/team-records/source_phone.png |
| Protected routes | Both | Navigation and records | Access requires source account; no credentials used | blocked | Repository source retained |

No hero media, nested menus, carousel or scroll motion occurs on the publicly accessible auth screen. Logo and favicon were copied from repository public assets. Existing production users and records are not part of source code.
