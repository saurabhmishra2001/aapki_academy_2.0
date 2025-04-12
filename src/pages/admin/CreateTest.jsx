import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import TestForm from '@/components/admin/forms/TestForm';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function CreateTestPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleTestCreated = () => {
    toast({
      title: 'Success',
      description: 'Test created successfully',
    });
    navigate('/admin/tests');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumb className="mb-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/admin" className="text-blue-600 hover:text-blue-800">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink to="/admin/tests" className="text-blue-600 hover:text-blue-800">
                Tests
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-gray-600">Create Test</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {error && (
          <Alert variant="destructive" className="mb-6 border border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{error}</span>
          </Alert>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          {loading ? (
            <CardContent className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading test data...</p>
              </div>
            </CardContent>
          ) : (
            <TestForm onTestCreated={handleTestCreated} />
          )}
        </div>
      </div>
    </div>
  );
}
