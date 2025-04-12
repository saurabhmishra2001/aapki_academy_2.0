import { useState, useEffect } from "react";
import { testService } from "../../services/testService";
import { Button } from "../../components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";
import Table from "../../components/ui/table/Table"
import TableBody from "../../components/ui/table/TableBody"
import TableCell from "../../components/ui/table/TableCell"
import TableHead from "../../components/ui/table/TableHead"
import TableHeader from "../../components/ui/table/TableHeader"
import { Pencil, Eye, Trash } from "lucide-react";
import { useToast } from "../../hooks/useToast";

export default function ActiveTests() {
  const [activeTests, setActiveTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActiveTests = async () => {
      try {
        const data = await testService.getActiveTests();
        setActiveTests(data);
      } catch (error) {
        setError("Failed to load active tests. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load active tests.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchActiveTests();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Active Tests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Total Marks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeTests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.title}</TableCell>
              <TableCell>{test.description}</TableCell>
              <TableCell>{test.duration} minutes</TableCell>
              <TableCell>{test.total_marks}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-blue-500 hover:bg-blue-100"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-yellow-500 hover:bg-yellow-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:bg-red-100"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {activeTests.length === 0 && (
        <p className="text-center py-4 text-gray-500">No active tests found.</p>
      )}
    </div>
  );
}