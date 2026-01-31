import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'dev_requests.log');

export function devLog(message: string) {
  try {
    if (process.env.NODE_ENV !== 'development') return;
    const line = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, line);
  } catch (err) {
    // Best-effort: do not crash app if logging fails
    // eslint-disable-next-line no-console
    console.error('devLog failed:', err);
  }
}
