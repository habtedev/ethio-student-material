import { MyContext } from '@/src/bot/types/bot.types';
import { getUserByTelegramId, updateUserGrade, isUserPremium } from '@/src/lib/db/user.service';
import {
  getFreshmanCoursesKeyboard,
  getFreshmanStreamKeyboard,
  getMaterialCategoriesKeyboard,
  getUniversitiesKeyboard,
  getDepartmentsKeyboard,
  getUniDetailKeyboard,
  getDeptDetailKeyboard,
  getPremiumUpgradeKeyboard,
  getPaymentMethodsKeyboard,
  getTelebirrPaymentKeyboard,
  getCBEPaymentKeyboard,
  getMainReplyKeyboard,
  getBackToMenuKeyboard,
} from '@/src/bot/keyboards/main.keyboard';
import { sendPremiumPlansMessage } from '@/src/bot/handlers/button.handler';

/**
 * Handle Stream Switch Callback
 */
export async function handleStreamSelect(ctx: MyContext) {
  if (!ctx.callbackQuery || !ctx.callbackQuery.data || !ctx.from) return;
  await ctx.answerCallbackQuery();

  const data = ctx.callbackQuery.data;
  const parts = data.replace('select_stream:', '').split(':');
  const stream = (parts[1] as 'Natural' | 'Social') || 'Natural';
  const telegramId = ctx.from.id;

  await updateUserGrade(telegramId, 'Freshman Year', stream);
  const isPremium = await isUserPremium(telegramId);

  await ctx.reply(
    `🎉 **Freshman ${stream} Science ተመርጧል!**\n\n` +
      `ሁሉም የ **${stream} Science** ሞጁሎችና የፈተና ጥያቄዎች ዝግጁ ናቸው!`,
    {
      parse_mode: 'Markdown',
      reply_markup: getMainReplyKeyboard(isPremium),
    }
  );
}

/**
 * Handle University Info Callback
 */
/**
 * Handle University Info Callback
 */
