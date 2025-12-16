# PowerMyPoint 🎯

An AI-powered presentation generator built with Next.js, Google Gemini, and Supabase. Create professional presentations in seconds using natural language prompts.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Google Gemini](https://img.shields.io/badge/Gemini-1.5%20Pro-4285f4)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e)

## ✨ Features

- 🤖 **AI-Powered Generation**: Create presentations using Google Gemini 1.5 Pro
- 📊 **Smart Slide Creation**: Automatically generates 5-8 slides with structured content
- ✏️ **Full Editor**: Edit titles, descriptions, and individual slides
- 👁️ **Presentation Viewer**: Fullscreen viewer with keyboard navigation
- 🔥 **Trending Page**: Discover popular presentations sorted by views
- 💾 **Supabase Storage**: Secure cloud storage with Row Level Security
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A [Google Gemini API key](https://makersuite.google.com/app/apikey)
- A [Supabase project](https://supabase.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PowerMyPoint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Google Gemini API Key (get from https://makersuite.google.com/app/apikey)
   GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here

   # Supabase Configuration (get from your Supabase project settings)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up the database**
   
   - Open your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Copy the contents of `src/database/schema.sql`
   - Paste and run the SQL script
   
   This will create:
   - `users` table for user data
   - `presentations` table for storing presentations
   - Indexes for performance
   - Row Level Security policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
PowerMyPoint/
├── src/
│   ├── app/
│   │   ├── (main)/              # Main app routes
│   │   │   ├── explore/         # Browse presentations
│   │   │   ├── presentations/   # Presentation detail & edit
│   │   │   ├── trendings/       # Trending presentations
│   │   │   └── settings/        # App settings
│   │   ├── api/                 # API routes
│   │   │   ├── generate/        # Claude AI generation
│   │   │   └── presentations/   # CRUD operations
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components
│   │   ├── PresentationCard.tsx
│   │   ├── PresentationViewer.tsx
│   │   ├── SlideEditor.tsx
│   │   └── LoadingSpinner.tsx
│   ├── database/
│   │   ├── connect.ts           # Supabase client
│   │   └── schema.sql           # Database schema
│   └── types/
│       └── types.ts             # TypeScript types
├── public/                      # Static assets
├── .env.local                   # Environment variables (create this)
└── package.json
```

## 🎨 Usage

### Creating a Presentation

1. Navigate to the **Explore** page
2. Enter a prompt in the creation form, e.g., "Create a presentation about climate change"
3. Click **Create** and wait for Google Gemini to generate your presentation
4. Your presentation will appear in the grid

### Viewing a Presentation

1. Click on any presentation card
2. Use the **Previous/Next** buttons or **arrow keys** to navigate slides
3. Press **F** for fullscreen mode
4. Press **Esc** to exit

### Editing a Presentation

1. Click the **Edit** button on a presentation card or detail page
2. Modify the title, description, or slide content
3. Add new slides with the **Add Slide** button
4. Delete slides (minimum 1 slide required)
5. Click **Save Changes** when done

### Exploring Trending

1. Navigate to the **Trending** page
2. View presentations sorted by popularity (views)
3. See statistics and top-ranked presentations

## 🔌 API Documentation

### Generate Presentation

**POST** `/api/generate`

Generate a new presentation using Google Gemini.

**Request Body:**
```json
{
  "prompt": "Create a presentation about renewable energy",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Renewable Energy",
    "description": "An overview of renewable energy sources",
    "slides": [...],
    "created_at": "2025-12-07T...",
    "views": 0
  },
  "message": "Presentation generated successfully"
}
```

### Get All Presentations

**GET** `/api/presentations?public=true&limit=20&offset=0`

Fetch presentations with pagination.

**Query Parameters:**
- `public` (boolean): Filter public presentations
- `limit` (number): Number of results (default: 20)
- `offset` (number): Pagination offset (default: 0)

### Get Single Presentation

**GET** `/api/presentations/[id]`

Fetch a specific presentation by ID. Automatically increments view count.

### Update Presentation

**PUT** `/api/presentations/[id]`

Update presentation details.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "slides": [...],
  "is_public": true
}
```

### Delete Presentation

**DELETE** `/api/presentations/[id]`

Delete a presentation permanently.

## 🗄️ Database Schema

### presentations

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Presentation title |
| description | TEXT | Brief description |
| slides | JSONB | Array of slide objects |
| user_id | UUID | Foreign key to users |
| is_public | BOOLEAN | Public visibility |
| views | INTEGER | View count |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### users

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | TEXT | User email |
| name | TEXT | User name |
| created_at | TIMESTAMP | Creation timestamp |

## 🛠️ Technologies

- **Framework**: [Next.js 15.5.4](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI**: [Google Gemini 1.5 Pro](https://ai.google.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown)

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Environment variables for sensitive credentials
- API key validation
- Secure database queries with Supabase client

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for ChatGPT (optional, for better outline generation) | No |
| `PEXELS_API_KEY` | Pexels API key for image fallback (optional, for replacing broken images) | No |
| `GOOGLE_IMAGEN_API_KEY` | Google Imagen API key for image generation fallback (optional, can use GOOGLE_GEMINI_API_KEY if compatible) | No |
| `GOOGLE_CLOUD_PROJECT_ID` | Google Cloud Project ID (required if using Imagen API) | No |
| `GOOGLE_CLOUD_LOCATION` | Google Cloud location (default: us-central1, required if using Imagen API) | No |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check that all environment variables are set correctly
2. Ensure the database schema has been run in Supabase
3. Verify your Google Gemini API key is valid
4. Check the browser console for errors

## 🎯 Roadmap

- [ ] User authentication with Supabase Auth
- [ ] Presentation templates
- [ ] Export to PDF/PPTX
- [ ] Collaborative editing
- [ ] Custom themes and styling
- [ ] Image generation for slides
- [ ] Presentation analytics

---

Built with ❤️ using Next.js, Google Gemini, and Supabase
