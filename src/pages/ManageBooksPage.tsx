
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BookGrid from "@/components/book/BookGrid";
import { useBook } from "@/context/BookContext";
import AddBookForm from "@/components/admin/AddBookForm";

const ManageBooksPage = () => {
  const { books, addBook, removeBook, requestBook } = useBook();

  const handleAddBook = (book: {
    title: string;
    author: string;
    category: string;
    available: number;
    coverImage?: string;
  }) => {
    addBook(book);
  };

  const handleRemoveBook = (bookId: string) => {
    removeBook(bookId);
  };

  return (
    <DashboardLayout title="Manage Books">
      <div className="mb-6 flex justify-end">
        <AddBookForm onAddBook={handleAddBook} />
      </div>

      <BookGrid
        books={books}
        onRequest={requestBook}
        isAdmin={true}
        onRemove={handleRemoveBook}
      />
    </DashboardLayout>
  );
};

export default ManageBooksPage;
