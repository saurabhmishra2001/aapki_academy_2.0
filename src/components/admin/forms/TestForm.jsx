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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Test</h1>
        <p className="text-gray-600">Fill in the details and add questions to create a test</p>
        <div className="flex items-center gap-4 mt-4 text-gray-600">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {test.duration} min
          </span>
          <span className="flex items-center">
            <Award className="h-4 w-4 mr-1" />
            {test.questions.length} questions
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
          <p className="text-gray-600 mb-4">Enter the general details about this test</p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-700">Title</Label>
              <Input
                id="title"
                value={test.title}
                onChange={(e) => setTest((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter test title"
                required
                className="w-full mt-1 border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700">Description</Label>
              <Textarea
                id="description"
                value={test.description}
                onChange={(e) => setTest((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the test purpose and content"
                className="w-full mt-1 border-gray-300"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration" className="text-gray-700">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={test.duration}
                  onChange={(e) => setTest((prev) => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full mt-1 border-gray-300"
                  required
                />
              </div>

              <div>
                <Label htmlFor="total_marks" className="text-gray-700">Total Marks</Label>
                <Input
                  id="total_marks"
                  type="number"
                  value={test.total_marks}
                  onChange={(e) => setTest((prev) => ({ ...prev, total_marks: parseInt(e.target.value) }))}
                  className="w-full mt-1 border-gray-300"
                  required
                />
              </div>

              <div>
                <Label htmlFor="passing_marks" className="text-gray-700">Passing Marks</Label>
                <Input
                  id="passing_marks"
                  type="number"
                  value={test.passing_marks}
                  onChange={(e) => setTest((prev) => ({ ...prev, passing_marks: parseInt(e.target.value) }))}
                  className="w-full mt-1 border-gray-300"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h2>
          <p className="text-gray-600 mb-4">Set when the test will be available</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time" className="text-gray-700">Start Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={test.start_time}
                onChange={(e) => setTest((prev) => ({ ...prev, start_time: e.target.value }))}
                className="w-full mt-1 border-gray-300"
                required
              />
            </div>

            <div>
              <Label htmlFor="end_time" className="text-gray-700">End Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={test.end_time}
                onChange={(e) => setTest((prev) => ({ ...prev, end_time: e.target.value }))}
                className="w-full mt-1 border-gray-300"
                required
              />
            </div>
          </div>
        </div>

        {/* ... rest of the form remains the same ... */}
      </div>
    </form>
  );
}

