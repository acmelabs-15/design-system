export const packageFileBudget = 60_000;

/** Count archive entries as npm does; this is a project budget, not npm's documented limit. */
export async function assertArchiveFileBudget(file: string): Promise<number> {
  const child = Bun.spawn(["tar", "-tzf", file], {
    env: { ...process.env, LC_ALL: "C" },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [listing, error, status] = await Promise.all([Bun.readableStreamToText(child.stdout), Bun.readableStreamToText(child.stderr), child.exited]);
  if (status !== 0) {
    throw new Error("Cannot inspect package archive: " + error.trim());
  }
  const files = listing.split("\n").filter(Boolean).length;
  if (files > packageFileBudget) {
    throw new Error(`Package archive contains ${files} files; the project budget is ${packageFileBudget}.`);
  }
  return files;
}
