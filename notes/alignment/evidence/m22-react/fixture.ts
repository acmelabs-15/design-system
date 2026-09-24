import { Group } from "@acmelabs/design-system-react/components/group";
import { Button } from "@acmelabs/design-system-react/components/button";
import { Video } from "@acmelabs/design-system-react/components/video";
import { Show } from "@acmelabs/design-system-react/components/show";
import { Tabs } from "@acmelabs/design-system-react/components/tabs";
import { Tab } from "@acmelabs/design-system-react/components/tab";
import { TabPanel } from "@acmelabs/design-system-react/components/tab-panel";
import { Collapsible } from "@acmelabs/design-system-react/components/collapsible";
import { CollapsibleTrigger } from "@acmelabs/design-system-react/components/collapsible-trigger";
import { CollapsibleContent } from "@acmelabs/design-system-react/components/collapsible-content";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { flushSync, createPortal } from "react-dom";
import { Box } from "@acmelabs/design-system-react/components/box";
import { Fieldset } from "@acmelabs/design-system-react/components/fieldset";
import { Input } from "@acmelabs/design-system-react/components/input";
const container = document.createElement("main");
document.body.append(container);
const root = createRoot(container);
let current: any;
const ref = React.createRef<any>();
let count = 0;
function Child() {
	const [value, setValue] = React.useState(0);
	return React.createElement(
		"button",
		{ id: "child", onClick: () => setValue((v) => v + 1) },
		String(value),
	);
}
function render(props: any = {}, strict = false) {
	current = props;
	flushSync(() =>
		root.render(
			React.createElement(
				strict ? React.StrictMode : React.Fragment,
				null,
				React.createElement(
					Box,
					{ id: "box", ref, ...props },
					React.createElement(Child),
				),
			),
		),
	);
}
Object.assign(window, {
	render,
	ref,
	root,
	unmount: () => flushSync(() => root.unmount()),
	fieldset: (disabled = false, show = true) =>
		flushSync(() =>
			root.render(
				React.createElement(
					"form",
					null,
					React.createElement(
						Fieldset,
						{ disabled },
						React.createElement("legend", { slot: "legend" }, "Settings"),
						show
							? React.createElement(Input, {
									id: "input",
									name: "name",
									value: "Peter",
									onAcmeInput: (e: any) => {
										count++;
										(window as any).detail = e.detail;
									},
								})
							: null,
					),
				),
			),
		),
	events: () => count,
});
render({ padding: 4, paddingInline: 2 });
const h = React.createElement;
function Stateful() {
	const [count, setCount] = React.useState(0);
	return h(
		"button",
		{ id: "stateful", onClick: () => setCount((v) => v + 1) },
		String(count),
	);
}
Object.assign(window, {
	show: (when = false, preserveState = false) =>
		flushSync(() =>
			root.render(
				h(Show, {
					when,
					preserveState,
					renderContent: () => h(Stateful),
					renderFallback: () => h("p", { id: "fallback" }, "Fallback"),
				}),
			),
		),
	tabs: (value = "a", unmountOnExit = false) =>
		flushSync(() =>
			root.render(
				h(
					Tabs,
					{ value, lazyMount: true, unmountOnExit },
					h(Tab, { value: "a" }, "A"),
					h(Tab, { value: "b" }, "B"),
					h(TabPanel, {
						value: "a",
						slot: "panels",
						renderContent: () => h(Stateful),
					}),
					h(TabPanel, {
						value: "b",
						slot: "panels",
						renderContent: () => h("p", { id: "panel-b" }, "Second"),
					}),
				),
			),
		),
	disclosure: (expanded = false) =>
		flushSync(() =>
			root.render(
				h(
					Collapsible,
					{ expanded, lazyMount: true, unmountOnExit: true },
					h(CollapsibleTrigger, null, "Toggle"),
					h(CollapsibleContent, { renderContent: () => h(Stateful) }),
				),
			),
		),
	video: (label = "English", track = true) =>
		flushSync(() =>
			root.render(
				h(
					Video,
					{ id: "video", autoplay: false, loading: "eager", src: "/clip.mp4" },
					track
						? h("track", {
								id: "track",
								kind: "captions",
								src: "/captions.vtt",
								label,
								srcLang: "en",
								default: true,
							})
						: null,
					h("span", { slot: "fallback" }, "Unavailable"),
				),
			),
		),
});
Object.assign(window, {
	videoProps: (props = {}) =>
		flushSync(() =>
			root.render(h(Video, { id: "video", autoplay: false, ...props })),
		),
});
Object.assign(window, {
	container,
	refProbe: () => {
		let attached = 0,
			cleaned = 0;
		const ref = (node) => {
			if (node) {
				attached++;
				return () => cleaned++;
			}
		};
		flushSync(() => root.render(h(React.StrictMode, null, h(Box, { ref }))));
		window.refCounts = () => ({ attached, cleaned });
	},
});
import { applyReactStyleInputs } from "@acmelabs/design-system/react-support";
Object.assign(window, {
	transferStyle: () => applyReactStyleInputs(ref.current, {}, { padding: 8 }),
});
Object.assign(window, {
	group: (size) =>
		flushSync(() =>
			root.render(
				h(
					Group,
					{ size: "large" },
					h(Button, { id: "button", ...(size ? { size } : {}) }, "Action"),
				),
			),
		),
});

Object.assign(window,{eventLifetime:()=>flushSync(()=>root.render(h(Input,{ref,onAcmeInput:()=>count++}))) });
