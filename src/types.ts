export type InputMode =
  | 'topic'
  | 'text'
  | 'upload_doc'
  | 'upload_image'
  | 'camera_scan'
  | 'url'
  | 'youtube'
  | 'audio';

export type OutputStyleCategory =
  | 'EDUCATION'
  | 'QUESTION & EXAM'
  | 'UNIVERSITY'
  | 'BOOKS'
  | 'ISLAMIC'
  | 'RESEARCH'
  | 'BUSINESS'
  | 'PRESENTATION'
  | 'VISUAL';

export type DocumentType =
  | 'Textbook Chapter'
  | 'Academic Paper'
  | 'Islamic Manuscript'
  | 'Corporate Report'
  | 'Magazine Newsletter'
  | 'Executive Brief'
  | 'Technical Manual'
  | 'Research Monograph'
  | 'MCQ Question Bank'
  | 'University Answer Sheet'
  | 'Publishing Book';

export type StyleTheme =
  | 'Modern Minimalist'
  | 'Classical Editorial'
  | 'Islamic Heritage'
  | 'Corporate Royal'
  | 'IEEE Academic'
  | 'Serif Elegant';

export type LanguageCode = 'en' | 'bn' | 'ar';

export interface MCQOption {
  key: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface MCQItem {
  id: string;
  questionNumber: number;
  question: string;
  options: MCQOption[];
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D'
  explanation: string;
  reference?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface UniversityAnswerData {
  questionTitle: string;
  introduction: string;
  definition?: string;
  mainDiscussion: string;
  evidencePoints?: string[];
  examples?: string[];
  criticalAnalysis?: string;
  conclusion: string;
  references?: string[];
}

export interface IslamicContent {
  arabicText?: string;
  transliteration?: string;
  translation?: string;
  explanation?: string;
  quranReferences?: string[];
  hadithReferences?: string[];
  scholarOpinions?: string[];
}

export interface ResearchData {
  title: string;
  abstract: string;
  keywords: string[];
  introduction: string;
  methodology?: string;
  resultsDiscussion?: string;
  conclusion: string;
  references: string[];
}

export interface VisualDiagramData {
  diagramType: 'mindmap' | 'flowchart' | 'timeline' | 'comparison' | 'tree' | 'infographic';
  nodes: {
    id: string;
    label: string;
    description?: string;
    category?: string;
  }[];
}

export interface CalloutData {
  type: 'key_takeaway' | 'quote' | 'definition' | 'scholarly_note' | 'formula' | 'example' | 'warning';
  title?: string;
  text: string;
}

export interface TableData {
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface FigureItem {
  label: string;
  description: string;
}

export interface FigureData {
  title: string;
  diagramType: 'process' | 'comparison' | 'hierarchy' | 'statistic' | 'architecture';
  items: FigureItem[];
}

export interface DocumentSection {
  id: string;
  heading: string;
  level: 1 | 2 | 3;
  content: string;
  sectionStyle?: 'standard' | 'mcq' | 'university_answer' | 'islamic' | 'research' | 'visual' | 'summary_box';
  mcqs?: MCQItem[];
  universityAnswer?: UniversityAnswerData;
  islamicContent?: IslamicContent;
  researchData?: ResearchData;
  visualDiagram?: VisualDiagramData;
  callout?: CalloutData;
  table?: TableData;
  figure?: FigureData;
}

export interface CoverData {
  coverTitle: string;
  coverSubtitle?: string;
  badgeText?: string;
  coverStyle: 'minimalist' | 'ornate' | 'corporate' | 'academic' | 'islamic_manuscript' | 'hardcover' | 'pocket';
  abstract?: string;
  heroImageUrl?: string;
}

export interface DocumentData {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  organization?: string;
  date: string;
  language: LanguageCode;
  direction: 'ltr' | 'rtl';
  documentType: DocumentType;
  selectedStyles?: string[]; // IDs of selected output styles for multi-style combinations
  theme: StyleTheme;
  primaryFont: string;
  accentColor: string;
  headingColor?: string;
  bodyColor?: string;
  targetWordCount?: number;
  targetPageCount?: number;
  includeTOC?: boolean;
  hasCover: boolean;
  coverData?: CoverData;
  tableOfContents?: { title: string; level: number; page: number }[];
  sections: DocumentSection[];
  references?: string[];
  pageFormat?: 'A4' | 'Letter' | 'Executive' | 'B5 Pocket';
  columnCount?: 1 | 2 | 3;
  headerText?: string;
  footerText?: string;
}

export interface CustomizationSettings {
  titleFontSize: number; // default 30pt
  chapterFontSize: number; // default 22pt
  headingFontSize: number; // default 18pt
  subHeadingFontSize: number; // default 16pt
  bodyFontSize: number; // default 12pt
  footnoteFontSize: number; // default 9pt
  fontFamily: string;
  headingFontFamily: string;
  bodyColor: string;
  headingColor: string;
  accentColor: string;
  backgroundColor: string;
  pageSize: 'A4' | 'Letter' | 'Executive' | 'B5 Pocket';
  margins: 'compact' | 'normal' | 'wide';
  lineHeight: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  paragraphSpacing: number;
  columns: 1 | 2 | 3;
  headerText: string;
  footerText: string;
  pageNumberStyle: 'simple' | 'bracket' | 'dash' | 'fancy';
  showWatermark: boolean;
  watermarkText: string;
  watermarkOpacity: number;
  logoUrl?: string;
}

export interface OutputStyleDefinition {
  id: string;
  name: string;
  category: OutputStyleCategory;
  description: string;
  badge: string;
  defaultConfig: Partial<CustomizationSettings> & {
    coverStyle?: 'minimalist' | 'ornate' | 'corporate' | 'academic' | 'islamic_manuscript' | 'hardcover' | 'pocket';
  };
}

export interface LayoutSettings extends CustomizationSettings {
  orientation: 'portrait' | 'landscape';
  hasHeaderFooter: boolean;
  marginSize: 'compact' | 'normal' | 'wide';
}

export interface OCRResult {
  extractedText: string;
  language: LanguageCode;
  title: string;
  detectedHeadings: string[];
  qualityScore: number;
  notes?: string;
}

