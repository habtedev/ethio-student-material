export type SupportedLanguage = 'am' | 'en' | 'or' | 'ti';

export interface TranslationDictionary {
  btn_materials: string;
  btn_saved: string;
  btn_exams: string;
  btn_dept: string;
  btn_uni: string;
  btn_profile: string;
  btn_invite: string;
  btn_language: string;
  btn_premium: string;
  btn_premium_active: string;
  locked_badge: string;
  unlocked_badge: string;

  welcome_title: string;
  welcome_prompt_phone: string;
  share_phone_btn: string;
  phone_verified: string;
  choose_resources: string;

  lock_alert_title: string;
  lock_alert_desc: string;
  unlock_btn: string;

  pricing_title: string;
  pricing_plans: string;
  payment_info: string;

  invite_msg: string;
  profile_title: string;
  select_language: string;
  language_changed: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  // AMHARIC
  am: {
    btn_materials: '📚 የትምህርት መርጃዎች',
    btn_saved: '🔖 ማስታወሻዎች',
    btn_exams: '📝 የፈተና ባንክ',
    btn_dept: '🏢 የዲፓርትመንት መረጃ',
    btn_uni: '🏛️ የዩኒቨርሲቲ መረጃ',
    btn_profile: '👤 መገለጫ',
    btn_invite: '🔗 ይጋብዙ',
    btn_language: '🌐 ቋንቋ',
    btn_premium: '✨ ፕሪሚየም (ክፍት)',
    btn_premium_active: '✨ VIP ክፍት',
    locked_badge: '',
    unlocked_badge: '',

    welcome_title: 'የኢትዮጵያ ዩኒቨርሲቲ Freshman የትምህርት ፖርታል',
    welcome_prompt_phone: 'ለመቀጠል እባክዎን ስልክ ቁጥርዎን ያጋሩ:',
    share_phone_btn: 'ስልክ ቁጥር አረጋግጥ',
    phone_verified: 'ስልክ ቁጥርዎ በተሳካ ሁኔታ ተመዝግቧል!',
    choose_resources: 'የሚፈልጉትን የትምህርት መርጃ ይምረጡ:',

    lock_alert_title: 'አገልግሎቱ ክፍት ነው!',
    lock_alert_desc: 'ሁሉም የ Freshman ሞጁሎች፣ ፈተናዎች፣ የዲፓርትመንትና ዩኒቨርሲቲ መረጃዎች በነፃነት ክፍት ናቸው።',
    unlock_btn: 'ሙሉ አገልግሎት ክፍት',

    pricing_title: 'የ Freshman VIP ፕሪሚየም መረጃ',
    pricing_plans: '• 1 ወር: 50 ETB\n• 1 ሴሚስተር: 120 ETB\n• ሙሉ ዓመት: 200 ETB',
    payment_info: '• Telebirr: 0911000000\n• CBE: 1000123456789',

    invite_msg: 'የ Freshman Hero ቦትን ለጓደኞችዎ ያጋሩ:\nhttps://t.me/EthioStudentMaterialBot',
    profile_title: 'የተማሪ መገለጫ (Student Profile)',
    select_language: 'እባክዎን ቋንቋ ይምረጡ / Please select your language:',
    language_changed: 'ቋንቋዎ በተሳካ ሁኔታ ወደ አማርኛ ተቀይሯል!',
  },

  // ENGLISH
  en: {
    btn_materials: '📚 Course Materials & Modules',
    btn_saved: '🔖 Lecture Notes',
    btn_exams: '📝 Exam Bank & Past Papers',
    btn_dept: '🏢 Department Info',
    btn_uni: '🏛️ University Guide',
    btn_profile: '👤 Student Profile',
    btn_invite: '🔗 Share Platform',
    btn_language: '🌐 Language',
    btn_premium: '✨ VIP Premium (Unlocked)',
    btn_premium_active: '✨ VIP Active',
    locked_badge: '',
    unlocked_badge: '',

    welcome_title: 'Ethiopian University Freshman Academic Portal',
    welcome_prompt_phone: 'Please verify your phone number to continue:',
    share_phone_btn: 'Verify Phone Number',
    phone_verified: 'Phone number verified and registered successfully!',
    choose_resources: 'Select the academic resources you need:',

    lock_alert_title: 'Access Unlocked!',
    lock_alert_desc: 'All university modules, exams, department cutoffs, and campus guides are fully unlocked for you.',
    unlock_btn: 'Full VIP Access Active',

    pricing_title: 'Freshman VIP Membership Plans',
    pricing_plans: '• 1 Month: 50 ETB\n• 1 Semester: 120 ETB\n• Full Year: 200 ETB',
    payment_info: '• Telebirr: 0911000000\n• CBE: 1000123456789',

    invite_msg: 'Share this academic portal with your university classmates:\nhttps://t.me/EthioStudentMaterialBot',
    profile_title: 'Student Profile',
    select_language: 'Please choose your preferred language:',
    language_changed: 'Language switched to English successfully!',
  },

