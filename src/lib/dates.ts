export const formatNodeDate = (dateString: string): string => {
  if (!dateString) return "Never";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return "Invalid Date";
  }
};