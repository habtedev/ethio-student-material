import { Keyboard, InlineKeyboard } from 'grammy';
import { getTranslation, SupportedLanguage } from '@/src/bot/i18n/translations';

/**
 * Main Persistent Reply Keyboard with Department Info & University Info:
 * Row 1: 📖 መርጃዎች (Materials)
 * Row 2: 🏷️ በፍጥነት የተቀመጡ (Saved/Bookmarks)
 * Row 3: 🏆 ፈተናዎች (Exams)
 * Row 4: 🏢 የዲፓርትመንት መረጃ (Dept Info) | 🏛️ የዩኒቨርሲቲ መረጃ (Uni Info)
 * Row 5: 👤 መገለጫ (Profile) | 👥 ይጋብዙ (Invite)
 * Row 6: 🌐 ቋንቋ (Language) | 💎 ፕሪሚየም (Premium)
 */
export function getMainReplyKeyboard(isPremium = true, lang: SupportedLanguage = 'am') {
  const t = getTranslation(lang);
  const keyboard = new Keyboard();

  // Row 1: 📖 መርጃዎች (Materials & Modules - Fully Unlocked)
  keyboard.text(t.btn_materials).row();

  // Row 2: 🏷️ በፍጥነት የተቀመጡ (Saved / Quick Access - Fully Unlocked)
  keyboard.text(t.btn_saved).row();

  // Row 3: 🏆 ፈተናዎች (Exams & Past Papers - Fully Unlocked)
  keyboard.text(t.btn_exams).row();

  // Row 4: 🏢 የዲፓርትመንት መረጃ | 🏛️ የዩኒቨርሲቲ መረጃ
  keyboard
    .text(t.btn_dept)
    .text(t.btn_uni)
    .row();

  // Row 5: 👤 መገለጫ (Profile) | 👥 ይጋብዙ (Invite)
  keyboard
    .text(t.btn_profile)
    .text(t.btn_invite)
    .row();

  // Row 6: 🌐 ቋንቋ (Language) | 💎 ፕሪሚየም (Premium Active)
  keyboard
    .text(t.btn_language)
    .text(t.btn_premium_active)
    .resized();

  return keyboard;
}

/**
 * Language Selection Inline Keyboard
 */
export function getLanguageSelectionKeyboard() {
  return new InlineKeyboard()
    .text('🇪🇹 አማርኛ (Amharic)', 'set_lang:am')
    .text('🇬🇧 English', 'set_lang:en')
    .row()
    .text('🌳 Afaan Oromoo', 'set_lang:or')
    .text('⛰️ ትግርኛ (Tigrigna)', 'set_lang:ti')
    .row()
    .text('🔙 Back / ተመለስ', 'menu:main_free');
}

/**
 * Freshman Stream Selection
 */
export function getFreshmanStreamKeyboard(lang: SupportedLanguage = 'am') {
  return new InlineKeyboard()
    .text('🔬 Natural Science (ተፈጥሮ ሳይንስ)', 'select_stream:Freshman:Natural')
    .text('📚 Social Science (ማህበራዊ ሳይንስ)', 'select_stream:Freshman:Social')
    .row()
    .text('🔙 Back to Main Menu', 'menu:main_free');
}

/**
 * Materials & Study Resource Categories matching screenshot:
 * Row 1: 📚 Module | 📚 Notes
 * Row 2: 📚 Worksheet | 📚 Assignment
 * Row 3: 📚 Mid exam | 📚 Final exam
 * Row 4: 📚 Reference books
 */
export function getMaterialCategoriesKeyboard(lang: SupportedLanguage = 'am') {
  return new InlineKeyboard()
    .text('📚 Module', 'mat_cat:module')
    .text('📚 Notes', 'mat_cat:notes')
    .row()
    .text('📚 Worksheet', 'mat_cat:worksheet')
    .text('📚 Assignment', 'mat_cat:assignment')
    .row()
    .text('📚 Mid exam', 'mat_cat:mid_exam')
    .text('📚 Final exam', 'mat_cat:final_exam')
    .row()
    .text('📚 Reference books', 'mat_cat:ref_books')
    .row()
    .text('🔙 Back to Main Menu / ተመለስ', 'menu:main_free');
}

/**
 * Freshman Course Modules List (Ethiopian Curriculum)
 */