export async function handleUniversityInfo(ctx: MyContext) {
  if (!ctx.callbackQuery || !ctx.callbackQuery.data) return;
  await ctx.answerCallbackQuery();

  const data = ctx.callbackQuery.data;
  const uniKey = data.replace('uni:', '');

  const uniData: Record<
    string,
    {
      name: string;
      city: string;
      campuses: string;
      grading: string;
      topDepts: string;
      life: string;
      tips: string;
    }
  > = {
    aau: {
      name: 'Addis Ababa University (AAU) 🏛️',
      city: 'Addis Ababa (Capital)',
      campuses: '4 Kilo (Natural Sci), 6 Kilo (Main/Social), 5 Kilo (AAiT Engineering), FBE (Business), Tikur Anbessa (Health)',
      grading: 'Standard 4.0 Scale (A+ = 4.0, A = 4.0, A- = 3.75, B+ = 3.5, B = 3.0, C = 2.0, F = 0.0)',
      topDepts: 'Software Eng (3.80+), Medicine (3.85+), Electrical Eng (3.55+), Law (3.70+), Accounting (3.40+)',
      life: 'Central city life, historic libraries (Kennedy Library), well-equipped computer labs.',
      tips: 'Freshman students take classes in 4 Kilo or 6 Kilo. 1st semester GPA carries high weight for pre-engineering and health sciences placement.',
    },
    astu: {
      name: 'Adama Science & Technology University (ASTU) 🏛️',
      city: 'Adama (Oromia)',
      campuses: 'Main Campus (Applied Natural Sciences, Engineering, Computing)',
      grading: 'Rigorous STEM Scale (A = 4.0, B+ = 3.5, B = 3.0, C = 2.0)',
      topDepts: 'Computer Science & Engineering (3.75+), Electrical & Electronics (3.50+), Mechanical (3.40+)',
      life: 'Dedicated STEM research environment, 24/7 study halls, high-speed campus WiFi.',
      tips: 'Applied Mathematics and General Physics are intensive. Form study groups within the first 2 weeks.',
    },
    aastu: {
      name: 'Addis Ababa Science & Technology University (AAASTU) 🏛️',
      city: 'Addis Ababa (Kilinto)',
      campuses: 'Kilinto Ultra-Modern Technology Campus',
      grading: 'Technology Standard 4.0 Scale',
      topDepts: 'Software Engineering (3.80+), Architecture (3.65+), Biotechnology (3.45+), Civil (3.40+)',
      life: 'State-of-the-art incubation centers, tech clubs, modern dormitories.',
      tips: 'Pre-Engineering freshman year requires high continuous assessment scores (quizzes & assignments).',
    },
    bdu: {
      name: 'Bahir Dar University (BDU) 🏛️',
      city: 'Bahir Dar (Lake Tana)',
      campuses: 'Poly (BiT - Engineering), Peda (Education/Social), Felege Hiwot (Medicine), Maritime Academy',
      grading: 'Standard MoE Letter Scale (A = 4.0, B+ = 3.5, B = 3.0)',
      topDepts: 'Maritime Engineering, Medicine, Civil Engineering, Computer Science, Law',
      life: 'Beautiful lakeside environment, calm study atmosphere, rich sports culture.',
      tips: 'BiT engineering freshman students should master Calculus and Engineering Physics.',
    },
    ju: {
      name: 'Jimma University (JU) 🏛️',
      city: 'Jimma (Oromia)',
      campuses: 'Main Campus, JiT (Institute of Technology), College of Public Health & Medical Sciences',
      grading: 'Community-Based Training Program (CBTP) + 4.0 GPA Scale',
      topDepts: 'Medicine & Surgery (MD), Pharmacy, Civil & Electrical Engineering, Agriculture',
      life: 'Known as Ethiopia’s top university for Health Sciences and practical community research.',
      tips: 'Take advantage of JU departmental tutoring sessions and peer-led study circles.',
    },
    hu: {
      name: 'Hawassa University (HU) 🏛️',
      city: 'Hawassa (Sidama)',
      campuses: 'Main Campus, IoT (Institute of Technology), Wondo Genet (Forestry), College of Medicine',
      grading: 'Standard 4.0 Scale',
      topDepts: 'Medicine, Software Engineering, Civil Engineering, Agro-Economics',
      life: 'Clean green campus next to Lake Hawassa, vibrant student community.',
      tips: 'First-year students who target Medicine need consistent 3.75+ semester GPA.',
    },
    gondar: {
      name: 'University of Gondar (UoG) 🏛️',
      city: 'Gondar (Amhara)',
      campuses: 'Maraki (Social Science & Law), Atse Tewodros (Science & Tech), College of Medicine (CMHS)',
      grading: 'Standard 4.0 Scale',
      topDepts: 'Medicine (Historic Pioneer), Optometry, Physiotherapy, Law, Computer Science',
      life: 'Historic mountain city, Ethiopia’s oldest medical training institute, rich academic tradition.',
      tips: 'Health Science competitions are high; focus on General Psychology and Natural Science modules.',
    },
    haramaya: {
      name: 'Haramaya University (HrU) 🏛️',
      city: 'Haramaya / Harar',
      campuses: 'Main Campus (Agriculture & Technology), Harar Campus (Health Sciences)',
      grading: 'Standard 4.0 Scale',
      topDepts: 'Veterinary Medicine, Agricultural Engineering, Medicine, Electrical Engineering',
      life: 'Expansive historic campus, high research output, multicultural student body.',
      tips: 'Prepare early for Mid-term exams as they carry 30-40% of the course weight.',
    },
    amu: {
      name: 'Arba Minch University (AMU) 🏛️',
      city: 'Arba Minch (Southern Ethiopia)',
      campuses: 'Main Campus, Institute of Technology (AWTI - Water Technology), Chamo Campus, Nechsar',
      grading: 'Standard 4.0 Scale',
      topDepts: 'Water Resources & Irrigation Engineering, Hydraulic Eng, Civil Eng, Computer Science',
      life: 'National center of excellence for Water & Environmental Engineering.',
      tips: 'Engineering students gain strong advantages in hydraulic and civil infrastructure tracks.',
    },
    mu: {
      name: 'Mekelle University (MU) 🏛️',
      city: 'Mekelle (Tigray)',
      campuses: 'Endayesus (Main/Tech), Ayder (Health Sciences), Adi Haki (Law & Social)',
      grading: 'Standard 4.0 Scale',
      topDepts: 'Ayder Medical School, Electrical Engineering, Dryland Agriculture, Law',
      life: 'Strong academic faculty, modern Ayder referral hospital training facilities.',
      tips: 'Stay organized with laboratory reports and mid-term past papers.',
    },
    wsu: {
      name: 'Wolaita Sodo University (WSU) 🏛️',
      city: 'Wolaita Sodo',
      campuses: 'Gandaba (Main), Otona (Health & Medical Sciences), Tercha Campus',
      grading: 'Standard 4.0 Scale',
      topDepts: 'Medicine & Health Sciences, Civil Engineering, Agricultural Economics',
      life: 'Rapidly growing university with supportive academic staff and active student associations.',
      tips: 'Participate actively in freshman tutorials and review MoE past exam questions.',
    },
    du: {
      name: 'Dilla University (DU) 🏛️',
      city: 'Dilla (Gedeo)',
      campuses: 'Main Campus, Odayaa (Tech), Aderash (Health Sciences)',
      grading: 'Standard 4.0 Scale',
      topDepts: 'Computer Science, Electrical Engineering, Natural Resource Management, Education',
      life: 'Pleasant climate, cooperative learning culture, green campus.',
      tips: 'Focus heavily on Logic & Critical Thinking and Communicative English for easy GPA boosts.',
    },
  };

  const uni = uniData[uniKey] || uniData.aau;

  const message =
    `🏛️ **${uni.name}**\n\n` +
    `📍 **ቦታ (Location):** ${uni.city}\n` +
    `🏫 **ካምፓሶች (Campuses):** ${uni.campuses}\n\n` +
    `📊 **የነጥብ አሰጣጥ (Grading System):**\n${uni.grading}\n\n` +
    `🔥 **ከፍተኛ ተፈላጊ ዲፓርትመንቶች (Top Cutoffs):**\n${uni.topDepts}\n\n` +
    `🏕️ **የካምፓስ ሕይወት (Campus Life):**\n${uni.life}\n\n` +
    `💡 **ለ Freshman ተማሪዎች ምክር (Freshman Survival Tips):**\n${uni.tips}\n\n` +
    `_ለተጨማሪ መረጃ እና ለዲፓርትመንት መግቢያ ዝርዝር ከታች ያሉትን በተኖች ይጠቀሙ!_`;

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: getUniDetailKeyboard(),
  });
}

