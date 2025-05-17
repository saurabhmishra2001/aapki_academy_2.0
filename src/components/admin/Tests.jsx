import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaTrash, FaPlus, FaSpinner, FaPencilAlt } from 'react-icons/fa';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    questions: [{
      text: '',
      options: ['', '', '', ''],
      correctOption: 0
    }]
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'tests'));
      const testsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTests(testsList);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tests'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        duration: 30,
        questions: [{
          text: '',
          options: ['', '', '', ''],
          correctOption: 0
        }]
      });
      fetchTests();
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const handleDelete = async (testId) => {
    try {
      await deleteDoc(doc(db, 'tests', testId));
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    if (field === 'option') {
      const [optionIndex, optionValue] = value;
      newQuestions[index].options[optionIndex] = optionValue;
    } else {
      newQuestions[index][field] = value;
    }
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctOption: 0
        }
      ]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tests</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <FaPlus className="w-5 h-5 mr-2" />
          Create Test
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {test.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duration: {test.duration} minutes
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{test.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {test.questions.length} questions
              </p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Test
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    Questions
                  </h4>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <FaPlus className="w-4 h-4 mr-1" />
                    Add Question
                  </button>
                </div>

                {formData.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Question {qIndex + 1}
                      </label>
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Options
                      </label>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctOption === oIndex}
                            onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                            className="text-primary-500 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleQuestionChange(qIndex, 'option', [oIndex, e.target.value])}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
                            placeholder={`Option ${oIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;