  // AFAAN OROMOO
  or: {
    btn_materials: '📚 Moojuloota Barnootaa',
    btn_saved: '🔖 Qabxiiwwan Gabaabaa',
    btn_exams: '📝 Qormaatawwan Darban',
    btn_dept: '🏢 Odeeffannoo Muummee',
    btn_uni: '🏛️ Odeeffannoo Yuunivarsiitii',
    btn_profile: '👤 Eenyummaa Barataa',
    btn_invite: '🔗 Hiriyoota Afeeraa',
    btn_language: '🌐 Afaan',
    btn_premium: '✨ VIP (Banamaa)',
    btn_premium_active: '✨ VIP Banamaa',
    locked_badge: '',
    unlocked_badge: '',

    welcome_title: 'Pootaala Barnootaa Freshman Yuunivarsiitii Itoophiyaa',
    welcome_prompt_phone: 'Itti fufuuf lakkoofsa bilbilaa keessan mirkaneessaa:',
    share_phone_btn: 'Lakkoofsa Bilbilaa Mirkaneessi',
    phone_verified: 'Lakkoofsi bilbilaa keessanii milkaa\'inaan galmaa\'eera!',
    choose_resources: 'Meeshaalee barnootaa barbaaddan filadhaa:',

    lock_alert_title: 'Tajaajilli Banameera!',
    lock_alert_desc: 'Moojuloota, qormaatawwan darban, odeeffannoo muummee hundi isiniif banamaadha.',
    unlock_btn: 'Hunda Basi',

    pricing_title: 'Gatii Piriimiyemii Freshman',
    pricing_plans: '• Ji\'a 1: 50 ETB\n• Semisteera 1: 120 ETB\n• Waggaa Guutuu: 200 ETB',
    payment_info: '• Telebirr: 0911000000\n• CBE: 1000123456789',

    invite_msg: 'Liinkii boottii kana hiriyoota keessaniif qoodaa:\nhttps://t.me/EthioStudentMaterialBot',
    profile_title: 'Eenyummaa Barataa (Profile)',
    select_language: 'Mee afaan filadhaa / Please select language:',
    language_changed: 'Afaan gara Afaan Oromootti jijjiirameera!',
  },

  // TIGRIGNA
  ti: {
    btn_materials: '📚 መወከሲታትን ሞጁላትን',
    btn_saved: '🔖 ማስታወሻታት',
    btn_exams: '📝 ናይ ቀደም ፈተናታት',
    btn_dept: '🏢 ሓበሬታ ክፍሊ ትምህርቲ',
    btn_uni: '🏛️ ሓበሬታ ዩኒቨርስቲ',
    btn_profile: '👤 መገለጺ ተምሃራይ',
    btn_invite: '🔗 ዓድሙ',
    btn_language: '🌐 ቋንቋ',
    btn_premium: '✨ ፕሪሚየም (ክፉት)',
    btn_premium_active: '✨ VIP ክፉት',
    locked_badge: '',
    unlocked_badge: '',

    welcome_title: 'ናይ ኢትዮጵያ ዩኒቨርስቲ Freshman ፖርታል ትምህርቲ',
    welcome_prompt_phone: 'ንምቕጻል በጃኹም ቁጽሪ ስልክኹም ኣረጋግጹ:',
    share_phone_btn: 'ቁጽሪ ስልኪ ኣረጋግጽ',
    phone_verified: 'ቁጽሪ ስልክኹም ብትኽክል ተመዝጊቡ ኣሎ!',
    choose_resources: 'ዘድልየኩም መምሃሪ መወከሲ ምረጹ:',

    lock_alert_title: 'ኣገልግሎት ክፉት እዩ!',
    lock_alert_desc: 'ኩሎም ሞጁላት፣ ናይ ቀደም ፈተናታት፣ ሓበሬታ ክፍሊ ትምህርቲ ንዓኹም ምሉእ ብምሉእ ክፉታት እዮም።',
    unlock_btn: 'ኩሉ ኣገልግሎት ክፉት እዩ',

    pricing_title: 'ናይ Freshman ፕሪሚየም ዋጋታት',
    pricing_plans: '• 1 ወርሒ: 50 ETB\n• 1 ሴሚስተር: 120 ETB\n• ምሉእ ዓመት: 200 ETB',
    payment_info: '• Telebirr: 0911000000\n• CBE: 1000123456789',

    invite_msg: 'ንፈተውትኹም ሊንክ ኣካፍሉ:\nhttps://t.me/EthioStudentMaterialBot',
    profile_title: 'መገለጺ ተምሃራይ (Profile)',
    select_language: 'በጃኹም ቋንቋኹም ምረጹ:',
    language_changed: 'ቋንቋኹም ብትኽክል ናብ ትግርኛ ተቐዪሩ ኣሎ!',
  },
};

export function getTranslation(lang?: string | null): TranslationDictionary {
  if (lang === 'en') return translations.en;
  if (lang === 'or') return translations.or;
  if (lang === 'ti') return translations.ti;
  return translations.am;
}
