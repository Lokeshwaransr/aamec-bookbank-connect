
import React from "react";
import { Book } from "@/context/BookContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  onRequest: (bookId: string) => void;
  isAdmin?: boolean;
  onRemove?: (bookId: string) => void;
  disableRequest?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onRequest,
  isAdmin = false,
  onRemove,
  disableRequest = false,
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md">
      <div className="relative h-48">
        <img
          src={book.coverImage || "https://placehold.co/200x300/e5e7eb/a3a3a3?text=No+Cover"}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover book-cover"
        />
        {book.available <= 0 && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2"
          >
            Out of Stock
          </Badge>
        )}
      </div>
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="flex justify-between text-sm">
          <span>Category:</span>
          <span>{book.category}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>Available:</span>
          <span>{book.available}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        {isAdmin ? (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => onRemove && onRemove(book.id)}
          >
            Remove Book
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => onRequest(book.id)}
            disabled={book.available <= 0 || disableRequest}
          >
            Request Book
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
