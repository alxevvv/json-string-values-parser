type JsonStringObject = { [Key in string]: JsonStringValue } & {
  [Key in string]?: JsonStringValue | undefined;
};

type JsonStringArray = JsonStringValue[] | readonly JsonStringValue[];

type JsonStringValue = string | JsonStringObject | JsonStringArray;

export type { JsonStringArray, JsonStringObject, JsonStringValue };
