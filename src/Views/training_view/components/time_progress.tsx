function formatTime(ms: number): string {
  let remaining = ms;

  const days = Math.floor(remaining / 86400000);
  remaining %= 86400000;

  const hours = Math.floor(remaining / 3600000);
  remaining %= 3600000;

  const minutes = Math.floor(remaining / 60000);
  remaining %= 60000;

  const seconds = Math.floor(remaining / 1000);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? "dia" : "dias"}`);
  }

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}min`);
  }

  if (seconds > 0) {
    parts.push(`${seconds}s`);
  }

  if (parts.length === 0) {
    return "0s";
  }

  return parts.join(", ");
}

export default function TimeProgress(props: {
  startTime?: null | number;
  endTime?: null | number;
}) {
  const delta = (props.endTime ?? Date.now()) - (props.startTime ?? Date.now());
  return formatTime(delta);
}
