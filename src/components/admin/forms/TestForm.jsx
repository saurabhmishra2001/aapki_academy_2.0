import React, { useState } from "react";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Plus, Trash2 } from "lucide-react";
import Textarea from "../../ui/textarea";

const TestForm = ({ onTestCreated }) => {
  const [test, setTest] = useState({
    title: "",
    duration: 60,
    total_marks: 100,
    status: "draft",
    description: "",
    questions: [],
    type: "free",
    subject: "NTA",
    model: "", // Optional model field
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleTestFieldChange = (field, value) => {
    setTest((prev) => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    setTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_text: "",
          options: ["", "", "", ""],
          correct_answer: "",
          marks: 1,
          explanation: "",
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    setTest((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestionField = (index, field, value) => {
    setTest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index][field] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const updateQuestionOption = (qIndex, optIndex, value) => {
    setTest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIndex].options[optIndex] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const validateQuestionFields = (question, index) => {
    const errors = {};
    if (!question.question_text.trim()) {
      errors.question_text = `Question ${index + 1} text is required`;
    }
    question.options.forEach((opt, i) => {
      if (!opt.trim()) {
        errors[`option_${i}`] = `Option ${i + 1} is required`;
      }
    });
    if (!question.correct_answer.trim()) {
      errors.correct_answer = "Correct answer is required";
    } else if (!question.options.includes(question.correct_answer)) {
      errors.correct_answer = "Correct answer must match one of the options";
    }
    if (!question.marks || question.marks < 1) {
      errors.marks = "Marks must be at least 1";
    }
    return errors;
  };

  const validateForm = () => {
    const errors = {};
    if (!test.title.trim()) errors.title = "Title is required";
    if (!test.duration || test.duration <= 0) errors.duration = "Duration must be positive";
    if (!test.total_marks || test.total_marks <= 0) errors.total_marks = "Total marks must be positive";

    const questionErrors = test.questions.map((q, i) => validateQuestionFields(q, i));
    if (questionErrors.some((err) => Object.keys(err).length > 0)) {
      errors.questions = questionErrors;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!test.questions.length) {
      setError("Please add at least one question");
      return;
    }
    if (validateForm()) {
      setLoading(true);
      try {
        const { testService } = await import("../../../services/testService");
        await testService.createTest({
          ...test,
          created_at: new Date(),
          updated_at: new Date(),
        });
        if (onTestCreated) onTestCreated();
      } catch (err) {
        setError(err.message || "Failed to create test");
      } finally {
        setLoading(false);
      }
    }
  };

  const totalQuestionsMarks = test.questions.reduce(
    (sum, q) => sum + (q.marks || 0),
    0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Test</h2>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg shadow-sm mb-6">
          <TabsTrigger value="details">Test Details</TabsTrigger>
          <TabsTrigger value="questions">Questions ({test.questions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="p-6 space-y-6 bg-white border border-gray-200">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={test.title}
                  onChange={(e) => handleTestFieldChange("title", e.target.value)}
                />
                {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={test.duration}
                  onChange={(e) =>
                    handleTestFieldChange("duration", parseInt(e.target.value) || 0)
                  }
                />
                {formErrors.duration && (
                  <p className="text-sm text-red-500">{formErrors.duration}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_marks">Total Marks</Label>
                <Input
                  id="total_marks"
                  type="number"
                  min="1"
                  value={test.total_marks}
                  onChange={(e) =>
                    handleTestFieldChange("total_marks", parseInt(e.target.value) || 0)
                  }
                />
                {formErrors.total_marks && (
                  <p className="text-sm text-red-500">{formErrors.total_marks}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={test.status}
                  onChange={(e) => handleTestFieldChange("status", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Test Type</Label>
                <select
                  id="type"
                  value={test.type}
                  onChange={(e) => handleTestFieldChange("type", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {test.type === "paid" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <select
                      id="subject"
                      value={test.subject}
                      onChange={(e) => handleTestFieldChange("subject", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="NTA">NTA</option>
                      <option value="UGC NET">UGC NET</option>
                      <option value="JRF">JRF</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model (Optional)</Label>
                    <select
                      id="model"
                      value={test.model}
                      onChange={(e) => handleTestFieldChange("model", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">-- Select Model --</option>
                      <option value="PYQ">PYQ</option>
                      <option value="Mock">Mock</option>
                      <option value="Sample">Sample</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={test.description}
                onChange={(e) => handleTestFieldChange("description", e.target.value)}
                rows={4}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <div className="space-y-6">
            {test.questions.map((q, i) => (
              <Card key={i} className="p-6 relative bg-white border border-gray-200">
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                  className="absolute top-4 right-4 text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                <div className="space-y-6">
                  <div>
                    <Label>Question {i + 1}</Label>
                    <Textarea
                      value={q.question_text}
                      onChange={(e) => updateQuestionField(i, "question_text", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, j) => (
                      <div key={j}>
                        <Label>Option {j + 1}</Label>
                        <Input
                          value={opt}
                          onChange={(e) => updateQuestionOption(i, j, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Correct Answer</Label>
                      <Input
                        value={q.correct_answer}
                        onChange={(e) =>
                          updateQuestionField(i, "correct_answer", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Marks</Label>
                      <Input
                        type="number"
                        value={q.marks}
                        min="1"
                        onChange={(e) =>
                          updateQuestionField(i, "marks", parseInt(e.target.value) || 1)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Explanation</Label>
                    <Textarea
                      value={q.explanation}
                      onChange={(e) => updateQuestionField(i, "explanation", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="w-full flex gap-2 justify-center border-dashed"
            >
              <Plus className="h-5 w-5" /> Add Question
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {totalQuestionsMarks !== test.total_marks && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Mismatch in Marks</AlertTitle>
          <AlertDescription>
            Sum of question marks ({totalQuestionsMarks}) does not match total test marks (
            {test.total_marks}). Please adjust the marks to match.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center mt-8">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Test"}
        </Button>
      </div>
    </form>
  );
};

export default TestForm;
