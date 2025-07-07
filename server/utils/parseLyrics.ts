export function parseSyncedLyrics(
  lrc: string,
  offset = -0.6
): [number, string][] {
  const pattern = /\[(\d+):(\d+\.\d+)](.*)/;
  const result: [number, string][] = [];

  for (const line of lrc.split("\n")) {
    const match = pattern.exec(line);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const totalSeconds = Math.round(minutes * 60 + seconds + offset);
      const lyric = match[3].trim();
      if (totalSeconds >= 0) {
        result.push([totalSeconds, lyric]);
      }
    }
  }

  return result.sort((a, b) => a[0] - b[0]);
}
