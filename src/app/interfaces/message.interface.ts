export interface IMessage {
  _id?: string;
  user?: string;
  text: string;
  date: string,
  tags?: string[],
  createdAt?: string;
  updatedAt?: string;
  socketId?: string
}
