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

export const SymbolColor: Map<string, string> = new Map();
SymbolColor.set("●", JpColor.Yellow);
SymbolColor.set("▲", JpColor.Cyan);
SymbolColor.set("■", JpColor.Lime);
SymbolColor.set("★", JpColor.Magenta);

export const SymbolMarks: string[] = Array.from(SymbolColor.keys());

export interface SymbolInfo {
  color: string;
  italic: boolean;
  bold: boolean;
}

export const SymbolTable = (): Map<string, SymbolInfo> => {
  const table: Map<string, SymbolInfo> = new Map();
  SymbolMarks.forEach((mark) => {
    const col = SymbolColor.get(mark) || JpColor.Transparent;
    table.set(mark, { color: col, italic: false, bold: false });
  });
  return table;
};
