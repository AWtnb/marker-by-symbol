import { SymbolMarks, SymbolInfo } from "./ColorTable";

const paragraphStyle: string = "margin:0;font-family:'Yu Mincho','MS Mincho',serif;";
const BlankParagraphMarkup = `<p style="${paragraphStyle};font-size:10.5pt;"><br/></p>`;

const trimSymbol = (s: string): string => {
  return s.substring(1, s.length - 1);
};

const searchPattern = (s: string): string => {
  return s + ".+?" + s;
};

class Decorator {
  private readonly origin: string;
  private formatted;

  constructor(s: string) {
    this.origin = s;
    this.formatted = this.origin;
  }

  public decorate(symbol: string, color: string, italic: boolean, bold: boolean) {
    const reg = new RegExp(searchPattern(symbol), "g");
    const fs = italic ? "italic" : "normal";
    const fw = bold ? "bold" : "normal";
    this.formatted = this.formatted.replace(reg, (m: string) => {
      const inner = trimSymbol(m);
      const markup = `<span style="background:${color};font-style:${fs};font-weight:${fw};">${inner}</span>`;
      return markup;
    });
  }

  public getMarkupText(size: number = 10.5): string {
    return `<p style="${paragraphStyle};font-size:${size}pt;">${this.formatted}</p>`;
  }
}

const toEntry = (s: string): string => {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};

export const ExecuteMarkup = (s: string, fontSize: number, mapping: Map<string, SymbolInfo>): string => {
  const stack: string[] = [];
  s.split(/\n/)
    .map((s) => toEntry(s))
    .forEach((line: string) => {
      if (line.length < 1 || line.trim().length < 1) {
        stack.push(BlankParagraphMarkup);
        return;
      }
      const de = new Decorator(line);
      SymbolMarks.forEach((m) => {
        const info = mapping.get(m)!;
        de.decorate(m, info.color, info.italic, info.bold);
      });
      stack.push(de.getMarkupText(fontSize));
    });
  return stack.join("");
};

export const ToPlainText = (s: string): string => {
  return SymbolMarks.reduce((acc, mark) => {
    const reg = new RegExp(searchPattern(mark), "g");
    return acc.replace(reg, trimSymbol);
  }, s);
};
