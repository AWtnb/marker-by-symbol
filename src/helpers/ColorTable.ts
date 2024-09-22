export enum JpColor {
  "Yellow" = "黄色",
  "Cyan" = "水色",
  "Lime" = "緑色",
  "Magenta" = "ピンク",
  "Transparent" = "（なし）",
}

const colorNameTable: Map<string, string> = new Map();
colorNameTable.set(JpColor.Yellow, "Yellow");
colorNameTable.set(JpColor.Cyan, "Cyan");
colorNameTable.set(JpColor.Lime, "Lime");
colorNameTable.set(JpColor.Magenta, "Magenta");
colorNameTable.set(JpColor.Transparent, "Transparent");

export const JpColorNames: string[] = [...colorNameTable.keys()];

export const ToHtmlColorName = (jpName: string): string => {
  return colorNameTable.get(jpName) || "Transparent";
};

export const SymbolDefaultColor: Map<string, string> = new Map();
SymbolDefaultColor.set("●", JpColor.Yellow);
SymbolDefaultColor.set("▲", JpColor.Cyan);
SymbolDefaultColor.set("■", JpColor.Lime);
SymbolDefaultColor.set("★", JpColor.Magenta);

export const SymbolMarks: string[] = Array.from(SymbolDefaultColor.keys());

export interface SymbolInfo {
  color: string;
  italic: boolean;
  bold: boolean;
}

export const SymbolTable = (): Map<string, SymbolInfo> => {
  const table: Map<string, SymbolInfo> = new Map();
  SymbolMarks.forEach((mark) => {
    const col = SymbolDefaultColor.get(mark) || JpColor.Transparent;
    table.set(mark, { color: col, italic: false, bold: false });
  });
  return table;
};
