# Official review viewer serialization correction

This record preserves the original checkpoint and its exact evidence. Current reproduction paths are maintained separately from saved results.

The official `skill-creator/eval-viewer/generate_review.py` embeds `json.dumps(embedded)` directly inside a script element. The archived HTML contains literal `</script>` text. This ends the viewer script early, produces a Chrome `Invalid or unexpected token` error and prevents the Benchmark control from working.

The correction escapes `<` as `\u003c` at the JSON serialization boundary. It preserves parsed string values and prevents archived source from becoming viewer markup. [viewer-tooling.patch](viewer-tooling.patch) records the one-line change. Only a temporary copy of the official generator changed; the installed plugin, original consumer artifacts and package source did not change.

The original official viewer template is used unchanged. It renders text outputs, including HTML, with `pre.textContent`, and screenshots with embedded image URLs. It does not execute the unpublished consumer HTML against public CDN URLs. The generated static viewer is checked in real Chrome: the Benchmark tab renders and no page errors occur. [grader-verification.json](grader-verification.json) records the result.

The exact historical tooling correction can be replayed only in a separate temporary copy of the official generator and its adjacent viewer.html template, with the recorded patch. The captured invocation was:

```sh
python3 /path/to/temporary/generate_review.py /path/to/iteration-1 \
  --skill-name design-system-consumer-guidance \
  --benchmark /path/to/iteration-1/benchmark.json \
  --static /path/to/iteration-1/review.html
```

Python is external evaluation tooling, not a shipped package dependency.

## Workflow migration verification

This tooling record and its immutable patch/results remain provenance. The [workflow migration checks](../../../workflow-migration/task-08.json) do not reinstall or rerun the historical Python viewer, modify the installed plugin, or execute archived consumer source.
