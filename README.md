# json-string-values-parser

Recursively traverse JSON properties and call transformation function on the value.

## Example

```typescript
import { jsonParseStringValues } from "json-string-values-parser";

const source = {
  a: "1",
  b: "false",
  c: "string",
  d: "null",
  e: "undefined",
};

const result = jsonParseStringValues(source);

console.log(result);

/*
{
  a: 1,
  b: false,
  c: "string",
  d: null,
  e: "undefined",
}
*/
```

## Install

```
npm install json-string-values-parser
```

## API

### Function

```typescript
import { jsonParseStringValues } from "json-string-values-parser";

jsonParseStringValues(source, options); // options is optional
```

### Class instantiation

```typescript
import { JsonStringValuesParser } from "json-string-values-parser";

const parser = new JsonStringValuesParser(options); // options is optional

parser.parse(source);
```

### Options

All options are optional.

#### `options.nullValues: string[] | false`

String values converted to `null`.

- If set to `false`, conversion won't happen.
- If omitted, `JSON.parse` will be applied (`"null"` will become `null`).
- If passed array, only values from the array will be converted to `null`.

#### `options.falseValues: string[] | false`

String values converted to `false`.

- If set to `false`, conversion won't happen.
- If omitted, `JSON.parse` will be applied (`"false"` will become `false`).
- If passed array, only values from the array will be converted to `false`.

#### `options.trueValues: string[] | false`

String values converted to `true`.

- If set to `false`, conversion won't happen.
- If omitted, `JSON.parse` will be applied(`"true"` will become `true`).
- If passed array, only values from the array will be converted to `true`.

#### `options.parseNumbers: boolean`

> default: `true`

Try to convert string to number using `JSON.parse` method.

#### `options.arrayDelimiter`

Array delimiter. If set, string will be splitted into array by given pattern(s).
Array values will be parsed again.

```typescript
jsonParseStringValues("1, 2, 3", { arrayDelimiter: ", " });
// returns [1, 2, 3]
```

## License

Licensed under the MIT license. Copyright (c) 2023-present Vladislav Alexeev
