import type { Localized } from '../i18n'

export const CATEGORIES = ['languages', 'it', 'office', 'marketing'] as const
export const LEVELS = ['beginner', 'intermediate', 'advanced'] as const
export const FORMATS = ['onsite', 'online', 'hybrid'] as const
export const SCHEDULES = ['day', 'evening', 'weekend'] as const

export type Category = (typeof CATEGORIES)[number]
export type Level = (typeof LEVELS)[number]
export type Format = (typeof FORMATS)[number]
export type Schedule = (typeof SCHEDULES)[number]

/**
 * A recurring session rule, e.g. "first Monday of next month, evenings".
 * Dates are computed from today so the demo never shows past sessions.
 */
export interface SessionPlan {
  monthOffset: number
  /** 0 = Sunday … 6 = Saturday */
  weekday: number
  schedule: Schedule
  format: Format
  time: string
}

export interface Course {
  slug: string
  category: Category
  level: Level
  image: string
  imageAlt: Localized
  title: Localized
  tagline: Localized
  hours: number
  weeks: number
  rhythm: Localized
  /** Indicative starting price in MAD. */
  priceFrom: number
  priceUnit: 'month' | 'total'
  ageMin: number
  featured?: boolean
  objectives: Localized[]
  modules: { title: Localized; text: Localized }[]
  prerequisites: Localized[]
  audience: Localized[]
  faq: { q: Localized; a: Localized }[]
  /** Extra search terms (any language). */
  keywords: string
  sessions: SessionPlan[]
}

const L = (fr: string, ar: string, en: string): Localized => ({ fr, ar, en })

