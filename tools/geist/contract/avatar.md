# avatar: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use a single `<Avatar>` for one person, team, or organization. For two or more stacked avatars, use `<AvatarGroup>` so the cluster gets correct overlap, sizing, and a single accessible label.
- [ ] (Best Practices) Pass `src` first and fall back to `letter` (1–2 uppercase chars) when the image is missing. Reserve `placeholder` for the loading shell, never as a permanent fallback.
- [ ] (Best Practices) `title` is the literal entity name (`Acme Inc.`, `Jane Doe`). Geist already prefixes letter avatars with `Avatar with initials:` for screen readers, so don’t hand-write `Avatar of …`.
- [ ] (Best Practices) Keep `letter` uppercase and derived from the entity name. No emoji, no punctuation, no `?`.
- [ ] (Best Practices) Pick a size that matches adjacent type: 20–24px next to `text-label-14`, 32px next to `text-label-16`, 48–64px in headers and onboarding states.
