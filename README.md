# Advance Next Template (BETA)

`ADVICE: this template is in maintenance mode.`

A Next.js template with advanced configuration and pre-set best practices for rapid project development. Ideal for scalable web applications with modern features.

![Next.js](https://img.shields.io/badge/Next.js-13.5.4-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=flat&logo=typescript)

## Features

- **Next.js 13+**: App Router and latest features.
- **TypeScript**: Static typing for robust code.
- **Tailwind CSS**: Utility-first CSS framework.
- **ESLint & Prettier**: Code quality and formatting.
- **Environment Variables**: Pre-configured setup.
- **Hot Reload**: Fast development experience.
- **Modular Structure**: Organized and scalable.

## Prerequisites

- Node.js ≥ 18.0
- npm ≥ 9.0 (recommended) or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/David200197/advance-next-template.git
   cd advance-next-template
   ```


2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   - Duplicate `.env.example` and rename to `.env.local`
   - Update variables as needed:
     ```env
     NEXT_PUBLIC_API_URL=YOUR_API_URL
     NEXT_PUBLIC_APP_NAME=YOUR_APP_NAME
     ```

## Available Scripts

- **Development**:

  ```bash
  npm run dev
  # or
  yarn dev
  ```

  Runs the app at `http://localhost:3000`.

- **Production Build**:

  ```bash
  npm run build
  # or
  yarn build
  ```

- **Start Production Server**:

  ```bash
  npm start
  # or
  yarn start
  ```

- **Linting**:

  ```bash
  npm run lint
  # or
  yarn lint
  ```

- **Prettier Formatting**:
  ```bash
  npm run format
  # or
  yarn format
  ```

## Project Structure

```
advance-next-template/
├── app/               # App Router directory
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable components
│   ├── styles/        # Global CSS/Tailwind config
│   └── types/         # TypeScript types
├── .eslintrc.json     # ESLint config
├── .prettierrc        # Prettier config
├── next.config.js     # Next.js config
└── tsconfig.json      # TypeScript config
```

## Technologies

- **Next.js**: Framework foundation
- **React**: UI library
- **TypeScript**: Static typing
- **Tailwind CSS**: Styling
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

**Happy coding!** 🚀

```

This README includes:
- Clear installation instructions
- Environment setup guide
- Script explanations
- Project structure visualization
- Technology badges
- Concise feature list

Let me know if you'd like to adjust any sections!
```
