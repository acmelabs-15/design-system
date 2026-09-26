import { expect, test } from "bun:test";
import { browserIconModule } from "../browser-icon-modules";

test("generated artwork and family imports use browser URLs without changing geometry", () => {
  const input = 'import { artwork } from "../../../records/home";\nartwork.add("outlined", true, { paths: [{d:"M160-120v-480"}] });\nexport { artwork };\nimport "../../artwork/outlined/filled/home";';
  expect(browserIconModule(input)).toBe(input.replace('records/home"', 'records/home.js"').replace('filled/home"', 'filled/home.js"'));
  expect(browserIconModule(browserIconModule(input))).toBe(browserIconModule(input));
});
