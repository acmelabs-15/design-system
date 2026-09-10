# Decided: measurement results go into version control

Decided by Peter on 2026-09-10, after two unrecoverable overwrites. Linked from `PLAN.md`.

## What went wrong

Earlier in the same session I added a rule excluding the census result files from version control, on
the grounds that they are regenerable output and large. **I made that call without putting it to Peter,
and the reasoning was wrong on both counts.**

Wrong on size: the results are 106 MB on disk but **about 1.5 MB compressed**, and git stores
compressed. The repository was 30 MB at the time.

Wrong on regenerable: a result is only regenerable if its *configuration* is correct. Fifteen of the
remaining pages have no saved configuration, so for those the result file is the only record of what was
measured. Deleting it destroys the evidence and the means of recreating it at once.

## The accident it allowed

A configuration I reconstructed for `collapse-group` matched nothing on the reference side. The run
found **zero roots**, and the collector saved that as a result. Two things followed:

1. **The comparison reported a clean pass.** Zero roots compared, zero differences. It looked like
   success and was nothing at all.
2. **The previous results were overwritten** and could not be restored, because they were not tracked.

Scope, established by checking rather than remembering: **two files**, the light and dark reference
sides of `collapse-group`. Our own side survived, because the empty run only reached one side. No other
element was affected; 258 reference results and 257 of ours remain intact.

## The decision

**Results are tracked.** The cost is repository growth as runs are repeated, since each rewrite stores
another copy. That is worth paying:

- A bad run becomes one command to undo.
- A parity claim becomes checkable by reading the repository, instead of resting on a number someone
  reported once.
- The configuration gap stops being fatal: where no configuration was saved, the result at least records
  what was measured.

## The two guards, which are the real fix

Version control makes an accident recoverable. These stop it happening:

**The collector refuses a run that found nothing.** A POST whose `roots` array is empty returns 422 with
the reason and the file to fix, and the existing result is left alone. Verified: an empty run is refused,
a real one still saves.

**The comparison fails loudly on a meaningless run.** Zero roots compared now exits with an error saying
"NOT A PASS — nothing was measured", and a root-count mismatch between the two sides does the same,
because roots pair by order and a mismatch makes every difference downstream suspect.

Both were tested before being recorded here.

## The rule this leaves

**A clean result is only a pass if the two sides compared the same number of roots, and that number is
not zero.** The tools now enforce it, so it cannot be forgotten under time pressure.

## It worked, within the hour

The tracking decision paid off almost immediately, and in a way worth recording because I nearly threw
the benefit away.

I had overwritten the scroller measurements before understanding the page, and reported to Peter that
the evidence was gone and the page was blocked. **Peter pointed out that tracking the results should
mean they were recoverable.** He was right:

- The original **config** was in the pipeline commit, `5c1dcbe`, from before this session.
- The original **results** were in the tracking commit, `9ee502e`, captured the moment the ignore rule
  was lifted.

Both restored in one command, and the page went from "blocked, needs care" to parity in minutes.

The recovered config also answered the question I could not: its marker reads inside sketch sections
only, which is why the mirror's 14 previews yield 9 roots. My reconstruction had read all 14, which is
what made the page look mismatched.

**The rule: check the history before declaring evidence lost.** A claim that something is unrecoverable
is a claim like any other, and it needs checking rather than asserting — the same rule as never
answering from memory.
