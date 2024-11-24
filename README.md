# Portfolio's David

This is my portfolio. You can check it on the website https://david200197.github.io/david-portafolio/#BANNER_MARK

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

  - Serves the built application using Vite's preview feature.

- **Pre-deploy**: `npm run predeploy`

  - Runs the build and CV update process before deployment.

- **Deploy**: `npm run deploy`

  - Deploys the `dist` directory to GitHub Pages using `gh-pages`.

- **Only deploy**: `npm run only-deploy`

  - Directly deploys the `dist` directory to GitHub Pages without any pre-processing.

- **Package Only Install**: `npm run package-only-install`

  - Installs dependencies and generates a `package-lock.json` file without modifying `node_modules`.

- **Update CV**: `npm run update-cv`
  - Updates the CV using a TypeScript script located in `scripts/update-cv/script.ts`.
