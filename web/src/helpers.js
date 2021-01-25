export const bytesToMegaBytes = (bytes, digits = 2) => digits ? (bytes / (1024*1024)).toFixed(digits) : (bytes / (1024*1024));
export const getTotalSeconds = (date = new Date()) => (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds() + date.getMilliseconds()/1000;
