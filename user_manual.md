# PowerMyPoint User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Creating Presentations](#creating-presentations)
4. [Viewing & Editing Presentations](#viewing--editing-presentations)
5. [Permissions & Collaboration](#permissions--collaboration)
6. [Exporting Presentations](#exporting-presentations)
7. [Experimental Mode](#experimental-mode)
8. [Account & Settings](#account--settings)
9. [Tips & Best Practices](#tips--best-practices)

---

## Introduction

PowerMyPoint is an AI-powered presentation creation platform that generates beautiful, professional presentations from simple text prompts. Using advanced AI technology, it creates visually stunning slides with custom layouts, images, and styling.

### Key Features
- **AI-Powered Generation**: Create presentations from text descriptions
- **Beautiful Design**: Modern, professional layouts with Tailwind CSS styling
- **Real-time Streaming**: Watch your presentation build slide-by-slide
- **Multiple Export Formats**: Download as PPTX or custom .pmp format
- **Collaborative Features**: Share presentations publicly or keep them private

---

## Getting Started

### 1. Sign Up / Login
1. Navigate to the homepage
2. Click **"Sign Up"** or **"Login"** in the navigation bar
3. Enter your email and password
4. Verify your account if required

### 2. Dashboard Overview
After logging in, you'll see three main sections:
- **My Work**: Your personal presentations
- **Explore**: Public presentations from all users
- **Trending**: Popular presentations sorted by likes

---

## Creating Presentations

### Basic Creation

1. **Navigate to Explore Page**
   - Click "Explore" in the sidebar

2. **Enter Your Prompt**
   - Type a description of your presentation
   - Example: *"Create a presentation about climate change"*
   - Be specific for better results

3. **AI Model Selection** (Optional)
   - ☑️ **Use ChatGPT for better planning**: Enabled by default if you have `OPENAI_API_KEY` configured
   - Uses ChatGPT for outline generation, then Gemini for slide creation
   - Unchecked: Uses only Gemini for entire generation

4. **Click "Create"**
   - The system will generate your presentation
   - You'll see a streaming preview as slides are created
   - Progress updates show: Planning → Generating slides → Validating images → Complete


### Generation Tips
- **Be Specific**: "Create a presentation about renewable energy with focus on solar and wind power"
- **Specify Slide Count**: "Create a 10-slide presentation about..."
- **Include Visual Hints**: "...with images of nature and wildlife"
- **Technical Topics**: For programming/technical topics, the AI will include code examples
- **Math/Science**: For mathematical topics, the AI will include equations

---

## Viewing & Editing Presentations

### Viewing Presentations

1. **Open a Presentation**
   - Click on any presentation card
   - Or navigate to `/presentations/[id]`

2. **Navigation Controls**
   - **Arrow Keys**: Navigate between slides
   - **Left/Right Buttons**: Click to change slides
   - **Fullscreen Button**: Expand to fullscreen mode
   - **Close Button**: Return to previous page

3. **Fullscreen Mode**
   - Click the fullscreen icon (⛶)
   - Press `ESC` or click minimize icon to exit
   - Perfect for presentations and demos

### Editing Presentations

**Note**: Only presentation owners can edit their presentations.

1. **Click "Edit" Button**
   - Available on presentation detail page
   - Only visible if you own the presentation

2. **Edit Mode Features**
   - **Title & Description**: Update presentation metadata
   - **Slide Content**: Click on text to edit directly
   - **Visual Editor**: Select elements to modify
   - **DSL Mode**: View/edit raw DSL code

3. **Save Changes**
   - Click **"Save"** button
   - Changes are saved to database
   - Redirects to presentation view

### Deleting Presentations

**Note**: Only presentation owners can delete their presentations.

1. Click **"Delete"** button on presentation card or detail page
2. Confirm deletion in popup dialog
3. Presentation is permanently removed

---

## Permissions & Collaboration

### Ownership-Based Permissions

**As a Presentation Owner:**
- ✅ View your presentation
- ✅ Edit content and metadata
- ✅ Delete presentation
- ✅ Export to PPTX or .pmp
- ❌ Cannot like your own presentation

**As a Viewer (Non-Owner):**
- ✅ View public presentations
- ✅ Like presentations
- ✅ Export presentations (if public)
- ❌ Cannot edit
- ❌ Cannot delete
- ❌ Cannot like your own presentations

### Liking Presentations

1. **View a Presentation** (that you don't own)
2. **Click the "Like" Button**
   - Button shows heart icon
   - Changes to "Liked" when active
   - Like count updates in real-time


### Public vs Private Presentations

- **Public Presentations**: Visible in Explore and Trending pages
- **Private Presentations**: Only visible to owner (requires tier upgrade)
- Default: All presentations are public

---

## Exporting Presentations

### Export as PPTX (PowerPoint)

1. **Open Presentation Detail Page**
2. **Click "Export as PPTX" Button** (📥 icon)
3. **Wait for Processing**
   - Each slide is rendered as a high-quality image
   - Images are embedded in PPTX file
   - Download starts automatically

**PPTX Export Features:**
- ✅ Exact visual copy of rendered presentation
- ✅ Preserves all Tailwind styles, gradients, layouts
- ✅ 1920x1080 resolution (16:9 aspect ratio)
- ⚠️ Text is not editable (embedded as images)
- ⚠️ Larger file size than text-based PPTX

### Export as .pmp (Custom Format)

1. **Open Presentation Detail Page**
2. **Click "Export" Button**
3. **Download .pmp File**
   - Contains raw DSL code
   - Can be imported back into PowerMyPoint
   - Smaller file size
   - Preserves full editability

---

## Experimental Mode

### What is Experimental Mode?

Experimental Mode enables advanced Reveal.js features for presentations, including:
- **Slide Transitions**: Fade, slide, zoom, convex, concave
- **Fragment Animations**: Progressive reveals
- **Code Highlighting**: Syntax-highlighted code blocks
- **Math Equations**: LaTeX equation rendering
- **Auto-Animations**: Smooth element transitions
- **Speaker Notes**: Hidden notes for presenters

### Enabling Experimental Mode

1. **Navigate to Settings** (⚙️ icon in sidebar)
2. **Toggle "Experimental Mode"**
3. **Create New Presentation**
   - AI will generate Reveal.js-compatible slides
   - Includes transitions, fragments, and advanced features

### Experimental Mode Features

**When Creating:**
- AI generates slides with varied transitions
- Includes progressive reveals (fragments)
- Adds code blocks for technical topics
- Includes math equations for scientific topics
- Uses professional Lucide icons (no emojis)

**When Viewing:**
- Uses Reveal.js viewer instead of standard viewer
- Supports keyboard shortcuts (Space, Arrow keys)
- Fullscreen presentation mode
- Fragment-by-fragment reveals

### Best Practices for Experimental Mode
- Use for technical presentations with code
- Use for scientific presentations with equations
- Use for presentations requiring dynamic transitions
- Not recommended for simple, static presentations

---

## Account & Settings

### Accessing Settings

1. Click **Settings** (⚙️) in sidebar
2. View and update your preferences

### Available Settings

**Experimental Mode**
- Toggle Reveal.js features on/off
- Affects new presentation generation
- Does not affect existing presentations

**Account Information**
- View your email
- View account creation date
- View tier information

### Tier System

**Free Tier:**
- ✅ Unlimited public presentations
- ✅ AI generation with Gemini
- ✅ Export to PPTX and .pmp
- ❌ No private presentations
- ❌ No priority support

**Premium Tier** (Future):
- ✅ All Free features
- ✅ Private presentations
- ✅ Priority generation queue
- ✅ Advanced customization
- ✅ Priority support

---

## Tips & Best Practices

### Writing Effective Prompts

**Good Prompts:**
- ✅ "Create a 7-slide presentation about renewable energy, focusing on solar and wind power with statistics"
- ✅ "Make a technical presentation about React hooks with code examples"
- ✅ "Create a business presentation about marketing strategies for startups"

**Avoid:**
- ❌ "Make a presentation" (too vague)
- ❌ "Slides about stuff" (no context)
- ❌ Single-word prompts

### Optimizing Generation

1. **Use ChatGPT Option**: Better structure and planning
2. **Be Specific**: More details = better results
3. **Specify Slide Count**: "Create a 10-slide presentation..."
4. **Include Visual Hints**: "...with nature images"
5. **Mention Technical Needs**: "...with code examples" or "...with equations"

### Presentation Quality

**For Best Results:**
- Review generated slides before presenting
- Edit any inaccurate content
- Ensure images are relevant and high-quality
- Check text readability (contrast, font size)
- Test in fullscreen mode before presenting

### Performance Tips

1. **Slow Generation?**
   - Check internet connection
   - Try disabling ChatGPT option
   - Reduce slide count in prompt

2. **Export Issues?**
   - Ensure all images have loaded
   - Try refreshing the page
   - Check browser console for errors

3. **Viewing Issues?**
   - Use modern browsers (Chrome, Firefox, Edge)
   - Enable JavaScript
   - Clear browser cache if needed

---

## Keyboard Shortcuts

### Presentation Viewer
- **Arrow Left/Right**: Previous/Next slide
- **Arrow Up/Down**: Previous/Next slide
- **Space**: Next slide
- **Home**: First slide
- **End**: Last slide
- **F**: Toggle fullscreen
- **ESC**: Exit fullscreen

### Experimental Mode (Reveal.js)
- **Space**: Next fragment/slide
- **Shift + Space**: Previous fragment/slide
- **Arrow Keys**: Navigate slides
- **ESC**: Overview mode
- **S**: Speaker notes (if available)

---
