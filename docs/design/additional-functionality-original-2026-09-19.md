Additional things I'd like to have the design system do/support/etc that I think we should research and evaluate.

- In documentation, remove the following: “ACME Design System · Foundations and components after vercel.com/geist, read in full · Google Sans Flex and Google Sans Code · Built with Lit.”

- In documentation, have the pagination at the bottom of the page become sticky so it's always visible and can be clicked at any time.

- The combo box padding in the options is correct at the start of the option but overflows at the end of the option.

  <img src="/Users/peterkloss/Screenshots/CleanShot 2026-09-19 at 4.28.02 AM.png" alt="CleanShot 2026-09-19 at 4.28.02 AM" style="zoom:13%;" />

- I think it might make sense to create a component, I think, maybe of sorts, that allows for an indicator icon or an indicator to be animated between a group of items that can be selected one at a time.

- I'm wondering for the animation if we should create some sort of animation component or transition component or perhaps both that leverages the Lit Motion package, where we introduce a component that has a bunch of standard in out animations with standard animation timings.  This could be and should be used for everything from full page transitions to modal and drawer transitions like enter and exit, skeleton loaders, container transforms, individual component states like switches, various states. . I think Material Design 3 by Google probably has some sort of standard around this.  It looks like they do and they split them into 3 categories that I think align nicely with the capabilities of Lit Motion nicely:

  - [Motion physics system](https://m3.material.io/styles/motion/overview/how-it-works)
  - [Easing and duration](https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration)
  - [Transitions](https://m3.material.io/styles/motion/transitions/transition-patterns)

- Checkbox, animate, check and uncheck states, same with radio, same with switches as well as other components.  I think Material Design 3 has nice standards around this that the above animation/transition component - and I think we should evaluate the animations in the material design three components that likely would make sense to apply to ours.

- I think we should also evaluate the material design three specs regarding shapes and see where it makes sense to apply those in our design system. This also likely makes sense to make a part of that animation/transition component(s).

  - [Shape overview & principles](https://m3.material.io/styles/shape/overview-principles)
  - [Corner radius scale](https://m3.material.io/styles/shape/corner-radius-scale)
  - [Shape morph](https://m3.material.io/styles/shape/shape-morph)

- I think we should evaluate some of the foundations that are documented for Material Design 3 and figure out if there are things that we need to include.  Here are some of the documented foundations they’ve documented that I think we should take a look at (probably would make sense to also evaluate Chakra-UI and Radix - both it’s primitives and themes packages - to see what their implementations think about these things):

  - Layout
    - [Overview](https://m3.material.io/foundations/layout/layout-overview/overview)
    - [Parts of layout](https://m3.material.io/foundations/layout/layout-overview/parts-of-layout)
    - [Adaptive design](https://m3.material.io/foundations/layout/layout-overview/adaptive-design)
    - Scaffold
      - [Overview](https://m3.material.io/foundations/layout/scaffold/overview)
      - [Bars](https://m3.material.io/foundations/layout/scaffold/bars)
      - [Rails](https://m3.material.io/foundations/layout/scaffold/rails)
      - [Panes](https://m3.material.io/foundations/layout/scaffold/panes)
    - Grids & spacing
      - [Overview](https://m3.material.io/foundations/layout/grids-spacing/overview)
      - [Grids](https://m3.material.io/foundations/layout/grids-spacing/grids)
      - [Spacing](https://m3.material.io/foundations/layout/grids-spacing/spacing)
      - [Density](https://m3.material.io/foundations/layout/grids-spacing/density)
    - Breakpoints
      - [Overview](https://m3.material.io/foundations/layout/breakpoints/overview)
      - [Compact](https://m3.material.io/foundations/layout/breakpoints/compact)
      - [Medium](https://m3.material.io/foundations/layout/breakpoints/medium)
      - [Expanded](https://m3.material.io/foundations/layout/breakpoints/expanded)
      - [Large & extra-large](https://m3.material.io/foundations/layout/breakpoints/large-extra-large)
    - [Bidirectionality & RTL](https://m3.material.io/foundations/layout/bidirectionality-rtl)
    - Canonical layout examples
      - [Overview](https://m3.material.io/foundations/layout/canonical-examples/overview)
      - [Feed](https://m3.material.io/foundations/layout/canonical-examples/feed)
      - [List-detail](https://m3.material.io/foundations/layout/canonical-examples/list-detail)
      - [Supporting pane](https://m3.material.io/foundations/layout/canonical-examples/supporting-pane)
  - [Customization](https://m3.material.io/foundations/customization)
  - Design tokens
    - [Overview](https://m3.material.io/foundations/design-tokens/overview)
    - [How to use tokens](https://m3.material.io/foundations/design-tokens/how-to-use-tokens)
  - Interaction
    - [Gestures](https://m3.material.io/foundations/interaction/gestures)
    - [Inputs](https://m3.material.io/foundations/interaction/inputs)
    - [Selections](https://m3.material.io/foundations/interaction/selection)
    - [States](https://m3.material.io/foundations/interaction/states/overview)

- I think I'd like for us to also create a version of these components that are compatible with React probably by using the [@lit/react](https://lit.dev/docs/frameworks/react/) utility.  I'd also like us to take a look at all of the [TanStack packages](https://github.com/TanStack) that support multiple frameworks and see how they structure their code base and see if we can come up with a code base structure that makes sense for us.  A really great example of a package that supports a shitload of frameworks is their [table package](https://github.com/TanStack/table).

- Right now, this is the only view our pagination supports. I'm wondering if it should also support a more complex pagination scenario, for instance, like you often see with paginated tables.  I feel like this is something we should research.![CleanShot 2026-09-19 at 5.57.07 AM](/Users/peterkloss/Screenshots/CleanShot 2026-09-19 at 5.57.07 AM.png)

- I'd like for our toast to render multiple open toasts in the following way, just like [ShadCN](https://ui.shadcn.com/docs/components/base/toast) does.<img src="/Users/peterkloss/Screenshots/CleanShot 2026-09-19 at 6.06.53 AM.png" alt="CleanShot 2026-09-19 at 6.06.53 AM" style="zoom:23%;" />

- I'm wondering if we should support plain and rich tooltip variations like in [Material Design 3](https://m3.material.io/components/tooltips/overview), or if the rich tooltip variation is simply a popover that is triggered on hover.

- I think for the default button, instead of being a solid black background (light mode) or solid white background (dark mode) like it is now I’d like it to use the solid blue background like it does in the [custom button example](http://localhost:4180/components/button#custom) that it shows in the docs.  I think I'd like to have this applied to all the other places where it makes sense to apply this, like the checkbox or the radio or the switch, etc.

- I'd also like to make sure that the design system supports the ability to create custom themes.

- Establish which naming convention the community favors most, “toast” or “snackbar”.

- Evaluate switching from biome to oxlint leveraging [ultracite](https://www.ultracite.ai/) for the preset.

- I’d like for us to evaluate the AG Grid [AI Toolkit](https://www.ag-grid.com/javascript-data-grid/ai-toolkit/), [MCP Server](https://www.ag-grid.com/javascript-data-grid/mcp-server/) and [Skills](https://www.ag-grid.com/javascript-data-grid/skills/) implementations to see which of those 3 things would make sense for us to make design system specific versions of as well as if it would make sense to use the [TanStack Intent](https://tanstack.com/intent/latest) package for any of the 3 things we think make sense to include in the design system.

- I’d like for us to evaluate the [TanStack Devtools package](https://tanstack.com/devtools/latest) and see if it would make sense for us to implement lit/react devtools for our design system (we’d have to use the vanilla js version of the framework for the lit HTML implementation).

- I’d like for us to evaluate the [TanStack Config package](https://tanstack.com/config/latest) and evaluate whether there are any conventions or ideas that we think are worth bringing over into our codebase.

- I'd also like for us to evaluate the breakpoint system that chakra-ui provides and see if it makes sense to provide something similar in our design system https://chakra-ui.com/docs/styling/responsive-design.
