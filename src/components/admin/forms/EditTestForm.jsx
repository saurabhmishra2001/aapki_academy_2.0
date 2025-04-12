import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { testService } from '../../../services/testService';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Alert } from '../../ui/alert';
import { useToast } from '../../../hooks/useToast';
import { Label } from '../../ui/label';
import { Spinner } from '../../ui/spinner';

export default function EditTestForm() {
    const navigate = useNavigate();
    const { testId } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [test, setTest] = useState({
      title: '',
      description: '',
      duration: 60,
      total_marks: 100,
      passing_marks: 40,
      start_time: '',
      end_time: '',
      questions: []
    });
    const [validationErrors, setValidationErrors] = useState({});
    const { toast } = useToast();
  
    useEffect(() => {
      document.body.classList.add('admin-sidebar-open');
      return () => {
        document.body.classList.remove('admin-sidebar-open');
      };
    }, []);
  
    useEffect(() => {
      const fetchTest = async () => {
        try {
          const testData = await testService.getTestWithQuestions(testId);
          setTest({
            ...testData,
            start_time: testData.start_time ? new Date(testData.start_time).toISOString().slice(0, 16) : '',
            end_time: testData.end_time ? new Date(testData.end_time).toISOString().slice(0, 16) : '',
            questions: testData.questions || [],
          });
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchTest();
    }, [testId]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(''); // Clear any previous errors
      setValidationErrors({});
  
      // Basic form validation
      const errors = {};
      if (!test.title) errors.title = 'Title is required';
      if (!test.description) errors.description = 'Description is required';
      if (!test.duration || test.duration <= 0) errors.duration = 'Duration must be a positive number';
      if (!test.total_marks || test.total_marks <= 0) errors.total_marks = 'Total marks must be a positive number';
      if (!test.passing_marks || test.passing_marks <= 0 || test.passing_marks > test.total_marks) {
          errors.passing_marks = 'Passing marks must be between 1 and total marks';
      }
      if (!test.start_time) errors.start_time = 'Start time is required';
      if (!test.end_time) errors.end_time = 'End time is required';
  
      // Questions validation
      const questionErrors = [];
      test.questions.forEach((question, index) => {
        const qErrors = {};
        if (!question.question_text) qErrors.question_text = 'Question text is required';
        if (!question.options || question.options.length !== 4 || question.options.some(opt => !opt)) {
          qErrors.options = 'All 4 options are required';
        }
        if (!question.correct_answer || !question.options.includes(question.correct_answer)) {
          qErrors.correct_answer = 'Correct answer must be one of the options';
        }
        if (!question.marks || question.marks <= 0) qErrors.marks = 'Marks must be a positive number';
  
        if (Object.keys(qErrors).length > 0) {
          questionErrors[index] = qErrors;
        }
      });
  
      if (Object.keys(errors).length > 0 || questionErrors.length > 0) {
        setValidationErrors({ ...errors, questions: questionErrors });
        setLoading(false);
        return;
      }
  
      // Check if start time is before end time
      if (new Date(test.start_time) >= new Date(test.end_time)) {
        setValidationErrors({
          ...validationErrors,
          end_time: 'End time must be after start time',
        });
        setLoading(false);
        return;
      }

      try {
        await testService.updateTest(testId, test);
  
        // If the update is successful, show success toast and navigate to the tests page
        toast({
          title: 'Success',
          description: 'Test updated successfully',
          type: 'success',
        });
        navigate('/admin/tests');
      } catch (err) {
        // If there is an error during the update process, set the error state and show error toast
        const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          type: 'error',
        });
  
      } finally {
        setLoading(false);
      }
    };
  
    const addQuestion = () => {
      setTest(prev => ({
          ...prev, questions: [...prev.questions, { question_text: '', options: ['', '', '', ''], correct_answer: '', explanation: '', marks: 1 }]
      }));
    };
  
    const deleteQuestion = (index) => {
      if (test.questions.length <= 1) {
        toast({ title: 'Warning', description: 'A test must have at least one question.', type: 'warning' });
        return;
      }
  
      setTest(prev => ({
        ...prev,
        questions: prev.questions.filter((_, qIndex) => qIndex !== index)
      }));
    };
  
    // Determine if the test is active or expired
    // const isExpired = new Date(test.end_time) < new Date();  // Removed unused variable
  
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}

            {/* Test Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Test Details</h2>
                    <p className="text-sm text-gray-500 mt-1">Basic information about the test</p>
                </div>
  
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <Input
                                value={test.title}
                                onChange={e => setTest(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter test title"
                                className={validationErrors.title ? 'border-red-500' : ''}
                                required
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <textarea
                                value={test.description}
                                onChange={e => setTest(prev => ({ ...prev, description: e.target.value }))}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 ${
                                  validationErrors.description ? 'border-red-500' : ''
                                }`}
                                rows={3}
                                placeholder="Describe the test purpose and content"
                            />
                            {validationErrors.description && <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label>Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={test.duration}
                                    onChange={e => setTest(prev => ({ ...prev, duration: parseInt(e.target.value, 10) }))}
                                    className={validationErrors.duration ? 'border-red-500' : ''}
                                    required
                                    />
                                
                            </div>

                            <div>
                                <Label>Total Marks</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={test.total_marks}
                                    onChange={e => setTest(prev => ({ ...prev, total_marks: parseInt(e.target.value, 10) }))}
                                    className={validationErrors.total_marks ? 'border-red-500' : ''}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Passing Marks</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max={test.total_marks}
                                    value={test.passing_marks}
                                    className={validationErrors.passing_marks ? 'border-red-500' : ''}
                                    onChange={e => setTest(prev => ({ ...prev, passing_marks: parseInt(e.target.value, 10) }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Start Time</Label>
                                <Input
                                    type="datetime-local"
                                    value={test.start_time}
                                    className={validationErrors.start_time ? 'border-red-500' : ''}
                                    onChange={(e) => {
                                      setTest((prev) => ({ ...prev, start_time: e.target.value }));
                                    }}
                                />
                                {validationErrors.start_time && <p className="text-red-500 text-xs mt-1">{validationErrors.start_time}</p>}
                            </div>

                            <div>
                                <Label>End Time</Label>
                                <Input
                                    type="datetime-local"
                                    className={validationErrors.end_time ? 'border-red-500' : ''}
                                    value={test.end_time}
                                    onChange={(e) => setTest((prev) => ({ ...prev, end_time: e.target.value }))}
                                />
                                {validationErrors.end_time && <p className="text-red-500 text-xs mt-1">{validationErrors.end_time}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
                        <p className="text-sm text-gray-600 mt-1">Add and manage test questions</p>
                    </div>
                    <Button
                        type="button"
                        onClick={addQuestion}
                        className="gap-2"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Add Question
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                  {test.questions.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No questions added yet</p>
                    </div>
                  ) : (
                        test.questions.map((question, qIndex) => (
                            <div key={qIndex} className="border rounded-xl p-6 bg-gray-50 relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium text-gray-700">Question {qIndex + 1}</h3>
  
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newQuestions = [...test.questions];
                                        const updatedQuestion = { ...newQuestions[qIndex] };
                                        updatedQuestion.isExpanded = !updatedQuestion.isExpanded;
                                        newQuestions[qIndex] = updatedQuestion;
                                        setTest(prev => ({ ...prev, questions: newQuestions }));
                                      }}
                                    >
                                      {question.isExpanded ? 'Collapse' : 'Expand'}
                                    </Button>
  
                                  
                                    <Button
                                      type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteQuestion(qIndex)}
                                    >
                                        <TrashIcon className="h-4 w-4 text-red-600" />
                                    </Button>
                                </div>

                                <div className={`space-y-4 ${question.isExpanded ? '' : 'hidden'}`}>
                                    <div>
                                        <Label>Question Text</Label>
                                        <textarea
                                            value={question.question_text}
                                            onChange={e => {
  
                                                const newQuestions = [...test.questions];
                                                newQuestions[qIndex].question_text = e.target.value;
                                                setTest(prev => ({ ...prev, questions: newQuestions }));
                                            }}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            rows={2}
                                            required
                                        />
                                        {validationErrors.questions && validationErrors.questions[qIndex] && validationErrors.questions[qIndex].question_text && (
                                          <p className="text-red-500 text-xs mt-1">
                                            {validationErrors.questions[qIndex].question_text}
                                          </p>
                                        )}
                                      
                                      
                                      
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Options</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                                                    <input
                                                      type="radio"
                                                      className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${
                                                        validationErrors.questions &&
                                                        validationErrors.questions[qIndex]?.correct_answer && 'border-red-500'
                                                      }`}
                                                        name={`correct-${qIndex}`}
                                                        checked={question.correct_answer === option}
                                                        onChange={() => {
                                                            const newQuestions = [...test.questions];
                                                            newQuestions[qIndex].correct_answer = option;
                                                            setTest(prev => ({ ...prev, questions: newQuestions }));
                                                        }}
                                                      
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={option}
                                                        onChange={e => {
                                                            const newQuestions = [...test.questions];
                                                            newQuestions[qIndex].options[oIndex] = e.target.value;
                                                            setTest(prev => ({ ...prev, questions: newQuestions }));
                                                        }}
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        className="border-0 shadow-none focus:ring-0 p-0"
                                                      
                                                      
                                                      
                                                      
                                                      
                                                      
                                                      
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Explanation</Label>
                                            <textarea
                                                value={question.explanation}
                                                onChange={e => {
                                                    const newQuestions = [...test.questions];
                                                    newQuestions[qIndex].explanation = e.target.value;
                                                    setTest(prev => ({ ...prev, questions: newQuestions }));
                                                }}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                rows={2}
                                            />
  
                                        
                                        
                                        
                                        
                                        </div>
  
                                      
  
  
                                        <div>
                                            <Label>Marks</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={question.marks}
                                                onChange={e => {
                                                  const newQuestions = [...test.questions];
                                                  newQuestions[qIndex].marks = parseInt(e.target.value, 10);
                                                  setTest(prev => ({ ...prev, questions: newQuestions }));
                                                }}
                                                className="w-24"
                                            />
                                        </div>
  
                                    </div>
                                </div>
                            </div>

                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/tests')}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="gap-2"
                >
                    {loading && <Spinner className="h-4 w-4" />}
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}

function PlusIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>
    );
}

function TrashIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
        </svg>
    );
}