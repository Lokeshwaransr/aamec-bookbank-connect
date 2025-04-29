
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book as BookIcon } from "lucide-react";

interface AddBookFormProps {
  onAddBook: (book: {
    title: string;
    author: string;
    category: string;
    available: number;
    coverImage?: string;
  }) => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onAddBook }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState("1");
  const [coverImage, setCoverImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddBook({
      title,
      author,
      category,
      available: parseInt(available, 10) || 1,
      coverImage: coverImage || undefined,
    });
    
    // Reset form
    setTitle("");
    setAuthor("");
    setCategory("");
    setAvailable("1");
    setCoverImage("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center">
          <BookIcon size={18} />
          Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Enter the details of the book to add to the library.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Book category"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available">Quantity Available</Label>
            <Input
              id="available"
              type="number"
              min="1"
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
              placeholder="Quantity available"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
            <Input
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">Add Book</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookForm;
