export type Action =
  | { datatype: string; type: "error"; message: string }
  | { datatype: string; type: "success" };
