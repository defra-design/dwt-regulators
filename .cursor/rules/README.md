# Cursor rules for the DWT regulator reports

Not a rule itself (`.md`, not `.mdc`). Adapted from the rules in `defra-prototype-admin-service`, which is a GOV.UK Prototype Kit project. This repo prototypes Power BI reports, so Prototype Kit rules were replaced with Power BI and data visualisation rules.

| File | Loads when |
| --- | --- |
| `general/core-rules.mdc` | Always |
| `general/design-system-references.mdc` | Always |
| `general/content-design.mdc` | `public/**/*.html`, `server.js` open |
| `general/accessibility.mdc` | `public/**/*.html`, `server.js` open |
| `general/data-visualisation.mdc` | `public/**/*.html` open |
| `general/jira-ticket-writing.mdc` | When the agent decides it's relevant (writing tickets) |
| `defra/defra-design-and-patterns.mdc` | Always |
| `defra/defra-content.mdc` | `public/**/*.html` open |
| `defra/defra-accessibility.mdc` | `public/**/*.html`, `server.js` open |
| `project/regulators-project-context.mdc` | Always |
| `project/regulators-working-practices.mdc` | Always |
| `project/power-bi-feasibility.mdc` | `public/**/*.html` open |

## Not carried over

- Prototype Kit structure, versioning, routes, templates, session data: not used here.
- GOV.UK spacing scale: doesn't apply to Power BI canvases. The proximity principle still applies.

Review every 6 months, and update `project/` whenever the reports change.
