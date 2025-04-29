
import React, { useState } from "react";
import { useBook } from "@/context/BookContext";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BookGrid from "@/components/book/BookGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const DashboardPage = () => {
  const { books, requestBook } = useBook();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestBook = (bookId: string) => {
    requestBook(bookId);
  };

  const isAdmin = currentUser?.role === "bookbankadmin";

  return (
    <DashboardLayout title="Book List">
      <div className="flex flex-col gap-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <BookGrid
          books={filteredBooks}
          onRequest={handleRequestBook}
          isAdmin={false}
          disableRequest={currentUser?.role !== "student"}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
