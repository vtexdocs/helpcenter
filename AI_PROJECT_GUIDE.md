# AI Project Guide: Help Center

## 1. Project Overview

*   **Project Name**: Help Center
*   **Purpose**: This project is the official VTEX Help Center. It serves as a comprehensive resource for users, providing documentation, guides, API references, announcements, FAQs, and support information related to the VTEX platform and its products.
*   **Live Site Context**: This is a documentation and informational website.

## 2. Technologies Used

*   **Frontend Framework**: Next.js (with React)
*   **Language**: TypeScript
*   **Styling**: CSS Modules (inferred from Next.js conventions and `src/styles/`), global CSS (`src/styles/global.css`). The `@vtex/brand-ui` dependency may also provide UI components and styling.
*   **State Management**: Likely React's Context API and local component state. No dedicated global state management library (like Redux or Zustand) is apparent in `package.json`.
*   **Linting & Formatting**:
    *   ESLint (`lint.enabled` in `trunk.yaml`)
    *   Prettier (`lint.enabled` in `trunk.yaml`)
    *   markdownlint (`lint.enabled` in `trunk.yaml`)
    *   shellcheck, shfmt, taplo, yamllint (from `trunk.yaml`)
    *   Managed via Trunk.io (see `.trunk/trunk.yaml`)
*   **Testing**:
    *   End-to-End (E2E): Cypress (`cypress.config.mjs`)
    *   Unit/Integration: (Likely Jest or React Testing Library, check `package.json` and `src/tests/`)
*   **Deployment**: Netlify (`netlify.toml`)
*   **Search Integration**: Algolia (see `algolia/` directory)
*   **Package Manager**: Yarn (inferred from `yarn-error.log` and `package.json` `engines` field)
*   **Markdown Processing**: `next-mdx-remote` and `@code-hike/mdx` are used, indicating MDX is supported for rich content.

## 3. Key Directories and Files

### 3.1. Root Directory

*   `.trunk/trunk.yaml`: Configuration for Trunk.io, which manages linters, formatters, and other development tools.
*   `algolia/`: Contains configuration and scripts for Algolia search integration.
    *   `scraper_md.json`: Configuration for the Algolia scraper, likely targeting Markdown content.
    *   `scripts/scraper.sh`: Shell script to run the Algolia scraper.
*   `public/`: Static assets accessible directly via the webserver.
    *   `favicon.ico`, `robots.txt`, `sitemap.xml`: Standard web metadata files.
    *   `images/`: Contains all static image assets used throughout the site.
    *   `landing_page_announcements.json`, `navigation.json`: JSON data files, likely used to populate dynamic sections of the site (e.g., landing page, navigation menus).
    *   `rapidoc/`: Assets for RapiDoc, used for rendering API documentation.
*   `scripts/`: Project-specific utility scripts.
*   `src/`: Contains the core source code of the application.
*   `CHANGELOG.md`: Tracks changes and versions of the project.
*   `commitlint.config.js`: Configuration for `commitlint`, enforcing conventional commit messages.
*   `cypress.config.mjs`: Configuration file for Cypress E2E tests.
*   `netlify.toml`: Configuration for deploying the site on Netlify.
*   `next-env.d.ts`: TypeScript declaration file for Next.js environment variables.
*   `next-sitemap.config.js`: Configuration for `next-sitemap` to generate sitemaps.
*   `next.config.js`: Main configuration file for the Next.js application.
*   `package.json`: Lists project dependencies, scripts (build, dev, test, lint), and other metadata.
*   `README.md`: General information about the project (likely for human developers).
*   `tsconfig.json`: TypeScript compiler configuration.
*   `yarn.lock` (expected, though `yarn-error.log` is present): Yarn lock file for deterministic dependency installation.

### 3.2. `src/` Directory

*   `components/`: Contains reusable React components, likely organized by feature or UI element. This is a crucial directory for UI development.
    *   Subdirectories like `announcement-bar/`, `article-pagination/`, `header/`, `footer/` indicate a modular component structure.