/**
 * Handle Department Placement Info Callback
 */
export async function handleDepartmentInfo(ctx: MyContext) {
  if (!ctx.callbackQuery || !ctx.callbackQuery.data) return;
  await ctx.answerCallbackQuery();

  const data = ctx.callbackQuery.data;
  const deptKey = data.replace('dept:', '');

  const deptData: Record<
    string,
    {
      title: string;
      stream: string;
      cutoff: string;
      requirements: string;
      careers: string;
      tips: string;
    }
  > = {
    cs_se: {
      title: '💻 Computer Science & Software Engineering',
      stream: 'Natural Science (Pre-Engineering / Computing)',
      cutoff: 'Freshman CGPA 3.65 - 3.90+ (Top 5% Students)',
      requirements: 'High score (A/A+) in Math for Natural, Logic, and Emerging Technologies.',
      careers: 'Software Engineer, Full-Stack Developer, AI/Data Specialist, Mobile App Dev, Cybersecurity.',
      tips: 'Master programming fundamentals early (Python/C++). GPA is the sole selection criteria in AAU, ASTU, AASTU.',
    },
    med: {
      title: '🩺 Medicine (Doctor of Medicine - MD) & Pharmacy',
      stream: 'Natural Science (Health Sciences Stream)',
      cutoff: 'Freshman CGPA 3.75 - 4.00 + Entrance Exam/Interview in some universities',
      requirements: 'Top grades in General Psychology, Physics, Communicative English, and Biology.',
      careers: 'Medical Doctor, Surgeon, Clinical Researcher, Hospital Director, Pharmacist.',
      tips: 'Maintain a 3.8+ GPA in Semester 1. Female students and developing region quotas apply (usually 0.2-0.3 points allowance).',
    },
    eng: {
      title: '⚙️ Electrical & Computer Engineering',
      stream: 'Natural Science (Pre-Engineering Stream)',
      cutoff: 'Freshman CGPA 3.25 - 3.60',
      requirements: 'Solid grasp of General Physics, Calculus/Applied Math, and Emerging Technologies.',
      careers: 'Power Systems Engineer, Telecommunications Specialist (Ethio Telecom, Safaricom), Robotics, Embedded Systems.',
      tips: 'Focus heavily on circuit theory and physics mechanics in second semester.',
    },
    civil: {
      title: '🏗️ Civil & Construction Engineering',
      stream: 'Natural Science (Pre-Engineering Stream)',
      cutoff: 'Freshman CGPA 3.00 - 3.45',
      requirements: 'Strength in Physics, Calculus, and Engineering Graphics foundation.',
      careers: 'Structural Engineer, Infrastructure Contractor, Highway & Bridge Designer, Project Manager.',
      tips: 'Consistently one of the largest engineering faculties with extensive field work.',
    },
    mech: {
      title: '🔧 Mechanical & Mechatronics Engineering',
      stream: 'Natural Science (Pre-Engineering Stream)',
      cutoff: 'Freshman CGPA 3.10 - 3.50',
      requirements: 'Excellence in Physics, Mathematics, and Engineering Materials.',
      careers: 'Automotive Engineer, Aviation/Aerospace (Ethiopian Airlines), Manufacturing, Industrial Automation.',
      tips: 'High recruitment opportunities with Ethiopian Airlines maintenance and industrial parks.',
    },
    chem: {
      title: '🧪 Chemical & Biomedical Engineering',
      stream: 'Natural Science (Pre-Engineering / Health Stream)',
      cutoff: 'Freshman CGPA 3.00 - 3.40',
      requirements: 'High performance in Chemistry, General Physics, and Applied Mathematics.',
      careers: 'Process Engineer, Pharmaceutical Manufacturing, Food Processing, Medical Device Specialist.',
      tips: 'Rapidly growing industrial sector with breweries, cement factories, and sugar corporations.',
    },
    business: {
      title: '📊 Accounting, Finance & Banking',
      stream: 'Social Science (Business & Economics Stream)',
      cutoff: 'Social Science CGPA 3.20 - 3.65',
      requirements: 'High grade in Math for Social, Communicative English, and Critical Thinking.',
      careers: 'Bank Auditor, Financial Analyst (CBE, Awash, Dashen), Tax Consultant, Corporate Accountant.',
      tips: 'Keep semester GPA above 3.5 to secure top banking and accounting department placements.',
    },
    law: {
      title: '⚖️ School of Law (LLB)',
      stream: 'Social Science (Law & Governance Stream)',
      cutoff: 'Social Science CGPA 3.50 - 3.85',
      requirements: 'Excellence in Critical Thinking & Logic, Civics, and English Language.',
      careers: 'Judge, Public Prosecutor, Corporate Legal Counsel, Human Rights Advocate, Diplomat.',
      tips: 'Strong reading and analytical writing skills are required. Oral participation in class helps.',
    },
    econ: {
      title: '📈 Economics, Management & Marketing',
      stream: 'Social Science (Business & Economics Stream)',
      cutoff: 'Social Science CGPA 2.90 - 3.35',
      requirements: 'Solid grades in Mathematics for Social and Global Trends.',
      careers: 'Economic Policy Analyst, Marketing Manager, Supply Chain Coordinator, NGO Project Officer.',
      tips: 'Understanding macroeconomic concepts and statistical tools gives strong career leverage.',
    },
    agri: {
      title: '🌾 Agriculture, Food Science & Agribusiness',
      stream: 'Natural / Social Science',
      cutoff: 'CGPA 2.50 - 3.00',
      requirements: 'Good foundation in Geography, Inclusiveness, and Environmental Sciences.',
      careers: 'Agricultural Economist, Food Processing Specialist, Farm Manager, Export Quality Officer.',
      tips: 'High scholarship and international research grant opportunities available.',
    },
  };

  const dept = deptData[deptKey] || deptData.cs_se;

  const message =
    `🏢 **${dept.title}**\n\n` +
    `🔬 **ዘርፍ (Stream):** ${dept.stream}\n` +
    `🎯 **አስፈላጊ ዝቅተኛ GPA (Estimated Cutoff):** \`${dept.cutoff}\`\n\n` +
    `📌 **ዋና ዋና መስፈርቶች (Requirements):**\n${dept.requirements}\n\n` +
    `💼 **የሥራ ዕድሎች (Career Opportunities):**\n${dept.careers}\n\n` +
    `💡 **ጠቃሚ ምክር (Freshman Placement Tip):**\n${dept.tips}\n\n` +
    `_የ 1ኛ ሴሚስተር GPAዎን ለማሳደግ የ Mid እና Final ፈተናዎችን በደንብ ይለማመዱ!_`;

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: getDeptDetailKeyboard(),
  });
}

