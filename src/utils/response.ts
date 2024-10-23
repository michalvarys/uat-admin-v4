export function getResults(data) {
  if (!data) {
    return;
  }

  if (data.results) {
    return data.results;
  }

  return data;
}
