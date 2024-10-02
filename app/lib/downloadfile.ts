export const downloadTxtFile = (content: string, filename: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename + ".txt";
  document.body.appendChild(element);
  element.click();
};

export const downloadJsonlFile = (data: [], title: string) => {
  const jsonData = data;
  const jsonContent = JSON.stringify(jsonData, null, 2);
  const element = document.createElement("a");
  const file = new Blob([jsonContent], { type: "application/json" });
  element.href = URL.createObjectURL(file);
  element.download = title.replace(".txt", "") + ".json";
  document.body.appendChild(element);
  element.click();
};
