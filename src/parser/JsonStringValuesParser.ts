import { JsonArray, JsonPrimitive, JsonValue } from "type-fest";

import { JsonStringValue } from "@/types";

import { JsonParser } from "./JsonParser.js";

interface JsonStringValuesParserOptions {
  /**
   * String values converted to `null`.
   * - If set to `false`, conversion won't happen.
   * - If omitted, `JSON.parse` will be applied (`"null"` will become `null`).
   * - If passed array, only values from the array will be converted to `null`.
   */
  nullValues?: string[] | false;

  /**
   * String values converted to `false`.
   * - If set to `false`, conversion won't happen.
   * - If omitted, `JSON.parse` will be applied (`"false"` will become `false`).
   * - If passed array, only values from the array will be converted to `false`.
   */
  falseValues?: string[] | false;

  /**
   * String values converted to `true`.
   * - If set to `false`, conversion won't happen.
   * - If omitted, `JSON.parse` will be applied(`"true"` will become `true`).
   * - If passed array, only values from the array will be converted to `true`.
   */
  trueValues?: string[] | false;

  /**
   * Try to convert value to number
   * @default true
   */
  parseNumbers?: boolean;

  /**
   * Array delimiter.
   * If set, string will be splitted into array by given pattern(s).
   * @example
   * const parser = new JsonStringValuesParser({arrayDelimiter: ", "});
   * parser.parse("1, 2, 3");
   * // returns [1, 2, 3]
   */
  arrayDelimiter?: string | string[];
}

class JsonStringValuesParser extends JsonParser {
  constructor(readonly options?: JsonStringValuesParserOptions) {
    super();
    if (typeof this.options === "undefined") {
      this.options = {};
    }
    if (typeof this.options.parseNumbers === "undefined") {
      this.options.parseNumbers = true;
    }
  }

  public parse(source: JsonStringValue): JsonValue {
    return super.parse(source);
  }

  protected processPrimitive(source: string): JsonPrimitive | JsonArray {
    let result: JsonPrimitive | JsonArray;

    result = this.parseNull(source);
    if (result === null) return result;

    result = this.parseFalse(source);
    if (result === false) return result;

    result = this.parseTrue(source);
    if (result === true) return result;

    result = this.parseNumber(source);
    if (typeof result === "number") return result;

    result = this.parseArray(source);
    if (Array.isArray(result)) return this.processArray(result);

    return this.parseString(source);
  }

  protected parseNull(value: string): string | null {
    return this.parseValue(null, value, this.options?.nullValues);
  }

  protected parseFalse(value: string): string | false {
    return this.parseValue(false, value, this.options?.falseValues);
  }

  protected parseTrue(value: string): string | true {
    return this.parseValue(true, value, this.options?.trueValues);
  }

  protected parseNumber(value: string): string | number {
    if (!this.options?.parseNumbers) {
      return value;
    }
    const result = this.useJsonParse(value);
    return typeof result === "number" ? result : value;
  }

  protected parseArray(value: string): string | string[] {
    if (!this.options?.arrayDelimiter) {
      return value;
    }

    const delimiters = Array.isArray(this.options.arrayDelimiter)
      ? this.options.arrayDelimiter
      : [this.options.arrayDelimiter];

    let splits: string[] = [value];

    for (let i = 0; i < delimiters.length; i++) {
      splits = splits.reduce((acc, cur) => {
        acc.push(...cur.split(delimiters[i]));
        return acc;
      }, [] as string[]);
    }

    if (splits.length < 2) {
      return value;
    }

    return splits;
  }

  protected parseString(value: string): string {
    return value;
  }

  private parseValue<T extends JsonPrimitive>(
    parseFor: T,
    value: string,
    strings?: string[] | false,
  ): T | string {
    if (strings !== false) {
      if (strings?.length) {
        if (strings.includes(value)) {
          return parseFor;
        }
      } else if (this.useJsonParse(value) === parseFor) {
        return parseFor;
      }
    }
    return value;
  }

  private useJsonParse(value: string): JsonPrimitive {
    try {
      return JSON.parse(value);
    } catch (error) {
      if (error instanceof Error && error.name === "SyntaxError") {
        return value;
      }
      throw error;
    }
  }
}

export { JsonStringValuesParser };
export type { JsonStringValuesParserOptions };
