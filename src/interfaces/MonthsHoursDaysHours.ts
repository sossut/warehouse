import { RowDataPacket } from 'mysql2';
import { DaysHours } from './DaysHours';
import { MonthsHours } from './MonthsHours';

interface MonthsHoursDaysHours {
  id: number;
  daysHoursId: number | DaysHours;
  monthsHoursId: number | MonthsHours;
}

interface GetMonthsHoursDaysHours extends RowDataPacket, MonthsHoursDaysHours {}

type PostMonthsHoursDaysHours = Omit<MonthsHoursDaysHours, 'id'>;

type PutMonthsHoursDaysHours = Partial<PostMonthsHoursDaysHours>;

export {
  MonthsHoursDaysHours,
  GetMonthsHoursDaysHours,
  PostMonthsHoursDaysHours,
  PutMonthsHoursDaysHours
};
