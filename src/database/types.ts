import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export interface Messages {
  id: Generated<number>;
  userId: number;
  sprintId: number;
  timestamp: Generated<string>;
  status: number;
  gifUrl: string;
  message: string;
}

export interface Sprints {
  id: Generated<number>;
  course: string;
  module: number;
  sprint: number;
  code: string;
  title: string;
}

export interface Templates {
  id: Generated<number>;
  template: string;
  isActive: string;
}

export interface Users {
  id: Generated<number>;
  username: string;
  discordId: string;
}

export interface DB {
  messages: Messages;
  sprints: Sprints;
  templates: Templates;
  users: Users;
}
