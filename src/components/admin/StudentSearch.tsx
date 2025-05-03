
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StudentSearch = () => {
  const [registerNumber, setRegisterNumber] = useState("");
  const [student, setStudent] = useState<any>(null);
  const { getStudentByRegisterNumber } = useAuth();

  const handleSearch = () => {
    if (!registerNumber.trim()) return;
    
    const foundStudent = getStudentByRegisterNumber(registerNumber);
    setStudent(foundStudent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search by Register Number"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
          className="max-w-sm"
        />
        <Button type="button" onClick={handleSearch} variant="secondary">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {student ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Username</p>
                <p className="text-sm">{student.username}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Register Number</p>
                <p className="text-sm">{student.registerNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{student.email || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Year</p>
                <p className="text-sm">{student.year || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Annual Income</p>
                <p className="text-sm">{student.annualIncome || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">CGPA</p>
                <p className="text-sm">{student.cgpa || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : registerNumber ? (
        <p className="text-muted-foreground">No student found with this register number.</p>
      ) : null}
    </div>
  );
};

export default StudentSearch;
