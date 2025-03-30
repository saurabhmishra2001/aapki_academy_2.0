## Local Setup Instructions

1. **Prerequisites**
   - Node.js (v18 or higher)
   - npm (v9 or higher)
   - Git

2. **Clone and Install**
   ```bash
   # Clone the repository
   git clone <your-repo-url>
   cd aapki-academy

   # Install dependencies
   npm install
   ```

3. **Supabase Setup**
   - Create a new project at https://supabase.com
   - Get your project URL and anon key
   - Create a `.env` file in the project root:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Database Setup**
   - Go to your Supabase project's SQL editor
   - Run the migration files from `supabase/migrations` in order:
     1. `0001_proud_haze.sql`
     2. `0002_broken_fire.sql`

5. **Create Admin User**
   - Sign up through the application
   - In Supabase SQL editor, run:
   ```sql
   INSERT INTO admin_users (id)
   SELECT id FROM auth.users
   WHERE email = 'your-email@example.com';
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Open http://localhost:5173
   - Log in with your admin credentials
   - Navigate to `/admin` to access the admin dashboard

## Creating Tests

1. **Access Admin Dashboard**
   - Log in as admin
   - Go to `/admin/tests/create`

2. **Create a Test**
   - Fill in basic test details:
     - Title
     - Description
     - Duration
     - Total marks
     - Start/End times

3. **Add Questions**
   - Click "Add Question"
   - For each question:
     - Enter question text
     - Add 4 options
     - Select correct answer
     - Add explanation
     - Set marks

4. **Save Test**
   - Click "Create Test" to save
   - Test will be available to users based on start/end times