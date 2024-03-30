import { RowDataPacket } from 'mysql2';

import { MonthsHoursDaysHours } from './MonthsHoursDaysHours';

interface MonthsHours {
  id: number;
  startDate: Date;
  endDate: Date;
  monthsWorkedHoursSeconds?: number;
  daysHours: MonthsHoursDaysHours[];
}

interface GetMonthsHours extends RowDataPacket, MonthsHours {}

type PostMonthsHours = Omit<MonthsHours, 'id'>;

type PutMonthsHours = Partial<PostMonthsHours>;

export { MonthsHours, GetMonthsHours, PostMonthsHours, PutMonthsHours };
