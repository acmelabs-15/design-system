import * as React from "react";
import { Input } from "@acmelabs/design-system-react/components/input";
import { Box } from "@acmelabs/design-system-react/components/box";
import { Show } from "@acmelabs/design-system-react/components/show";
import { Video } from "@acmelabs/design-system-react/components/video";
import { Pagination } from "@acmelabs/design-system-react/components/pagination";
import type { AcmeInput } from "@acmelabs/design-system/components/input";
const ref = React.createRef<AcmeInput>();
<Input
	ref={ref}
	value="hello"
	onAcmeInput={(event) => {
		const text: string = event.detail.value;
		console.log(text);
	}}
/>;
<Box as="section" padding={{ compact: 2, medium: 4 }} />;
<Show when renderContent={() => <Input value="Owned" />} />;
<Pagination onAcmeRequest={event => {
  if (event.detail.action === "page") { const page: number = event.detail.page; console.log(page); }
  if (event.detail.action === "page-size") { const pageSize: number = event.detail.pageSize; console.log(pageSize); }
}} />;
<Video preload="metadata">
	<track src="captions.vtt" kind="captions" />
</Video>;
// @ts-expect-error Input has a string value.
<Input value={42} />;
// @ts-expect-error Methods belong on the element ref.
<Input reportValidity={() => true} />;
// @ts-expect-error Native form state is read-only.
<Input validity={{}} />;
// @ts-expect-error Box uses its selected structural tags.
<Box as="button" />;
<Input
	onAcmeInput={(event) => {
		// @ts-expect-error The event detail retains its string value.
		const value: number = event.detail.value;
		console.log(value);
	}}
/>;