/**
 * Handle GPA & Study Tools Callback
 */
export async function handleStudyTools(ctx: MyContext) {
  if (!ctx.callbackQuery || !ctx.callbackQuery.data) return;
  await ctx.answerCallbackQuery();

  const data = ctx.callbackQuery.data;
  const toolKey = data.replace('tool:', '');

  if (toolKey === 'gpa_calc') {
    const calcText =
      `🧮 **Ethiopian University GPA / CGPA Calculator**\n\n` +
      `**Letter Grade Scale & Grade Points:**\n` +
      `• **A+ / A (4.00)** ➔ Excellent (85 - 100%)\n` +
      `• **A- (3.75)** ➔ Very Good (80 - 84%)\n` +
      `• **B+ (3.50)** ➔ Very Good (75 - 79%)\n` +
      `• **B (3.00)** ➔ Good (70 - 74%)\n` +
      `• **B- (2.75)** ➔ Satisfactory (65 - 69%)\n` +
      `• **C+ (2.50)** ➔ Fair (60 - 64%)\n` +
      `• **C (2.00)** ➔ Pass (50 - 59%)\n` +
      `• **F (0.00)** ➔ Fail (< 50%)\n\n` +
      `📐 **Formula:** \`GPA = Total (Grade Point × Credit Hours) / Total Credit Hours\`\n\n` +
      `💡 _ለተሟላ የ GPA ማስያ የ Web App ዳሽቦርዳችንን ይክፈቱ!_`;

    await ctx.reply(calcText, { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() });
  } else if (toolKey === 'tips') {
    const tipsText =
      `💡 **Freshman Year Survival Guide & Tips** 🎓\n\n` +
      `1️⃣ **First 3 Weeks Count:** የመጀመሪያዎቹ ሳምንታት የፈተና ውጤቶች (Quizzes) 20-30% ይይዛሉ።\n` +
      `2️⃣ **Study in Groups:** ከ 3-4 ጎበዝ ተማሪዎች ጋር በመሆን የ Mid ፈተናዎችን በጋራ ይስሩ።\n` +
      `3️⃣ **Past Papers Are Gold:** 70% የሚሆኑት የ Mid እና Final ጥያቄዎች ካለፉት ዓመታት ፈተናዎች ጋር ተመሳሳይ ናቸው።\n` +
      `4️⃣ **Target GPA 3.8+:** የምርጫ ዲፓርትመንትዎን ያለ ምንም ችግር ለማግኘት ከ 1ኛ ሴሚስተር ጀምሮ ጠንክረው ይማሩ!`;

    await ctx.reply(tipsText, { parse_mode: 'Markdown', reply_markup: getBackToMenuKeyboard() });
  } else {
    await ctx.reply('📅 **የ 1ኛ እና 2ኛ ሴሚስተር የትምህርት ካላንደር ዝግጁ ነው!**', {
      reply_markup: getBackToMenuKeyboard(),
    });
  }
}



