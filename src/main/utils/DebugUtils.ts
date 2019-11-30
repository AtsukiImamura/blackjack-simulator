export namespace DebugUtils {
  export function toJsonLines(obj: any): string {
    const json = JSON.stringify(obj);
    let currentIndent = "";
    let resJson = "";
    for (const j of json) {
      if (j === "{" || j === "[") {
        const tmpIndent = currentIndent;
        currentIndent += "  ";
        resJson += "\n" + tmpIndent + j; //`${j}\n` + currentIndent;
        continue;
      } else if (j === "}" || j === "]") {
        currentIndent = " ".repeat(Math.max(0, currentIndent.length - 2));
        resJson += "\n" + currentIndent + j; // `${j}\n` + currentIndent;
        continue;
      }
      resJson += j;
      if (j === ",") {
        resJson += "\n" + currentIndent;
      }
    }

    return resJson;
  }
}
