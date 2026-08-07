import { DocumentData } from '../types';

export const sampleDocuments: DocumentData[] = [
  {
    id: 'doc-islamic-justice',
    title: 'Al-Adlu wal-Insaf (Justice & Equity in Islamic Thought)',
    subtitle: 'A Comparative Jurisprudential Study on Fundamental Rights, Ethics, and Governance',
    author: 'Dr. Muhammad Al-Ghazali & Research Council',
    organization: 'International Academy of Islamic Jurisprudence',
    date: 'Sha\'ban 1447 AH / 2026 CE',
    language: 'ar',
    direction: 'rtl',
    documentType: 'Islamic Manuscript',
    theme: 'Islamic Heritage',
    primaryFont: 'Noto Naskh Arabic',
    accentColor: '#047857',
    hasCover: true,
    pageFormat: 'A4',
    columnCount: 1,
    headerText: 'Islamic Jurisprudential Monographs — Vol. 14',
    footerText: 'International Academy of Islamic Jurisprudence • Academic Edition',
    coverData: {
      coverTitle: 'العدل والأنساف في الشريعة الإسلامية',
      coverSubtitle: 'دراسة مقارنة في الحقوق والأخلاق والعدالة الاجتماعية',
      badgeText: 'PUBLICATION GRADE SCHOLARLY EDITION',
      coverStyle: 'islamic_manuscript',
      abstract: 'هذا البحث المستفيض يقدم تحليلاً شاملاً لمفهوم العدل والإنصاف في الشريعة الإسلامية والفكر الإسلامي المعاصر، مع مقارنة مع النظم القانونية الحديثة.',
      heroImageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    },
    tableOfContents: [
      { title: '1. المقدمة والأصول المفهومية للعدل', level: 1, page: 2 },
      { title: '2. الفرق بين العدل والإنصاف في الفقه الإسلامي', level: 1, page: 3 },
      { title: '3. التطبيقات المعاصرة في الاقتصاد والحوكمة', level: 1, page: 4 },
      { title: '4. الخاتمة والتوصيات العلمية', level: 1, page: 5 },
    ],
    sections: [
      {
        id: 'sec-1',
        heading: '1. المقدمة والأصول المفهومية للعدل',
        level: 1,
        content: `إن مفهوم العدل والإنصاف يمثل الدعامة الأساسية التي يقوم عليها البناء التشريعي والأخلاقي في الشريعة الإسلامية. فالعدل ليس مجرد قيمة أخلاقية مجردة، بل هو مقصد شرعي أعلى يمتد إلى كافة مجالات الحياة الاجتماعية والاقتصادية والسياسية.

وقد جاء القران الكريم مؤكداً على إقامة القسط والعدل في مواضع متعددة، موضحاً أن العدل أقرب للتقوى وأنه الميزان الذي قامت عليه السماوات والأرض.`,
        callout: {
          type: 'quote',
          title: 'الآية الكريمة',
          text: '﴿إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ﴾ — سورة النحل: 90',
        },
      },
      {
        id: 'sec-2',
        heading: '2. الفرق بين العدل والإنصاف في الفقه الإسلامي',
        level: 1,
        content: `يفرق العلماء والمحققون بين مفهوم "العدل" و"الإنصاف"؛ فبينما يمثل العدل تطبيق الأحكام العامة بالقسط والاعتدال، يأتي "الإنصاف" لإعطاء كل ذي حق حقه بمعيار الدقة والمراعاة للظروف الخاصة والمصالح العالية.

وقد نوه ابن القيم رحمه الله في كتابه (إعلام الموقعين) إلى أن الميزان الشرعي يدور مع العدل حيثما دار، وأن الشريعة مبناها وساسها على الحكم ومصالح العباد في المعاش والمعاد.`,
        table: {
          title: 'مقارنة بين معايير العدل والإنصاف',
          headers: ['المعيار', 'العدل (Justice)', 'الإنصاف (Equity)'],
          rows: [
            ['النطاق', 'المساواة أمام القانون العام', 'مراعاة الحالات الفردية'],
            ['المقصد', 'استقرار المعاملات والسيادة', 'إزالة المشقة والجور المقنع'],
            ['الأداة الفقهية', 'النصوص والقواعد الكلية', 'الاستحسان والمصالح المرسلة'],
          ],
        },
      },
      {
        id: 'sec-3',
        heading: '3. التطبيقات المعاصرة في الاقتصاد والحوكمة',
        level: 1,
        content: `في العصر الحديث، تبرز الحاجة إلى تفعيل قيم العدل والإنصاف في المؤسسات المالية والأنظمة القضائية وإدارة الثروات الوطنية. إن ضمان العدالة التوزيعية والشفافية وحماية الفئات الضعيفة يعد من أوجب مقاصد الشريعة الإسلامية.`,
        callout: {
          type: 'key_takeaway',
          title: 'الخلاصة الفقهية',
          text: 'العدالة الاجتماعية ليست نافلة من القول، بل هي شرط استقرار المجتمعات الإسلامية ونجاح نهضتها العلمية والاقتصادية.',
        },
      },
    ],
    references: [
      'ابن قيم الجوزية، إعلام الموقعين عن رب العالمين، دار الكتب العلمية، بيروت.',
      'أبو حامد الغزالي، المستصفى من علم الأصول، المطبعة الأميري، القاهرة.',
      'د. وهبة الزحيلي، الفقه الإسلامي وأدلته، دار الفكر المعاصر، دمشق.',
    ],
  },
  {
    id: 'doc-photosynthesis',
    title: 'Photosynthesis & Bioenergetics: A Quantum Biological Approach',
    subtitle: 'Comprehensive Treatise on Light-Harvesting Complexes, Electron Transport, and Carbon Fixation',
    author: 'Prof. Elena Rostova & Department of Biophysics',
    organization: 'Cambridge University Press • Academic Monographs',
    date: 'Academic Year 2026',
    language: 'en',
    direction: 'ltr',
    documentType: 'Textbook Chapter',
    theme: 'Classical Editorial',
    primaryFont: 'Playfair Display',
    accentColor: '#0d9488',
    hasCover: true,
    pageFormat: 'A4',
    columnCount: 2,
    headerText: 'Principles of Advanced Molecular Biophysics • Chapter 8',
    footerText: 'Cambridge Academic Publishing — Authorized Student Edition',
    coverData: {
      coverTitle: 'Photosynthesis & Bioenergetics',
      coverSubtitle: 'Quantum Mechanics and Structural Biology of the Light-Driven Engine',
      badgeText: 'TEXTBOOK & RESEARCH MONOGRAPH',
      coverStyle: 'academic',
      abstract: 'An authoritative study exploring light absorption, exciton transfer pathways, Photosystems I & II architecture, and the Calvin-Benson cycle with biochemical equations and quantitative physical analysis.',
      heroImageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
    },
    tableOfContents: [
      { title: '8.1 Photophysical Fundamentals of Light Absorption', level: 1, page: 2 },
      { title: '8.2 Architecture of Photosystem II & Water Splitting', level: 1, page: 3 },
      { title: '8.3 Z-Scheme Electron Transport & Proton Gradient', level: 1, page: 4 },
      { title: '8.4 Enzymatic Carbon Fixation in Calvin Cycle', level: 1, page: 5 },
    ],
    sections: [
      {
        id: 'sec-1',
        heading: '8.1 Photophysical Fundamentals of Light Absorption',
        level: 1,
        content: `Photosynthesis represents one of Earth's most fundamental biological reactions, converting solar irradiance into chemical energy stored in molecular bonds. At the molecular level, light harvesting begins when photons striking antenna pigments (chlorophyll a, b, and carotenoids) promote electrons from ground state (S0) to excited singlet states (S1 or S2).

Quantum coherence phenomena in light-harvesting complexes (LHCII) demonstrate near-100% quantum efficiency, transferring excitation energy to the reaction center P680 within picoseconds via resonance energy transfer.`,
        callout: {
          type: 'formula',
          title: 'Planck-Einstein Relation',
          text: 'E = h · ν = (h · c) / λ  where h ≈ 6.626 × 10⁻³⁴ J·s and c ≈ 3.0 × 10⁸ m/s',
        },
      },
      {
        id: 'sec-2',
        heading: '8.2 Architecture of Photosystem II & Water Splitting',
        level: 1,
        content: `Photosystem II (PSII) is a multi-subunit pigment-protein supercomplex embedded in the thylakoid membrane. At its core lies the Oxygen-Evolving Complex (OEC), containing a catalytic Mn₄CaO₅ cluster responsible for catalyzing the light-driven oxidation of water.

The overall water oxidation stoichiometry releases molecular oxygen, protons into the thylakoid lumen, and electrons into the electron transport chain:`,
        callout: {
          type: 'definition',
          title: 'Net Water Oxidation Reaction',
          text: '2 H₂O + 4 photons ⟶ O₂ + 4 H⁺ (lumen) + 4 e⁻',
        },
        table: {
          title: 'Table 8.1: Photochemical Components of PSII vs PSI',
          headers: ['Component', 'Photosystem II (PSII)', 'Photosystem I (PSI)'],
          rows: [
            ['Reaction Center', 'P680 (Chlorophyll a dimer)', 'P700 (Chlorophyll a dimer)'],
            ['Primary Electron Acceptor', 'Pheophytin (Pheo)', 'Monomeric Chlorophyll (A₀)'],
            ['Optimal Wavelength', '680 nm (Red spectrum)', '700 nm (Far-red spectrum)'],
            ['Primary Function', 'Water oxidation & O₂ release', 'NADP⁺ reduction to NADPH'],
          ],
        },
      },
      {
        id: 'sec-3',
        heading: '8.3 Z-Scheme Electron Transport & Proton Gradient',
        level: 1,
        content: `Electrons generated at PSII travel sequentially through Plastoquinone (PQ), the Cytochrome b₆f complex, and Plastocyanin (PC) to PSI. This linear flow pumps protons across the thylakoid membrane, generating a proton-motive force (pmf) used by ATP Synthase (CF₀CF₁) to phosphorylate ADP into ATP.`,
        figure: {
          title: 'Figure 8.2: The Z-Scheme Pathway of Oxygenic Photosynthesis',
          diagramType: 'process',
          items: [
            { label: 'Step 1: Photolysis', description: 'OEC splits 2H₂O to yield 4e⁻, O₂ and 4H⁺' },
            { label: 'Step 2: Plastoquinone Transport', description: 'PQ carries e⁻ across thylakoid lipid bilayer' },
            { label: 'Step 3: Cytochrome b6f Complex', description: 'Proton pumping builds electrochemical gradient' },
            { label: 'Step 4: PSI Re-excitation', description: '700nm photons boost e⁻ energy to reduce Ferredoxin' },
          ],
        },
      },
    ],
    references: [
      'Nelson, N., & Yocum, C. F. (2006). Structure and function of photosystems I and II. Annu. Rev. Plant Biol., 57, 521-565.',
      'Blankenship, R. E. (2021). Molecular Mechanisms of Photosynthesis (3rd ed.). Wiley-Blackwell.',
    ],
  },
  {
    id: 'doc-ai-corporate',
    title: 'Enterprise AI & Cloud Infrastructure 2026',
    subtitle: 'Strategic Roadmap for Fortune 500 Technology Transformation & Generative Workflows',
    author: 'McKinsey Tech Advisory & AI Institute',
    organization: 'Global Technology Leadership Practice',
    date: 'Q3 2026 Executive Brief',
    language: 'en',
    direction: 'ltr',
    documentType: 'Corporate Report',
    theme: 'Corporate Royal',
    primaryFont: 'Inter',
    accentColor: '#1e40af',
    hasCover: true,
    pageFormat: 'A4',
    columnCount: 2,
    headerText: 'EXECUTIVE BRIEFING • STRATEGIC REPORT',
    footerText: 'Confidential • Global Technology Leadership Practice',
    coverData: {
      coverTitle: 'Enterprise AI & Cloud Infrastructure',
      coverSubtitle: 'Capital Allocation, Agentic Workflows, and Compute Architecture 2026–2030',
      badgeText: 'EXECUTIVE ADVISORY REPORT',
      coverStyle: 'corporate',
      abstract: 'A strategic blueprint detailing AI model deployment economics, hybrid sovereign cloud infrastructure, real-time agent orchestration, and enterprise risk governance.',
      heroImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    },
    tableOfContents: [
      { title: '1. Executive Summary & Macro Market Trends', level: 1, page: 2 },
      { title: '2. The Shift to Autonomous Agentic Frameworks', level: 1, page: 3 },
      { title: '3. Financial ROI & Infrastructure Expenditure Matrix', level: 1, page: 4 },
    ],
    sections: [
      {
        id: 'sec-1',
        heading: '1. Executive Summary & Macro Market Trends',
        level: 1,
        content: `As enterprise generative AI matures beyond initial pilot programs into core production infrastructure, Fortune 500 organizations are restructuring capital budgets toward agentic orchestration, specialized domain models, and low-latency inference clusters.

In 2026, over 74% of enterprise software workloads leverage multi-agent workflows running on hybrid cloud and edge environments. Failure to modernize document pipelines and knowledge retrieval risks significant operational latency.`,
        callout: {
          type: 'key_takeaway',
          title: 'Executive Takeaway',
          titleStyle: 'font-semibold text-blue-900',
          text: 'Organizations adopting automated AI publishing and document synthesis report a 68% reduction in knowledge delivery time and a 42% cost savings in external design agency retainer fees.',
        },
      },
      {
        id: 'sec-2',
        heading: '2. The Shift to Autonomous Agentic Frameworks',
        level: 1,
        content: `Traditional linear AI prompts are being replaced by dynamic agent chains capable of multi-modal research, data validation, automated layout design, and multi-format document distribution.`,
        table: {
          title: 'Table 1: AI Infrastructure Maturity Stages',
          headers: ['Stage', 'Focus Area', 'Expected ROI Horizon'],
          rows: [
            ['Stage 1: Prompt Assistants', 'Individual productivity & draft generation', '0–6 Months'],
            ['Stage 2: Enterprise RAG', 'Internal knowledge base search & document QA', '6–12 Months'],
            ['Stage 3: Agentic Publishing Studio', 'Automated end-to-end PDF/web document creation', '12–18 Months'],
          ],
        },
      },
    ],
    references: [
      'Gartner Research (2026). Strategic Technology Trends in Enterprise AI.',
      'MIT Sloan Management Review. Operationalizing Agentic AI Workflows.',
    ],
  },
  {
    id: 'doc-bengali-literature',
    title: 'বাংলা সাহিত্য ও আধুনিক ডিজিটাল প্রকাশনা প্রযুক্তি',
    subtitle: 'রবীন্দ্রনাথ থেকে আধুনিক যুগ: ফন্ট, টাইপোগ্রাফি ও কৃত্রিম বুদ্ধিমত্তার ভূমিকা',
    author: 'অধ্যাপক ড. রফিকুল ইসলাম ও গবেষণা দল',
    organization: 'বাংলা একাডেমি ও ডিজিটাল সাহিত্য প্রেস',
    date: 'ভাদ্র ১৪৩৩ / ২০২৬ খ্রিস্টাব্দ',
    language: 'bn',
    direction: 'ltr',
    documentType: 'Academic Paper',
    theme: 'Serif Elegant',
    primaryFont: 'Noto Serif Bengali',
    accentColor: '#9f1239',
    hasCover: true,
    pageFormat: 'A4',
    columnCount: 1,
    headerText: 'বাংলা সাহিত্য পত্রিকা — বিশেষ গবেষণা সংস্করণ',
    footerText: 'বাংলা একাডেমি ডিজিটাল লাইব্রেরি প্রকল্প',
    coverData: {
      coverTitle: 'বাংলা সাহিত্য ও আধুনিক প্রকাশনা প্রযুক্তি',
      coverSubtitle: 'টাইপোগ্রাফি, হরফ বিন্যাস ও কৃত্রিম বুদ্ধিমত্তার নান্দনিক সংযোগ',
      badgeText: 'গবেষণা প্রবন্ধ',
      coverStyle: 'ornate',
      abstract: 'এই গবেষণা পত্রে বাংলা অক্ষরের ইতিহাস, ডিজিটাল প্রকাশনায় ফন্ট ও পেজ লেআউটের গুরুত্ব এবং আধুনিক কৃত্রিম বুদ্ধিমত্তা চালিত পিডিএফ তৈরির কলাকৌশল তুলে ধরা হয়েছে।',
      heroImageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    },
    tableOfContents: [
      { title: '১. সূচনা ও বাংলা টাইপোগ্রাফির ইতিহাস', level: 1, page: 2 },
      { title: '২. ডিজিটাল প্রকাশনায় সঠিক ফন্ট ও মার্জিন নির্বাচন', level: 1, page: 3 },
      { title: '৩. সিদ্ধান্ত ও ভবিষ্যৎ দিকনির্দেশনা', level: 1, page: 4 },
    ],
    sections: [
      {
        id: 'sec-1',
        heading: '১. সূচনা ও বাংলা টাইপোগ্রাফির ইতিহাস',
        level: 1,
        content: `বাংলা ভাষার সৌন্দর্য ও গাম্ভীর্য প্রকাশে টাইপোগ্রাফি এবং হরফ বিন্যাসের অবদান অনস্বীকার্য। চার্লস উইলকিন্স ও পঞ্চানন কর্মকারের ধাতুনির্মিত হরফ থেকে শুরু করে আধুনিক ডিজিটাল ভেক্টর ফন্ট—বাংলা মুদ্রণ শিল্প দীর্ঘ পথ অতিক্রম করেছে।

আজকের কৃত্রিম বুদ্ধিমত্তা চালিত প্রকাশনা প্রযুক্তির যুগে বাংলা বই, প্রাতিষ্ঠানিক সনদ, ও একাডেমিক গবেষণা পত্র আন্তর্জাতিক মানের নান্দনিকতায় তৈরি করা সম্ভব হচ্ছে।`,
        callout: {
          type: 'quote',
          title: 'রবীন্দ্রনাথ ঠাকুরের উক্তি',
          text: '“ভাষাকে সুন্দর ও স্পষ্ট রূপ দেওয়াই হলো সংস্কৃতি ও সাহিত্যের প্রথম শর্ত।”',
        },
      },
      {
        id: 'sec-2',
        heading: '২. ডিজিটাল প্রকাশনায় সঠিক ফন্ট ও মার্জিন নির্বাচন',
        level: 1,
        content: `বাংলা পিডিএফে স্পষ্টতা বজায় রাখতে সঠিক ফন্ট সাইজ, লাইন হাইট (Line Height) ও মার্জিন অত্যন্ত গুরুত্বপূর্ণ। বিশেষ করে 'নোতো শরীফ বেঙ্গলি' এবং 'হিন্দ শিলিগুড়ি' ফন্ট আধুনিক প্রকাশনার ক্ষেত্রে সর্বশ্রেষ্ঠ পাঠযোগ্যতা প্রদান করে।`,
        table: {
          title: 'ছক ১: ফন্ট ও পেজ লেআউট গাইডলাইন',
          headers: ['ব্যবহারের স্থান', 'প্রস্তাবিত ফন্ট', 'সাইজ ও লাইন স্পেসিং'],
          rows: [
            ['মূল শিরোনাম', 'Noto Serif Bengali (Bold)', '২৪px, Line-height 1.3'],
            ['প্যারাগ্রাফ বডি', 'Noto Serif Bengali (Regular)', '১৬px, Line-height 1.6'],
            ['ফুটনোট ও রেফারেন্স', 'Hind Siliguri', '১২px, Line-height 1.4'],
          ],
        },
      },
    ],
    references: [
      'ইসলাম, রফিকুল (২০২৪)। বাংলা হরফ ও মুদ্রণ শিল্পের ইতিহাস। ঢাকা: বাংলা একাডেমি।',
      'চৌধুরী, মনজুরে ইলাহী (২০২৫)। আধুনিক টাইপোগ্রাফি ও ডিজিটাল ফন্ট ডিজাইন।',
    ],
  },
];
