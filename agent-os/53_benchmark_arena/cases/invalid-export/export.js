export function exportFile() {
  const blob = new Blob(["not a valid export"], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  return url;
}
