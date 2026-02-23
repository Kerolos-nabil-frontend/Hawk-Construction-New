---
description: How to start both frontend and backend for HAWK Construction
---

To resolve the "Network error" and run the application successfully, you need to have both the backend (ASP.NET) and the frontend (Vite/React) running at the same time.

### 1. Start the Backend (.NET API)
Open a **new terminal** (Command Prompt or PowerShell) and run:
```powershell
cd "f:\reactjs-vite-tailwindcss-boilerplate-main\HAWK-master\HAWK"
dotnet run
```
*Wait until you see the message: `Now listening on: http://localhost:5026`*

### 2. Start the Frontend (Vite)
In your **original terminal** (or another new one), run:
```powershell
cd "f:\reactjs-vite-tailwindcss-boilerplate-main"
npm run dev
```

### 3. Verify Connection
- Open `http://localhost:5173` in your browser.
- Try to sign in again. The frontend will now be able to reach the backend at `http://localhost:5026`.

// turbo
### (Optional) Run both automatically
If you want to start both with a single command, you can run:
```powershell
Start-Process powershell -ArgumentList "cd 'f:\reactjs-vite-tailwindcss-boilerplate-main\HAWK-master\HAWK'; dotnet run" ; npm run dev
```
