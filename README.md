🚀 Admin-Controlled Portfolio Website

A modern, dynamic, and admin-aware portfolio website built using React and TypeScript.
This project goes beyond a static portfolio by introducing secure, role-based interactivity while remaining fully frontend-driven and production-safe.

✨ Key Features
🔄 Auto-Synced GitHub Projects

Public repositories are fetched dynamically using the GitHub API

Ensures the portfolio always reflects the latest public work

🔒 Private Project Support (Admin Only)

Manually add private or confidential projects

Hidden from visitors

Fully manageable by the portfolio owner

🛡️ Admin Mode with Secure Access

Admin features are protected using a secret-key-based admin mode

Visitors cannot add, edit, or delete any content

Admin state is isolated to the owner’s browser (localStorage)

🧠 Dynamic Skills Management

Static core skills remain unchanged

Admin can:

Add new skill categories

Add new skills to existing categories

All updates persist locally without a backend

🎨 Clean UI & Architecture

Clear separation between static and dynamic data

Role-based UI rendering (Admin vs Visitor)

Dark-mode friendly interface

Smooth animations using Framer Motion

While AI tools assisted in early UI exploration, the system architecture, state management, persistence logic, and admin controls were manually designed and implemented.

🧩 Tech Stack

Frontend: React, TypeScript

Styling: Tailwind CSS

Animations: Framer Motion

Icons: Lucide Icons

State & Storage: React Hooks + localStorage

API: GitHub REST API
