export interface BookPage {
  pageNumber: number;
  chapterTitle: string;
  title?: string;
  content: string;
  quote?: string;
  footnote?: string;
}

export interface BookChapter {
  title: string;
  startPage: number;
  pages: BookPage[];
}

export interface BookItem {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  author: string;
  translator?: string;
  cover_image: string;
  description: string;
  category: string;
  total_pages: number;
  published_year?: number;
  chapters?: BookChapter[];
  views_count?: number;
}
