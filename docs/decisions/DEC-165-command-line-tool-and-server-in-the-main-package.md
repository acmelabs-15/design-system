---
id: DEC-165
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: architecture # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: true
  real-trade-off: true
from: IDEA-005#18 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-030, RES-077, RES-082] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-165: The command line tool of 1.0, with its MCP server, lives in the main package

IDEA-005#18 asks where the MCP server lives. Peter's kickoff prompt named a direction to test: the server and the skills ship inside the design system package, with a command in its `bin`. He decided it in two steps on 2026-11-20. His mark ✅ for "A subcommand of the project's command line tool" makes the server a subcommand of the command line tool of 1.0. His answer to the question dialog, "In the main package (Recommended)", puts that tool into the `bin` of the main package. The rejected option is a package of its own for the tool, as `@ant-design/cli`.

The words of the option that he chose: "One install gives the components, the guidance, the command and the server, all at one version. Cost: an unusual shape, tool code inside the library package, and a pass-on command in each framework package for pnpm."

The main package is the package that every consumer of 1.0 has installed: the one package of 1.0, or the core package below the framework packages. IDEA-004#07 decides which of the two it is.

## Consequences

- The server and the command have the version of the installed components with no logic for it (DEC-163). The trial RES-077 showed it: after an update of the package, the server answered as the new version at once.
- The shape is unusual. No library of the 112 projects in RES-082 has its server only inside its main library package; 11 have it in a command line tool or a dev server, and those tools are packages of their own or the product itself.
- The main package holds the code of the tool and of the server. An application never imports that code, so it adds to the size of the install and not to the size of a page.
- With pnpm, a consumer who installs only a package that depends on the main package does not get its `bin` (RES-077). If the framework targets are packages of their own, each needs a small command that passes the call on. The deferred row IDEA-005#29 holds it, and IDEA-004#07 takes it in.
- Changing the place after the release breaks the server entry in every project that the command wrote, so the choice is hard to reverse after 1.0.
- His mark ✅ for "Inside the dev server of the installed package" is not part of this decision. 1.0 has no dev server of its own. A part that runs in the consumer's dev server is a candidate capability of the devtools; IDEA-006#10 decides it.
- A hosted MCP server is open in IDEA-005#09.
