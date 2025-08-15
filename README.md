# Portfolio's David

This is my portfolio. You can check it on the website https://david200197.github.io/david-portafolio/en

## Scripts

- **Format**: `npm run format`
  - Runs Prettier to format the code within the `src` directory.

- **Lint**: `npm run lint`
  - Executes ESLint to analyze and ensure code quality in `.ts` and `.tsx` files within the `src` folder.

- **Develop**: `npm run dev`
  - Starts the development server using Vite for an efficient development process.

- **Build**: `npm run build`
  - Performs TypeScript checks without emitting files and builds the application using Vite.

- **Analyze**: `npm run analyze`
  - Analyzes the build output by setting the `ANALYZE` environment variable to `true` and executing the build script.

- **Serve**: `npm run serve`
  - Serves the built application using preview feature.

- **Package Only Install**: `npm run package-only-install`
  - Installs dependencies and generates a `package-lock.json` file without modifying `node_modules`.

- **Create CV**: `npm run tool:create-cv`
  - Updates the CV using a script located in `scripts/create-cv.mjs`.
