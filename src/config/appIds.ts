export const appIds = [
  "finder",
  "textedit",
  "paint",
  "control-panels",
  "browser",
] as const;

export type AppId = (typeof appIds)[number];
