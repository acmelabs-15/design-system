import assert from "node:assert/strict";
const root = new URL("../../../../", import.meta.url).pathname,
	dir = root + "/.artifacts/m22-react";
const fixture = new URL("./fixture.ts", import.meta.url).pathname;
const consumer = process.env.ACME_REACT_CONSUMER;
const entry = consumer ? consumer + "/react-fixture.ts" : fixture;
if (consumer) await Bun.write(entry, Bun.file(fixture));
const built = await Bun.build({
	entrypoints: [entry],
	outdir: dir + "/out",
	target: "browser",
	format: "esm",
	splitting: true,
	naming: { entry: "entry.[ext]" },
});
if (!built.success) throw new AggregateError(built.logs);
const server = Bun.serve({
	port: 0,
	async fetch(request) {
		const p = new URL(request.url).pathname;
		if (p === "/")
			return new Response(
				'<!doctype html><link rel="stylesheet" href="/tokens.css"><script type="module" src="/entry.js"></script>',
				{ headers: { "Content-Type": "text/html" } },
			);
		if (p === "/clip.mp4")
			return new Response(Bun.file(root + "/site/assets/video/example.mp4"));
		if (p === "/captions.vtt")
			return new Response(Bun.file(root + "/site/assets/video/captions.vtt"));
		const f = Bun.file(
			p === "/tokens.css"
				? (consumer
						? consumer + "/node_modules/@acmelabs/design-system"
						: root) + "/dist/styles/tokens.css"
				: dir + "/out" + p,
		);
		return (await f.exists())
			? new Response(f)
			: new Response("Missing", { status: 404 });
	},
});
const runtime = process.env.ACME_BROWSER_RUNTIME;
if (!runtime)
	throw new Error(
		"Set ACME_BROWSER_RUNTIME to the directory containing Playwright",
	);
