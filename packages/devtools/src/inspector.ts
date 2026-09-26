import { createComponent, createSignal } from "solid-js";
import { render } from "solid-js/web";
import {
  JsonTree,
  MainPanel,
  Section,
  SectionDescription,
  SectionTitle,
  ThemeContextProvider,
} from "@tanstack/devtools-ui";
import { DiagnosticObserver, type DiagnosticMetadata, type DiagnosticOptions } from "./diagnostics";

const SnapshotTree = JsonTree<unknown, never>;

export interface DesignSystemInspector {
  mount(container: HTMLElement): void;
  unmount(): void;
  dispose(): void;
}
/** Mounts a scoped read-only TanStack Devtools UI surface shared by Lit and React. */
export function createInspector(metadata: DiagnosticMetadata, options: DiagnosticOptions): DesignSystemInspector {
  const observer = new DiagnosticObserver(metadata, options);
  let remove: (() => void) | undefined;
  let disposed = false;
  const unmount = () => {
    const cleanup = remove;
    remove = undefined;
    cleanup?.();
    observer.stop();
  };
  return {
    mount(container) {
      if (disposed) throw new Error("Inspector is disposed");
      if (remove) throw new Error("Inspector is already mounted");
      if (container.ownerDocument !== options.root.ownerDocument)
        throw new Error("Inspector and inspected root must share a document");
      if (container === options.root || container.contains(options.root))
        throw new Error("Mount the inspector beside or inside its inspected root, not around it");
      const surface = container.ownerDocument.createElement("section");
      surface.setAttribute("aria-label", "Design system inspector");
      surface.setAttribute("data-acme-inspector", "");
      container.append(surface);
      const [snapshot, setSnapshot] = createSignal(observer.getSnapshot());
      const unsubscribe = observer.subscribe(setSnapshot);
      const detach = render(
        () =>
          createComponent(ThemeContextProvider, {
            get theme() {
              return snapshot().components[0]?.theme.appearance ?? "light";
            },
            get children() {
              return createComponent(MainPanel, {
                withPadding: true,
                get children() {
                  return [
                    createComponent(Section, {
                      children: [
                        createComponent(SectionTitle, { children: "Design system inspector" }),
                        createComponent(SectionDescription, {
                          children: `Release ${metadata.version}. Read-only public component data. Sensitive values are ${options.includeSensitiveValues ? "explicitly enabled" : "redacted"}.`,
                        }),
                      ],
                    }),
                    createComponent(Section, {
                      children: [
                        createComponent(SectionTitle, { children: "Components" }),
                        createComponent(SnapshotTree, {
                          get value() {
                            return snapshot().components;
                          },
                          copyable: false,
                          defaultExpansionDepth: 2,
                        }),
                      ],
                    }),
                    createComponent(Section, {
                      children: [
                        createComponent(SectionTitle, { children: "Recent public events" }),
                        createComponent(SnapshotTree, {
                          get value() {
                            return snapshot().events;
                          },
                          copyable: false,
                          defaultExpansionDepth: 2,
                        }),
                      ],
                    }),
                  ];
                },
              });
            },
          }),
        surface,
      );
      remove = () => {
        unsubscribe();
        detach();
        surface.remove();
      };
      observer.start(surface);
    },
    unmount,
    dispose() {
      if (disposed) return;
      unmount();
      disposed = true;
    },
  };
}
