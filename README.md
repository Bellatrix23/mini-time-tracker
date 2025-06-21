# Mini Time Tracker

A lightweight time tracking app built using **React** and **TypeScript** for the Looped Automation technical challenge. This app helps users manage how they spend their time by allowing them to create tasks, track time with a live timer, and view total estimated and actual time worked.

## Features

- Add new time entries with task name and estimated time
- Input validation for missing task name or time
- Start and stop a live timer for active tracking
- Edit or delete existing entries
- Visual countdown with overtime highlighting
- View total estimated time and total time worked
- Fully responsive and clean UI design
- Deployed and accessible online

## Tech Stack

- React with TypeScript
- React Hooks (useState, useEffect)
- Custom CSS (no frameworks)
- Vercel for deployment

## Installation

1. Clone the repo:

```bash
 git clone https://github.com/bellatrix23/mini-time-tracker.git

cd mini-time-tracker
```

2.  Install dependencies:

```bash
npm install
```

3. Start the app locally:

```bash
npm run dev
```

4. Open in your browser
   Navigate to http://localhost:5173 (or the port Vite specifies) to view the app.

## Assumptions & Trade-offs

⏱ Time is handled in seconds behind the scenes for precision.

🧠 Only one task can run at a time (prevents tracking overlap).

💾 No database or persistence layer included to stay within the challenge scope.

✨ The app is structured to easily support future data persistence (e.g., localStorage, Supabase).

## Improvements with More Time

🔒 Add persistent storage (e.g., localStorage or backend)

📊 Display time usage analytics with charts

👥 Support for multiple users and accounts

🌗 Theme toggle (light/dark mode)

🧪 Unit tests and integration tests for form and timer logic

## Challenge Requirements Met

- Built with React and TypeScript

- Time entry form includes task name and hours worked

- Displays list of time entries

- Shows total hours worked

- Input validation (required fields, positive time)

- Clear commit history and component structure

- Deployed to Vercel

- README with setup instructions, assumptions, and improvement notes

## Author

Zoë Bell

Junior FullStack Developer

GitHub: https://github.com/Bellatrix23
