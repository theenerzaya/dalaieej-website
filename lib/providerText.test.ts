import { describe, expect, it } from "vitest";
import {
  decodeProviderHtmlEntities,
  toPlainProviderText,
  toPlainProviderTextList,
} from "./providerText";

describe("provider text normalization", () => {
  it("decodes Cloudbeds HTML entities without rendering HTML", () => {
    expect(
      toPlainProviderText(
        'ТАНЫ ЗАХИАЛГАД БАГТСАН ҮЙЛЧИЛГЭЭНҮҮД:&nbsp; Өглөөний цай |&nbsp;"Далай ээж"'
      )
    ).toBe('ТАНЫ ЗАХИАЛГАД БАГТСАН ҮЙЛЧИЛГЭЭНҮҮД: Өглөөний цай | "Далай ээж"');
  });

  it("strips tags and normalizes whitespace", () => {
    expect(toPlainProviderText("<p>Breakfast&nbsp;<strong>included</strong></p>")).toBe(
      "Breakfast included"
    );
  });

  it("decodes numeric entities", () => {
    expect(decodeProviderHtmlEntities("Tom &amp; Jerry &quot;Hi&quot;")).toBe('Tom & Jerry "Hi"');
    expect(toPlainProviderText("A&#160;B &#38; C")).toBe("A B & C");
  });

  it("filters empty provider text list items", () => {
    expect(toPlainProviderTextList([" Sauna&nbsp;", "<br>", "Kayak"])).toEqual([
      "Sauna",
      "Kayak",
    ]);
  });
});
