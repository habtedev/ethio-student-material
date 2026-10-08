import dotenv from 'dotenv';

// Automatically load .env.local and .env
dotenv.config({ path: '.env.local' });
dotenv.config();

export const BOT_CONFIG = {
  get token() {
    return process.env.TELEGRAM_BOT_TOKEN || '';
  },
  name: 'Ethio Student Material Bot',
  get username() {
    return process.env.TELEGRAM_BOT_USERNAME || 'EthioStudentMaterialBot';
  },
  get channelUsername() {
    return process.env.TELEGRAM_CHANNEL_USERNAME || '@ethiostudentmaterial';
  },
  supportContact: '@ethiostudentsupport',
  defaultLanguage: 'am',
};

export function validateBotConfig(): { isValid: boolean; error?: string } {
  const token = BOT_CONFIG.token;
  if (!token || token.trim() === '' || token.includes('YOUR_TELEGRAM_BOT_TOKEN')) {
    return {
      isValid: false,
      error: 'TELEGRAM_BOT_TOKEN is not defined or is empty in .env.local.',
    };
  }
  return { isValid: true };
}
