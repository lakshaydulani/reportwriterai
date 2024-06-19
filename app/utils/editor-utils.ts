export function createParagraph(content: string): object {
  const lineBreaks = content.split("\n");

  const paragraphs = 
    lineBreaks
      .filter((line) => {
        return !!line;
      })
      .map((line) => {
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: line,
            },
          ],
        };
      })
  ;

  return {
    type: "doc",
    content: paragraphs,
  };
}