process.env.PLAYWRIGHT_BROWSERS_PATH = runtime + "/browsers";
const pw = await import(runtime + "/node_modules/playwright/index.mjs");
const reports = [];
try {
	for (const engine of ["chromium", "firefox", "webkit"]) {
		const browser = await pw[engine].launch({
			headless: true,
			...(engine === "chromium" && process.env.ACME_CHROMIUM_PATH
				? { executablePath: process.env.ACME_CHROMIUM_PATH }
				: {}),
		});
		const page = await browser.newPage({ reducedMotion: "reduce" }),
			errors = [],
			checks = [];
		page.on("pageerror", (e) => errors.push(String(e)));
		const check = async (name, fn) => {
			try {
				await page.goto(server.url.href);
				await page.waitForFunction(() => window.ref?.current?.updateComplete);
				await fn();
				checks.push({ name, pass: true });
				console.log(engine, "PASS", name);
			} catch (e) {
				checks.push({ name, pass: false, error: String(e) });
				console.log(engine, "FAIL", name, e);
			}
		};
		await check(
			"ordered style inputs reorder, remove, reassert and preserve unrelated writes",
			async () => {
				const padding = () =>
					page
						.locator("acme-box")
						.evaluate((el) => getComputedStyle(el).paddingInlineStart);
				const first = await padding();
				await page.evaluate(() =>
					window.render({ paddingInline: 2, padding: 4 }),
				);
				await page.waitForFunction(
					(before) =>
						getComputedStyle(window.ref.current).paddingInlineStart !== before,
					first,
				);
				const second = await padding();
				await page.evaluate(() => window.render({ paddingInline: 2 }));
				assert.equal(await padding(), first);
				await page.evaluate(() => {
					window.ref.current.paddingInline = 8;
					window.ref.current.backgroundColor = "red";
				});
				assert.notEqual(await padding(), first);
				await page.evaluate(() => window.render({ paddingInline: 2 }));
				assert.equal(await padding(), first);
				assert.equal(
					await page.evaluate(() => window.ref.current.backgroundColor),
					"red",
				);
				await page.evaluate(() => window.render({}));
				assert.equal(
					await page.evaluate(() => window.ref.current.paddingInline),
					undefined,
				);
				assert.notEqual(first, second);
			},
		);
		await check(
			"Strict Mode retains actual element refs and stateful child identity",
			async () => {
				await page.evaluate(() => window.render({ padding: 4 }, true));
				await page.locator("#child").click();
				await page.evaluate(
					() => (window.child = document.querySelector("#child")),
				);
				await page.evaluate(() =>
					window.render({ padding: 8, className: "sample" }, true),
				);
				assert.equal(await page.locator("#child").innerText(), "1");
				assert.equal(
					await page.evaluate(
						() => window.child === document.querySelector("#child"),
					),
					true,
				);
				assert.equal(
					await page.evaluate(
						() => window.ref.current === document.querySelector("acme-box"),
					),
					true,
				);
				await page.evaluate(() => window.unmount());
				assert.equal(await page.evaluate(() => window.ref.current), null);
			},
		);
		await check(
			"native fieldset ancestor retains React-owned controls, form values and events",
			async () => {
				await page.evaluate(() => window.fieldset());
				await page.waitForFunction(() =>
					document.querySelector("#input")?.shadowRoot?.querySelector("input"),
				);
				assert.equal(
					await page.evaluate(
						() => document.querySelector("#input").parentElement.localName,
					),
					"fieldset",
				);
				assert.equal(
					await page.evaluate(() =>
						new FormData(document.querySelector("form")).get("name"),
					),
					"Peter",
				);
				await page.locator("acme-input input").fill("Changed");
				assert.ok((await page.evaluate(() => window.events())) > 0);
				assert.equal(await page.evaluate(() => window.detail.value), "Changed");
				await page.evaluate(() => window.fieldset(true));
				assert.equal(await page.locator("acme-input input").isDisabled(), true);
				await page.evaluate(() => window.fieldset(false, false));
				assert.equal(await page.locator("acme-input").count(), 0);
				await page.evaluate(() => window.fieldset(false, true));
				assert.equal(await page.locator("acme-input").count(), 1);
			},
		);
		await check(
			"Show mounts React branches and preserves state only when selected",
			async () => {
				await page.evaluate(() => window.show(false));
				await page.locator("#fallback").waitFor();
				assert.equal(await page.locator("#stateful").count(), 0);
				await page.evaluate(() => window.show(true));
				await page.locator("#stateful").click();
				assert.equal(await page.locator("#stateful").innerText(), "1");
				await page.evaluate(() => window.show(false));
				await page.locator("#stateful").waitFor({ state: "detached" });
				await page.evaluate(() => window.show(true));
				assert.equal(await page.locator("#stateful").innerText(), "0");
				await page.locator("#stateful").click();
				await page.evaluate(() => window.show(false, true));
				await page.evaluate(() => window.show(true, true));
				assert.equal(await page.locator("#stateful").innerText(), "1");
			},
		);
		await check(
			"Tabs uses canonical mount decisions for React state retention and exit removal",
			async () => {
				await page.evaluate(() => window.tabs());
				await page.locator("#stateful").click();
				await page.evaluate(() => window.tabs("b"));
				await page.locator("#panel-b").waitFor();
				assert.equal(await page.locator("#stateful").count(), 1);
				await page.evaluate(() => window.tabs("a"));
				assert.equal(await page.locator("#stateful").innerText(), "1");
				await page.evaluate(() => window.tabs("b", true));
				await page.locator("#stateful").waitFor({ state: "detached" });
				await page.evaluate(() => window.tabs("a", true));
				assert.equal(await page.locator("#stateful").innerText(), "0");
			},
		);
		await check(
			"Collapsible removes React content after the owned exit lifetime",
			async () => {
				await page.evaluate(() => window.disclosure());
				assert.equal(await page.locator("#stateful").count(), 0);
				await page.evaluate(() => window.disclosure(true));
				await page.locator("#stateful").click();
				await page.evaluate(() => window.disclosure(false));
				await page.locator("#stateful").waitFor({ state: "detached" });
				await page.evaluate(() => window.disclosure(true));
				assert.equal(await page.locator("#stateful").innerText(), "0");
			},
		);
		await check(
			"Video renders real React track nodes into the native target",
			async () => {
				await page.evaluate(() => window.video());
				await page.waitForFunction(() =>
					document
						.querySelector("acme-video")
						.getVideoElement()
						.querySelector("track"),
				);
				await page.waitForFunction(
					() =>
						document.querySelector("acme-video").getVideoElement()
							.readyState === 4,
				);
				await page.evaluate(
					() =>
						(document
							.querySelector("acme-video")
							.getVideoElement()
							.querySelector("track").track.mode = "showing"),
				);
				await page.waitForFunction(
					() =>
						document
							.querySelector("acme-video")
							.getVideoElement()
							.querySelector("track")?.readyState === 2,
				);
				await page.evaluate(
					() =>
						(window.track = document
							.querySelector("acme-video")
							.getVideoElement()
							.querySelector("track")),
				);
				await page.evaluate(() => window.video("Updated"));
				assert.equal(await page.evaluate(() => window.track.label), "Updated");
				assert.equal(
					await page.evaluate(
						() =>
							window.track.parentElement ===
							document.querySelector("acme-video").getVideoElement(),
					),
					true,
				);
				await page.evaluate(() => window.video("Updated", false));
				assert.equal(
					await page.evaluate(() => window.track.isConnected),
					false,
				);
				await page.evaluate(() => window.video());
				await page.waitForFunction(() =>
					document
						.querySelector("acme-video")
						.getVideoElement()
						.querySelector("track"),
				);
				await page.evaluate(
					() =>
						(document
							.querySelector("acme-video")
							.getVideoElement()
							.querySelector("track").track.mode = "showing"),
				);
				await page.waitForFunction(
					() =>
						document
							.querySelector("acme-video")
							.getVideoElement()
							.querySelector("track")?.readyState === 2,
				);
			},
		);
		await check(
			"removing an ordinary input restores its declared default",
			async () => {
				await page.evaluate(() =>
					window.videoProps({ loading: "eager", preload: "metadata" }),
				);
				assert.equal(
					await page.evaluate(
						() => document.querySelector("acme-video").loading,
					),
					"eager",
				);
				await page.evaluate(() => window.videoProps());
				assert.equal(
					await page.evaluate(
						() => document.querySelector("acme-video").loading,
					),
					"lazy",
				);
				assert.equal(
					await page.evaluate(
						() => document.querySelector("acme-video").preload,
					),
					"auto",
				);
			},
		);
		await check(
			"callback refs receive React cleanup in Strict Mode and on unmount",
			async () => {
				await page.evaluate(() => window.refProbe());
				const mounted = await page.evaluate(() => window.refCounts());
				assert.ok(mounted.attached >= 1);
				await page.evaluate(() => window.unmount());
				const ended = await page.evaluate(() => window.refCounts());
				assert.equal(ended.attached, ended.cleaned);
			},
		);
		await check(
			"React retains host and child identity through document adoption and updates",
			async () => {
				await page.locator("#child").click();
				await page.evaluate(async () => {
					const frame = document.createElement("iframe");
					document.body.append(frame);
					window.frame = frame;
					window.original = window.ref.current;
					window.originalChild = document.querySelector("#child");
					frame.contentDocument.body.append(
						frame.contentDocument.adoptNode(window.container),
					);
					window.render({ padding: 8 });
					await window.ref.current.updateComplete;
				});
				assert.equal(
					await page.evaluate(() => window.ref.current === window.original),
					true,
				);
				assert.equal(
					await page.evaluate(() => window.originalChild.textContent),
					"1",
				);
				assert.equal(
					await page.evaluate(
						() =>
							window.original.ownerDocument === window.frame.contentDocument,
					),
					true,
				);
				await page.evaluate(async () => {
					document.body.append(document.adoptNode(window.container));
					window.render({ padding: 4 });
					await window.ref.current.updateComplete;
				});
				assert.equal(await page.locator("#child").innerText(), "1");
				await page.evaluate(() => window.unmount());
			},
		);
		await check(
			"removing a React style prop preserves a newer helper owner",
			async () => {
				await page.evaluate(() => window.render({ padding: 4 }));
				await page.evaluate(() => window.transferStyle());
				await page.evaluate(() => window.render({}));
				assert.equal(await page.evaluate(() => window.ref.current.padding), 8);
			},
		);
		await check(
			"removing an authored size restores Group inheritance",
			async () => {
				await page.evaluate(() => window.group("small"));
				await page.waitForFunction(
					() => document.querySelector("#button").size === "small",
				);
				await page.evaluate(() => window.group());
				await page.waitForFunction(
					() => document.querySelector("#button").size === "large",
				);
			},
		);
		await check('unmount releases custom event callbacks on a retained element',async()=>{await page.evaluate(()=>window.eventLifetime());await page.evaluate(()=>{window.retained=window.ref.current;window.unmount();window.retained.dispatchEvent(new CustomEvent('acme-input',{detail:{value:'late'}}))});assert.equal(await page.evaluate(()=>window.events()),0)});
reports.push({ engine, checks, errors });
		await browser.close();
	}
} finally {
	server.stop(true);
}
await Bun.write(dir + "/results.json", JSON.stringify(reports, null, 2));
if (reports.some((r) => r.errors.length || r.checks.some((c) => !c.pass)))
	process.exitCode = 1;
