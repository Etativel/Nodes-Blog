function estimateReadingTime(text, wordsPerMinute = 400) {
  const words = text.trim().split(/\s+/).length;
  const minutes = words / wordsPerMinute;

  if (minutes < 1) {
    return `${Math.ceil(minutes * 60)} sec read`;
  }
  return `${Math.ceil(minutes)} min read`;
}

export default estimateReadingTime;
