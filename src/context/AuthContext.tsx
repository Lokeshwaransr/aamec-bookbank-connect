
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define the user types
export type UserRole = "student" | "bookbankadmin" | "bookbankclerk" | "bookbankstaff";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  registerNumber?: string; // Only for students
  email?: string;
  year?: string;
  annualIncome?: string;
  cgpa?: string;
}

// Define the context interface
interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string, registerNumber?: string) => Promise<boolean>;
  logout: () => void;
  register: (
    username: string, 
    password: string, 
    registerNumber: string,
    email?: string,
    year?: string,
    annualIncome?: string,
    cgpa?: string
  ) => Promise<boolean>;
  isAuthenticated: boolean;
  getAllStudents: () => any[];
  getStudentByRegisterNumber: (regNo: string) => any | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Predefined admin accounts
const ADMIN_ACCOUNTS = [
  { username: "bookbankadmin", password: "123456", role: "bookbankadmin" as UserRole },
  { username: "bookbankclerk", password: "123456", role: "bookbankclerk" as UserRole },
  { username: "bookbankstaff", password: "123456", role: "bookbankstaff" as UserRole },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  const isAuthenticated = currentUser !== null;

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("aamecUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("aamecUser");
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("aamecUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("aamecUser");
    }
  }, [currentUser]);

  // Login function
  const login = async (username: string, password: string, registerNumber?: string): Promise<boolean> => {
    // Check if it's an admin login
    const adminAccount = ADMIN_ACCOUNTS.find(
      (admin) => admin.username.toLowerCase() === username.toLowerCase() && admin.password === password
    );

    if (adminAccount) {
      setCurrentUser({
        id: crypto.randomUUID(),
        username: adminAccount.username,
        role: adminAccount.role,
      });
      toast({
        title: "Login Successful",
        description: `Welcome back, ${adminAccount.username}!`,
      });
      return true;
    }

    // Check if it's a student login
    if (!registerNumber) {
      toast({
        title: "Login Failed",
        description: "Register number is required for student login",
        variant: "destructive",
      });
      return false;
    }

    // In a real application, we would validate against a database
    // For this demo, we'll check localStorage for registered students
    const storedStudents = localStorage.getItem("aamecStudents");
    if (storedStudents) {
      const students = JSON.parse(storedStudents);
      const student = students.find(
        (s: any) => s.username === username && s.password === password && s.registerNumber === registerNumber
      );

      if (student) {
        setCurrentUser({
          id: student.id,
          username: student.username,
          role: "student",
          registerNumber: student.registerNumber,
          email: student.email,
          year: student.year,
          annualIncome: student.annualIncome,
          cgpa: student.cgpa,
        });
        toast({
          title: "Login Successful",
          description: `Welcome back, ${student.username}!`,
        });
        return true;
      }
    }

    toast({
      title: "Login Failed",
      description: "Invalid credentials. Please try again.",
      variant: "destructive",
    });
    return false;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Get all students
  const getAllStudents = () => {
    const storedStudents = localStorage.getItem("aamecStudents");
    return storedStudents ? JSON.parse(storedStudents) : [];
  };

  // Get student by register number
  const getStudentByRegisterNumber = (regNo: string) => {
    const students = getAllStudents();
    return students.find((s: any) => s.registerNumber === regNo) || null;
  };

  // Register function for students
  const register = async (
    username: string, 
    password: string, 
    registerNumber: string,
    email?: string,
    year?: string,
    annualIncome?: string,
    cgpa?: string
  ): Promise<boolean> => {
    // In a real app, we would send this data to a server
    // For this demo, we'll store in localStorage
    const storedStudents = localStorage.getItem("aamecStudents");
    const students = storedStudents ? JSON.parse(storedStudents) : [];
    
    // Check if student already exists
    if (students.some((s: any) => s.username === username || s.registerNumber === registerNumber)) {
      toast({
        title: "Registration Failed",
        description: "Username or Register Number already exists",
        variant: "destructive",
      });
      return false;
    }

    const newStudent = {
      id: crypto.randomUUID(),
      username,
      password,
      registerNumber,
      email,
      year,
      annualIncome,
      cgpa,
      role: "student" as UserRole,
    };

    students.push(newStudent);
    localStorage.setItem("aamecStudents", JSON.stringify(students));

    // Auto login after registration
    setCurrentUser({
      id: newStudent.id,
      username: newStudent.username,
      role: "student",
      registerNumber: newStudent.registerNumber,
      email: newStudent.email,
      year: newStudent.year,
      annualIncome: newStudent.annualIncome,
      cgpa: newStudent.cgpa,
    });

    toast({
      title: "Registration Successful",
      description: "Your account has been created and you're now logged in!",
    });
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      register, 
      isAuthenticated,
      getAllStudents,
      getStudentByRegisterNumber
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
