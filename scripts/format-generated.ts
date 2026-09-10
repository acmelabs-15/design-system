// Runs the package's Biome over files a generator just wrote, so generated output lands in the
// shape `bun run lint` expects. The generators emit their CSS on one line per rule, and Biome
// formats the CSS embedded in a Lit css`` template (javascript.experimentalEmbeddedSnippetsEnabled
// in biome.json), so without this pass every regeneration reintroduces formatting errors.
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");

/**
 * Formats generated files in place with the package's Biome.
 *
 * A generator writes its whole batch first and then calls this once, so one Biome process covers
 * every file. Biome resolves `biome.json` from the package root, so the result matches what
 * `bun run lint` expects. Paths outside the config's `files.includes` are ignored by Biome itself.
 *
 * @param files* - Paths of the generated files to format.
 *
 * @returns The number of files handed to Biome.
 *
 * @throws {Error} When Biome exits non-zero, carrying its own diagnostics. A parse error here
 * means a generator emitted a snippet Biome cannot read (a backslash escape inside a css``
 * template is the known case), which is a generator bug rather than a formatting problem.
 */
export const formatGenerated = async (files: string[]): Promise<number> => {
  if (!files.length) return 0;

  const proc = Bun.spawn(["bunx", "biome", "format", "--write", ...files], { cwd: ROOT, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);

  if (code !== 0) throw new Error(`biome format --write failed (exit ${code}):\n${stderr || stdout}`);

  return files.length;
};
