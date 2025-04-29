
import React from "react";
import { Book } from "@/context/BookContext";
import BookCard from "./BookCard";

interface BookGridProps {
  books: Book[];
  onRequest: (bookId: string) => void;
  isAdmin?: boolean;
  onRemove?: (bookId: string) => void;
  disableRequest?: boolean;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  onRequest,
  isAdmin = false,
  onRemove,
  disableRequest = false,
}) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">No books available</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onRequest={onRequest}
          isAdmin={isAdmin}
          onRemove={onRemove}
          disableRequest={disableRequest}
        />
      ))}
    </div>
  );
};

export default BookGrid;
