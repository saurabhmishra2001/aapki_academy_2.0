# Aapki Academy

An online learning platform with courses, video lectures, and test series.

## Setup Instructions

1. **Prerequisites**
   - Node.js (v18 or higher)
   - npm (v9 or higher)

2. **Environment Setup**
   - Click the "Connect to Supabase" button in the top right corner
   - This will automatically set up your `.env` file with the required variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Installation**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Database Setup**
   - The database schema will be automatically created when you connect to Supabase
   - Add test data through the Supabase dashboard:
     1. Go to your Supabase project dashboard
     2. Navigate to the SQL editor
     3. Add sample test data using the provided SQL below:

```sql
-- Insert a sample test
INSERT INTO tests (
  title, description, duration, total_marks, passing_marks,
  start_time, end_time, is_active
) VALUES (
  'Sample Mathematics Test',
  'Basic algebra and arithmetic test',
  60, -- 60 minutes duration
  100, -- total marks
  40,  -- passing marks
  NOW(), -- start time (current time)
  NOW() + INTERVAL '7 days', -- end time (7 days from now)
  true
);

-- Get the test ID we just inserted
DO $$ 
DECLARE
  test_id uuid;
BEGIN
  SELECT id INTO test_id FROM tests ORDER BY created_at DESC LIMIT 1;

  -- Insert sample questions
  INSERT INTO questions (test_id, question_text, options, correct_answer, explanation) VALUES
  (test_id, 'What is 2 + 2?', '["3","4","5","6"]', '4', 'Basic addition'),
  (test_id, 'Solve: x + 5 = 10', '["3","4","5","6"]', '5', 'Basic algebra: subtract 5 from both sides'),
  (test_id, 'What is 3 × 4?', '["10","11","12","13"]', '12', 'Basic multiplication');
END $$;
```

## Features
- Course Management
- Video Lectures
- Test Series with Analytics
- Document Repository