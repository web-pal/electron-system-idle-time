// @flow
import moment from 'moment';
import 'moment-duration-format';

export function stj(seconds: number, format?: string = 'h[h] m[m] s[s]'): string {
  return moment.duration(seconds * 1000).format(format);
}
