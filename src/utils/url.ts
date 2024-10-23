export function getSearchParams(request) {
  const url = new URL(request.url, "http://localhost");
  return url.searchParams;
}
