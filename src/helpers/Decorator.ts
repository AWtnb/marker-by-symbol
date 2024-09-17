const paragraphStyle: string = "margin:0;font-family:'Yu Mincho','MS Mincho',serif;";
export const BlankParagraphMarkup = `<p style="${paragraphStyle};font-size:10.5pt;"><br/></p>`;

export const TrimSymbol = (s: string): string => {
  return s.substring(1, s.length - 1);
};

export const SearchPattern = (s: string): string => {
  return s + ".+?" + s;
};

export class Decorator {
  private readonly origin: string;
  private formatted;

  constructor(s: string) {
    this.origin = s;
    this.formatted = this.origin;
  }

  public decorate(symbol: string, color: string, italic: boolean, bold: boolean) {
    const reg = new RegExp(SearchPattern(symbol), "g");
    const fs = italic ? "italic" : "normal";
    const fw = bold ? "bold" : "normal";
    this.formatted = this.formatted.replace(reg, (m: string) => {
      const inner = TrimSymbol(m);
      const markup = `<span style="background:${color};font-style:${fs};font-weight:${fw};">${inner}</span>`;
      return markup;
    });
  }

  public getMarkupText(size: number = 10.5): string {
    return `<p style="${paragraphStyle};font-size:${size}pt;">${this.formatted}</p>`;
  }
}
