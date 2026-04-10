<div align="center">
  <h1 align="center">10GPA</h1>

  
  <p align="center">
    <strong>Your Complete Study Companion for B.Tech Excellence</strong>
    <br />
    Complete syllabus coverage, curated video lectures, comprehensive practice tests, and decade-old previous papers
    <br />
    <br />
    <a href="https://www.10gpa.in/" target="_blank"><strong>Visit Website</strong></a>
    <br />
    <br />
    <a href="https://github.com/codetillsleep/notesapp2.0/issues">Report Bug</a>
    ·
    <a href="https://github.com/codetillsleep/notesapp2.0/issues">Request Feature</a>
  </p>


  <p align="center">
    <a href="https://www.10gpa.in/" target="_blank">
      <img src="https://img.shields.io/badge/website-10gpa.in-indigo?style=for-the-badge&logo=web&logoColor=white" alt="Website" />
    </a>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

---

## Overview

**10GPA** is a comprehensive educational platform designed for B.Tech students in the CSAM (Computer Science & Applied Mathematics) and CYBER (Cyber Security & Forensics) branches at GGSIPU. The platform provides organized access to study materials, previous year questions, video lectures, and exam resources.

### Key Features

- **Complete Syllabus Coverage** - Comprehensive coverage of all topics organized by semester and subject
- **Video Library** - Curated collection of expert lectures and tutorials from verified sources
- **Question Banks** - Extensive collection of practice questions aligned with university exam patterns
- **Mock Tests** - Full-length practice tests simulating real exam conditions
- **Previous Year Papers** - Decade-long archive of solved previous year examination papers
- **Branch-Specific Resources** - Dedicated materials for CSAM and CYBER specializations

---

## Problem Statement

While numerous educational resources exist for GGSIPU students, emerging branches such as CSAM and CYBER often lack dedicated, organized study materials. Students frequently face challenges in locating reliable, curriculum-specific resources, leading to inefficient exam preparation.

## Solution

10GPA addresses these challenges by providing:

- Centralized repository of authenticated study materials
- Curriculum-aligned content organization
- No pirated or unauthorized content
- User-friendly interface for quick resource access
- Regular updates aligned with university syllabus changes

---

## Preview

<div align="center">
  <img width="100%" alt="10GPA Platform Interface" src="https://github.com/user-attachments/assets/c7dffd35-7170-4cf9-b8e1-a9cc1f46bba0" />
  <p><em>Modern, intuitive interface designed for efficient learning</em></p>
</div>

---


## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework for server-side rendering and static generation |
| TypeScript | 5.x | Type-safe JavaScript development |
| MongoDB | Atlas | Cloud-based NoSQL database for content management |
| Node.js | 20.x | JavaScript runtime environment |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Express.js | 4.x | Backend API framework |

---

## Getting Started

### Prerequisites

- Node.js (version 18.0 or higher)
- npm (version 9.0 or higher) or yarn
- Git version control system
- MongoDB Atlas account (free tier available)

### Installation Steps

**1. Clone the repository**

```bash
# Using SSH (recommended for contributors)
git clone git@github.com:codetillsleep/notesapp2.0.git

# Or using HTTPS
git clone https://github.com/codetillsleep/notesapp2.0.git
```

**2. Navigate to project directory**

```bash
cd notesapp2.0
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in the root directory with the following configuration:

```env
MONGODB_URI=

NEXTAUTH_SECRET= 
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=   
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

**5. Start development server**

```bash
npm run dev
```

**6. Access the application**

Open your browser and navigate to `http://localhost:3000`

---

## Project Structure

```
10gpa/
├── app/
│   ├── api/                 # API route handlers
│   ├── components/          # Reusable React components
│   ├── constants/           # Application constants and configuration
│   ├── (routes)/           # Next.js page routes
│   └── layout.tsx          # Root layout component
├── public/                  # Static assets (images, fonts, etc.)
├── styles/                  # Global CSS and Tailwind configuration
├── lib/                     # Utility functions and helpers
├── .env.local              # Environment variables (create this file)
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## Development Guidelines

### Code Standards

- Follow TypeScript strict mode guidelines
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages following conventional commits
- Maintain component modularity and reusability

### Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

---

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## Deployment

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## Support and Contact

For bug reports, feature requests, or general inquiries:

- **Issue Tracker**: [GitHub Issues](https://github.com/codetillsleep/notesapp2.0/issues)
- **Discussions**: [GitHub Discussions](https://github.com/codetillsleep/notesapp2.0/discussions)

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

<div align="center">
  <p>
    <strong>Developed by students, for students</strong>
  </p>
  <p>
    <a href="https://www.10gpa.in/">Website</a> •
    <a href="https://github.com/codetillsleep/notesapp2.0">GitHub Repository</a>
  </p>
  <br>
  <sub>If this project has been helpful, please consider starring the repository</sub>
</div>
