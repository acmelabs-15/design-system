import { describe, expect, test } from "bun:test";
import "../../../index.ts";
import type { AcmeChart } from "../chart.ts";

describe("acme-chart", () => {
  test("without data the default slot carries the plot", async () => {
    document.body.innerHTML = `<acme-chart height="120"><svg></svg></acme-chart>`;
    const el = document.body.firstElementChild as AcmeChart;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".plot slot:not([name])")).not.toBeNull();
    expect(el.shadowRoot!.querySelector(".host")).toBeNull();
    expect((el.shadowRoot!.querySelector(".plot") as HTMLElement).style.height).toBe("120px");
  });

  test("with data it renders the chart host and parses the series keys", async () => {
    document.body.innerHTML = `<acme-chart type="bar" x="m" y="a, b" data='[{"m":"Jan","a":1,"b":2}]'></acme-chart>`;
    const el = document.body.firstElementChild as AcmeChart;
    await el.updateComplete;
    expect(el.data.length).toBe(1);
    expect(el.shadowRoot!.querySelector(".host")).not.toBeNull();
    expect(el.shadowRoot!.querySelector(".plot slot:not([name])")).toBeNull();
  });
});
