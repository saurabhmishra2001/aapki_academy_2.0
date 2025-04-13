"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import Textarea from "../../ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { useToast } from '../../../hooks/useToast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Plus, Trash2, AlertCircle, Clock, Award, Calendar, Save } from 'lucide-react';

export default function TestForm({ onTestCreated, initialTest }) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [test, setTest] = useState({
    title: "",
    description: "",
    duration: 60,
    total_marks: 100,
    passing_marks: 40,
    start_time: "",
    end_time: "",
    questions: [],
  })
  const { toast } = useToast()
  const [controller, setController] = useState(null)

  useEffect(() => {
    if (initialTest) {
      setTest({
        ...initialTest,
        start_time: initialTest.start_time ? new Date(initialTest.start_time).toISOString().slice(0, 16) : "",
        end_time: initialTest.end_time ? new Date(initialTest.end_time).toISOString().slice(0, 16) : "",
        questions: initialTest.questions || [],
      })
    }
    const abortController = new AbortController()
    setController(abortController)
    return () => abortController.abort()
  }, [initialTest])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Assuming testService.createTest is available in your actual implementation
      // await testService.createTest(test, controller?.signal)
      toast({
        title: "Success",
        description: "Test created successfully",
      })
      onTestCreated()
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message)
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = () => {
    setTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_text: "",
          options: ["", "", "", ""],
          correct_answer: "",
          explanation: "",
          marks: 1,
        },
      ],
    }))
    setActiveTab("questions")
  }

  const updateQuestionField = (qIndex, field, value) => {
    const newQuestions = [...test.questions]
    newQuestions[qIndex][field] = value
    setTest((prev) => ({ ...prev, questions: newQuestions }))
  }

  const updateQuestionOption = (qIndex, oIndex, value) => {
    const newQuestions = [...test.questions]
    newQuestions[qIndex].options[oIndex] = value
    setTest((prev) => ({ ...prev, questions: newQuestions }))
  }

  const removeQuestion = (qIndex) => {
    const newQuestions = test.questions.filter((_, i) => i !== qIndex)
    setTest((prev) => ({ ...prev, questions: newQuestions }))
  }

  const totalQuestionsMarks = test.questions.reduce((sum, q) => sum + q.marks, 0)

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6 text-sm">
          <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</a>
          <span className="mx-2 text-gray-500">/</span>
          <a href="/tests" className="text-blue-600 hover:text-blue-800">Tests</a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-600">Create Test</span>
        </nav>

        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Test</h1>
            <p className="mt-2 text-gray-600">Fill in the details and add questions to create a test</p>
          </div>

          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {test.duration} min
            </span>
            <span className="flex items-center">
              <Award className="h-4 w-4 mr-1" />
              {test.questions.length} questions
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`mr-4 py-2 px-1 ${
                activeTab === "details"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Test Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("questions")}
              className={`py-2 px-1 ${
                activeTab === "questions"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Questions
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "details" && (
              <>
                <div>
                  <label className="block font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={test.title}
                    onChange={(e) => setTest(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter test title"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    value={test.description}
                    onChange={(e) => setTest(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                    placeholder="Describe the test purpose and content"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={test.duration}
                    onChange={(e) => setTest(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={test.total_marks}
                    onChange={(e) => setTest(prev => ({ ...prev, total_marks: parseInt(e.target.value) }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={test.passing_marks}
                    onChange={(e) => setTest(prev => ({ ...prev, passing_marks: parseInt(e.target.value) }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={test.start_time}
                    onChange={(e) => setTest(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={test.end_time}
                    onChange={(e) => setTest(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Test'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

