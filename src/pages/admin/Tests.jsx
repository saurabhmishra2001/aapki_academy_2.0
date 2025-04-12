import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testService } from '../../services/testService';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/InputField';
import { PageHeader } from '../../components/common/PageHeader';
import { MainLayout } from '../../components/layout/MainLayout';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 6;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const data = await testService.getTests();
      setTests(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/CreateTest?testId=${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await testService.deleteTest(id);
        setTests(tests.filter((test) => test.id !== id));
        toast({
          title: 'Success',
          description: 'Test deleted successfully',
          type: 'success',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          type: 'error',
        });
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/CreateTest');
  };

  const filteredTests = tests.filter((test) =>
    test.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);

  const totalPages = Math.ceil(filteredTests.length / testsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <MainLayout>
      <PageHeader title="Tests" breadcrumbs={[{ label: 'Dashboard', path: '/admin' }, { label: 'Tests' }]} />
      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Search tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleCreateNew} variant="primary">
          Create New Test
        </Button>
      </div>

      {filteredTests.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No tests found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTests.map((test) => (
              <div key={test.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800">{test.title}</h3>
                  <p className="text-gray-600 mt-2 line-clamp-3">{test.description}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Duration: {test.duration} minutes</p>
                    <p>Total Marks: {test.total_marks}</p>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(test.id)}>
                    Edit
                  </Button>
                  <Button variant="error" size="sm" onClick={() => handleDelete(test.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  const pageNumber = Math.max(1, currentPage - 2) + index;
                  if (pageNumber > totalPages) return null;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      aria-current="page"
                      className={`${currentPage === pageNumber ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}
                {totalPages > 5 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`${currentPage === totalPages ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}

function ChevronLeftIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );
}