/**
 * Handle Materials Category Selector Callback (Module, Notes, Worksheet, Assignment, Mid exam, Final exam, Reference books)
 */
export async function handleMaterialCategory(ctx: MyContext) {
  if (!ctx.callbackQuery || !ctx.callbackQuery.data || !ctx.from) return;
  await ctx.answerCallbackQuery();

  const telegramId = ctx.from.id;
  const user = await getUserByTelegramId(telegramId);
  const stream = (user?.stream as 'Natural' | 'Social') || 'Natural';
  const categoryKey = ctx.callbackQuery.data.replace('mat_cat:', '');

  const catNames: Record<string, string> = {
    module: '📚 Freshman Official Modules (ኦፊሴላዊ ሞጁሎች)',
    notes: '📚 Lecture Notes & Summaries (አጫጭር ማስታወሻዎች)',
    worksheet: '📚 Worksheets & Practice Exercises (የልምምድ ወርክሺቶች)',
    assignment: '📚 Assignments with Step-by-Step Solutions (አሳይመንቶች)',
    mid_exam: '📚 University Mid-Term Exams & Solutions (የሚድ ፈተናዎች)',
    final_exam: '📚 University Final Exams & Answer Keys (የፋይናል ፈተናዎች)',
    ref_books: '📚 Standard Reference Textbooks & Guides (ሪፈረንስ መጽሐፍት)',
  };

  const title = catNames[categoryKey] || '📚 Freshman Course Materials';

  await ctx.reply(
    `🎓 **${title}**\n\n` +
      `🔬 **ዘርፍ (Stream):** ${stream} Science\n` +
      `የሚፈልጉትን የትምህርት ኮርስ ይምረጡ (Select Course):`,
    {
      parse_mode: 'Markdown',
      reply_markup: getFreshmanCoursesKeyboard(stream, categoryKey),
    }
  );
}

