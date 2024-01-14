import { RowDataPacket } from 'mysql2';

interface Client {
  id: number;
  name: string;
}

interface GetClient extends RowDataPacket, Client {}

type PostClient = Omit<Client, 'id'>;

type PutClient = Partial<PostClient>;

export { Client, GetClient, PostClient, PutClient };
