import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { StoreSelector } from "../../shared/store-connection";
import { ComposedParticipants } from "../../shared/composed-participants";
import { message, messageCatalogs } from "../../shared/messages";
import { breadcrumbsContext, breadcrumbFor, isBreadcrumbsBoundary, registerBreadcrumbsBoundary, type BreadcrumbOwner, type BreadcrumbMember } from "../../shared/breadcrumbs-context";
import { breadcrumbsStructureCss } from "../../generated/components/breadcrumbs/breadcrumbs-structure.styles";
/** A named navigation landmark containing the page's ordered ancestry.
 * @slot - Breadcrumb members, in navigation order.
 * @csspart root - The native navigation landmark.
 * @csspart list - The native ordered list.
 */
export class AcmeBreadcrumbs extends AcmeSemanticElement {
  static styles = [sharedCss, breadcrumbsStructureCss];
  private readonly members = createAtom<readonly BreadcrumbMember[]>([]);
  private readonly revision = createAtom(0);
  private readonly ordered = createAtom(() => {
    this.revision.get();
    return [...this.members.get()].filter((member) => !member.host.hidden).sort((a, b) => (a.host.compareDocumentPosition(b.host) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1));
  });
  private readonly owner: BreadcrumbOwner = {
    members: this.ordered,
    register: (member) => {
      this.members.set((members) => [...members, member]);
      return () => this.members.set((members) => members.filter((m) => m !== member));
    },
  };
  private readonly provider = new ContextProvider(this, { context: breadcrumbsContext, initialValue: this.owner });
  private readonly updates = new StoreSelector(this, () => this.ordered);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.members.get(),
    find: breadcrumbFor,
    boundary: isBreadcrumbsBoundary,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
    changed: () => this.revision.set((value) => value + 1),
  });
  constructor() {
    super();
    registerBreadcrumbsBoundary(this);
  }
  protected get semanticDefaults() {
    return { label: message(this.themeContext.scope.effective.get().locale, "breadcrumbs.label", "Breadcrumb") };
  }
  render() {
    return html`<nav part="root"><ol part="list" role="list"><slot></slot></ol></nav>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-breadcrumbs": AcmeBreadcrumbs;
  }
}