export const courses: Course[] = [
  {
    slug: 'anglais-communication',
    category: 'languages',
    level: 'intermediate',
    image: 'anglais',
    imageAlt: L('Trois apprenants échangent en souriant autour d’une table', 'ثلاثة متعلمين يتحاورون مبتسمين حول طاولة', 'Three learners chatting and smiling around a table'),
    title: L('Anglais : communiquer au quotidien', 'الإنجليزية: التواصل في الحياة اليومية', 'English for everyday communication'),
    tagline: L(
      'Prenez confiance à l’oral : conversations, voyages, travail. Des petits groupes et beaucoup de pratique.',
      'اكتسب الثقة في التحدث: محادثات، سفر، عمل. مجموعات صغيرة وتطبيق كثير.',
      'Gain confidence speaking: conversations, travel, work. Small groups and plenty of practice.',
    ),
    hours: 48,
    weeks: 12,
    rhythm: L('2 séances de 2 h par semaine', 'حصتان من ساعتين في الأسبوع', 'Two 2-hour sessions a week'),
    priceFrom: 450,
    priceUnit: 'month',
    ageMin: 14,
    featured: true,
    objectives: [
      L('Tenir une conversation simple sur des sujets du quotidien', 'إجراء محادثة بسيطة حول مواضيع يومية', 'Hold a simple conversation on everyday topics'),
      L('Comprendre l’essentiel d’un échange à vitesse normale', 'فهم جوهر حوار بسرعة عادية', 'Understand the gist of a conversation at normal speed'),
      L('Rédiger un e-mail ou un message clair', 'كتابة رسالة إلكترونية أو رسالة قصيرة واضحة', 'Write a clear email or message'),
      L('Gagner en aisance grâce aux mises en situation', 'اكتساب الطلاقة من خلال تمارين المحاكاة', 'Speak more easily through role-plays'),
    ],
    modules: [
      { title: L('Se présenter et échanger', 'التعريف بالنفس والتحاور', 'Introducing yourself'), text: L('Présentations, habitudes, goûts : les bases d’une conversation fluide.', 'التعارف والعادات والأذواق: أسس محادثة سلسة.', 'Introductions, habits, likes: the basics of a smooth conversation.') },
      { title: L('Voyager et se déplacer', 'السفر والتنقل', 'Travelling and getting around'), text: L('Hôtel, transport, restaurant : les situations les plus fréquentes.', 'الفندق والنقل والمطعم: المواقف الأكثر تكرارًا.', 'Hotel, transport, restaurant: the most common situations.') },
      { title: L('L’anglais au travail', 'الإنجليزية في العمل', 'English at work'), text: L('Appels, e-mails courts et réunions simples.', 'المكالمات والرسائل القصيرة والاجتماعات البسيطة.', 'Calls, short emails and simple meetings.') },
      { title: L('Raconter et donner son avis', 'الحكي وإبداء الرأي', 'Telling stories and giving opinions'), text: L('Temps du passé, comparaisons et argumentation simple.', 'أزمنة الماضي والمقارنة والحجاج البسيط.', 'Past tenses, comparisons and simple arguments.') },
      { title: L('Projet oral final', 'المشروع الشفهي الختامي', 'Final speaking project'), text: L('Une courte présentation préparée puis présentée devant le groupe.', 'عرض قصير يُحضَّر ثم يُقدَّم أمام المجموعة.', 'A short talk, prepared and then given to the group.') },
    ],
    prerequisites: [
      L('Connaître les bases de l’anglais (niveau débutant avancé environ)', 'معرفة أساسيات الإنجليزية (مستوى مبتدئ متقدم تقريبًا)', 'Know the basics of English (roughly upper beginner)'),
      L('Un court entretien de positionnement avant le début', 'مقابلة قصيرة لتحديد المستوى قبل البداية', 'A short placement chat before the start'),
    ],
    audience: [
      L('Lycéens et étudiants à partir de 14 ans', 'التلاميذ والطلبة ابتداءً من 14 سنة', 'Pupils and students aged 14 and over'),
      L('Professionnels du tourisme et du commerce', 'مهنيو السياحة والتجارة', 'Tourism and retail professionals'),
      L('Adultes qui veulent reprendre l’anglais', 'البالغون الراغبون في العودة إلى الإنجليزية', 'Adults getting back into English'),
    ],
    faq: [
      {
        q: L('Je ne sais pas si j’ai le bon niveau ?', 'لست متأكدًا من مستواي؟', 'I’m not sure I have the right level?'),
        a: L(
          'Un entretien de positionnement est proposé avant l’inscription pour vous orienter vers le bon groupe.',
          'تُقترح مقابلة لتحديد المستوى قبل التسجيل لتوجيهك إلى المجموعة المناسبة.',
          'A placement chat is offered before enrolment to guide you to the right group.',
        ),
      },
      {
        q: L('Que se passe-t-il si je manque une séance ?', 'ماذا لو فاتتني حصة؟', 'What if I miss a session?'),
        a: L(
          'Les supports sont partagés après chaque séance ; en format hybride, vous pouvez suivre la séance à distance.',
          'تُشارَك الدعامات بعد كل حصة، وفي الصيغة الهجينة يمكنك متابعة الحصة عن بُعد.',
          'Materials are shared after each session; in the hybrid format you can join remotely.',
        ),
      },
    ],
    keywords: 'english anglais inglés انجليزية إنجليزية conversation oral speaking langue',
    sessions: [
      { monthOffset: 1, weekday: 1, schedule: 'evening', format: 'onsite', time: '18:30 – 20:30' },
      { monthOffset: 1, weekday: 6, schedule: 'weekend', format: 'hybrid', time: '10:00 – 12:00' },
      { monthOffset: 2, weekday: 2, schedule: 'evening', format: 'hybrid', time: '18:30 – 20:30' },
    ],
  },
  {
    slug: 'espagnol-debutant',
    category: 'languages',
    level: 'beginner',
    image: 'espagnol',
    imageAlt: L('Bureau avec carnet de notes, livres et ordinateur portable', 'مكتب عليه دفتر ملاحظات وكتب وحاسوب محمول', 'Desk with a notebook, books and a laptop'),
    title: L('Espagnol pour débutants', 'الإسبانية للمبتدئين', 'Spanish for beginners'),
    tagline: L(
      'Les bases pour comprendre et vous faire comprendre : utile pour le tourisme, les études et la famille.',
      'الأساسيات لتَفهم وتُفهِم: مفيدة للسياحة والدراسة والعائلة.',
      'The basics to understand and be understood: useful for tourism, studies and family.',
    ),
    hours: 36,
    weeks: 12,
    rhythm: L('1 séance de 3 h par semaine', 'حصة واحدة من 3 ساعات في الأسبوع', 'One 3-hour session a week'),
    priceFrom: 400,
    priceUnit: 'month',
    ageMin: 12,
    objectives: [
      L('Se présenter et poser des questions simples', 'التعريف بالنفس وطرح أسئلة بسيطة', 'Introduce yourself and ask simple questions'),
      L('Comprendre des phrases courantes', 'فهم الجمل المتداولة', 'Understand everyday phrases'),
      L('Lire et écrire des messages courts', 'قراءة وكتابة رسائل قصيرة', 'Read and write short messages'),
      L('Maîtriser la prononciation de base', 'إتقان النطق الأساسي', 'Get the basic pronunciation right'),
    ],
    modules: [
      { title: L('Premiers pas', 'الخطوات الأولى', 'First steps'), text: L('Alphabet, prononciation, salutations et formules de politesse.', 'الحروف والنطق والتحية وعبارات المجاملة.', 'Alphabet, pronunciation, greetings and polite phrases.') },
      { title: L('La vie quotidienne', 'الحياة اليومية', 'Everyday life'), text: L('Nombres, heures, achats et prix.', 'الأعداد والساعات والتسوق والأثمان.', 'Numbers, time, shopping and prices.') },
      { title: L('Se repérer', 'التوجه في المدينة', 'Finding your way'), text: L('La ville, les directions et les transports.', 'المدينة والاتجاهات والنقل.', 'The city, directions and transport.') },
      { title: L('Parler de soi', 'الحديث عن النفس', 'Talking about yourself'), text: L('Famille, études, loisirs et projets.', 'العائلة والدراسة والهوايات والمشاريع.', 'Family, studies, hobbies and plans.') },
    ],
    prerequisites: [
      L('Aucun prérequis en espagnol', 'لا يُشترط أي مستوى في الإسبانية', 'No prior Spanish needed'),
      L('Savoir lire et écrire en français ou en arabe', 'إتقان القراءة والكتابة بالفرنسية أو العربية', 'Able to read and write in French or Arabic'),
    ],
    audience: [
      L('Débutants complets à partir de 12 ans', 'المبتدئون تمامًا ابتداءً من 12 سنة', 'Complete beginners aged 12 and over'),
      L('Personnes en contact avec des visiteurs hispanophones', 'من يتعامل مع زوار ناطقين بالإسبانية', 'People who meet Spanish-speaking visitors'),
      L('Familles avec des proches en Espagne', 'العائلات التي لها أقارب في إسبانيا', 'Families with relatives in Spain'),
    ],
    faq: [
      {
        q: L('Faut-il acheter un manuel ?', 'هل يجب شراء كتاب مدرسي؟', 'Do I need to buy a textbook?'),
        a: L('Non, les supports de cours sont fournis pendant la formation.', 'لا، تُوفَّر الدعامات خلال التكوين.', 'No, course materials are provided during the course.'),
      },
      {
        q: L('Mon enfant de 12 ans peut-il s’inscrire ?', 'هل يمكن لابني ذي 12 سنة التسجيل؟', 'Can my 12-year-old enrol?'),
        a: L(
          'Oui, à partir de 12 ans, avec les coordonnées d’un parent ou tuteur dans la demande.',
          'نعم، ابتداءً من 12 سنة، مع معلومات أحد الوالدين أو الولي في الطلب.',
          'Yes, from age 12, with a parent or guardian’s details in the request.',
        ),
      },
    ],
    keywords: 'spanish espagnol español إسبانية اسبانية langue débutant',
    sessions: [
      { monthOffset: 1, weekday: 4, schedule: 'evening', format: 'onsite', time: '18:00 – 21:00' },
      { monthOffset: 2, weekday: 6, schedule: 'weekend', format: 'onsite', time: '09:30 – 12:30' },
    ],
  },
  {
    slug: 'francais-professionnel',
    category: 'languages',
    level: 'intermediate',
    image: 'francais',
    imageAlt: L('Main qui écrit dans un carnet à côté d’une tasse', 'يد تكتب في دفتر بجانب فنجان', 'A hand writing in a notebook next to a cup'),
    title: L('Français professionnel : écrit & oral', 'الفرنسية المهنية: الكتابة والتواصل الشفهي', 'Professional French: writing & speaking'),
    tagline: L(
      'E-mails, comptes rendus, entretiens et prises de parole : un français clair et efficace au travail.',
      'الرسائل الإلكترونية والتقارير والمقابلات والعروض: فرنسية واضحة وفعّالة في العمل.',
      'Emails, reports, interviews and presentations: clear, effective French at work.',
    ),
    hours: 30,
    weeks: 10,
    rhythm: L('1 séance de 3 h par semaine', 'حصة واحدة من 3 ساعات في الأسبوع', 'One 3-hour session a week'),
    priceFrom: 450,
    priceUnit: 'month',
    ageMin: 16,
    objectives: [
      L('Rédiger des e-mails professionnels clairs', 'تحرير رسائل إلكترونية مهنية واضحة', 'Write clear professional emails'),
      L('Structurer un compte rendu ou une lettre', 'هيكلة تقرير أو رسالة', 'Structure a report or a letter'),
      L('Préparer un entretien d’embauche', 'التحضير لمقابلة عمل', 'Prepare for a job interview'),
      L('Prendre la parole en réunion avec aisance', 'أخذ الكلمة في الاجتماعات بارتياح', 'Speak up comfortably in meetings'),
    ],
    modules: [
      { title: L('Écrits du quotidien', 'الكتابات اليومية', 'Everyday writing'), text: L('E-mails, relances et réponses aux clients.', 'الرسائل الإلكترونية والتذكيرات والرد على الزبناء.', 'Emails, follow-ups and replies to customers.') },
      { title: L('Documents structurés', 'الوثائق المهيكلة', 'Structured documents'), text: L('Comptes rendus, lettres et CV.', 'التقارير والرسائل والسير الذاتية.', 'Reports, letters and CVs.') },
      { title: L('Oral professionnel', 'التواصل الشفهي المهني', 'Speaking at work'), text: L('Présentation, réunion et téléphone.', 'العرض والاجتماع والهاتف.', 'Presentations, meetings and phone calls.') },
      { title: L('Préparer un entretien', 'التحضير للمقابلة', 'Interview preparation'), text: L('Simulations et retours individuels.', 'محاكاة وملاحظات فردية.', 'Mock interviews and individual feedback.') },
    ],
    prerequisites: [
      L('Comprendre le français courant', 'فهم الفرنسية المتداولة', 'Understand everyday French'),
      L('Un ordinateur ou un smartphone pour le format en ligne', 'حاسوب أو هاتف ذكي للصيغة عن بعد', 'A computer or smartphone for the online format'),
    ],
    audience: [
      L('Demandeurs d’emploi qui préparent des entretiens', 'الباحثون عن عمل المستعدون للمقابلات', 'Job seekers preparing for interviews'),
      L('Employés en contact avec le public', 'الموظفون المتعاملون مع العموم', 'Staff who deal with the public'),
      L('Étudiants en fin de cursus', 'الطلبة في نهاية مسارهم', 'Students finishing their degree'),
    ],
    faq: [
      {
        q: L('Le format en ligne est-il interactif ?', 'هل الصيغة عن بعد تفاعلية؟', 'Is the online format interactive?'),
        a: L(
          'Les séances ont lieu en direct, en petit groupe, avec exercices et corrections pendant la séance.',
          'تُقام الحصص مباشرة في مجموعة صغيرة، مع تمارين وتصحيحات خلال الحصة.',
          'Sessions are live, in a small group, with exercises and corrections during the session.',
        ),
      },
      {
        q: L('Mes écrits seront-ils corrigés ?', 'هل سيتم تصحيح كتاباتي؟', 'Will my writing be corrected?'),
        a: L('Oui, des exercices d’écriture sont corrigés individuellement tout au long de la formation.', 'نعم، تُصحَّح تمارين الكتابة بشكل فردي طوال التكوين.', 'Yes, writing exercises are corrected individually throughout the course.'),
      },
    ],
    keywords: 'french français francais فرنسية رسائل email cv entretien rédaction langue',
    sessions: [
      { monthOffset: 1, weekday: 2, schedule: 'evening', format: 'online', time: '19:00 – 22:00' },
      { monthOffset: 2, weekday: 3, schedule: 'evening', format: 'onsite', time: '18:00 – 21:00' },
    ],
  },
  {
    slug: 'informatique-premiers-pas',
    category: 'it',
    level: 'beginner',
    image: 'informatique',
    imageAlt: L('Jeune apprenant concentré devant un ordinateur portable', 'متعلم شاب مركز أمام حاسوب محمول', 'Young learner focused on a laptop'),
    title: L('Premiers pas en informatique & internet', 'الخطوات الأولى في الإعلاميات والإنترنت', 'First steps with computers & the internet'),
    tagline: L(
      'Ordinateur, smartphone, e-mail, démarches en ligne : devenez autonome, à votre rythme.',
      'الحاسوب والهاتف الذكي والبريد الإلكتروني والخدمات عبر الإنترنت: كن مستقلًا وفق إيقاعك.',
      'Computer, smartphone, email, online services: become independent, at your own pace.',
    ),
    hours: 24,
    weeks: 6,
    rhythm: L('2 séances de 2 h par semaine', 'حصتان من ساعتين في الأسبوع', 'Two 2-hour sessions a week'),
    priceFrom: 900,
    priceUnit: 'total',
    ageMin: 12,
    featured: true,
    objectives: [
      L('Utiliser un ordinateur et organiser ses fichiers', 'استعمال الحاسوب وتنظيم الملفات', 'Use a computer and organise your files'),
      L('Créer et gérer une adresse e-mail', 'إنشاء بريد إلكتروني وتدبيره', 'Create and manage an email address'),
      L('Naviguer sur internet en sécurité', 'تصفح الإنترنت بأمان', 'Browse the internet safely'),
      L('Effectuer des démarches en ligne simples', 'القيام بإجراءات بسيطة عبر الإنترنت', 'Complete simple online procedures'),
    ],
    modules: [
      { title: L('Découvrir l’ordinateur', 'اكتشاف الحاسوب', 'Getting to know the computer'), text: L('Souris, clavier, fenêtres et dossiers.', 'الفأرة ولوحة المفاتيح والنوافذ والمجلدات.', 'Mouse, keyboard, windows and folders.') },
      { title: L('Internet au quotidien', 'الإنترنت في الحياة اليومية', 'Everyday internet'), text: L('Recherche, favoris et téléchargements.', 'البحث والمفضلة والتنزيلات.', 'Search, bookmarks and downloads.') },
      { title: L('E-mail & messagerie', 'البريد الإلكتروني والمراسلة', 'Email & messaging'), text: L('Envoyer, joindre un fichier, organiser sa boîte.', 'الإرسال وإرفاق ملف وتنظيم العلبة.', 'Sending, attaching files, organising your inbox.') },
      { title: L('Sécurité numérique', 'الأمن الرقمي', 'Staying safe online'), text: L('Mots de passe, arnaques courantes et confidentialité.', 'كلمات المرور والاحتيالات الشائعة والخصوصية.', 'Passwords, common scams and privacy.') },
      { title: L('Démarches en ligne', 'الإجراءات عبر الإنترنت', 'Online procedures'), text: L('Formulaires, documents scannés et prises de rendez-vous.', 'الاستمارات والوثائق الممسوحة وحجز المواعيد.', 'Forms, scanned documents and booking appointments.') },
    ],
    prerequisites: [
      L('Aucun prérequis', 'لا توجد شروط مسبقة', 'No prerequisites'),
      L('Des ordinateurs sont mis à disposition pendant les séances', 'تُوضع حواسيب رهن الإشارة خلال الحصص', 'Computers are available during sessions'),
    ],
    audience: [
      L('Adultes et seniors qui débutent', 'البالغون وكبار السن المبتدئون', 'Adults and seniors starting out'),
      L('Parents qui veulent accompagner leurs enfants', 'الآباء الراغبون في مواكبة أبنائهم', 'Parents who want to support their children'),
      L('Jeunes à partir de 12 ans', 'الشباب ابتداءً من 12 سنة', 'Young people aged 12 and over'),
    ],
    faq: [
      {
        q: L('Je n’ai jamais utilisé d’ordinateur, est-ce pour moi ?', 'لم أستعمل حاسوبًا من قبل، هل هذا التكوين مناسب لي؟', 'I’ve never used a computer — is this for me?'),
        a: L('Oui, la formation part de zéro, avec un rythme adapté et beaucoup de répétition.', 'نعم، يبدأ التكوين من الصفر بإيقاع ملائم وتكرار كثير.', 'Yes, the course starts from zero, at a suitable pace with plenty of repetition.'),
      },
      {
        q: L('Puis-je venir avec mon propre appareil ?', 'هل يمكنني إحضار جهازي الخاص؟', 'Can I bring my own device?'),
        a: L('Oui, c’est même conseillé pour repartir avec des réglages adaptés à votre appareil.', 'نعم، بل يُنصح بذلك لتنطلق بإعدادات تناسب جهازك.', 'Yes, it’s even recommended so you leave with settings that suit your device.'),
      },
    ],
    keywords: 'informatique ordinateur internet email smartphone computer إعلاميات حاسوب انترنت débutant senior',
    sessions: [
      { monthOffset: 1, weekday: 3, schedule: 'day', format: 'onsite', time: '10:00 – 12:00' },
      { monthOffset: 1, weekday: 6, schedule: 'weekend', format: 'onsite', time: '14:00 – 16:00' },
      { monthOffset: 2, weekday: 3, schedule: 'day', format: 'onsite', time: '10:00 – 12:00' },
    ],
  },
  {
    slug: 'developpement-web',
    category: 'it',
    level: 'intermediate',
    image: 'web',
    imageAlt: L('Ordinateur portable affichant du code sur un bureau clair', 'حاسوب محمول يعرض شيفرة برمجية على مكتب فاتح', 'Laptop showing code on a bright desk'),
    title: L('Créer un site web : HTML, CSS & JavaScript', 'إنشاء موقع ويب: HTML وCSS وJavaScript', 'Build a website: HTML, CSS & JavaScript'),
    tagline: L(
      'De la page blanche à un site responsive en ligne : un projet concret pour apprendre en construisant.',
      'من صفحة فارغة إلى موقع متجاوب على الإنترنت: مشروع ملموس للتعلم عبر البناء.',
      'From a blank page to a live responsive website: a real project to learn by building.',
    ),
    hours: 60,
    weeks: 12,
    rhythm: L('2 séances de 2 h par semaine + travail sur projet', 'حصتان من ساعتين في الأسبوع + عمل على المشروع', 'Two 2-hour sessions a week + project work'),
    priceFrom: 2900,
    priceUnit: 'total',
    ageMin: 15,
    featured: true,
    objectives: [
      L('Structurer une page avec du HTML sémantique', 'هيكلة صفحة بـ HTML دلالي', 'Structure a page with semantic HTML'),
      L('Mettre en forme un site responsive avec CSS', 'تنسيق موقع متجاوب بواسطة CSS', 'Style a responsive site with CSS'),
      L('Ajouter de l’interactivité avec JavaScript', 'إضافة التفاعل بواسطة JavaScript', 'Add interactivity with JavaScript'),
      L('Publier un site et le versionner avec Git', 'نشر موقع وإدارة نسخه عبر Git', 'Publish a site and version it with Git'),
    ],
    modules: [
      { title: L('Les bases du web', 'أساسيات الويب', 'Web basics'), text: L('HTML sémantique, liens, images et formulaires.', 'HTML الدلالي والروابط والصور والاستمارات.', 'Semantic HTML, links, images and forms.') },
      { title: L('CSS moderne', 'CSS الحديث', 'Modern CSS'), text: L('Flexbox, grid et responsive design.', 'Flexbox وGrid والتصميم المتجاوب.', 'Flexbox, grid and responsive design.') },
      { title: L('JavaScript essentiel', 'أساسيات JavaScript', 'JavaScript essentials'), text: L('Variables, fonctions, événements et DOM.', 'المتغيرات والدوال والأحداث وDOM.', 'Variables, functions, events and the DOM.') },
      { title: L('Outils du développeur', 'أدوات المطور', 'Developer tools'), text: L('Éditeur de code, Git et mise en ligne.', 'محرر الشيفرة وGit والنشر على الإنترنت.', 'Code editor, Git and deployment.') },
      { title: L('Projet final', 'المشروع الختامي', 'Final project'), text: L('Votre site vitrine, de la maquette à la mise en ligne.', 'موقعك التعريفي، من التصميم إلى النشر.', 'Your showcase site, from mock-up to launch.') },
    ],
    prerequisites: [
      L('Être à l’aise avec un ordinateur (fichiers, navigateur)', 'الارتياح في استعمال الحاسوب (الملفات، المتصفح)', 'Comfortable with a computer (files, browser)'),
      L('Disposer d’un ordinateur portable', 'التوفر على حاسوب محمول', 'Have your own laptop'),
    ],
    audience: [
      L('Étudiants curieux du développement web', 'الطلبة المهتمون بتطوير الويب', 'Students curious about web development'),
      L('Commerçants qui veulent comprendre leur site', 'التجار الراغبون في فهم موقعهم', 'Business owners who want to understand their site'),
      L('Personnes en reconversion qui veulent tester le métier', 'الأشخاص في إعادة توجيه مهني الراغبون في تجربة المهنة', 'Career changers testing the waters'),
    ],
    faq: [
      {
        q: L('Faut-il savoir programmer ?', 'هل يجب معرفة البرمجة مسبقًا؟', 'Do I need to know how to code?'),
        a: L('Non, mais il faut être à l’aise avec un ordinateur. Le module JavaScript reprend les bases pas à pas.', 'لا، لكن يجب الارتياح في استعمال الحاسوب. وحدة JavaScript تشرح الأساسيات خطوة بخطوة.', 'No, but you should be comfortable with a computer. The JavaScript module covers the basics step by step.'),
      },
      {
        q: L('Cette formation mène-t-elle à un emploi ?', 'هل يضمن هذا التكوين عملًا؟', 'Does this course lead to a job?'),
        a: L(
          'Aucune garantie d’emploi n’est donnée. La formation permet d’acquérir des bases solides et un projet à montrer.',
          'لا يُقدَّم أي ضمان للتشغيل. يتيح التكوين اكتساب أسس متينة ومشروع يمكن عرضه.',
          'No job guarantee is given. The course builds solid foundations and a project you can show.',
        ),
      },
    ],
    keywords: 'web site html css javascript js code programmation développement developer برمجة موقع تطوير',
    sessions: [
      { monthOffset: 1, weekday: 1, schedule: 'evening', format: 'hybrid', time: '18:30 – 20:30' },
      { monthOffset: 2, weekday: 6, schedule: 'weekend', format: 'online', time: '09:30 – 13:30' },
    ],
  },
  {
    slug: 'excel-avance',
    category: 'office',
    level: 'advanced',
    image: 'excel',
    imageAlt: L('Ordinateur portable affichant un tableau de bord avec graphiques', 'حاسوب محمول يعرض لوحة قيادة بمبيانات', 'Laptop showing a dashboard with charts'),
    title: L('Excel avancé : formules, tableaux croisés & tableaux de bord', 'إكسل متقدم: الصيغ والجداول المحورية ولوحات القيادة', 'Advanced Excel: formulas, pivot tables & dashboards'),
    tagline: L(
      'Automatisez vos calculs et transformez vos données en décisions, sur des cas proches de votre activité.',
      'أتمتة حساباتك وتحويل بياناتك إلى قرارات، من خلال حالات قريبة من نشاطك.',
      'Automate your calculations and turn data into decisions, using cases close to your work.',
    ),
    hours: 20,
    weeks: 5,
    rhythm: L('2 séances de 2 h par semaine', 'حصتان من ساعتين في الأسبوع', 'Two 2-hour sessions a week'),
    priceFrom: 1200,
    priceUnit: 'total',
    ageMin: 16,
    objectives: [
      L('Maîtriser les fonctions de recherche et conditionnelles', 'إتقان دوال البحث والدوال الشرطية', 'Master lookup and conditional functions'),
      L('Analyser des données avec les tableaux croisés dynamiques', 'تحليل البيانات بالجداول المحورية', 'Analyse data with pivot tables'),
      L('Construire un tableau de bord lisible', 'بناء لوحة قيادة واضحة', 'Build a clear dashboard'),
      L('Fiabiliser ses fichiers (validation, protection)', 'تأمين الملفات (التحقق، الحماية)', 'Make files reliable (validation, protection)'),
    ],
    modules: [
      { title: L('Formules qui comptent', 'الصيغ الأساسية', 'Formulas that matter'), text: L('RECHERCHEX, SI imbriqués, SOMME.SI.ENS.', 'XLOOKUP وIF المتداخلة وSUMIFS.', 'XLOOKUP, nested IFs, SUMIFS.') },
      { title: L('Préparer ses données', 'تحضير البيانات', 'Preparing data'), text: L('Tableaux structurés, nettoyage et validation.', 'الجداول المهيكلة والتنظيف والتحقق.', 'Structured tables, cleaning and validation.') },
      { title: L('Tableaux croisés dynamiques', 'الجداول المحورية', 'Pivot tables'), text: L('Regrouper, filtrer et segmenter.', 'التجميع والتصفية والتقسيم.', 'Grouping, filtering and slicers.') },
      { title: L('Tableau de bord', 'لوحة القيادة', 'Dashboard'), text: L('Graphiques, indicateurs et mise en page.', 'المبيانات والمؤشرات والتنسيق.', 'Charts, indicators and layout.') },
      { title: L('Cas pratique', 'حالة تطبيقية', 'Hands-on case'), text: L('Un fichier issu de votre activité (anonymisé si besoin).', 'ملف من نشاطك (مجهول الهوية عند الحاجة).', 'A file from your own work (anonymised if needed).') },
    ],
    prerequisites: [
      L('Utiliser Excel régulièrement (saisie, formules simples)', 'استعمال إكسل بانتظام (الإدخال، الصيغ البسيطة)', 'Use Excel regularly (data entry, simple formulas)'),
      L('Avoir accès à Excel sur un ordinateur', 'التوفر على إكسل في حاسوب', 'Have access to Excel on a computer'),
    ],
    audience: [
      L('Comptables, gestionnaires et assistants', 'المحاسبون والمسيرون والمساعدون', 'Accountants, managers and assistants'),
      L('Commerçants qui suivent leurs ventes', 'التجار الذين يتتبعون مبيعاتهم', 'Shop owners tracking their sales'),
      L('Étudiants en gestion', 'طلبة التسيير', 'Business students'),
    ],
    faq: [
      {
        q: L('Puis-je travailler sur mes propres fichiers ?', 'هل يمكنني العمل على ملفاتي الخاصة؟', 'Can I work on my own files?'),
        a: L('Oui, le dernier module est un cas pratique : vous pouvez apporter un fichier, anonymisé si besoin.', 'نعم، الوحدة الأخيرة حالة تطبيقية: يمكنك إحضار ملف، مجهول الهوية عند الحاجة.', 'Yes, the last module is a hands-on case: you can bring a file, anonymised if needed.'),
      },
      {
        q: L('Et si ce niveau est trop élevé pour moi ?', 'وماذا لو كان هذا المستوى مرتفعًا بالنسبة لي؟', 'What if this level is too high for me?'),
        a: L('Un court test de positionnement permet de vous orienter, si besoin, vers la bureautique essentielle.', 'يسمح اختبار قصير لتحديد المستوى بتوجيهك، عند الحاجة، إلى المكتبيات الأساسية.', 'A short placement test can point you to Office essentials instead, if needed.'),
      },
    ],
    keywords: 'excel tableur spreadsheet formules tcd pivot dashboard إكسل اكسل جداول bureautique office',
    sessions: [
      { monthOffset: 1, weekday: 2, schedule: 'evening', format: 'onsite', time: '18:30 – 20:30' },
      { monthOffset: 1, weekday: 4, schedule: 'evening', format: 'online', time: '19:00 – 21:00' },
    ],
  },
  {
    slug: 'bureautique-essentielle',
    category: 'office',
    level: 'beginner',
    image: 'bureautique',
    imageAlt: L('Ordinateur portable, carnet et tasse sur un bureau lumineux', 'حاسوب محمول ودفتر وفنجان على مكتب مضيء', 'Laptop, notebook and mug on a bright desk'),
    title: L('Bureautique essentielle : Word, Excel, PowerPoint', 'المكتبيات الأساسية: Word وExcel وPowerPoint', 'Office essentials: Word, Excel, PowerPoint'),
    tagline: L(
      'Les outils de bureau que tout le monde utilise, appris proprement : documents, tableaux et présentations.',
      'أدوات المكتب التي يستعملها الجميع، بطريقة صحيحة: وثائق وجداول وعروض.',
      'The office tools everyone uses, learned properly: documents, spreadsheets and presentations.',
    ),
    hours: 30,
    weeks: 6,
    rhythm: L('2 séances de 2 h 30 par semaine', 'حصتان من ساعتين ونصف في الأسبوع', 'Two 2.5-hour sessions a week'),
    priceFrom: 1400,
    priceUnit: 'total',
    ageMin: 14,
    objectives: [
      L('Mettre en page un document professionnel (CV, lettre, rapport)', 'تنسيق وثيقة مهنية (سيرة ذاتية، رسالة، تقرير)', 'Lay out a professional document (CV, letter, report)'),
      L('Créer un tableau Excel avec des calculs simples', 'إنشاء جدول إكسل بحسابات بسيطة', 'Build an Excel sheet with simple calculations'),
      L('Concevoir une présentation claire', 'تصميم عرض تقديمي واضح', 'Design a clear presentation'),
      L('Organiser, enregistrer et partager ses fichiers', 'تنظيم الملفات وحفظها ومشاركتها', 'Organise, save and share your files'),
    ],
    modules: [
      { title: L('Word', 'Word', 'Word'), text: L('Mise en forme, styles, CV et lettres.', 'التنسيق والأنماط والسير الذاتية والرسائل.', 'Formatting, styles, CVs and letters.') },
      { title: L('Excel', 'Excel', 'Excel'), text: L('Saisie, formules de base et mise en forme.', 'الإدخال والصيغ الأساسية والتنسيق.', 'Data entry, basic formulas and formatting.') },
      { title: L('PowerPoint', 'PowerPoint', 'PowerPoint'), text: L('Diapositives claires, images et prise de parole.', 'شرائح واضحة وصور وتقديم شفهي.', 'Clear slides, images and presenting.') },
      { title: L('Organisation', 'التنظيم', 'Organisation'), text: L('Dossiers, PDF, partage et impression.', 'المجلدات وPDF والمشاركة والطباعة.', 'Folders, PDFs, sharing and printing.') },
    ],
    prerequisites: [
      L('Savoir utiliser une souris et un clavier', 'معرفة استعمال الفأرة ولوحة المفاتيح', 'Able to use a mouse and keyboard'),
      L('Grands débutants : « Premiers pas en informatique » conseillé avant', 'للمبتدئين تمامًا: يُنصح بـ«الخطوات الأولى في الإعلاميات» قبل ذلك', 'Complete beginners: “First steps with computers” first is recommended'),
    ],
    audience: [
      L('Lycéens et étudiants à partir de 14 ans', 'التلاميذ والطلبة ابتداءً من 14 سنة', 'Pupils and students aged 14 and over'),
      L('Demandeurs d’emploi', 'الباحثون عن عمل', 'Job seekers'),
      L('Personnel administratif', 'الأطر الإدارية', 'Administrative staff'),
    ],
    faq: [
      {
        q: L('Les logiciels sont-ils fournis ?', 'هل البرامج متوفرة؟', 'Is the software provided?'),
        a: L('Les postes du centre sont équipés pour les séances en présentiel.', 'حواسيب المركز مجهزة للحصص الحضورية.', 'The centre’s computers are equipped for in-person sessions.'),
      },
      {
        q: L('Quelle suite après cette formation ?', 'ما الخطوة التالية بعد هذا التكوين؟', 'What comes next?'),
        a: L('Pour celles et ceux qui utilisent Excel au quotidien, « Excel avancé » est la suite logique.', 'لمن يستعمل إكسل يوميًا، «إكسل متقدم» هو الخطوة المنطقية.', 'If you use Excel every day, “Advanced Excel” is the natural next step.'),
      },
    ],
    keywords: 'bureautique office word excel powerpoint ppt cv مكتبيات وورد باوربوينت',
    sessions: [
      { monthOffset: 1, weekday: 1, schedule: 'day', format: 'onsite', time: '09:30 – 12:00' },
      { monthOffset: 1, weekday: 3, schedule: 'evening', format: 'onsite', time: '18:00 – 20:30' },
      { monthOffset: 2, weekday: 1, schedule: 'day', format: 'onsite', time: '09:30 – 12:00' },
    ],
  },
  {
    slug: 'marketing-digital',
    category: 'marketing',
    level: 'intermediate',
    image: 'marketing',
    imageAlt: L('Atelier en groupe devant un mur couvert de notes adhésives', 'ورشة جماعية أمام جدار مغطى بأوراق لاصقة', 'Group workshop in front of a wall of sticky notes'),
    title: L('Marketing digital & réseaux sociaux', 'التسويق الرقمي ووسائل التواصل الاجتماعي', 'Digital marketing & social media'),
    tagline: L(
      'Faites connaître votre activité en ligne : stratégie, contenus, publicité et lecture des résultats.',
      'عرّف بنشاطك على الإنترنت: الاستراتيجية والمحتوى والإعلانات وقراءة النتائج.',
      'Get your business known online: strategy, content, ads and reading the results.',
    ),
    hours: 32,
    weeks: 8,
    rhythm: L('1 séance de 4 h par semaine', 'حصة واحدة من 4 ساعات في الأسبوع', 'One 4-hour session a week'),
    priceFrom: 1800,
    priceUnit: 'total',
    ageMin: 16,
    objectives: [
      L('Définir sa cible et un message clair', 'تحديد الفئة المستهدفة ورسالة واضحة', 'Define your audience and a clear message'),
      L('Planifier un calendrier de contenus', 'تخطيط رزنامة للمحتوى', 'Plan a content calendar'),
      L('Créer des visuels et des vidéos courtes', 'إنشاء تصاميم ومقاطع فيديو قصيرة', 'Create visuals and short videos'),
      L('Lancer une petite campagne et lire ses statistiques', 'إطلاق حملة صغيرة وقراءة إحصائياتها', 'Run a small campaign and read its stats'),
    ],
    modules: [
      { title: L('Stratégie', 'الاستراتيجية', 'Strategy'), text: L('Cible, positionnement et objectifs.', 'الفئة المستهدفة والتموقع والأهداف.', 'Audience, positioning and goals.') },
      { title: L('Contenus', 'المحتوى', 'Content'), text: L('Calendrier éditorial, textes, visuels et vidéos courtes.', 'رزنامة النشر والنصوص والتصاميم والفيديوهات القصيرة.', 'Editorial calendar, copy, visuals and short videos.') },
      { title: L('Réseaux sociaux', 'وسائل التواصل', 'Social media'), text: L('Pages professionnelles, communauté et messagerie.', 'الصفحات المهنية والمجتمع والمراسلة.', 'Business pages, community and messaging.') },
      { title: L('Publicité en ligne', 'الإعلان عبر الإنترنت', 'Online advertising'), text: L('Budget, ciblage et suivi.', 'الميزانية والاستهداف والتتبع.', 'Budget, targeting and tracking.') },
      { title: L('Mesure', 'القياس', 'Measuring'), text: L('Les statistiques utiles et comment ajuster.', 'الإحصائيات المفيدة وكيفية التعديل.', 'The useful stats and how to adjust.') },
    ],
    prerequisites: [
      L('Utiliser un smartphone et les réseaux sociaux au quotidien', 'استعمال الهاتف الذكي ووسائل التواصل يوميًا', 'Use a smartphone and social media daily'),
      L('Idéalement, une activité ou un projet à promouvoir', 'يُستحسن وجود نشاط أو مشروع للترويج له', 'Ideally, a business or project to promote'),
    ],
    audience: [
      L('Commerçants, artisans et indépendants', 'التجار والحرفيون والمستقلون', 'Shop owners, artisans and freelancers'),
      L('Porteurs de projet', 'حاملو المشاريع', 'Project founders'),
      L('Étudiants qui visent les métiers du digital', 'الطلبة الطامحون لمهن الرقمنة', 'Students aiming for digital careers'),
    ],
    faq: [
      {
        q: L('Faut-il un budget publicitaire ?', 'هل يلزم رصد ميزانية إعلانية؟', 'Do I need an ad budget?'),
        a: L('Non. La publicité est vue en atelier avec des exemples ; lancer une vraie campagne reste facultatif.', 'لا. يُدرس الإعلان في ورشة بأمثلة، وإطلاق حملة حقيقية يبقى اختياريًا.', 'No. Ads are covered in workshops with examples; running a real campaign is optional.'),
      },
      {
        q: L('Travaille-t-on sur un vrai projet ?', 'هل نشتغل على مشروع حقيقي؟', 'Do we work on a real project?'),
        a: L('Chaque participant applique les exercices à son activité ou à un projet fictif.', 'يطبق كل مشارك التمارين على نشاطه أو على مشروع افتراضي.', 'Each participant applies the exercises to their own business or a mock project.'),
      },
    ],
    keywords: 'marketing digital réseaux sociaux social media instagram facebook tiktok ads publicité community تسويق رقمي',
    sessions: [
      { monthOffset: 1, weekday: 4, schedule: 'evening', format: 'hybrid', time: '18:00 – 22:00' },
      { monthOffset: 2, weekday: 6, schedule: 'weekend', format: 'online', time: '09:00 – 13:00' },
    ],
  },
]

export function findCourse(slug: string | null | undefined) {
  return courses.find((c) => c.slug === slug)
}

export const courseFormats = (c: Course) => [...new Set(c.sessions.map((s) => s.format))]
export const courseSchedules = (c: Course) => [...new Set(c.sessions.map((s) => s.schedule))]

export const imageSrc = (name: string, w: 640 | 1200 = 640) => `/images/${name}-${w}.webp`
export const imageSrcSet = (name: string) => `/images/${name}-640.webp 640w, /images/${name}-1200.webp 1200w`