export function getFreshmanCoursesKeyboard(stream = 'Natural', category = 'module') {
  const keyboard = new InlineKeyboard();

  if (category === 'ref_books') {
    if (stream === 'Natural') {
      keyboard
        .text('📐 Calculus (James Stewart 8th Ed)', `course:${stream}:${category}:StewartCalc`)
        .row()
        .text('⚡ University Physics (Young & Freedman)', `course:${stream}:${category}:UnivPhysics`)
        .row()
        .text('🧠 Introduction to Logic (Patrick Hurley)', `course:${stream}:${category}:HurleyLogic`)
        .row()
        .text('💡 Psychology: Core Concepts (Zimbardo)', `course:${stream}:${category}:PsychRef`)
        .row()
        .text('🤖 Emerging Technologies Official Guide', `course:${stream}:${category}:EmergingGuide`);
    } else {
      keyboard
        .text('📊 Mathematics for Social Sciences', `course:${stream}:${category}:SocialMathRef`)
        .row()
        .text('⚖️ Ethiopian Constitutional Law & Civics', `course:${stream}:${category}:LawRef`)
        .row()
        .text('🧠 Critical Thinking & Informal Logic', `course:${stream}:${category}:LogicSocialRef`)
        .row()
        .text('🌐 Global Affairs & International Relations', `course:${stream}:${category}:GlobalRef`)
        .row()
        .text('💡 General Psychology for Social Science', `course:${stream}:${category}:PsychSocialRef`);
    }
  } else {
    if (stream === 'Natural') {
      keyboard
        .text('📐 Math for Natural', `course:${stream}:${category}:Math`)
        .text('⚡ General Physics', `course:${stream}:${category}:Physics`)
        .row()
        .text('🧠 Critical Thinking & Logic', `course:${stream}:${category}:Logic`)
        .text('💡 General Psychology', `course:${stream}:${category}:Psychology`)
        .row()
        .text('📖 Communicative English', `course:${stream}:${category}:English`)
        .text('🤖 Emerging Technologies', `course:${stream}:${category}:EmergingTech`)
        .row()
        .text('🌍 Geography of Ethiopia', `course:${stream}:${category}:Geography`)
        .text('🤝 Inclusiveness', `course:${stream}:${category}:Inclusiveness`);
    } else {
      keyboard
        .text('📊 Math for Social', `course:${stream}:${category}:MathSocial`)
        .text('🧠 Critical Thinking & Logic', `course:${stream}:${category}:Logic`)
        .row()
        .text('💡 General Psychology', `course:${stream}:${category}:Psychology`)
        .text('📖 Communicative English', `course:${stream}:${category}:English`)
        .row()
        .text('⚖️ Introduction to Civics', `course:${stream}:${category}:Civics`)
        .text('🌍 Geography of Ethiopia', `course:${stream}:${category}:Geography`)
        .row()
        .text('🌐 Global Trends', `course:${stream}:${category}:GlobalTrends`)
        .text('🤝 Inclusiveness', `course:${stream}:${category}:Inclusiveness`);
    }
  }

  keyboard
    .row()
    .text('📚 ምድቦች (All Categories)', 'menu:mat_categories')
    .text('🔄 Stream (ቀይር)', 'menu:switch_stream')
    .row()
    .text('🏠 ዋና ማውጫ (Main Menu)', 'menu:main_free');

  return keyboard;
}

/**
 * University Info Selection Keyboard
 */
/**
 * University Info Selection Keyboard
 */
export function getUniversitiesKeyboard(lang: SupportedLanguage = 'am') {
  return new InlineKeyboard()
    .text('🏛️ Addis Ababa University (AAU)', 'uni:aau')
    .text('🏛️ ASTU (Adama Science & Tech)', 'uni:astu')
    .row()
    .text('🏛️ AASTU (Addis Ababa Sci & Tech)', 'uni:aastu')
    .text('🏛️ Bahir Dar University (BDU)', 'uni:bdu')
    .row()
    .text('🏛️ Jimma University (JU)', 'uni:ju')
    .text('🏛️ Hawassa University (HU)', 'uni:hu')
    .row()
    .text('🏛️ University of Gondar (UoG)', 'uni:gondar')
    .text('🏛️ Haramaya University (HrU)', 'uni:haramaya')
    .row()
    .text('🏛️ Arba Minch University (AMU)', 'uni:amu')
    .text('🏛️ Mekelle University (MU)', 'uni:mu')
    .row()
    .text('🏛️ Wolaita Sodo Univ (WSU)', 'uni:wsu')
    .text('🏛️ Dilla University (DU)', 'uni:du')
    .row()
    .text('🏢 የዲፓርትመንት መረጃ (Dept Info)', 'menu:dept_list')
    .text('🔙 Back to Menu / ተመለስ', 'menu:main_free');
}

/**
 * Department Placement & Cutoff Info Keyboard
 */
