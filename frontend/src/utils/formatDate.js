export const formatDateSafe = (
  dateInput,
  options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
) => {
  if (!dateInput) return "-";
  try {
    const normalizedInput =
      typeof dateInput === "string" ? dateInput.replace(" ", "T") : dateInput;
    const date = new Date(normalizedInput);

    if (isNaN(date.getTime())) {
      const parsedTimestamp = Date.parse(dateInput);
      if (isNaN(parsedTimestamp)) {
        return "-";
      }
      return new Date(parsedTimestamp).toLocaleString("pt-BR", options);
    }
    return date.toLocaleString("pt-BR", options);
  } catch (error) {
    return "-";
  }
};