/**
 * Safe non-blocking STDIN reader
 */
export async function readStdin(timeoutMs = 1500) {
  if (process.stdin.isTTY) {
    return "";
  }

  return new Promise((resolve) => {
    let data = "";
    let timer = null;

    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        resolve(data);
      }, timeoutMs);
    }

    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      if (timer) clearTimeout(timer);
      resolve(data);
    });
    process.stdin.on("error", () => {
      if (timer) clearTimeout(timer);
      resolve(data);
    });
    process.stdin.resume();
  });
}
