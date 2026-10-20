import { npmDirectory } from "./release-npm";

export const packageFileBudget = 60_000;

/** Count archive entries as npm does; this is a project budget, not npm's documented limit. */
export async function assertArchiveFileBudget(file: string): Promise<number> {
  const header = new Uint8Array(await Bun.file(file).slice(0, 3).arrayBuffer());
  if (header[0] !== 0x1f || header[1] !== 0x8b || header[2] !== 8) {
    throw new Error("Package archive must contain gzip-compressed tar data");
  }
  const tar = await import(Bun.resolveSync("tar", npmDirectory()));
  let files = 0;
  await tar.t({
    file,
    strict: true,
    onReadEntry: () => {
      files++;
    },
  });
  if (files > packageFileBudget) {
    throw new Error(`Package archive contains ${files} files; the project budget is ${packageFileBudget}.`);
  }
  return files;
}
