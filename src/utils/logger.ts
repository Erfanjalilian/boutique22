export function info(message: string, meta?: any) {
  try {
    const ts = new Date().toISOString();
    if (meta) console.info(ts, "INFO", message, meta);
    else console.info(ts, "INFO", message);
  } catch (e) {
    // swallow
  }
}

export function warn(message: string, meta?: any) {
  try {
    const ts = new Date().toISOString();
    if (meta) console.warn(ts, "WARN", message, meta);
    else console.warn(ts, "WARN", message);
  } catch (e) {}
}

export function error(message: string, meta?: any) {
  try {
    const ts = new Date().toISOString();
    if (meta) console.error(ts, "ERROR", message, meta);
    else console.error(ts, "ERROR", message);
  } catch (e) {}
}
