export function parseTzOffset(tz) {
  const match = /^UTC([+-]?\d{1,2})?$/.exec(tz);
  if (match && match[1]) return parseInt(match[1], 10) * 60;
  return 0;
}

export function parseTimeExpression(input, tz = "UTC") {
  const offset = parseTzOffset(tz);
  const now = new Date();
  const local = new Date(now.getTime() + offset * 60000);
  input = input.trim().toLowerCase();
  if (input.startsWith("in")) {
    const parts = input.split(/ +/);
    const amount = parseInt(parts[1], 10);
    const unit = parts[2] || "minutes";
    if (isNaN(amount)) return null;
    if (unit.startsWith("min")) return new Date(local.getTime() + amount * 60000 - offset * 60000);
    if (unit.startsWith("hour")) return new Date(local.getTime() + amount * 3600000 - offset * 60000);
    if (unit.startsWith("day")) return new Date(local.getTime() + amount * 86400000 - offset * 60000);
  }
  if (input.startsWith("tomorrow")) {
    const time = input.split("at")[1]?.trim() || "00:00";
    const [h, m] = time.split(":").map((n) => parseInt(n, 10) || 0);
    const date = new Date(local.getTime() + 86400000);
    date.setHours(h, m, 0, 0);
    return new Date(date.getTime() - offset * 60000);
  }
  if (input.startsWith("at")) {
    const time = input.split("at")[1]?.trim() || "00:00";
    const [h, m] = time.split(":").map((n) => parseInt(n, 10) || 0);
    const date = new Date(local);
    date.setHours(h, m, 0, 0);
    if (date <= local) date.setDate(date.getDate() + 1);
    return new Date(date.getTime() - offset * 60000);
  }
  const ts = Date.parse(input);
  if (!isNaN(ts)) return new Date(ts);
  return null;
}

export function parseDateString(input, tz = "UTC") {
  return parseTimeExpression(input, tz);
}

export function nextFromRule(rule, from = new Date(), tz = "UTC") {
  const offset = parseTzOffset(tz);
  const local = new Date(from.getTime() + offset * 60000);
  rule = rule.toLowerCase();
  if (rule.startsWith("every day")) {
    const time = rule.split("at")[1]?.trim() || "00:00";
    const [h, m] = time.split(":").map((n) => parseInt(n, 10) || 0);
    const next = new Date(local);
    next.setHours(h, m, 0, 0);
    if (next <= local) next.setDate(next.getDate() + 1);
    return new Date(next.getTime() - offset * 60000);
  }
  if (rule.startsWith("every")) {
    const parts = rule.split(/ +/);
    const day = parts[1];
    const time = parts[3] || "00:00";
    const [h, m] = time.split(":").map((n) => parseInt(n, 10) || 0);
    const next = new Date(local);
    const dow = ["sun","mon","tue","wed","thu","fri","sat"].indexOf(day.slice(0,3));
    if (dow !== -1) {
      let diff = dow - next.getDay();
      if (diff <= 0) diff += 7;
      next.setDate(next.getDate() + diff);
      next.setHours(h, m, 0, 0);
      return new Date(next.getTime() - offset * 60000);
    }
  }
  return null;
}
