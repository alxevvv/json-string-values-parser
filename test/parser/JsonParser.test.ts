import { JsonValue } from "type-fest";
import { describe, expect, it, vi } from "vitest";

import { JsonParser } from "@/parser";

describe("class JsonParser", () => {
  it("should create a deep copy of the object", () => {
    const parser = new JsonParser();

    const source = {
      a: 1,
      b: "string",
      c: [1, 2, 3],
      d: {
        x: true,
        y: null,
      },
    };

    const result = parser.parse(source) as typeof source;

    expect(result).toEqual(source);
    expect(result).not.toBe(source);
    expect(result.c).not.toBe(source.c);
    expect(result.d).not.toBe(source.d);
  });

  it("should call appropriate methods for different property types", () => {
    const parser = new JsonParser();

    const spyProcessArray = vi.spyOn(parser as any, "processArray");
    const spyProcessObject = vi.spyOn(parser as any, "processObject");
    const spyProcessPrimitive = vi.spyOn(parser as any, "processPrimitive");

    const source = {
      a: 1,
      b: "string",
      c: {
        d: false,
        e: [1, 2, 3],
        f: "aaa, bbb, ccc",
      },
    };

    const result = parser.parse(source) as typeof source;

    expect(result).toEqual(source);
    expect(spyProcessArray).toHaveBeenCalledTimes(1);
    expect(spyProcessObject).toHaveBeenCalledTimes(2);
    expect(spyProcessPrimitive).toHaveBeenCalledTimes(7);
  });

  it("should process an array as a source", () => {
    const parser = new JsonParser();

    const source: JsonValue = [
      { a: 1, b: 2 },
      123,
      { c: 3, d: 4 },
      "string",
      [7, 8, 9],
    ];

    const result = parser.parse(source) as typeof source;

    expect(result).toEqual(source);
  });

  it("should process a primitive as a source", () => {
    const parser = new JsonParser();

    expect(parser.parse(null)).toBe(null);
    expect(parser.parse(false)).toBe(false);
    expect(parser.parse(100)).toBe(100);
    expect(parser.parse("string")).toBe("string");
  });
});
