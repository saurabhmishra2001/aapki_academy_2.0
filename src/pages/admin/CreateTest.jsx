import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';
import TestForm from '../../components/admin/forms/TestForm';
import { useToast } from '../../hooks/useToast';
import { testService } from '../../services/testService';

export default function CreateTest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId');
  const [initialTest, setInitialTest] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    document.body.classList.add('admin-sidebar-open');
    return () => document.body.classList.remove('admin-sidebar-open');
  }, []);

  useEffect(() => {
    const fetchTest = async () => {
      if (testId) {
        try {
          setLoading(true)
          const testData = await testService.getTestWithQuestions(testId)
          setInitialTest(testData)
        } catch (error) {
          toast({
            title: 'Error',
            description: error.message,
            type: 'error',
          });
        }
      }
    }

    fetchTest()
  }, [testId, toast])

  const handleTestCreated = () => {
    toast({
      title: 'Success',
      description: 'Test created successfully',
      type: 'success',
    });
    navigate('/admin/tests');
  };

  const breadcrumbs = [
    { label: 'Admin', link: '/admin/dashboard' },
    { label: 'Tests', link: '/admin/tests' },
    { label: testId ? 'Edit Test' : 'Create New Test' },
  ];
  return (
  
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {testId ? 'Edit Test' : 'Create New Test'}
        </h1>
        <TestForm onTestCreated={handleTestCreated} initialTest={initialTest} />
      </div>
  
  );
}