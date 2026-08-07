import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Lazy init for Gemini SDK
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Generate full document structure from input
app.post('/api/generate-document', async (req, res) => {
  try {
    const {
      prompt,
      inputMode, // 'topic' | 'text' | 'ocr' | 'url' | 'youtube' | 'audio'
      documentType, // 'Academic Paper' | 'Textbook Chapter' | 'Corporate Report' | 'Islamic Manuscript' | 'Magazine Newsletter' | 'Executive Brief' | 'Technical Manual' | 'MCQ Question Bank' | 'University Answer Sheet' | 'Publishing Book'
      targetLanguage, // 'English' | 'Bangla' | 'Arabic' | 'Auto-detect'
      styleTheme, // 'Modern Minimalist' | 'Classical Editorial' | 'Islamic Heritage' | 'Corporate Royal' | 'Serif Elegant'
      selectedStyles = [], // Array of Output Style IDs (e.g. ['honours_answer', 'mcq_book', 'summary_note'])
      includeTOC,
      includeCover,
      includeCallouts,
      includeFigures,
      includeReferences,
    } = req.body;

    const ai = getGeminiClient();

    const selectedStylesStr = Array.isArray(selectedStyles) && selectedStyles.length > 0 
      ? selectedStyles.join(', ')
      : 'General Study Publication';

    const systemInstruction = `You are a world-class chief publication designer and senior editor at an elite publishing firm (resembling Adobe InDesign, Oxford University Press, and Harvard Business Review).
Your job is to transform raw input (topics, notes, scans, transcripts, or drafts) into a meticulously structured, publication-quality document payload.

CRITICAL INSTRUCTIONS FOR OUTPUT STYLES:
The user selected the following Output Styles: [${selectedStylesStr}].
You MUST generate sections tailored specifically to ALL selected styles in a single cohesive publication PDF document!

1. If MCQ or Exam Question styles (e.g., 'mcq_book', 'mcq_explanation', 'islamic_mcq', 'practice_test', 'model_test', 'question_bank') are selected:
   - Create a dedicated section with "sectionStyle": "mcq".
   - Include a "mcqs" array containing 3 to 6 high-yield multiple-choice questions.
   - Each MCQ must have: questionNumber, question, options (4 choices A, B, C, D with key and text), correctAnswer ('A'|'B'|'C'|'D'), explanation, reference, and difficulty ('Easy'|'Medium'|'Hard').

2. If University Answer styles (e.g., 'honours_answer', 'masters_answer', 'degree_answer', 'university_exam_answer', 'long_answer', 'analytical_answer') are selected:
   - Create a dedicated section with "sectionStyle": "university_answer".
   - Include a "universityAnswer" object with: questionTitle, introduction, definition, mainDiscussion, evidencePoints (array of strings), examples (array of strings), criticalAnalysis, conclusion, and references.

3. If Islamic styles (e.g., 'tafsir', 'hadith_explanation', 'fiqh_discussion', 'arabic_grammar', 'islamic_research', 'khutbah_notes', 'islamic_book', 'islamic_qa') are selected:
   - Create a dedicated section with "sectionStyle": "islamic".
   - Set language to 'ar' or 'bn' if appropriate, direction "rtl" if Arabic.
   - Include an "islamicContent" object with: arabicText (Noto Naskh Arabic font text), transliteration, translation, explanation, quranReferences, hadithReferences, and scholarOpinions.

4. If Research / Academic styles (e.g., 'research_paper', 'journal_paper', 'thesis', 'literature_review') are selected:
   - Create a dedicated section with "sectionStyle": "research".
   - Include a "researchData" object with: title, abstract, keywords (array), introduction, methodology, resultsDiscussion, conclusion, and references.

5. If Visual or Mind Map styles (e.g., 'mind_map', 'flowchart', 'timeline', 'comparison_chart', 'infographic') are selected:
   - Create a dedicated section with "sectionStyle": "visual".
   - Include a "visualDiagram" object with diagramType and nodes array.

6. Always include a comprehensive "summary_box" section or key takeaways if summary / revision notes are requested.

7. Language handling:
   - If targetLanguage is Arabic, set "direction": "rtl", "language": "ar", primaryFont: "Noto Naskh Arabic".
   - If Bengali, set "language": "bn", primaryFont: "Noto Serif Bengali".
   - If English, primaryFont: "Inter" or "Playfair Display".

Output MUST be valid JSON conforming strictly to the requested schema.`;

    const userPrompt = `
Generate a publication-ready document layout for topic: "${prompt}"

Configuration:
- Input Mode: ${inputMode || 'topic'}
- Selected Output Styles: [${selectedStylesStr}]
- Document Type: ${documentType || 'Textbook Chapter'}
- Theme Preference: ${styleTheme || 'Modern Minimalist'}
- Feature Options: Cover=${includeCover ?? true}, TOC=${includeTOC ?? true}, Callouts=${includeCallouts ?? true}, Figures=${includeFigures ?? true}, References=${includeReferences ?? true}

Return JSON with this exact structure:
{
  "title": "Document Title",
  "subtitle": "Informative Tagline or Subtitle",
  "author": "Author / Organization Name",
  "organization": "Publisher / Institution Name",
  "date": "Date / Edition",
  "language": "en" | "bn" | "ar",
  "direction": "ltr" | "rtl",
  "documentType": "${documentType || 'Textbook Chapter'}",
  "selectedStyles": [${selectedStyles.map((s: string) => `"${s}"`).join(', ')}],
  "theme": "${styleTheme || 'Modern Minimalist'}",
  "primaryFont": "Font Name",
  "accentColor": "#0f766e",
  "hasCover": true,
  "coverData": {
    "coverTitle": "Title",
    "coverSubtitle": "Subtitle",
    "badgeText": "PUBLICATION EDITION",
    "coverStyle": "minimalist" | "ornate" | "corporate" | "academic" | "islamic_manuscript" | "hardcover" | "pocket",
    "abstract": "A compelling overview of this publication."
  },
  "tableOfContents": [
    { "title": "1. Detailed Discussion & Analysis", "level": 1, "page": 2 },
    { "title": "2. University Standard Exam Answer", "level": 1, "page": 3 },
    { "title": "3. High-Yield MCQ Practice Bank", "level": 1, "page": 4 }
  ],
  "sections": [
    {
      "id": "sec-1",
      "heading": "Detailed Discussion & Theoretical Foundations",
      "level": 1,
      "content": "Rich, authoritative introductory prose explaining the core concepts, historical context, and foundational principles in depth...",
      "sectionStyle": "standard",
      "callout": {
        "type": "key_takeaway",
        "title": "Key Concept Principle",
        "text": "Highlighted core takeaway for students and researchers."
      }
    },
    {
      "id": "sec-2",
      "heading": "University Standard Exam Response",
      "level": 1,
      "content": "The following is a complete 10-point university exam answer model formatted for Honours & Masters examinations.",
      "sectionStyle": "university_answer",
      "universityAnswer": {
        "questionTitle": "Discuss the core principles and analytical frameworks of the topic in detail.",
        "introduction": "An authoritative academic introduction setting the background and scope...",
        "definition": "Clear formal definition of the terminology and theoretical boundaries.",
        "mainDiscussion": "Comprehensive multi-paragraph discussion breaking down main arguments, mechanisms, and perspectives...",
        "evidencePoints": [
          "Primary Evidence 1: Empirical observation and scholarly research",
          "Secondary Evidence 2: Comparative literature consensus"
        ],
        "examples": [
          "Case Example A: Real-world practical application",
          "Case Example B: Historical precedent"
        ],
        "criticalAnalysis": "Critical evaluation of limitations, counter-arguments, and modern implications.",
        "conclusion": "A synthesised concluding statement summarizing the findings and significance.",
        "references": ["Oxford University Press Academic Series", "Harvard Law Review"]
      }
    },
    {
      "id": "sec-3",
      "heading": "High-Yield MCQ Question Bank & Answers",
      "level": 1,
      "content": "Practice the following multiple choice questions with detailed solutions and explanations.",
      "sectionStyle": "mcq",
      "mcqs": [
        {
          "id": "mcq-1",
          "questionNumber": 1,
          "question": "Which of the following represents the primary principle of the topic?",
          "options": [
            { "key": "A", "text": "Option A - Primary structural mechanism" },
            { "key": "B", "text": "Option B - Secondary alternative model" },
            { "key": "C", "text": "Option C - Obsolete historical approach" },
            { "key": "D", "text": "Option D - Unrelated external factor" }
          ],
          "correctAnswer": "A",
          "explanation": "Option A is correct because empirical research confirms it as the foundational mechanism.",
          "reference": "Chapter 3, Page 112",
          "difficulty": "Medium"
        },
        {
          "id": "mcq-2",
          "questionNumber": 2,
          "question": "What is the critical distinction in modern applications?",
          "options": [
            { "key": "A", "text": "First option choice" },
            { "key": "B", "text": "Second option choice with precision" },
            { "key": "C", "text": "Third option choice" },
            { "key": "D", "text": "Fourth option choice" }
          ],
          "correctAnswer": "B",
          "explanation": "Option B provides the precise modern formulation verified across literature.",
          "reference": "Standard Academic Reference",
          "difficulty": "Hard"
        }
      ]
    },
    {
      "id": "sec-4",
      "heading": "Executive Summary & Revision Flashcard",
      "level": 1,
      "content": "Quick revision summary digest for rapid exam review.",
      "sectionStyle": "summary_box",
      "callout": {
        "type": "key_takeaway",
        "title": "Rapid Revision Checklist",
        "text": "1. Understand core definitions.\n2. Memorize key formulas / citations.\n3. Practice 10-point exam structures."
      }
    }
  ],
  "references": [
    "Oxford University Press Academic Series (2025)",
    "Harvard Business Review & Cambridge Research Press"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    res.json({ success: true, document: parsedData });
  } catch (err: any) {
    console.error('Error in /api/generate-document:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate document.' });
  }
});

// 2. OCR / Vision Scanning endpoint
app.post('/api/ocr-scan', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'imageBase64 required' });
    }

    const ai = getGeminiClient();
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this image (scanned page, book, notebook, printed document, or handwritten notes).
Perform high-precision OCR extraction:
1. Extract all text accurately without missing words.
2. Detect language (English, Bengali, Arabic, etc.).
3. Identify structural elements: Document Title, Main Headings, Subheadings, Paragraphs, Lists, Tables, Diagrams, and Footnotes.
4. Clean up background noise, handwritten glitches, and formatting mistakes.

Return JSON format:
{
  "extractedText": "Full cleaned raw text string",
  "language": "en" | "bn" | "ar",
  "title": "Detected Title",
  "detectedHeadings": ["Heading 1", "Heading 2"],
  "qualityScore": 98,
  "notes": "Scanner insight/notes on clarity and structure."
}`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, ocrResult: parsed });
  } catch (err: any) {
    console.error('Error in /api/ocr-scan:', err);
    res.status(500).json({ success: false, error: err.message || 'OCR processing failed.' });
  }
});