*   `lib/`: Utility functions, helper modules, or configurations for external libraries.
*   `messages/`: Internationalization (i18n) files. Contains JSON files for different languages (e.g., `en.json`, `es.json`, `pt.json`) for site localization.
*   `pages/`: Defines the application's routes. Each file/directory here corresponds to a URL path.
    *   `_app.tsx`: Custom Next.js App component, used for global layout, context providers, etc.
    *   `404.tsx`, `500.tsx`: Custom error pages.
    *   `index.tsx`: The homepage of the Help Center.
    *   Subdirectories like `announcements/`, `api/`, `docs/`, `editor/`, `faq/` represent different sections of the website.
*   `styles/`: Global stylesheets, theme configurations, or style-related utilities.
*   `tests/`: Contains test files, likely for unit and integration tests (e.g., using Jest, React Testing Library).
*   `utils/`: General utility functions and helper modules used across the application.

## 4. Content Management

*   **Markdown/MDX**: A significant portion of the content (especially documentation articles, FAQs, troubleshooting guides, and announcements) is fetched from the `vtexdocs/help-center-content` GitHub repository.
    *   Files are fetched as raw Markdown/MDX from `https://raw.githubusercontent.com/vtexdocs/help-center-content/` (typically the `main` branch, or a preview branch).
    *   This is evident in various `getStaticProps` and `getServerSideProps` functions within the `src/pages/` directory (e.g., `src/pages/docs/tutorials/[slug].tsx`, `src/pages/faq/[slug].tsx`, `src/pages/troubleshooting/[slug].tsx`, `src/pages/announcements/[slug].tsx`, `src/pages/known-issues/[slug].tsx`).
    *   The `src/utils/getGithubFile.ts` utility, using an authenticated Octokit instance, is also used for fetching file content and contributor information from this repository.
    *   The content is then processed by `next-mdx-remote` and `@code-hike/mdx`.
    *   The Algolia scraper configuration (`algolia/scraper_md.json`) also targets this externally hosted content.
*   **Pages using `getServerSideProps` and their runtime paths**:
    *   `src/pages/docs/tracks/[slug].tsx` corresponds to the runtime path `/docs/tracks/[slug]`.
    *   `src/pages/editor/sidebar.tsx` corresponds to the runtime path `/editor/sidebar`.
    *   `src/pages/docs/tutorials/[slug].tsx` corresponds to the runtime path `/docs/tutorials/[slug]`.
*   **JSON Data**: Dynamic content for elements like navigation (`public/navigation.json`) and landing page announcements (`public/landing_page_announcements.json`) is managed via local JSON files in the `public/` directory (e.g., `public/landing_page_announcements.json`, `public/navigation.json`).
*   **API Documentation**: RapiDoc (`public/rapidoc/`) is used, suggesting API specifications (e.g., OpenAPI/Swagger files) are either bundled or fetched to render API docs.

## 5. Development Workflow & Guidelines for AI Coders

*   **Understand Next.js**: Familiarity with Next.js conventions (pages router, API routes, data fetching methods like `getStaticProps`, `getServerSideProps`) is essential.
*   **Component-Based Architecture**: Leverage existing components in `src/components/` whenever possible. Create new reusable components if needed, following the existing structure.
*   **Routing**: New pages or sections should be added under `src/pages/`.
*   **Internationalization (i18n)**: For any user-facing text, ensure it's added to the JSON files in `src/messages/` and referenced appropriately in the code for translation.
*   **Static Assets**: Place new static assets (images, fonts) in the `public/` directory.
*   **Dependencies**: Use `yarn add <package>` or `yarn add --dev <package>` to add new dependencies.
*   **Linting and Formatting**:
    *   Run `yarn lint` and `yarn format` (or equivalent scripts in `package.json`) before committing.
    *   Trunk.io tools (configured in `.trunk/trunk.yaml`) will likely run on commit or push, ensuring code quality. Address any issues reported.
*   **Commit Messages**: Follow conventional commit message format as enforced by `commitlint` (see `commitlint.config.js`). Typically, this means commits like `feat: add new feature` or `fix: resolve a bug`.
*   **Testing**:
    *   Write unit/integration tests for new components and logic in `src/tests/`.
    *   Write E2E tests using Cypress for new features or significant UI changes.
*   **Configuration**:
    *   For Next.js specific behavior, check `next.config.js`.
    *   For TypeScript settings, refer to `tsconfig.json`.
    *   For deployment settings, see `netlify.toml`.
