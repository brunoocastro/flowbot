import moment, { Moment } from "moment";
// moment.locale('pt-br')
export const momentFormat = "[[]HH:mm:ss - DD/MM/YY[]]";
export default function getMomentString(date: string = null): string {
  const dateMoment = date ? moment(date) : moment();

  return dateMoment.format(momentFormat);
}