/**
 * Handle Course Material Download Callback
 */
export async function handleCourseDownload(ctx: MyContext) {
  if (!ctx.callbackQuery || !ctx.callbackQuery.data || !ctx.from) return;
  await ctx.answerCallbackQuery({ text: '📥 ፋይሉ እየተዘጋጀ ነው... (Preparing download...)' });

  const data = ctx.callbackQuery.data;
  // Format: course:Natural:module:Math
  const parts = data.replace('course:', '').split(':');
  const stream = parts[0] || 'Natural';
  const category = parts[1] || 'module';
  const courseCode = parts[2] || 'Math';

  const catName =
    category === 'module'
      ? 'Official Course Module'
      : category === 'notes'
      ? 'Chapter Notes & Slides'
      : category === 'worksheet'
      ? 'Worksheets & Practice Questions'
      : category === 'assignment'
      ? 'Assignment with Complete Solution'
      : category === 'mid_exam'
      ? 'Past Mid-Exams with Answer Key'
      : category === 'final_exam'
      ? 'Full Final Exam with Detailed Solutions'
      : category === 'ref_books'
      ? 'Official Standard Reference Textbook'
      : 'Course Material';

  const downloadMessage =
    `📥 **Freshman ${courseCode} (${stream} Science) - ${catName}** 🎓\n\n` +
    `📘 **ኮርስ (Course):** ${courseCode} (Ethiopian Higher Education Curriculum)\n` +
    `📊 **ፋይል ዓይነት (Format):** PDF (Full Version)\n` +
    `🏛️ **ምንጭ (Source):** Ethiopian Ministry of Education & University Archives\n\n` +
    `✅ **የማውረጃ ሊንክ (Direct Download Link):**\n` +
    `🔗 [Click here to download PDF](https://t.me/ethiostudentmaterial)\n\n` +
    `_ፋይሉን በቀጥታ በቴሌግራም ለማውረድ ከላይ ያለውን ሊንክ ይጫኑ!_`;

  await ctx.reply(downloadMessage, { parse_mode: 'Markdown' });
}

/**
 * Handle Navigation / Callbacks
 */
