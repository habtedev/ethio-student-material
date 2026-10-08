import { MyContext } from '@/src/bot/types/bot.types';
import { getUserByTelegramId, isUserPremium } from '@/src/lib/db/user.service';
import {
  getFreshmanCoursesKeyboard,
  getMaterialCategoriesKeyboard,
  getDepartmentsKeyboard,
  getUniversitiesKeyboard,
  getPremiumUpgradeKeyboard,
  getPaymentMethodsKeyboard,
  getLanguageSelectionKeyboard,
  getMainReplyKeyboard,
} from '@/src/bot/keyboards/main.keyboard';
import { getTranslation, SupportedLanguage } from '@/src/bot/i18n/translations';

/**
 * Handle persistent Reply Keyboard text button clicks
 * Layout:
 * 1. 📖 መርጃዎች (Materials)
 * 2. 🏷️ በፍጥነት የተቀመጡ (Saved)
 * 3. 🏆 ፈተናዎች (Exams)
 * 4. 🏢 የዲፓርትመንት መረጃ (Dept Info) | 🏛️ የዩኒቨርሲቲ መረጃ (Uni Info)
 * 5. 👤 መገለጫ (Profile) | 👥 ይጋብዙ (Invite)
 * 6. 🌐 ቋንቋ (Language) | 💎 ፕሪሚየም (Premium)
 */
