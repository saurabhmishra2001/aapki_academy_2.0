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
    type: "regular"
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

  const validateForm = () => {
    const errors = {};

    if (!test.title.trim()) errors.title = "Title is required";
    if (!test.duration || test.duration <= 0) errors.duration = "Duration must be positive";
    if (!test.total_marks || test.total_marks <= 0) errors.total_marks = "Total marks must be positive";

    test.questions.forEach((q, index) => {
      if (!q.question_text.trim()) errors[`question_${index}`] = "Question text is required";
      if (!q.correct_answer.trim()) errors[`question_${index}_answer`] = "Correct answer is required";
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (validateForm()) {
      setLoading(true);
      try {
        const { testService } = await import("../../../services/testService");
        await testService.createTest(test);
        if (onTestCreated) onTestCreated();
      } catch (err) {
        setError(err.message || "Failed to create test");
      } finally {
        setLoading(false);
      }
    }
  };

  const totalQuestionsMarks = test.questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Test Details</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="mt-6">
          <Card className="p-4 space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={test.title}
                onChange={(e) => handleTestFieldChange("title", e.target.value)}
              />
              {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
            </div>

            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={test.duration}
                onChange={(e) => handleTestFieldChange("duration", parseInt(e.target.value) || 0)}
              />
              {formErrors.duration && (
                <p className="text-sm text-red-500">{formErrors.duration}</p>
              )}
            </div>

            <div>
              <Label>Total Marks</Label>
              <Input
                type="number"
                value={test.total_marks}
                onChange={(e) => handleTestFieldChange("total_marks", parseInt(e.target.value) || 0)}
              />
              {formErrors.total_marks && (
                <p className="text-sm text-red-500">{formErrors.total_marks}</p>
              )}
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={test.description}
                onChange={(e) => handleTestFieldChange("description", e.target.value)}
              />
            </div>

            <div>
              <Label>Status</Label>
              <select
                className="border rounded p-2 w-full"
                value={test.status}
                onChange={(e) => handleTestFieldChange("status", e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="mt-6">
          <div className="space-y-6">
            {test.questions.map((q, i) => (
              <Card key={i} className="p-4">
                <div className="mb-2">
                  <Label>Question {i + 1}</Label>
                  <Textarea
                    value={q.question_text}
                    onChange={(e) => updateQuestionField(i, "question_text", e.target.value)}
                  />
                  {formErrors[`question_${i}`] && (
                    <p className="text-sm text-red-500">{formErrors[`question_${i}`]}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
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

                <div className="mt-2">
                  <Label>Correct Answer</Label>
                  <Input
                    value={q.correct_answer}
                    onChange={(e) =>
                      updateQuestionField(i, "correct_answer", e.target.value)
                    }
                  />
                  {formErrors[`question_${i}_answer`] && (
                    <p className="text-sm text-red-500">
                      {formErrors[`question_${i}_answer`]}
                    </p>
                  )}
                </div>

                <div className="mt-2">
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    value={q.marks}
                    onChange={(e) =>
                      updateQuestionField(i, "marks", parseInt(e.target.value) || 1)
                    }
                  />
                </div>

                <Button
                  variant="destructive"
                  className="mt-4"
                  type="button"
                  onClick={() => removeQuestion(i)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove Question
                </Button>
              </Card>
            ))}

            <Button type="button" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" /> Add Question
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Error Alert if total marks mismatch */}
      {totalQuestionsMarks !== test.total_marks && (
        <Alert variant="destructive">
          <AlertTitle>Mismatch in Marks</AlertTitle>
          <AlertDescription>
            Sum of question marks ({totalQuestionsMarks}) does not match total test marks ({test.total_marks}).
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Test"}</Button>
    </form>
  );
};

export default TestForm;
