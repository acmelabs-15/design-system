# Supplemental consumer checks

These checks preserve the original evaluation grades. They do not rewrite the original artifacts or claim that those artifacts authored a surrounding native form.

- Both React Radio Groups already supply name=plan. Supplying a native form around the control produces exactly the selected plan in real FormData. This closes the library integration question; the original React prompt did not explicitly require a form.
- The baseline React wrapper releases its callback: dispatching acme-change on a retained detached Tabs element does not add an application event.
- Both table consumers process exactly one application page request after same-element remount. A test-only EventTarget wrapper counts actual acme-request/page callback invocations at Pagination while preserving listener identity and capture. One native Next click yields one invocation and pageIndex1.

All five supplemental checks pass in Chromium. The three retained failed attempts are harness faults: the hidden native submitter made a selector ambiguous; one server omitted its original dist path mapping; a page-size10000 setup correctly disabled Next; and wrapping a transient TanStack method was not a reliable callback oracle. The final test corrects those setups instead of changing the artifacts or relaxing the expected outcome.

The script uses the preserved /tmp evaluation directories and their built outputs. The immutable original source and results are archived in ../iteration-1. Recreate those artifacts from their README build instructions before rerunning the supplemental script. Final library browser acceptance is separate and covers Chromium, Firefox and WebKit.
