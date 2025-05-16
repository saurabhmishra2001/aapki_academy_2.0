import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/useToast';
import { adminService } from '../../services/adminService';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';

export default function CreateCourse() {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'beginner',
    category: '',
    thumbnail: null,
    sections: [{
      title: '',
      content: [{
        type: 'video',
        title: '',
        url: ''
      }]
    }]
  });
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.createCourse(course);
      toast({
        title: 'Success',
        description: 'Course created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    setCourse({
      ...course,
      sections: [...course.sections, {
        title: '',
        content: [{
          type: 'video',
          title: '',
          url: ''
        }]
      }]
    });
  };

  const addContent = (sectionIndex) => {
    const newSections = [...course.sections];
    newSections[sectionIndex].content.push({
      type: 'video',
      title: '',
      url: ''
    });
    setCourse({ ...course, sections: newSections });
  };

  const removeSection = (index) => {
    setCourse({
      ...course,
      sections: course.sections.filter((_, i) => i !== index)
    });
  };

  const removeContent = (sectionIndex, contentIndex) => {
    const newSections = [...course.sections];
    newSections[sectionIndex].content = newSections[sectionIndex].content
      .filter((_, i) => i !== contentIndex);
    setCourse({ ...course, sections: newSections });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourse({ ...course, thumbnail: file });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={course.duration}
                  onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level">Level</Label>
                <select
                  id="level"
                  value={course.level}
                  onChange={(e) => setCourse({ ...course, level: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={course.category}
                  onChange={(e) => setCourse({ ...course, category: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="thumbnail">Course Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                onChange={handleThumbnailChange}
                accept="image/*"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {course.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <Input
                    value={section.title}
                    onChange={(e) => {
                      const newSections = [...course.sections];
                      newSections[sectionIndex].title = e.target.value;
                      setCourse({ ...course, sections: newSections });
                    }}
                    placeholder="Section Title"
                    className="w-full mr-4"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {section.content.map((content, contentIndex) => (
                  <div key={contentIndex} className="ml-4 mb-4 p-4 border rounded">
                    <div className="flex justify-between items-center gap-4">
                      <Input
                        value={content.title}
                        onChange={(e) => {
                          const newSections = [...course.sections];
                          newSections[sectionIndex].content[contentIndex].title = e.target.value;
                          setCourse({ ...course, sections: newSections });
                        }}
                        placeholder="Content Title"
                      />
                      <Input
                        value={content.url}
                        onChange={(e) => {
                          const newSections = [...course.sections];
                          newSections[sectionIndex].content[contentIndex].url = e.target.value;
                          setCourse({ ...course, sections: newSections });
                        }}
                        placeholder="Video URL"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeContent(sectionIndex, contentIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addContent(sectionIndex)}
                  className="ml-4"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Content
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addSection}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Section
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Creating Course...' : 'Create Course'}
        </Button>
      </form>
    </div>
  );
}