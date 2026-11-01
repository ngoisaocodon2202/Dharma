import React from 'react';
import { query } from '@/lib/db';
import { DharmaBookIcon } from '@/components/icons/DharmaBookIcon';
import { BooksSection } from '@/components/books/BooksSection';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookItem } from '@/components/books/types';

export const revalidate = 60;

export default async function LibraryPage() {
  const res = await query(
    'SELECT id, slug, title, subtitle, author, translator, cover_image, description, category, total_pages, published_year, chapters FROM books ORDER BY published_year DESC, created_at DESC'
  );
  const books: BookItem[] = res.rows;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {/* Header Banner */}
      <div className="space-y-3 border-b border-ivory-200 dark:border-charcoal-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-semibold uppercase tracking-wider bg-saffron-50 dark:bg-saffron-950/60 px-3 py-1 rounded-full border border-saffron-200/80 dark:border-saffron-800/60">
          <DharmaBookIcon className="w-3.5 h-3.5" />
          <span>Pháp Bảo Vô Giá • Tủ Kinh Sách Phật Học</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50 tracking-tight">
          Kho Tàng Kinh Điển & Sách Phật Học
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-3xl leading-relaxed">
          Nơi lưu giữ các kinh tạng Nguyên thủy, Đại thừa, các tác phẩm thiền học sâu sắc của Thiền sư Thích Nhất Hạnh,
          cố Hòa thượng Thích Thiện Hoa, cùng những tinh hoa minh triết về nhân quả luân hồi. Nhấp vào bất kỳ cuốn sách nào
          để mở trình đọc sách tương tác theo từng trang trang nghiêm, thanh tịnh.
        </p>
      </div>

      {/* Main Books Section with Category Filter, Search and Interactive Reader */}
      {books.length > 0 ? (
        <BooksSection books={books} showFilters={true} />
      ) : (
        <EmptyState title="Tủ sách đang cập nhật" description="Các đầu sách kinh điển đang được số hóa." />
      )}
    </div>
  );
}
