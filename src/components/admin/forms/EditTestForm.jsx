import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { testService } from '../../../services/testService';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Alert } from '../../ui/alert';
import { useToast } from '../../../hooks/useToast';

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
      setError('');
  
      try {
        await testService.updateTest(testId, test);
        toast({
          title: 'Success',
          description: 'Test updated successfully',
          type: 'success',
        });
        navigate('/admin/tests');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const addQuestion = () => {
      setTest(prev => ({
        ...prev,
        questions: [
          ...prev.questions,
          {
            question_text: '',
            options: ['', '', '', ''],
            correct_answer: '',
            explanation: '',
            marks: 1
          }
        ]
      }));
    };
  
    const deleteQuestion = (index) => {
      setTest(prev => ({
        ...prev,
        questions: prev.questions.filter((_, qIndex) => qIndex !== index)
      }));
    };
  
    // Determine if the test is active or expired
    const isExpired = new Date(test.end_time) < new Date();
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className={`bg-white rounded-lg shadow-md p-6 w-full max-w-4xl ${isExpired ? 'border-red-500' : 'border-green-500'}`}>
          {error && <Alert variant="destructive">{error}</Alert>}
  
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <Input
                type="text"
                value={test.title}
                onChange={e => setTest(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={test.description}
                onChange={e => setTest(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <Input
                  type="number"
                  value={test.duration}
                  onChange={e => setTest(prev => ({ ...prev, duration: parseInt(e.target.value, 10) }))}
                  required
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                <Input
                  type="number"
                  value={test.total_marks}
                  onChange={e => setTest(prev => ({ ...prev, total_marks: parseInt(e.target.value, 10) }))}
                  required
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Passing Marks</label>
                <Input
                  type="number"
                  value={test.passing_marks}
                  onChange={e => setTest(prev => ({ ...prev, passing_marks: parseInt(e.target.value, 10) }))}
                  required
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <Input
                  type="datetime-local"
                  value={test.start_time}
                  onChange={e => setTest(prev => ({ ...prev, start_time: e.target.value }))}
                  required
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <Input
                  type="datetime-local"
                  value={test.end_time}
                  onChange={e => setTest(prev => ({ ...prev, end_time: e.target.value }))}
                  required
                />
              </div>
            </div>
  
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Questions</h2>
                <Button type="button" onClick={addQuestion}>
                  Add Question
                </Button>
              </div>
  
              <div className="space-y-6">
                {test.questions.map((question, qIndex) => (
                  <div key={qIndex} className="border rounded-md p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Question {qIndex + 1}</label>
                      <textarea
                        value={question.question_text}
                        onChange={e => {
                          const newQuestions = [...test.questions];
                          newQuestions[qIndex].question_text = e.target.value;
                          setTest(prev => ({ ...prev, questions: newQuestions }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={2}
                        required
                      />
                    </div>
  
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-2">
                          <Input
                            type="text"
                            value={option}
                            onChange={e => {
                              const newQuestions = [...test.questions];
                              newQuestions[qIndex].options[oIndex] = e.target.value;
                              setTest(prev => ({ ...prev, questions: newQuestions }));
                            }}
                            placeholder={`Option ${oIndex + 1}`}
                            required
                          />
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correct_answer === option}
                            onChange={() => {
                              const newQuestions = [...test.questions];
                              newQuestions[qIndex].correct_answer = option;
                              setTest(prev => ({ ...prev, questions: newQuestions }));
                            }}
                            required
                          />
                        </div>
                      ))}
                    </div>
  
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Explanation</label>
                      <textarea
                        value={question.explanation}
                        onChange={e => {
                          const newQuestions = [...test.questions];
                          newQuestions[qIndex].explanation = e.target.value;
                          setTest(prev => ({ ...prev, questions: newQuestions }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={2}
                      />
                    </div>
  
                    <Button type="button" variant="destructive" onClick={() => deleteQuestion(qIndex)}>
                      Delete Question
                    </Button>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/tests')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
  