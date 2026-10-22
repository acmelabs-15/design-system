# Verify behavior on actual platforms

Status: ready-for-human
Type: task
Owner: human verification

## Remaining scope

- Actual Safari, including its keyboard and focus settings.
- Assistive-technology navigation and announcements.
- Genuine operating-system input methods, dictation and browser autofill.
- Real background-window visibility and focus behavior, including Toast pause and resume.

Automated Chromium, Firefox and WebKit checks cover their recorded paths. WebKit results do not certify actual Safari. Accessibility-tree checks do not certify screen-reader behavior. Direct callbacks and synthetic input do not certify operating-system input or autofill.

The [release record](../../../docs/releases/0.3.2.md) and [final local acceptance](../../../docs/verification/systematization/m26-final/README.md) retain those limits.

## Completion

Record the operating system, application/browser version, settings, assistive technology, exact interaction and observed result. Check affected controls and native comparison controls. Keep failed or unperformed cases visible; close only the cases actually verified.

## Comments

2026-10-21: carried forward as unperformed. The workflow migration does not replace these checks with automation claims.