*   **API Documentation**: If working with API documentation, understand how RapiDoc is integrated and where the API specification files are located or generated.
*   **Algolia Search**: If changes affect searchable content, ensure the Algolia scraper configuration (`algolia/scraper_md.json`) is still valid or update it if necessary. The scraper script is `algolia/scripts/scraper.sh`. Note that the content indexed by Algolia is primarily sourced from the external `vtexdocs/help-center-content` repository.

## 6. Key Utilities and Practices (`src/utils/`)

*   **Environment Variables**:
    *   `src/utils/config.ts`: Uses `next-plugin-preval` to make environment variables (like `GITHUB_APPID`, `GITHUB_INSTALLATIONID`) available at build time. `GITHUB_PRIVATEKEY` is loaded directly from `github.pem`.
    *   `src/utils/get-variables.ts`: Provides a `getVariable` function to access sensitive variables stored in an encrypted `./sheets-secrets` file. This file is decrypted using an `ENCRYPTION_KEY` environment variable. This is likely used for secrets not suitable for build-time preval.
*   **GitHub Interaction**:
    *   `src/utils/octokitConfig.ts`: Configures an Octokit instance for interacting with the GitHub API. It uses a GitHub App for authentication (App ID, private key, installation ID). Throttling is configured but disabled by default.
    *   `src/utils/getGithubFile.ts`: A utility function to fetch raw file content from a GitHub repository using the configured Octokit instance.
    *   `src/utils/getDocsPaths.ts`, `src/utils/getReleasePaths.ts`, `src/utils/getDocsList.preval.ts`: These utilities likely interact with the GitHub API (via Octokit) to fetch directory trees or lists of files from the `vtexdocs/help-center-content` repository to determine available documentation paths.
*   **Logging**:
    *   `src/utils/logging/log-util.ts`: Implements a `getLogger` utility.
        *   Logs messages to the console with color-coded severity (INFO, ERROR).
        *   For ERROR level logs, it can optionally send messages to a Zapier webhook if `ZAPIER_LOG_HOOK_PATH` environment variable is set.
*   **Content Fetching & Processing (Examples from `src/pages/`)**:
    *   Many page components (e.g., `announcements/[slug].tsx`, `docs/tracks/[slug].tsx`, `faq/[slug].tsx`, `known-issues/[slug].tsx`, `troubleshooting/[slug].tsx`) use `fetch` to get raw Markdown content from `https://raw.githubusercontent.com/vtexdocs/help-center-content/...`.
    *   They then use `next-mdx-remote/serialize` to process this Markdown, often with plugins like `remark-gfm`, `@code-hike/mdx`, `rehype-highlight`, and custom remark plugins found in `src/utils/remark_plugins/`.
    *   File contributors are also often fetched from a GitHub endpoint (`https://github.com/vtexdocs/help-center-content/file-contributors/...`).
*   **Other Utilities**:
    *   `src/utils/get-rapidoc.mjs`: A script to fetch a specific version of `rapidoc-min.js` from GitHub (`vtexdocs/RapiDoc`) and save it to `public/rapidoc/`. This runs as a pre-dev/pre-build step (see `package.json`).
    *   `src/utils/getMessages.tsx`: Likely related to internationalization (i18n), possibly fetching or organizing translation messages.
    *   `src/utils/navigation-utils.ts`: Contains helper functions for sidebar navigation, like `flattenJSON`, `getKeyByValue`, `getParents`.
    *   `src/utils/remark_plugins/`: Contains custom remark plugins for processing Markdown/MDX content (e.g., for handling images, blockquotes, reading time).

## 7. To Investigate Further (for a deeper understanding)

*   **Content Source**: Markdown/MDX content is confirmed to be primarily from the `vtexdocs/help-center-content` GitHub repository.
*   **Styling Details**: Confirm the extent of `@vtex/brand-ui` usage and if any other minor styling solutions are in place.
*   **Data Fetching Strategies**: Confirmed that `getStaticProps` and `getServerSideProps` are heavily used, fetching content primarily from the external GitHub repository via `fetch` or `getGithubFile.ts`. Client-side fetching might be used for dynamic interactions but primary content is server-rendered or statically generated.
*   **`./sheets-secrets`**: Understand the full range of secrets managed by this encrypted file and how they are used throughout the application.

By following these guidelines and understanding the project structure, AI coders should be able to contribute effectively to the Help Center project.
