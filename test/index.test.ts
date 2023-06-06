import { describe, expect, it } from "vitest";

describe("index.ts", () => {
  it("should export base class", async () => {
    expect(typeof (await import("../src/index")).JsonParser).toBe("function");
  });

  it("should export parser class", async () => {
    expect(typeof (await import("../src/index")).JsonStringValuesParser).toBe(
      "function",
    );
  });

  it("should export helper function", async () => {
    expect(typeof (await import("../src/index")).jsonParseStringValues).toBe(
      "function",
    );
  });
});
