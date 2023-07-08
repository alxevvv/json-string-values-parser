import { describe, expect, it } from "vitest";

import { JsonStringValuesParser } from "@/parser";

describe("class JsonStringValuesParser", () => {
  it("should parse string values", () => {
    const input = {
      a: "1",
      b: "false",
      c: "string",
      d: "null",
      e: "undefined",
    };

    const expected = {
      a: 1,
      b: false,
      c: "string",
      d: null,
      e: "undefined",
    };

    const parser = new JsonStringValuesParser();
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse nested objects", () => {
    const input = {
      a: "top-level",
      b: {
        c: "true",
        d: ["1", "2", "3"],
        e: { f: "false", g: "null" },
      },
    };

    const expected = {
      a: "top-level",
      b: {
        c: true,
        d: [1, 2, 3],
        e: { f: false, g: null },
      },
    };

    const parser = new JsonStringValuesParser();
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse nullables according `nullValues` option", () => {
    const input = {
      a: "not-null",
      b: "null",
      c: "NULL",
      d: ["a", "null", "false", "NULL"],
      e: {
        f: "true",
        g: "NULL",
        h: "null",
      },
    };

    const expected = {
      a: "not-null",
      b: "null",
      c: null,
      d: ["a", "null", false, null],
      e: {
        f: true,
        g: null,
        h: "null",
      },
    };

    const parser = new JsonStringValuesParser({
      nullValues: ["NULL"],
    });

    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse booleans according `falseValues` and `trueValues` options", () => {
    const input = {
      a: "TRUE",
      b: "false",
      c: "NO",
      d: "yes",
      e: "string",
      f: "1",
      g: ["FALSE", "true", "no", "YES"],
      h: {
        i: "FALSE",
        j: ["false", "TRUE", "NULL", "null"],
      },
      k: "null",
    };

    const expected = {
      a: true,
      b: "false",
      c: "NO",
      d: true,
      e: "string",
      f: 1,
      g: [false, true, false, true],
      h: {
        i: false,
        j: ["false", true, "NULL", null],
      },
      k: null,
    };

    const parser = new JsonStringValuesParser({
      trueValues: ["TRUE", "true", "YES", "yes"],
      falseValues: ["FALSE", "no"],
    });

    expect(parser.parse(input)).toEqual(expected);
  });

  it("should not parse if disabled", () => {
    const input = {
      a: "false",
      b: "true",
      c: "null",
    };

    const expected = {
      a: "false",
      b: "true",
      c: "null",
    };

    const parser = new JsonStringValuesParser({
      falseValues: false,
      trueValues: false,
      nullValues: false,
    });

    expect(parser.parse(input)).toEqual(expected);
  });

  it("should not parse numbers if disabled", () => {
    const input = {
      a: "0",
      b: "-1",
      c: "3.14",
    };

    const expected = {
      a: "0",
      b: "-1",
      c: "3.14",
    };

    const parser = new JsonStringValuesParser({
      parseNumbers: false,
    });

    expect(parser.parse(input)).toEqual(expected);
  });

  it("should find array-like strings", () => {
    const input = {
      a: "a, b, c",
      b: ["a, b, c", "d, e, f"],
      c: {
        d: "abc, def, ghi",
        e: "100, 200, 300",
        f: "true, false, null",
      },
      g: ", , ,",
    };

    const expected = {
      a: ["a", "b", "c"],
      b: [
        ["a", "b", "c"],
        ["d", "e", "f"],
      ],
      c: {
        d: ["abc", "def", "ghi"],
        e: [100, 200, 300],
        f: [true, false, null],
      },
      g: ["", "", ","],
    };

    const parser = new JsonStringValuesParser({
      arrayDelimiter: ", ",
    });

    expect(parser.parse(input)).toEqual(expected);
  });

  it("should find array literal", () => {
    const input = {
      a: "[1,2,3]",
    };

    const expected = {
      a: [1, 2, 3],
    };

    const parser = new JsonStringValuesParser();

    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse array members", () => {
    const input = {
      a: '[1, "two", false, [null, "one"]]',
    };

    const expected = {
      a: [1, "two", false, [null, "one"]],
    };

    const parser = new JsonStringValuesParser();

    expect(parser.parse(input)).toEqual(expected);
  });

  it("should find array-like strings using multiple delimiters", () => {
    const input = {
      a: "a, b, c : d : e__f__g",
    };

    const expected = {
      a: ["a", "b", "c", "d", "e", "f", "g"],
    };

    const parser = new JsonStringValuesParser({
      arrayDelimiter: [", ", " : ", "__"],
    });

    expect(parser.parse(input)).toEqual(expected);
  });
});
