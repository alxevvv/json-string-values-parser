import { JsonArray, JsonObject, JsonPrimitive, JsonValue } from "type-fest";

class JsonParser {
  public parse(source: JsonValue): JsonValue {
    if (Array.isArray(source)) {
      return this.processArray(source);
    } else if (source !== null && typeof source === "object") {
      return this.processObject(source as JsonObject);
    } else if (
      ["boolean", "number", "string"].includes(typeof source) ||
      source === null
    ) {
      return this.processPrimitive(source);
    } else {
      throw new TypeError("Unexpected source type");
    }
  }

  protected processArray(source: JsonArray) {
    return source.map(this.parse.bind(this));
  }

  protected processObject(source: JsonObject) {
    return Object.entries(source).reduce((acc, [key, value]) => {
      acc[key] = this.parse(value);
      return acc;
    }, {} as JsonObject);
  }

  protected processPrimitive(source: JsonPrimitive): JsonValue {
    return source;
  }
}

export { JsonParser };