export async function handleMenuNavigation(ctx: MyContext) {
  if (!ctx.callbackQuery || !ctx.callbackQuery.data || !ctx.from) return;
  await ctx.answerCallbackQuery();

  const action = ctx.callbackQuery.data;
  const telegramId = ctx.from.id;
  const isPremium = await isUserPremium(telegramId);

  switch (action) {
    case 'menu:mat_categories':
      await ctx.reply(
        `📚 **Freshman Study Materials & Exam Archive (VIP Unlocked)** 🎓\n\n` +
          `የሚፈልጉትን የትምህርት ምድብ ይምረጡ (Select Resource Category):`,
        {
          parse_mode: 'Markdown',
          reply_markup: getMaterialCategoriesKeyboard(),
        }
      );
      break;

    case 'menu:main_free':
      await ctx.reply(
        `🏠 **ዋና ማውጫ (Freshman Main Menu)**\n\n` +
          `ከታች ያሉትን በተኖች በመጠቀም የሚፈልጉትን መርጃ ይምረጡ 👇`,
        {
          parse_mode: 'Markdown',
          reply_markup: getMainReplyKeyboard(true),
        }
      );
      break;

    case 'menu:uni_list':
      await ctx.reply(
        `🏛️ **Ethiopian Universities Campus & Academic Info** 🇪🇹\n\n` +
          `የካምፓስ አቀማመጥ፣ የነጥብ አሰጣጥ (Grading Scale)፣ የዶርም እና የምግብ አገልግሎት መረጃዎች:\n\n` +
          `ዩኒቨርሲቲዎን ይምረጡ (Select University):`,
        {
          parse_mode: 'Markdown',
          reply_markup: getUniversitiesKeyboard(),
        }
      );
      break;

    case 'menu:dept_list':
      await ctx.reply(
        `🏢 **Ethiopian University Department Placement Info** 🎓\n\n` +
          `የዲፓርትመንት መግቢያ ዝቅተኛ GPA (Cutoff points)፣ መስፈርቶችና የሥራ ዕድሎች መረጃ:\n\n` +
          `የሚፈልጉትን የትምህርት መስክ ይምረጡ (Select Field):`,
        {
          parse_mode: 'Markdown',
          reply_markup: getDepartmentsKeyboard(),
        }
      );
      break;

    case 'menu:switch_stream':
      await ctx.reply(
        `🔬 **የትምህርት ዘርፍ ይምረጡ (Select Freshman Stream):**`,
        {
          parse_mode: 'Markdown',
          reply_markup: getFreshmanStreamKeyboard(),
        }
      );
      break;

    case 'premium:info':
    case 'premium:pay_info':
      await ctx.reply(
        `💎 **Freshman VIP Premium Subscription (የክፍያ አማራጮች)** 🇪🇹\n\n` +
          `የሚፈልጉትን የክፍያ አማራጭ ይምረጡ (Choose Payment Method):\n\n` +
          `💰 **የዋጋ ዝርዝር (Subscription Plans):**\n` +
          `• **1 ወር (1 Month):** \`50 ETB\`\n` +
          `• **1 ሴሚስተር (1 Semester):** \`120 ETB\` ⭐ *(ተመራጭ)*\n` +
          `• **ሙሉ ዓመት (Full Year):** \`200 ETB\` *(Lifetime)*\n\n` +
          `👇 **ለመክፈል ከታች አንዱን አካውንት ይምረጡ:**`,
        {
          parse_mode: 'Markdown',
          reply_markup: getPaymentMethodsKeyboard(),
        }
      );
      break;

    case 'pay:telebirr':
      await ctx.reply(
        `📱 **የቴሌብር (Telebirr) ክፍያ ዝርዝር መመሪያ** 🇪🇹\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `🔹 **የቴሌብር ስልክ ቁጥር:** \`0911000000\`\n` +
          `🔹 **የተቀባይ ስም:** Ethio Student Support\n` +
          `🔹 **የዋጋ ተመን:**\n` +
          `   • 1 ወር: 50 ETB\n` +
          `   • 1 ሴሚስተር: 120 ETB\n` +
          `   • ሙሉ ዓመት: 200 ETB\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `📌 **የአከፋፈል ቅደም ተከተል (Steps):**\n` +
          `1️⃣ የ Telebirr መተግበሪያዎን ይክፈቱ ወይም በ \`*127#\` ይደውሉ\n` +
          `2️⃣ **"ገንዘብ ማስተላለፍ (Send Money)"** የሚለውን ይምረጡ\n` +
          `3️⃣ ወደ \`0911000000\` የሚፈልጉትን የፕላን መጠን ያስተላልፉ\n` +
          `4️⃣ ክፍያው ሲጠናቀቅ የደረሰኝ ስክሪንሾት (Screenshot) ያንሱ\n` +
          `5️⃣ ያነሱትን Screenshot እዚህ ቻት ውስጥ በቀጥታ ይላኩልን ወይም ለአድሚን @ethiostudentsupport ከቴሌግራም ID \`${telegramId}\` ጋር ይላኩ!\n\n` +
          `_አድሚናችን በ 5 ደቂቃ ውስጥ የእርስዎን VIP Premium ያበራልዎታል!_`,
        {
          parse_mode: 'Markdown',
          reply_markup: getTelebirrPaymentKeyboard(),
        }
      );
      break;

    case 'pay:cbe':
      await ctx.reply(
        `🏦 **የኢትዮጵያ ንግድ ባንክ (CBE) ክፍያ ዝርዝር መመሪያ** 🇪🇹\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `🔹 **የ CBE ሂሳብ ቁጥር:** \`1000123456789\`\n` +
          `🔹 **የሂሳብ ስም:** Ethio Student Material\n` +
          `🔹 **የዋጋ ተመን:**\n` +
          `   • 1 ወር: 50 ETB\n` +
          `   • 1 ሴሚስተር: 120 ETB\n` +
          `   • ሙሉ ዓመት: 200 ETB\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `📌 **የአከፋፈል ቅደም ተከተል (Steps):**\n` +
          `1️⃣ የ CBE Mobile Banking / CBE Birr መተግበሪያዎን ይክፈቱ\n` +
          `2️⃣ ወደ ሂሳብ ቁጥር \`1000123456789\` ያስተላልፉ\n` +
          `3️⃣ የተቀባይ ስም **"Ethio Student Material"** መሆኑን ያረጋግጡ\n` +
          `4️⃣ ክፍያው ሲጠናቀቅ የደረሰኝ ስክሪንሾት (Screenshot) ወይም የ SMS ማረጋገጫ ያንሱ\n` +
          `5️⃣ ስክሪንሾቱን እዚህ ቻት ውስጥ በቀጥታ ይላኩልን ወይም ለአድሚን @ethiostudentsupport ከ ID: \`${telegramId}\` ጋር ይላኩ!\n\n` +
          `_ደረሰኙ እንደደረሰን በደቂቃዎች ውስጥ የእርስዎ VIP Premium ይበራል!_`,
        {
          parse_mode: 'Markdown',
          reply_markup: getCBEPaymentKeyboard(),
        }
      );
      break;

    case 'premium:check_status':
      if (isPremium) {
        await ctx.reply(
          `🎉 **እንኳን ደስ አለዎት! ፕሪሚየምዎ በርቷል (Premium Activated!)**\n\n` +
            `ሁሉንም የ Freshman ሞጁሎችና ፈተናዎች በሙሉ ነፃነት መጠቀም ይችላሉ!`,
          {
            parse_mode: 'Markdown',
            reply_markup: getMainReplyKeyboard(true),
          }
        );
      } else {
        await ctx.reply(
          `⏳ **ክፍያዎ በመረጋገጥ ላይ ነው (Pending Verification)**\n\n` +
            `የከፈሉበትን ደረሰኝ ስክሪንሾት በዚህ ቻት ውስጥ ይላኩ ወይም ለአድሚን @ethiostudentsupport ይላኩ።\n\n` +
            `የእርስዎ Telegram ID: \`${telegramId}\``,
          {
            parse_mode: 'Markdown',
            reply_markup: getPremiumUpgradeKeyboard(),
          }
        );
      }
      break;

    case 'premium:submit_proof':
      await ctx.reply(
        `📸 **የክፍያ ደረሰኝ ስክሪንሾት ለመላክ (Send Screenshot):**\n\n` +
          `1️⃣ የከፈሉበትን የቴሌብር ወይም የባንክ ደረሰኝ Screenshot አሁኑኑ በዚህ ቻት ውስጥ እንደ ፎቶ (Photo) ይላኩልን!\n` +
          `2️⃣ ወይም በቀጥታ ለአድሚን @ethiostudentsupport ከቴሌግራም ID \`${telegramId}\` ጋር ይላኩ።\n\n` +
          `_ደረሰኙ ሲደርሰን በ 5 ደቂቃ ውስጥ እናበራለን!_`,
        {
          parse_mode: 'Markdown',
          reply_markup: getPaymentMethodsKeyboard(),
        }
      );
      break;
  }
}
