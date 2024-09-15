const pStyle: string = "margin:0;font-family:'MS Mincho',serif;";
export const blankPara = `<p style="${pStyle};font-size:10.5pt;"><br/></p>`;

const trimSymbol = (s: string): string => {
  return s.substring(1, s.length - 1);
};

export class Decorator {
  private readonly origin: string;
  private formatted;
  private plain;

  constructor(s: string) {
    this.origin = s;
    this.formatted = this.origin;
    this.plain = this.origin;
  }

  public decorate(symbol: string, color: string, italic: boolean, bold: boolean) {
    const reg = new RegExp(symbol + ".+?" + symbol, "g");
    const fs = italic ? "italic" : "normal";
    const fw = bold ? "bold" : "normal";
    this.plain = this.plain.replace(reg, (m: string) => {
      return trimSymbol(m);
    });
    this.formatted = this.formatted.replace(reg, (m: string) => {
      const inner = trimSymbol(m);
      const markup = `<span style="background:${color};font-style:${fs};font-weight:${fw};">${inner}</span>`;
      return markup;
    });
  }

  public getMarkupText(size: number = 10.5): string {
    return `<p style="${pStyle};font-size:${size}pt;">${this.formatted}</p>`;
  }

  public getPlainText(trailing: string = "\n"): string {
    return this.plain + trailing;
  }
}
