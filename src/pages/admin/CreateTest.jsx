import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TestForm from '../../components/admin/forms/TestForm';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';

const CreateTest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId');
  const [initialTest, setInitialTest] = useState(null);
  const [error, setError] = useState(null);

  const { testService } = require('../../services/testService'); // Ensure this import is correct
  useEffect(() => {
    const fetchTest = async () => {
      if (testId) {
        try {
          const testData = await testService.getTestWithQuestions(testId);
          setInitialTest(testData);
        } catch (error) {
          setError(error.message);
        }
        // No need to show toast here, error will be displayed in the form
      }
    };

    fetchTest();
  }, [testId, toast]);

  const handleTestCreated = () => {
    // Success message is now handled within TestForm
    navigate('/admin/tests');
  };

  const breadcrumbs = [
    { label: 'Admin', link: '/admin/dashboard' },
    { label: 'Tests', link: '/admin/tests' },
    { label: testId ? 'Edit Test' : 'Create New Test' },
  ];
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={testId ? 'Edit Test' : 'Create New Test'}
        breadcrumbs={breadcrumbs}
      />
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
      <TestForm onTestCreated={handleTestCreated} initialTest={initialTest} />
    </div>
  );
}
export default CreateTest;