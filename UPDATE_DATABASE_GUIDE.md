# How to Update Database

## Quick Methods to Update Your Database

### Method 1: Using Script (Fastest)

1. **Get your Supabase credentials**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings > API
   - Copy your **Project URL** and **Service Role Key**

2. **Run the update script**:
   ```bash
   # Windows
   set VITE_SUPABASE_URL=your_project_url
   set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   node update-database.js
   
   # Linux/Mac
   export VITE_SUPABASE_URL=your_project_url
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   node update-database.js
   ```

### Method 2: Using Supabase Dashboard (Easiest)

1. **Go to SQL Editor**:
   - Open [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to **SQL Editor**

2. **Run this SQL**:
   ```sql
   -- Add sample teachers
   INSERT INTO teachers (
     name, email, phone, subject, hourly_rate, address,
     working_hours_start, working_hours_end, working_days,
     bio, specializations, experience, qualifications,
     role, is_active, rating, total_students, total_groups,
     total_sessions, total_revenue, preferences, social_links
   ) VALUES 
     (
       'أحمد محمد علي',
       'ahmed.mohamed@example.com',
       '+201234567890',
       'الرياضيات',
       150,
       'القاهرة، مصر',
       '09:00',
       '17:00',
       ARRAY['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
       'مدرس رياضيات ذو خبرة 10 سنوات',
       ARRAY['الجبر', 'الهندسة', 'التفاضل والتكامل'],
       10,
       ARRAY['بكالوريوس رياضيات', 'دبلوم تربوي'],
       'teacher',
       true,
       4.8,
       25,
       5,
       120,
       18000,
       '{"language": "ar", "theme": "light"}',
       '{"facebook": "", "twitter": "", "linkedin": ""}'
     ),
     (
       'فاطمة أحمد حسن',
       'fatima.ahmed@example.com',
       '+201234567891',
       'الفيزياء',
       140,
       'الإسكندرية، مصر',
       '10:00',
       '18:00',
       ARRAY['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
       'مدرسة فيزياء متخصصة',
       ARRAY['الميكانيكا', 'الكهرباء', 'الموجات'],
       8,
       ARRAY['بكالوريوس فيزياء', 'ماجستير فيزياء'],
       'teacher',
       true,
       4.9,
       20,
       4,
       100,
       14000,
       '{"language": "ar", "theme": "light"}',
       '{"facebook": "", "twitter": "", "linkedin": ""}'
     ),
     (
       'محمد علي محمود',
       'mohamed.ali@example.com',
       '+201234567892',
       'اللغة الإنجليزية',
       130,
       'الجيزة، مصر',
       '08:00',
       '16:00',
       ARRAY['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
       'مدرس لغة إنجليزية معتمد',
       ARRAY['قواعد اللغة', 'المحادثة', 'الكتابة'],
       12,
       ARRAY['بكالوريوس أدب إنجليزي', 'شهادة CELTA'],
       'teacher',
       true,
       4.7,
       30,
       6,
       150,
       19500,
       '{"language": "en", "theme": "dark"}',
       '{"facebook": "", "twitter": "", "linkedin": ""}'
     );
   ```

### Method 3: Manual Addition

1. **Go to Table Editor**:
   - Open [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to **Table Editor** > **teachers**

2. **Add teachers manually**:
   - Click **Insert row**
   - Fill in the data for each teacher
   - Make sure `is_active` is set to `true`

## What the Update Does

### 1. Adds 3 Sample Teachers:
- **أحمد محمد علي** (Mathematics)
- **فاطمة أحمد حسن** (Physics)
- **محمد علي محمود** (English)

### 2. Sets up proper data structure:
- All teachers are marked as `is_active = true`
- Includes complete profile information
- Sets proper working hours and specializations

### 3. Enables group creation:
- Teachers will appear in group creation forms
- You can assign groups to teachers
- Teachers can manage their groups

## Verify the Update

### Check in your app:
1. Go to **Teachers** page
2. Go to **Groups** > **Add Group**
3. You should see teachers in the dropdown

### Check in Supabase Dashboard:
1. Go to **Table Editor** > **teachers**
2. You should see 3 active teachers

### Check using script:
```bash
node quick-check-teachers.js
```

## Troubleshooting

### If you get "Environment variables missing":
```bash
# Set your variables first
set VITE_SUPABASE_URL=https://your-project.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
node update-database.js
```

### If you get "Table does not exist":
- The table will be created automatically when you add the first teacher
- Or run the full migration SQL from the dashboard

### If you get "Permission denied":
- Make sure you're using the **Service Role Key** (not Anon Key)
- Check your RLS policies in Supabase Dashboard

### If teachers don't appear in your app:
1. Check if `is_active = true`
2. Verify RLS policies allow public read access
3. Check your app's environment variables

## Next Steps

After updating the database:

1. **Test your app**: Go to Groups page and try creating a new group
2. **Assign teachers**: Select a teacher when creating groups
3. **Manage groups**: Use the "Manage Groups" button on teacher cards

## Files Available

- `update-database.js` - Simple script to add teachers
- `supabase/migrations/20240701_add_teachers_and_fix_issues.sql` - Full migration
- `APPLY_MIGRATION_GUIDE.md` - Detailed migration guide
- `SOLVE_NO_TEACHERS.md` - Troubleshooting guide

## Need Help?

If you encounter any issues:

1. Check the error messages carefully
2. Verify your Supabase credentials
3. Try the manual method using SQL Editor
4. Check the troubleshooting guides in the files above 