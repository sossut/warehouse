import { RowDataPacket } from 'mysql2';

interface DaysHours {
  id: number;
  day: Date;
  arrivedAt?: Date;
  leftAt?: Date;
  workedHoursSeconds?: number;
  kilometers?: number;
}

interface GetDaysHours extends RowDataPacket, DaysHours {}

type PostDaysHours = Omit<DaysHours, 'id'>;

type PutDaysHours = Partial<PostDaysHours>;

export { DaysHours, GetDaysHours, PostDaysHours, PutDaysHours };