// 3. AI Document Enhancement inside Studio (Rewrite, Translate, Summarize, Add Scholarly Citations, Expand)
app.post('/api/ai-enhance', async (req, res) => {
  try {
    const { text, action, targetLang, tone } = req.body;
    const ai = getGeminiClient();

    let promptInstructions = '';
    switch (action) {
      case 'translate':
        promptInstructions = `Translate the following text into ${targetLang || 'Bengali'}. Preserve scholarly tone, accurate specialized terms, and formatting.`;
        break;
      case 'academic_rewrite':
        promptInstructions = `Elevate the following text into publication-grade academic prose suitable for Oxford University Press or Nature. Enhance vocabulary, clarity, logical flow, and sentence structure.`;
        break;
      case 'summarize_takeaways':
        promptInstructions = `Summarize the following text into 3-5 high-impact publication Key Takeaways bullet points and a 1-paragraph Executive Abstract.`;
        break;
      case 'islamic_citations':
        promptInstructions = `Examine the text and add authentic Islamic scholarly context, Quranic ayat references (with English/Bengali translation), or classical commentary where appropriate, maintaining highest respect and accuracy.`;
        break;
      case 'generate_table':
        promptInstructions = `Convert key facts or data from the following text into a clean tabular layout with headers and rows.`;
        break;
      case 'expand':
        promptInstructions = `Expand on the following section with thorough explanations, illustrative real-world examples, historical context, or mathematical/logical breakdown.`;
        break;
      default:
        promptInstructions = `Refine and polish the text for publication quality. Tone: ${tone || 'professional'}.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `${promptInstructions}\n\nTEXT:\n"${text}"`,
    });

    res.json({ success: true, resultText: response.text });
  } catch (err: any) {
    console.error('Error in /api/ai-enhance:', err);
    res.status(500).json({ success: false, error: err.message || 'AI Enhancement failed.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
