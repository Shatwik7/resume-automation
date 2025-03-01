
# Resume Builder

## Overview

Resume Builder is a web application that allows users to generate professional resumes by analyzing their GitHub repositories and leveraging AI to create content. The generated resume is uploaded to AWS S3 and made accessible via a unique link. Additionally, users can edit, create, and upload custom resume templates via the web interface.

## System Architecture
![diagram-export-3-1-2025-8_03_04-PM](https://github.com/user-attachments/assets/fa5fd455-a735-45aa-9905-5de3b5ca48cf)


The system consists of the following key components:

- Frontend: Web interfaces for interacting with the resume builder.
- Backend (Deno & TypeScript): Handles resume generation, template management, and user requests.
- Database (MongoDB & Redis): Stores user profiles and resumes.
- GitHub Integration: Fetches user repositories and analyzes skills & projects.
- ChatGPT API & Gemini API: Generates AI-assisted resume content.
- AWS S3: Stores generated resumes and templates.
- PDF Generation (Puppeteer): Converts resumes into downloadable PDFs.
- Redis Queue: Manages worker jobs efficiently.

## Features

### User Features

- Sign in with GitHub
- Analyze GitHub repositories to extract skills & projects
- Generate AI-powered resume content
- Choose from multiple resume templates
- Edit and customize generated resumes
- Download resume as a PDF
- Get a sharable resume link

### Admin Features

- Upload, edit, and manage resume templates
- View all users and generated resumes
- Manage API rate limits and performance monitoring

## Installation & Setup

### Prerequisites

- Deno
- MongoDB
- Redis
- AWS S3 Bucket
- GitHub API Token
- Gemini API Token

### 1. Clone the Repository

git clone https://github.com/yourusername/resume-builder.git
cd resume-builder

### 2. Install Dependencies

For the API:
deno task install

For the Web Interface:
npm install

### 3. Configure Environment Variables

#### API Environment Variables

-AWS_REGION=""
-AWS_ACCESS_KEY_ID=""
-AWS_SECRET_ACCESS_KEY=""
-AWS_S3_BUCKET="api.incident"
-MONGO_URI="mongodb://localhost:27017/resumeDB"
-SECRET_TOKEN="mypassword"
-WEBHOOK_SECRET="mywebhookSecret"
-SERVER_URL="http://localhost:3000"
-FRONTEND_URL='http://192.168.29.179:5173'

#### Web Interface Environment Variables

-VITE_API_URL="http://192.168.29.179:3000"
-VITE_APP_NAME=ResumeForge

#### Worker Environment Variables

-GITHUB_TOKEN=""
-GEMINI_TOKEN=""
-AWS_REGION=""
-AWS_ACCESS_KEY_ID=""
-AWS_SECRET_ACCESS_KEY=""
-AWS_S3_BUCKET=""
-WEBHOOK_SECRET="mywebhookSecret"

### 4. Run the Application

run the redis on port 6379

For the API:
deno run dev

For the worker:
deno run dev

For the Web Interface:
npm run dev

The server will start at http://localhost:3000 and the web interface at http://192.168.29.179:5173.
