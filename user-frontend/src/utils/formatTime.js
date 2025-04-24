function timePosted(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  let seconds = Math.floor((now - date) / 1000);

  if (seconds < 1) seconds = 1;

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const units = [
    { unit: "year", value: 31536000 },
    { unit: "month", value: 2592000 },
    { unit: "week", value: 604800 },
    { unit: "day", value: 86400 },
    { unit: "hour", value: 3600 },
    { unit: "minute", value: 60 },
    { unit: "second", value: 1 },
  ];

  for (const { unit, value } of units) {
    const diff = Math.floor(seconds / value);
    if (diff >= 1) {
      return rtf.format(-diff, unit);
    }
  }

  return "just now";
}

export default timePosted;
