export class CommonUtils {
  public static zeroPadding(
    numText: string | number,
    length: number = 2,
  ): string {
    return `${numText}`.padStart(length, '0');
  }
}
