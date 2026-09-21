// Generated from compiled CSS. Edit its generator input.
import { css } from "lit";
export const jsonViewCss = css`.json :where(.tree) {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  background-color: #0000;
  margin: 0;
  padding: 0;
  line-height: 1.25rem;
  display: inline;
}

.json :where(.tree) :where(.top) {
  padding-block: 0;
  outline-style: none;
  margin: 0;
  padding-left: .5rem;
  padding-right: 0;
  display: inline;
}

.json :where(.tree) :where(.top) :where(.line) :where(.flat) {
  margin: 0;
  padding: 0;
  display: inline;
}

.json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) {
  outline-style: none;
  margin: 0;
  padding: 0;
  display: inline;
}

.json :where(.tree) :where(.top) :where(.line) :where(.group), .json :where(.tree) :where(.top) :where(.group) {
  margin: 0;
  padding: 0;
  display: block;
}

.json :where(.tree) :where(.top) :where(.group) :where(.item) {
  padding-block: 0;
  outline-style: none;
  margin: 0;
  padding-left: .5rem;
  padding-right: 0;
  display: block;
}

.json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.flat) {
  margin: 0;
  padding: 0;
  display: inline;
}

.json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.group) {
  margin: 0;
  padding: 0;
  display: block;
}

.json :where(.tree) :where(.top) :where(.line) :where(.toggle) :where(.chev), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle) :where(.chev) {
  vertical-align: top;
  width: 1rem;
  height: 1rem;
  color: var(--ds-gray-500);
  flex: 0 0 16px;
  justify-content: center;
  align-items: center;
  margin-left: -18px;
  margin-right: .125rem;
  display: inline-flex;
  translate: 0 .125rem;
}

.json :where(.tree) :where(.top) :where(.line) :where(.toggle) {
  box-sizing: border-box;
  cursor: pointer;
  touch-action: manipulation;
  vertical-align: top;
  border-radius: .25rem;
  min-height: 1.25rem;
  margin-left: -.75rem;
  padding-left: 18px;
  display: inline-block;
}

.json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) {
  box-sizing: border-box;
  vertical-align: top;
  border-radius: .25rem;
  min-height: 1.25rem;
  margin-left: -.75rem;
  padding-left: 18px;
  display: inline-block;
}

.json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle) {
  box-sizing: border-box;
  cursor: pointer;
  touch-action: manipulation;
  vertical-align: top;
  border-radius: .25rem;
  min-height: 1.25rem;
  margin-left: -.75rem;
  padding-left: 18px;
  display: inline-block;
}

.json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.brace) {
  box-sizing: border-box;
  vertical-align: top;
  border-radius: .25rem;
  min-height: 1.25rem;
  margin-left: -.75rem;
  padding-left: 18px;
  display: inline-block;
}

.json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) {
  box-sizing: border-box;
  vertical-align: top;
  border-radius: .25rem;
  display: inline;
}

.json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line.block), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.close.block) {
  display: block;
}

.json {
  font-family: var(--acme-font-mono);
  font-size: 13px;
  line-height: 1.25rem;
  font-weight: var(--acme-font-weight-400);
  display: inline;
}

.json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.key) :where(mark), .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.str) :where(mark), .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.num) :where(mark), .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.bool) :where(mark), .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.nil) :where(mark), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.key) :where(mark), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.str) :where(mark), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.num) :where(mark), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.bool) :where(mark), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.nil) :where(mark), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle) :where(.key) :where(mark), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.brace) :where(.key) :where(mark) {
  background-color: var(--acme-highlight-yellow);
  color: var(--ds-black);
}

.json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.key), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.key), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle) :where(.key), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.brace) :where(.key) {
  font-weight: var(--acme-font-weight-400);
  color: var(--ds-pink-900);
}

.json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.bool), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.bool) {
  color: var(--ds-amber-900);
}

.json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.num), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.num) {
  color: var(--ds-blue-900);
}

.json :where(.tree) :where(.top) :where(.line) :where(.toggle) :where(.dots), .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.nil), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.nil), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle) :where(.dots) {
  color: var(--ds-gray-900);
}

.json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.str), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.str) {
  color: var(--ds-green-900);
}

.json > strong {
  color: var(--ds-gray-1000);
  font-weight: var(--acme-font-weight-550);
}

.json :where(.tree) :where(.top) :where(.line) :where(.toggle) :where(.chev) svg, .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle) :where(.chev) svg {
  width: 1rem;
  height: 1rem;
}

@media (hover: hover) {
  .json :where(.tree) :where(.top) :where(.line) :where(.toggle)[data-hover] :where(.chev), .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle)[data-hover] :where(.chev) {
    color: var(--ds-gray-1000);
  }
}

.json :where(.tree) :where(.top)[data-focus] :where(.line) :where(.toggle), .json :where(.tree) :where(.top) :where(.group) :where(.item)[data-focus] :where(.line) :where(.toggle) {
  background-color: var(--ds-gray-alpha-100);
  outline-offset: 1px;
  outline-width: 2px;
  outline-style: solid;
  outline-color: var(--ds-blue-700);
}

.json :where(.tree) :where(.top)[data-focus] :where(.line) :where(.toggle) :where(.chev), .json :where(.tree) :where(.top) :where(.group) :where(.item)[data-focus] :where(.line) :where(.toggle) :where(.chev) {
  color: var(--ds-gray-1000);
}

.json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair)[data-focus] :where(.cell), .json :where(.tree) :where(.top) :where(.group) :where(.item)[data-focus] :where(.row), .json :where(.tree) :where(.top) :where(.group) :where(.item)[data-focus] :where(.line) :where(.brace) {
  outline-offset: 1px;
  outline-width: 2px;
  outline-style: solid;
  outline-color: var(--ds-blue-700);
}

@media (hover: hover) {
  .json :where(.tree) :where(.top) :where(.line) :where(.toggle)[data-hover], .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle)[data-hover] {
    background-color: var(--ds-gray-alpha-100);
  }
}

:where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.bool), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.bool) {
  color: var(--ds-amber-700);
}

:where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.str), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.num), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.str), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.num) {
  color: var(--ds-blue-700);
}

:where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.line) :where(.toggle) :where(.chev), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.line) :where(.toggle) :where(.dots), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.nil), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.nil), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle) :where(.chev), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle) :where(.dots) {
  color: var(--ds-gray-700);
}

:where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.line) :where(.flat) :where(.pair) :where(.cell) :where(.key), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.row) :where(.key), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle) :where(.key), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.brace) :where(.key) {
  color: var(--ds-pink-700);
}

@media (hover: hover) {
  :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.line) :where(.toggle)[data-hover] :where(.chev), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item) :where(.line) :where(.toggle)[data-hover] :where(.chev) {
    color: var(--ds-gray-500);
  }
}

:where(:host([data-dark])) .json :where(.tree) :where(.top)[data-focus] :where(.line) :where(.toggle) :where(.chev), :where(:host([data-dark])) .json :where(.tree) :where(.top) :where(.group) :where(.item)[data-focus] :where(.line) :where(.toggle) :where(.chev) {
  color: var(--ds-gray-500);
}
`;
