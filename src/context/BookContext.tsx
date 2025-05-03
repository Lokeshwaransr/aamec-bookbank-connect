import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth, User } from "./AuthContext";

// Book types
export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: number;
  coverImage?: string;
}

export type RequestStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "pending" | "approved" | "rejected" | "not_required";

export interface PaymentDetails {
  transactionId: string;
  paymentTime: string;
}

export interface BookRequest {
  id: string;
  bookId: string;
  userId: string;
  username: string;
  registerNumber?: string;
  requestDate: string;
  status: RequestStatus;
  paymentStatus: PaymentStatus;
  paymentDetails?: PaymentDetails;
}

// Interface for the context
interface BookContextType {
  books: Book[];
  requests: BookRequest[];
  addBook: (book: Omit<Book, "id">) => void;
  removeBook: (bookId: string) => void;
  requestBook: (bookId: string) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  submitPayment: (requestId: string, transactionId: string, paymentTime: string) => void;
  approvePayment: (requestId: string) => void;
  rejectPayment: (requestId: string) => void;
  getUserRequests: (userId: string) => BookRequest[];
  getBook: (bookId: string) => Book | undefined;
  getRequestById: (requestId: string) => BookRequest | undefined;
}

// Sample books data
const initialBooks: Book[] = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    author: "John Smith",
    category: "Computer Science",
    available: 5,
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Advanced Mathematics",
    author: "Sarah Johnson",
    category: "Mathematics",
    available: 3,
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Principles of Economics",
    author: "Robert Davidson",
    category: "Economics",
    available: 2,
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Engineering Physics",
    author: "Michael Chen",
    category: "Physics",
    available: 1,
    coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=400&fit=crop",
  },
];

const BookContext = createContext<BookContextType | null>(null);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedBooks = localStorage.getItem("aamecBooks");
    const storedRequests = localStorage.getItem("aamecRequests");

    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      // Initialize with sample books if no books are stored
      setBooks(initialBooks);
      localStorage.setItem("aamecBooks", JSON.stringify(initialBooks));
    }

    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("aamecBooks", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("aamecRequests", JSON.stringify(requests));
  }, [requests]);

  // Add a new book
  const addBook = (book: Omit<Book, "id">) => {
    const newBook: Book = {
      ...book,
      id: crypto.randomUUID(),
    };

    setBooks((prevBooks) => [...prevBooks, newBook]);
    toast({
      title: "Book Added",
      description: `"${book.title}" has been added to the library.`,
    });
  };

  // Remove a book
  const removeBook = (bookId: string) => {
    const bookToRemove = books.find(book => book.id === bookId);
    
    if (bookToRemove) {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      toast({
        title: "Book Removed",
        description: `"${bookToRemove.title}" has been removed from the library.`,
      });
    }
  };

  // Request a book
  const requestBook = (bookId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to request books.",
        variant: "destructive",
      });
      return;
    }

    const book = books.find(b => b.id === bookId);
    if (!book) {
      toast({
        title: "Book Not Found",
        description: "The requested book could not be found.",
        variant: "destructive",
      });
      return;
    }

    if (book.available <= 0) {
      toast({
        title: "Book Unavailable",
        description: "This book is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has already requested this book
    const existingRequest = requests.find(
      r => r.bookId === bookId && r.userId === currentUser.id && 
      (r.status === "pending" || r.status === "approved")
    );

    if (existingRequest) {
      toast({
        title: "Duplicate Request",
        description: "You have already requested this book.",
        variant: "destructive",
      });
      return;
    }

    const newRequest: BookRequest = {
      id: crypto.randomUUID(),
      bookId,
      userId: currentUser.id,
      username: currentUser.username,
      registerNumber: currentUser.registerNumber,
      requestDate: new Date().toISOString(),
      status: "pending",
      paymentStatus: "not_required",
    };

    setRequests((prevRequests) => [...prevRequests, newRequest]);
    toast({
      title: "Request Submitted",
      description: `Your request for "${book.title}" has been submitted.`,
    });
  };

  // Approve a book request
  const approveRequest = (requestId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === requestId) {
          // Update the book availability
          setBooks((prevBooks) =>
            prevBooks.map((book) => {
              if (book.id === request.bookId) {
                return { ...book, available: Math.max(0, book.available - 1) };
              }
              return book;
            })
          );
          
          return { 
            ...request, 
            status: "approved", 
            paymentStatus: "pending"
          };
        }
        return request;
      })
    );

    toast({
      title: "Request Approved",
      description: "The book request has been approved.",
    });
  };

  // Reject a book request
  const rejectRequest = (requestId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === requestId) {
          return { ...request, status: "rejected" };
        }
        return request;
      })
    );

    toast({
      title: "Request Rejected",
      description: "The book request has been rejected.",
    });
  };

  // Get a request by ID
  const getRequestById = (requestId: string) => {
    return requests.find(request => request.id === requestId);
  };

  // Submit payment details for a request
  const submitPayment = (requestId: string, transactionId: string, paymentTime: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === requestId) {
          return {
            ...request,
            paymentDetails: {
              transactionId,
              paymentTime,
            },
          };
        }
        return request;
      })
    );

    toast({
      title: "Payment Submitted",
      description: "Your payment details have been submitted for verification.",
    });
  };

  // Approve payment
  const approvePayment = (requestId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === requestId) {
          return { ...request, paymentStatus: "approved" };
        }
        return request;
      })
    );

    toast({
      title: "Payment Approved",
      description: "The payment has been verified and approved.",
    });
  };

  // Reject payment
  const rejectPayment = (requestId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id === requestId) {
          return { ...request, paymentStatus: "rejected" };
        }
        return request;
      })
    );

    toast({
      title: "Payment Rejected",
      description: "The payment information could not be verified.",
    });
  };

  // Get requests for a specific user
  const getUserRequests = (userId: string) => {
    return requests.filter((request) => request.userId === userId);
  };

  // Get a book by ID
  const getBook = (bookId: string) => {
    return books.find((book) => book.id === bookId);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        requests,
        addBook,
        removeBook,
        requestBook,
        approveRequest,
        rejectRequest,
        submitPayment,
        approvePayment,
        rejectPayment,
        getUserRequests,
        getBook,
        getRequestById,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
};
