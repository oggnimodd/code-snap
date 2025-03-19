export const getActiveLabel = (
  activeValue: string,
  items: { label: string; value: string }[]
) => {
  const item = items.find((item) => item.value === activeValue);
  if (item) {
    return item.label;
  }
  return "";
};
