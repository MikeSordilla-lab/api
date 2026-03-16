import { useState } from "react";
import { Search, Plus, RefreshCw, LogOut, MoreVertical, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { AddStudentDialog } from "./components/AddStudentDialog";

interface Student {
  id: string;
  name: string;
  rating: number;
}

const mockStudents: Student[] = [
  { id: "1", name: "Jean-Marie Smith", rating: 85 },
  { id: "2", name: "Kuwen Betonio", rating: 100 },
  { id: "3", name: "Mike Sordilla", rating: 92 },
  { id: "4", name: "O&#039;Brien Doe", rating: 88 },
  { id: "5", name: "Perfect Score", rating: 100 },
  { id: "6", name: "Princess Betonio", rating: 100 },
  { id: "7", name: "Test User", rating: 50 },
  { id: "8", name: "Zero Rated", rating: 0 },
];

export default function App() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleDelete = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log("Edit student:", id);
  };

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log("Refreshing data...");
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logging out...");
  };

  const handleAddStudent = (name: string, rating: number) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      rating,
    };
    setStudents([...students, newStudent]);
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "bg-green-500/10 text-green-700 border-green-200";
    if (rating >= 70) return "bg-blue-500/10 text-blue-700 border-blue-200";
    if (rating >= 50) return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
    return "bg-gray-500/10 text-gray-700 border-gray-200";
  };

  const filteredStudents = students
    .filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Student List</h1>
              <p className="text-sm text-gray-500 mt-1">
                {students.length} students • Logged in as admin
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="size-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="size-4" />
                Log Out
              </Button>
              <Button
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="size-4" />
                Add Student
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by first or last name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSort}
              className="gap-2"
            >
              Name {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </Button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Student</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 border-2 border-gray-100">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Student ID: {student.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getRatingColor(student.rating)} font-medium`}
                      >
                        <Star className="size-3 mr-1 fill-current" />
                        {student.rating}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                          <div
                            className={`h-2 rounded-full ${
                              student.rating >= 90
                                ? "bg-green-500"
                                : student.rating >= 70
                                ? "bg-blue-500"
                                : student.rating >= 50
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${student.rating}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 min-w-[3ch]">
                          {student.rating}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(student.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(student.id)}>
                              <Pencil className="size-4 mr-2" />
                              Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(student.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="size-4 mr-2" />
                              Delete Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {filteredStudents.length} of {students.length} students
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-green-500" />
              <span>Excellent (90+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-500" />
              <span>Good (70-89)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-yellow-500" />
              <span>Average (50-69)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-gray-400" />
              <span>Below Average (&lt;50)</span>
            </div>
          </div>
        </div>
      </div>

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
}
