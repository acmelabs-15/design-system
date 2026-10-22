# Confirm rotation of the exposed npm token

Status: ready-for-human
Type: task
Owner: Peter

## Evidence and boundary

An earlier delegated check printed an npm token into tool output. Peter was informed. The project record says no secret was committed. Revocation or replacement remains unconfirmed. [Incident record](../../../docs/research/08-developer-tooling.md#credential-handling-incident).

The releases are complete. No release authentication is pending. That fact does not close this separate credential action.

## Completion

Peter confirms that the exposed credential is revoked or replaced in the account's credential controls. Record only the confirmation and date. Credential values do not belong in issue comments, verification output or Git.

## Comments

2026-10-21: carried forward without reading or reusing credential files. This migration does not change account credentials.
