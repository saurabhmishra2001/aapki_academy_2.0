import { useState, useEffect } from "react";
import { testService } from "../../services/testService";
import { Button } from "../../components/ui/button";
import Table from "../../components/ui/table/Table"
import TableBody from "../../components/ui/table/TableBody"
import TableCell from "../../components/ui/table/TableCell"
import TableHead from "../../components/ui/table/TableHead"
import TableHeader from "../../components/ui/table/TableHeader"
import { Pencil, Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";

export default function TotalTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const fetchTests = async () => {
      try {
        const testsData = await testService.getTests();
        setTests(testsData);
      } catch (err) {
        setError("Failed to fetch tests");
        toast({
          title: "Error",
          description: "Failed to fetch tests. Please try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleDeleteTest = async (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      setLoading(true);
      try {
        await testService.deleteTest(testId);
        setTests(tests.filter((test) => test.id !== testId));
        toast({
          title: "Success",
          description: "Test deleted successfully",
          type: "success",
        });
      } catch (err) {
        setError("Failed to delete test");
        toast({
          title: "Error",
          description: "Failed to delete test. Please try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Total Tests</h2>
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {loading ? (
        <div>Loading tests...</div>
      ) : (
        <div className="rounded-md border">
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
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.title}</TableCell>
                  <TableCell>{test.description}</TableCell>
                  <TableCell>{test.duration} minutes</TableCell>
                  <TableCell>{test.total_marks}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/admin/tests/${test.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => navigate(`/admin/tests/create?testId=${test.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => handleDeleteTest(test.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}