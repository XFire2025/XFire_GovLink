# GovLink

GovLink is a Next.js-based web application designed to streamline government-related services for users. It provides a user-friendly interface for citizens, agents, and administrators to interact with various functionalities such as booking, chat, profile management, and system configuration.

## Project Overview

GovLink aims to bridge the gap between citizens and government services by offering a centralized platform for:

- Booking appointments and services.
- Real-time chat with agents and bots.
- Profile and document verification.
- Administrative system configuration and user management.

## Folder Structure

```
├── app/
│   ├── admin/                # Admin-specific pages and layouts
│   ├── agent/                # Agent-specific pages and layouts
│   ├── User/                 # User-specific pages and functionalities
│   ├── favicon.ico           # Favicon for the application
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main entry page
│   └── providers.tsx         # Providers for context and state management
├── components/
│   ├── Header.tsx            # Header component
│   ├── SelectField.tsx       # Custom select field component
│   ├── ThemeProvider.tsx     # Theme provider for dark/light mode
│   ├── ThemeToggle.tsx       # Theme toggle button
│   ├── adminSystem/          # Admin-specific components
│   ├── agent/                # Agent-specific components
│   └── Icons/                # Icon components
├── lib/
│   └── utils.ts              # Utility functions
├── public/
│   ├── Assets like images, SVGs, and GIFs
├── styles/
│   └── Tailwind and other style configurations
├── deploy/
│   ├── govlink.service       # Systemd service file for deployment
│   ├── start-app.sh          # Script to start the application
│   └── validate-deployment.sh # Script to validate deployment
```

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Deployment**: Netlify
- **Icons**: Custom SVGs and React components

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/XFire2025/govlink.git
   ```

2. Navigate to the project directory:

   ```bash
   cd govlink
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Deployment

GovLink is deployed using Netlify. The deployment status for each branch is as follows:

- **Main Branch**:
  [![Netlify Status](https://api.netlify.com/api/v1/badges/c64faf7b-b410-4c26-82fa-ac50e5b38da1/deploy-status)](https://app.netlify.com/projects/govlink25/deploys)

- **Dev Branch**:
  [![Netlify Status](https://api.netlify.com/api/v1/badges/399ab7d0-ba49-474d-b44b-a5637bfb2d1b/deploy-status)](https://app.netlify.com/projects/govlinkdev/deploys)

## How to Contribute

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your message here"
   ```

4. Push to your branch:

   ```bash
   git push origin feature-name
   ```

5. Open a pull request on GitHub.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## CodeRabit
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/XFire2025/govlink?utm_source=oss&utm_medium=github&utm_campaign=XFire2025%2Fgovlink&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

## RAG Application
GovLink is integrated with a Retrieval-Augmented Generation (RAG) application that enhances the user experience by providing intelligent responses and data retrieval capabilities. This integration allows users to interact with the system more effectively, leveraging AI to assist in various tasks.