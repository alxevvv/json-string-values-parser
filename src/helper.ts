import { JsonValue } from "type-fest";

import {
  JsonStringValuesParser,
  JsonStringValuesParserOptions,
} from "./parser";
import { JsonStringValue } from "./types";

function jsonParseStringValues(
  source: JsonStringValue,
  options?: JsonStringValuesParserOptions,
): JsonValue {
  return new JsonStringValuesParser(options).parse(source);
}

export { jsonParseStringValues };