export async function handleTextButton(ctx: MyContext) {
  if (!ctx.message || !ctx.message.text || !ctx.from) return;

  const text = ctx.message.text.trim();
  const telegramId = ctx.from.id;
  const user = await getUserByTelegramId(telegramId);
  const lang = (user?.languageCode as SupportedLanguage) || 'am';
  const isPremium = await isUserPremium(telegramId);
  const stream = (user?.stream as 'Natural' | 'Social') || 'Natural';
  const t = getTranslation(lang);

  // -----------------------------------------------------------------
  // 1. 🌐 ቋንቋ (Language Switcher)
  // -----------------------------------------------------------------
  if (
    text.includes('ቋንቋ') ||
    text.includes('Language') ||
    text.includes('Afaan')
  ) {
    await ctx.reply(t.select_language, {
      parse_mode: 'Markdown',
      reply_markup: getLanguageSelectionKeyboard(),
    });
    return;
  }

  // -----------------------------------------------------------------
  // 2. 👥 ይጋብዙ / 🔗 Share Platform
  // -----------------------------------------------------------------
  if (
    text.includes('ይጋብዙ') ||
    text.includes('Share') ||
    text.includes('Invite') ||
    text.includes('Afeeraa') ||
    text.includes('ዓድሙ')
  ) {
    await ctx.reply(
      `🔗 **${t.btn_invite} (Share Freshman Portal)**\n\n` +
        `🎁 **Share this academic bot with your university classmates:**\n` +
        `👉 https://t.me/EthioStudentMaterialBot\n\n` +
        `• 📚 Official Course Modules & Worksheets\n` +
        `• 📝 AAU, ASTU, JU Mid & Final Exams with Answer Keys\n` +
        `• 🏢 Department Cutoff Points & University Guides`,
      {
        parse_mode: 'Markdown',
        reply_markup: getMainReplyKeyboard(isPremium, lang),
      }
    );
    return;
  }

  // -----------------------------------------------------------------
  // 3. 👤 መገለጫ (Student Profile)
  // -----------------------------------------------------------------
  if (
    text.includes('መገለጫ') ||
    text.includes('Profile') ||
    text.includes('Eenyummaa') ||
    text.includes('መገለጺ')
  ) {
    const statusText = '💎 **VIP Premium Member (All Unlocked)** ⭐';
    const expiresText = user?.premiumUntil
      ? `\n⏳ **Expires:** ${new Date(user.premiumUntil).toLocaleDateString()}`
      : '\n⏳ **Access:** Lifetime VIP Access';

    const profileText =
      `👤 **${t.profile_title}**\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `🆔 **Telegram ID:** \`${telegramId}\`\n` +
      `📛 **ስም (Name):** ${user?.firstName || ctx.from.first_name} ${user?.lastName || ''}\n` +
      `📱 **ስልክ (Phone):** \`${user?.phoneNumber || 'Not linked'}\`\n` +
      `🎓 **ክፍል (Grade):** ${user?.grade || 'Freshman Year'}\n` +
      `🔬 **ዘርፍ (Stream):** ${stream} Science\n` +
      `🌐 **ቋንቋ (Language):** ${lang.toUpperCase()}\n` +
      `📊 **ደረጃ (Status):** ${statusText}${expiresText}\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `✨ _ሁሉም የትምህርት መርጃዎችና ፈተናዎች ለእርስዎ ክፍት ናቸው!_`;

    await ctx.reply(profileText, {
      parse_mode: 'Markdown',
      reply_markup: getMainReplyKeyboard(true, lang),
    });
    return;
  }

  // -----------------------------------------------------------------
  // 4. ✨ VIP Active / 💎 ፕሪሚየም (Premium Plans / Status)
  // -----------------------------------------------------------------
  if (
    text.includes('VIP') ||
    text.includes('Active') ||
    text.includes('Unlocked') ||
    text.includes('ፕሪሚየም') ||
    text.includes('Premium') ||
    text.includes('Piriimiyemii') ||
    text.includes('ፍታሕ') ||
    text.includes('ክፍት') ||
    text.includes('ክፉት')
  ) {
    const expDate = user?.premiumUntil ? new Date(user.premiumUntil).toLocaleDateString() : 'Lifetime';
    await ctx.reply(
      `⭐ **Freshman VIP Membership: ACTIVE!** 🎓\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 **Student:** ${user?.firstName || ctx.from.first_name}\n` +
        `🆔 **Telegram ID:** \`${telegramId}\`\n` +
        `📊 **Status:** 💎 VIP Unlocked (Full Access)\n` +
        `📅 **Expires:** ${expDate}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `All course modules, lecture notes, worksheets, past exams, and cutoff guides are fully active!\n\n` +
        `Need subscription help or wish to donate? View payment info below:`,
      {
        parse_mode: 'Markdown',
        reply_markup: getPremiumUpgradeKeyboard(lang),
      }
    );
    return;
  }

  // -----------------------------------------------------------------
  // Row 1: 📚 የትምህርት መርጃዎች (Materials & Modules)
  // -----------------------------------------------------------------
  if (
    text.includes('መርጃ') ||
    text.includes('Module') ||
    text.includes('Material') ||
    text.includes('Moojuloota') ||
    text.includes('መወከሲ')
  ) {
    await ctx.reply(
      `📚 **Freshman Study Materials & Exam Archive (VIP Unlocked)**\n\n` +
        `🔬 **Stream:** ${stream} Science\n` +
        `Select category below:`,
      {
        parse_mode: 'Markdown',
        reply_markup: getMaterialCategoriesKeyboard(lang),
      }
    );
    return;
  }

  // -----------------------------------------------------------------
  // Row 2: 🔖 ማስታወሻዎች (Saved / Lecture Notes)
  // -----------------------------------------------------------------
  if (
    text.includes('ማስታወሻ') ||
    text.includes('በፍጥነት') ||
    text.includes('Note') ||
    text.includes('Saved') ||
    text.includes('Qabxiiwwan') ||
    text.includes('Olkaawwaman') ||
    text.includes('ዝተዓቀቡ')
  ) {
    await ctx.reply(
      `🔖 **${t.btn_saved} (${stream} Science - VIP Unlocked)**\n\n` +
        `Select a course to view concise chapter summaries & lecture slides:`,
      {
        parse_mode: 'Markdown',
        reply_markup: getFreshmanCoursesKeyboard(stream, 'notes'),
      }
    );
    return;
  }

  // -----------------------------------------------------------------
  // Row 3: 📝 የፈተና ባንክ (Mid & Final Exams)
  // -----------------------------------------------------------------
  if (
    text.includes('ፈተና') ||
    text.includes('Exam') ||
    text.includes('Bank') ||
    text.includes('Mid') ||
    text.includes('Final') ||
    text.includes('Qormaatawwan')
  ) {
    await ctx.reply(
      `📝 **${t.btn_exams} (${stream} Science - VIP Unlocked)**\n\n` +
        `University past exams archive (AAU, ASTU, AASTU, JU, BDU) with detailed answer keys:`,
      {
        parse_mode: 'Markdown',
        reply_markup: getFreshmanCoursesKeyboard(stream, 'mid_exam'),
      }
    );
    return;
  }

  // -----------------------------------------------------------------
  // Row 4: 🏢 የዲፓርትመንት መረጃ (Department Placement & Cutoff Info)
  // -----------------------------------------------------------------
  if (
    text.includes('ዲፓርትመንት') ||
    text.includes('Department') ||
    text.includes('Placement') ||
    text.includes('Muummee') ||
    text.includes('ክፍሊ')
  ) {
    await ctx.reply(
      `🏢 **Ethiopian University Department Placement & Cutoff Info**\n\n` +
        `Freshman CGPA requirements, course prerequisites, and career outlooks:\n\n` +
        `Select department field:`,
      {
        parse_mode: 'Markdown',
        reply_markup: getDepartmentsKeyboard(),
      }
    );
    return;
  }

  // -----------------------------------------------------------------
  // Row 4: 🏛️ የዩኒቨርሲቲ መረጃ (University Info)
  // -----------------------------------------------------------------
  if (
    text.includes('ዩኒቨርሲቲ') ||
    text.includes('University') ||
    text.includes('Campus') ||
    text.includes('Guide') ||
    text.includes('Yuunivarsiitii') ||
    text.includes('ዩኒቨርስቲ')
  ) {
    await ctx.reply(
      `🏛️ **Ethiopian Universities Campus & Academic Directory**\n\n` +
        `Campus locations, grading scales, student facilities, and freshman tips:\n\n` +
        `Select university:`,
      {
        parse_mode: 'Markdown',
        reply_markup: getUniversitiesKeyboard(),
      }
    );
    return;
  }
}

/**
 * Send Lock Notification when non-premium user clicks any locked button
 */
export async function sendLockedFeatureMessage(
  ctx: MyContext,
  featureName: string,
  lang: SupportedLanguage = 'am'
) {
  const t = getTranslation(lang);

  const lockMessage =
    `🔒 **${t.lock_alert_title}**\n\n` +
    `📌 **የተመረጠው አገልግሎት:** *${featureName}*\n\n` +
    `${t.lock_alert_desc}\n\n` +
    `✨ **ፕሪሚየም ሲገቡ የሚከፈቱት (VIP Benefits):**\n` +
    `• 📖 የሁሉም ኮርሶች የተሟሉ ሞጁሎች (Official Modules)\n` +
    `• 🏷️ አጫጭር የፈተና ማጠቃለያዎች (Short Summaries)\n` +
    `• 🏆 የ AAU, ASTU, JU, BDU የ Mid እና Final ፈተናዎች ከመልሶቻቸው ጋር\n` +
    `• 🏢 የዲፓርትመንት መግቢያ GPA እና የዩኒቨርሲቲዎች መረጃ\n` +
    `• ⚡ ፈጣን ዳውንሎድ ያለ ማስታወቂያ\n\n` +
    `👇 **ሁሉንም ለመክፈት ከታች ያለውን በተን ይጫኑ (Unlock Now):**`;

  await ctx.reply(lockMessage, {
    parse_mode: 'Markdown',
    reply_markup: getMainReplyKeyboard(false, lang),
  });

  await ctx.reply('👇 **የማግኛ አማራጮች (Unlock Options):**', {
    reply_markup: getPremiumUpgradeKeyboard(lang),
  });
}

/**
 * Send Full Premium Pricing & Activation Info
 */
export async function sendPremiumPlansMessage(
  ctx: MyContext,
  lang: SupportedLanguage = 'am'
) {
  const t = getTranslation(lang);

  const infoMessage =
    `${t.pricing_title}\n\n` +
    `ሁሉንም የ Freshman ዓመት ሞጁሎችና ፈተናዎች በአነስተኛ ክፍያ ይክፈቱ!\n\n` +
    `💰 **የዋጋ ዝርዝር (Subscription Pricing):**\n` +
    `${t.pricing_plans}\n\n` +
    `💳 **የመክፈያ መንገዶች (Payment Options):**\n` +
    `${t.payment_info}\n\n` +
    `ከከፈሉ በኋላ ደረሰኝዎን ለቦት አድሚን @ethiostudentsupport በመላክ በደቂቃዎች ውስጥ ይክፈቱ!`;

  await ctx.reply(infoMessage, {
    parse_mode: 'Markdown',
    reply_markup: getPaymentMethodsKeyboard(),
  });
}
