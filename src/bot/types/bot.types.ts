import { Context } from 'grammy';
import { TelegramUser } from '@/src/types/database';

export interface MyContext extends Context {
  // Can be extended with custom session or user data
  dbUser?: TelegramUser | null;
}
