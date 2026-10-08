import { Keyboard } from 'grammy';

/**
 * Custom Reply Keyboard requesting the student's phone number
 */
export function getContactShareKeyboard() {
  return new Keyboard()
    .requestContact('📱 Share Phone Number / ስልክ ቁጥር ያጋሩ')
    .resized()
    .oneTime();
}
