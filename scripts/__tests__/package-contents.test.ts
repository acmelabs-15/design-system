import { afterEach, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { assertArchiveFileBudget } from "../package-contents";

interface TarEntry {
  name: string;
  content?: string;
  type?: "0" | "\0" | "1" | "2" | "5";
  linkname?: string;
}

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

function fixturePath(): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "acme-package-budget-"));
  temporaryDirectories.push(directory);
  return path.join(directory, "package.tgz");
}

function tarBytes(entries: TarEntry[]): Buffer {
  const byteLength = entries.reduce((size, entry) => size + 512 + Math.ceil(Buffer.byteLength(entry.content ?? "") / 512) * 512, 1024);
  const archive = Buffer.alloc(byteLength);
  let offset = 0;
  for (const entry of entries) {
    const header = archive.subarray(offset, offset + 512);
    const contentLength = Buffer.byteLength(entry.content ?? "");
    header.write(entry.name, 0, 100);
    header.write("0000644\0", 100);
    header.write("0000000\0", 108);
    header.write("0000000\0", 116);
    header.write(`${contentLength.toString(8).padStart(11, "0")}\0`, 124);
    header.write("00000000000\0", 136);
    header.fill(32, 148, 156);
    header.write(entry.type ?? "0", 156);
    if (entry.linkname) {
      header.write(entry.linkname, 157, 100);
    }
    header.write("ustar\0", 257);
    header.write("00", 263);
    const checksum = header.reduce((sum, byte) => sum + byte, 0);
    header.write(`${checksum.toString(8).padStart(6, "0")}\0 `, 148);
    if (entry.content) {
      archive.write(entry.content, offset + 512);
    }
    offset += 512 + Math.ceil(contentLength / 512) * 512;
  }
  return archive;
}

async function writeArchive(entries: TarEntry[]): Promise<string> {
  const file = fixturePath();
  await Bun.write(file, Bun.gzipSync(tarBytes(entries)));
  return file;
}

function regularFiles(count: number): TarEntry[] {
  return Array.from({ length: count }, (_, index) => ({ name: `package/dist/file-${index}.js` }));
}

test("archive budget counts files, repeated paths, directories and links while skipping payload blocks", async () => {
  const file = await writeArchive([
    { name: "package/", type: "5" },
    { name: "package/package.json", content: '{"name":"fixture","version":"0.0.0"}' },
    { name: "package/dist/module.js", content: "export const value = 1;\n".repeat(100) },
    { name: "package/dist/module.js", content: "export const value = 2;\n" },
    { name: "package/dist/legacy.js", type: "\0" },
    { name: "package/dist/shortcut.js", type: "2", linkname: "module.js" },
    { name: "package/dist/hardlink.js", type: "1", linkname: "package/dist/module.js" },
  ]);

  expect(await assertArchiveFileBudget(file)).toBe(7);
});

test("archive budget rejects an empty archive without package metadata", async () => {
  const file = await writeArchive([]);
  await expect(assertArchiveFileBudget(file)).rejects.toThrow();
});

test.each([59_999, 60_000])("archive budget accepts %i archive entries", async (count) => {
  const file = await writeArchive([{ name: "package/", type: "5" }, ...regularFiles(count - 1)]);
  expect(await assertArchiveFileBudget(file)).toBe(count);
});

test("archive budget rejects 60,001 archive entries", async () => {
  const file = await writeArchive([{ name: "package/", type: "5" }, ...regularFiles(60_000)]);
  await expect(assertArchiveFileBudget(file)).rejects.toThrow();
});

test("archive budget rejects a missing archive", async () => {
  await expect(assertArchiveFileBudget(fixturePath())).rejects.toThrow();
});

test("archive budget rejects a file that is not gzip", async () => {
  const file = fixturePath();
  await Bun.write(file, "not a compressed archive");
  await expect(assertArchiveFileBudget(file)).rejects.toThrow();
});

test("archive budget rejects an uncompressed tar file", async () => {
  const file = fixturePath();
  await Bun.write(file, tarBytes([{ name: "package/package.json", content: "{}" }]));
  await expect(assertArchiveFileBudget(file)).rejects.toThrow();
});

test("archive budget rejects gzip data that is not a tar archive", async () => {
  const file = fixturePath();
  await Bun.write(file, Bun.gzipSync("not a tar archive"));
  await expect(assertArchiveFileBudget(file)).rejects.toThrow();
});

test("archive budget rejects a truncated file payload", async () => {
  const file = fixturePath();
  const archive = tarBytes([{ name: "package/dist/module.js", content: "x".repeat(2048) }]);
  await Bun.write(file, Bun.gzipSync(archive.subarray(0, 1024)));
  await expect(assertArchiveFileBudget(file)).rejects.toThrow();
});

test("archive budget rejects a corrupt header checksum", async () => {
  const file = fixturePath();
  const archive = tarBytes([{ name: "package/package.json", content: "{}" }]);
  archive.write("changed", 0);
  await Bun.write(file, Bun.gzipSync(archive));
  await expect(assertArchiveFileBudget(file)).rejects.toThrow();
});
