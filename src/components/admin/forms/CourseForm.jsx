import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../services/adminService';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Alert } from '../../ui/alert';
import { useToast } from '../../../hooks/useToast';
import { Upload, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CourseForm({ onCourseCreated, initialCourse }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ['Basic Info', 'Course Details', 'Media & Content'];
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    lessons: '',
    price: '',
    category: '',
    thumbnail: null,
    content: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialCourse) {
      setFormData(initialCourse);
    }
  }, [initialCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (initialCourse) {
        await adminService.updateCourse(initialCourse.id, formData);
      } else {
        await adminService.createCourse(formData);
      }
      toast({
        title: 'Success',
        description: 'Course saved successfully',
        type: 'success',
      });
      onCourseCreated();
      setFormData({
        title: '',
        description: '',
        duration: '',
        lessons: '',
        price: '',
        category: '',
        thumbnail: null,
        content: []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <Alert variant="destructive">{error}</Alert>}
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{steps[currentStep - 1]}</h2>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
      
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Lessons</label>
                  <Input
                    type="number"
                    value={formData.lessons}
                    onChange={(e) => setFormData(prev => ({ ...prev, lessons: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Media & Content</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.files[0] }))}
                          className="hidden"
                          required={!initialCourse}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Content</label>
                    <div className="space-y-4 border rounded-lg p-6 bg-gray-50">
                      {formData.content.map((section, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm space-y-3 transition-all duration-200 hover:shadow-md">
                          <Input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                              const newContent = [...formData.content];
                              newContent[index].title = e.target.value;
                              setFormData(prev => ({ ...prev, content: newContent }));
                            }}
                            placeholder="Section Title"
                            className="w-full transition-shadow duration-200 focus:shadow-md"
                          />
                          <textarea
                            value={section.description}
                            onChange={(e) => {
                              const newContent = [...formData.content];
                              newContent[index].description = e.target.value;
                              setFormData(prev => ({ ...prev, content: newContent }));
                            }}
                            placeholder="Section Description"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-shadow duration-200 focus:shadow-md"
                            rows={2}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              const newContent = formData.content.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, content: newContent }));
                            }}
                            className="mt-2"
                          >
                            Remove Section
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            content: [...prev.content, { title: '', description: '' }]
                          }));
                        }}
                        className="w-full py-2 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" /> Add New Section
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          
          {currentStep === steps.length ? (
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
            >
              {loading ? 'Saving...' : initialCourse ? 'Update Course' : 'Create Course'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
  );
}