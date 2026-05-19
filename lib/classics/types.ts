export interface Paragraph {
  id: string;
  idx: number;
  text: string;
  translation?: string;
  niNote?: string;
}

export interface Chapter {
  title: string;
  subtitle?: string;
  intro?: string;
  paragraphs: Paragraph[];
}

export interface Book {
  title: string;
  slug: string;
  dynasty: string;
  author: string;
  intro: string;
  wordCount: number;
  chapters: Chapter[];
}

export interface SearchHit {
  bookSlug: string;
  bookTitle: string;
  chapterIdx: number;
  chapterTitle: string;
  paragraphIdx: number;
  paragraphId: string;
  snippet: string;
  text: string;
}