export function getDepartmentsKeyboard(lang: SupportedLanguage = 'am') {
  return new InlineKeyboard()
    .text('💻 Computer Science & Software Eng', 'dept:cs_se')
    .text('🩺 Medicine & Health Sciences', 'dept:med')
    .row()
    .text('⚙️ Electrical & Electronics Eng', 'dept:eng')
    .text('🏗️ Civil & Construction Eng', 'dept:civil')
    .row()
    .text('🔧 Mechanical & Mechatronics Eng', 'dept:mech')
    .text('🧪 Chemical & Biomedical Eng', 'dept:chem')
    .row()
    .text('📊 Accounting, Finance & Banking', 'dept:business')
    .text('⚖️ School of Law (LLB)', 'dept:law')
    .row()
    .text('📈 Economics & Management', 'dept:econ')
    .text('🌾 Agriculture & Food Science', 'dept:agri')
    .row()
    .text('🏛️ የዩኒቨርሲቲ መረጃ (Uni Info)', 'menu:uni_list')
    .text('🔙 Back to Menu / ተመለስ', 'menu:main_free');
}

/**
 * Navigation keyboard when viewing a specific University
 */
export function getUniDetailKeyboard() {
  return new InlineKeyboard()
    .text('🔙 የዩኒቨርሲቲዎች ዝርዝር (All Universities)', 'menu:uni_list')
    .row()
    .text('🏢 የዲፓርትመንት መግቢያ GPA (Dept Cutoffs)', 'menu:dept_list')
    .text('🏠 ዋና ማውጫ (Main Menu)', 'menu:main_free');
}

/**
 * Navigation keyboard when viewing a specific Department
 */
export function getDeptDetailKeyboard() {
  return new InlineKeyboard()
    .text('🔙 የዲፓርትመንቶች ዝርዝር (All Departments)', 'menu:dept_list')
    .row()
    .text('🏛️ የዩኒቨርሲቲ መረጃዎች (Universities)', 'menu:uni_list')
    .text('🏠 ዋና ማውጫ (Main Menu)', 'menu:main_free');
}

/**
 * Premium Upgrade Dialog Keyboard
 */
export function getPremiumUpgradeKeyboard(lang: SupportedLanguage = 'am') {
  const t = getTranslation(lang);
  return new InlineKeyboard()
    .text('⚡ Upgrade to VIP Premium (ይክፈሉ)', 'premium:pay_info')
    .row()
    .text('📱 Pay via Telebirr (ቴሌብር)', 'pay:telebirr')
    .text('🏦 Pay via CBE (ንግድ ባንክ)', 'pay:cbe')
    .row()
    .url('💬 Contact Support', 'https://t.me/ethiostudentsupport')
    .text('🔄 Check Status', 'premium:check_status')
    .row()
    .text('🔙 Back / ተመለስ', 'menu:main_free');
}

/**
 * Payment Methods Selection Keyboard
 */
export function getPaymentMethodsKeyboard() {
  return new InlineKeyboard()
    .text('📱 Telebirr (0911000000)', 'pay:telebirr')
    .row()
    .text('🏦 CBE Bank (1000123456789)', 'pay:cbe')
    .row()
    .text('📸 Send Screenshot / ደረሰኝ ላክ', 'premium:submit_proof')
    .text('🔄 Check Status / ሁኔታ አረጋግጥ', 'premium:check_status')
    .row()
    .text('🔙 Back to Main Menu / ተመለስ', 'menu:main_free');
}

/**
 * Telebirr Payment Detail Keyboard
 */
export function getTelebirrPaymentKeyboard() {
  return new InlineKeyboard()
    .url('💬 Forward to Support (@ethiostudentsupport)', 'https://t.me/ethiostudentsupport')
    .row()
    .text('📸 Send Screenshot in Bot', 'premium:submit_proof')
    .text('🔄 Verify Payment', 'premium:check_status')
    .row()
    .text('🏦 Pay via CBE Instead (ንግድ ባንክ)', 'pay:cbe')
    .text('🔙 Payment Options', 'premium:pay_info');
}

/**
 * CBE Payment Detail Keyboard
 */
export function getCBEPaymentKeyboard() {
  return new InlineKeyboard()
    .url('💬 Forward to Support (@ethiostudentsupport)', 'https://t.me/ethiostudentsupport')
    .row()
    .text('📸 Send Screenshot in Bot', 'premium:submit_proof')
    .text('🔄 Verify Payment', 'premium:check_status')
    .row()
    .text('📱 Pay via Telebirr Instead (ቴሌብር)', 'pay:telebirr')
    .text('🔙 Payment Options', 'premium:pay_info');
}

/**
 * Back to Main Menu
 */
export function getBackToMenuKeyboard() {
  return new InlineKeyboard().text('🔙 Back to Main Menu / ተመለስ', 'menu:main_free');
}
