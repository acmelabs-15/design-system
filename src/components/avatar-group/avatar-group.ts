import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { message, messageCatalogs } from "../../shared/messages";
import { isPlainRecord } from "../../shared/plain-record";
import type { AvatarSize } from "../avatar/avatar";
import { avatarGroupStructureCss } from "../../generated/components/avatar-group/avatar-group-structure.styles";

export type AvatarMember = Readonly<{ id: string; src?: string; label: string; initials?: string }>;
const sizes = { tiny: 16, small: 24, medium: 32, large: 48 } as const;
/** A bounded collection of entity images and its exact remaining count.
 * @slot overflow - Replacement content for the remaining count.
 * @csspart root - The composed Group.
 * @csspart member - A visible member.
 * @csspart overflow - The remaining-count surface.
 */
export class AcmeAvatarGroup extends AcmeElement {
  static styles = [sharedCss, avatarGroupStructureCss];
  @atomState() private entries: readonly AvatarMember[] = Object.freeze([]);
  /** @default [] */
  @property({ noAccessor: true, type: Array }) get members() {
    return this.entries;
  }
  set members(value: readonly AvatarMember[]) {
    if (value == null) {
      value = [];
    }
    if (!Array.isArray(value)) {
      throw new TypeError("Avatar members require an array");
    }
    const ids = new Set<string>();
    const next = value.map((member) => {
      if (
        !isPlainRecord(member) ||
        typeof member.id !== "string" ||
        !member.id ||
        typeof member.label !== "string" ||
        (member.src !== undefined && typeof member.src !== "string") ||
        (member.initials !== undefined && typeof member.initials !== "string")
      ) {
        throw new TypeError("Avatar members require an id, label and optional string source/initials");
      }
      if (ids.has(member.id)) {
        throw new TypeError("Avatar member IDs must be unique");
      }
      ids.add(member.id);
      return Object.freeze({
        id: member.id,
        label: member.label,
        src: typeof member.src === "string" ? member.src : undefined,
        initials: typeof member.initials === "string" ? member.initials : undefined,
      });
    });
    if (!Number.isSafeInteger(next.length + this.extra)) {
      throw new RangeError("Avatar total must be a safe integer");
    }
    const previous = this.entries;
    this.entries = Object.freeze(next);
    this.requestUpdate("members", previous);
  }
  @atomState() @property({ noAccessor: true, useDefault: true }) size: AvatarSize = "small";
  @atomState() private maximum = 3;
  /** @default 3 */
  @property({ noAccessor: true, type: Number, converter: { fromAttribute: (value: string | null) => (value === null ? 3 : Number(value)) } }) get limit() {
    return this.maximum;
  }
  set limit(value: number) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new RangeError("Avatar limit must be a nonnegative integer");
    }
    const previous = this.maximum;
    this.maximum = value;
    this.requestUpdate("limit", previous);
  }
  @atomState() private additional = 0;
  /** @default 0 */
  @property({ noAccessor: true, type: Number, converter: { fromAttribute: (value: string | null) => (value === null ? 0 : Number(value)) } }) get extra() {
    return this.additional;
  }
  set extra(value: number) {
    if (!Number.isSafeInteger(value) || value < 0 || !Number.isSafeInteger(value + this.members.length)) {
      throw new RangeError("Extra avatar count and total must be nonnegative safe integers");
    }
    const previous = this.additional;
    this.additional = value;
    this.requestUpdate("extra", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) reverse = false;
  @atomState() @property({ noAccessor: true, useDefault: true }) overlap = "auto";
  private readonly localeChanges = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  render() {
    const total = this.members.length + this.extra;
    const overflows = this.extra > 0 || (this.limit > 0 && total > this.limit);
    const shown = overflows && this.limit > 0 ? this.members.slice(0, Math.max(0, this.limit - 1)) : this.members;
    const hidden = total - shown.length;
    const locale = this.themeContext.scope.effective.get().locale;
    const numbers = new Intl.NumberFormat(locale);
    const count = numbers.format(hidden);
    const label = message(locale, `avatarGroup.more.${new Intl.PluralRules(locale).select(hidden)}`, hidden === 1 ? "{count} more person" : "{count} more people").replaceAll("{count}", count);
    const size = sizes[this.size] ?? sizes.small;
    const styles = { "--avatar-group-overlap": this.overlap === "auto" ? `${Math.round(size * 0.3)}px` : this.overlap, "--avatar-group-size": `${size}px` };
    return html`<acme-group class="avatar-group" part="root" .gap=${0} .alignItems=${"center"} style=${styleMap(styles)}>
      ${repeat(
        shown,
        (member) => member.id,
        (member, index) =>
          html`<span class="member" part="member" style=${styleMap({ zIndex: String(this.reverse ? index : shown.length - index) })}><acme-avatar .size=${this.size} .src=${member.src ?? ""} .label=${member.label} .initials=${member.initials ?? ""}></acme-avatar></span>`,
      )}
      ${hidden > 0 ? html`<span class="member overflow" part="overflow" style=${styleMap({ zIndex: this.reverse ? String(shown.length) : "0" })}><span class="sr">${label}</span><slot name="overflow"><bdi class="count" dir="ltr" aria-hidden="true">${hidden > 9 ? `${numbers.format(9)}+` : `+${count}`}</bdi></slot></span>` : nothing}
    </acme-group>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-avatar-group": AcmeAvatarGroup;
  }
}
