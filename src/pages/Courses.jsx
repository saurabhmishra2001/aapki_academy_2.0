import { useState, useEffect } from 'react';
import loadingGif from '../assets/loading.gif'; // Replace with the correct path to your loading GIF
import noDataImage from '../assets/no_data_found.webp'; // Replace with the correct path to your 'No Data Found' image
import { fetchCourses } from '../utils/apiClient'; // Hypothetical API client

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCoursesWithDelay = async () => {
      try {
        const data = await fetchCourses();

        // Artificial delay for loading
        setTimeout(() => {
          setCourses(data);
          setLoading(false);
        }, 4000); // Delay for 4 seconds
      } catch (err) {
        console.error('Error fetching courses:', err);

        // Artificial delay in case of error
        setTimeout(() => {
          setError('Failed to load courses');
          setLoading(false);
        }, 4000); // Delay for 4 seconds
      }
    };

    loadCoursesWithDelay();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={loadingGif} alt="Loading..." className="w-40 h-40 sm:w-60 sm:h-60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img src={noDataImage} alt="No Data Found" className="w-40 h-40 sm:w-60 sm:h-60" />
        <p className="text-gray-500 text-lg">No courses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Duration: {course.duration}</span>
                <span>{course.lessons} lessons</span>
              </div>
              <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
