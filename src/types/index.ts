export enum Role {
  User = 'user',
  Assistant = 'assistant',
}

export type Message = {
  role: Role;
  content: string;
  duration?: number;
};
