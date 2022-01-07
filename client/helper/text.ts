export const stripText = (text: string, number = 30) => {
  return text.length > number ? `${text.substring(0, number)}...` : text;
};

export const stripHTML = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};
