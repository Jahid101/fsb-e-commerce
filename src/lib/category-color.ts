export function categoryHue(name: string): number {
  let hash = 0;
  for (let index = 0; index < name.length; index++) {
    hash = (hash << 5) - hash + name.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}