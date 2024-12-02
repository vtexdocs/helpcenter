# Help Center

## Summary 

- [About](#about)
  - [Objective](#objective)
  - [Concepts and Features](#concepts-and-features)
- [Versioning](#versioning)
- [Tests](#tests)
- [Development](#development)
  - [Project Pattern](#project-pattern)
    - [Directory Tree](#directory-tree)
    - [React Preferences](#react-preferences)
    - [Code Linting and Format](#code-linting-and-format)
  - [Commits](#commits)
    - [How to make a commit](#how-to-make-a-commit)
  - [Branches](#branches)
    - [Feature Branches](#feature-branches)
- [Contributing](#contributing)
  - [How to develop and propose a new contribution](#how-to-develop-and-propose-a-new-contribution)
  - [What to do when someone updated the `main` branch and I'm developing something on my *feature branch*](#what-to-do-when-someone-updated-the-main-branch-and-im-developing-something-on-my-feature-branch)


## About

### Objective
This repository implements the new VTEX Help Center with better navigability, content centralization and search facility to improve merchants experience as they consult our new feature announcements, tutorial articles, troubleshooting guides and other types of documentation.

### Concepts and Features
As the Help Center Portal provides VTEX documentation to users, some of its main features are:
- Multilingual content

  All information present in the Help Center Portal is displayed in three languages ​​(English, Portuguese and Spanish), allowing easy access to the content available on the platform.


- Markdown files rendering

  [Markdown](https://www.markdownguide.org/) is a very popular markup language that helps making plaintext documents more semantic by adding formatting elements defined in its syntax. All documentation available on Help Center is written in markdown language.

## Versioning

The versioning process of this repository was built to automate version releases and standardize its contributions. The following goals are currently implemented:
- Standardize the repository history by adopting a commit messaging convention that makes commits more semantic

  [Commitlint](https://commitlint.js.org/#/) is a tool that lints commit messages according to Conventional Commits. [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), on the other hand, is based on the [SemVer (Semantic-Versioning)](https://semver.org/) standard.

- Automate `CHANGELOG.md` and `package.json` version updates based on semantic commit messages, as well as the creation of new version tags

  [Standard Version](https://github.com/conventional-changelog/standard-version) provides a release script that results in a release commit containing a new version in `package.json` and updates in `CHANGELOG.md`, all based on the changes introduced by the latest semantic commits. It also creates a new version tag.

- Automate new version releases when Pull Requests (PR) are merged into the `main` branch
 
  A GitHub action named **Release Version Workflow** is triggered whenever a PR is merged into the `main` branch. The action workflow contains steps that identify whether the PR should release a new version (and what type) to run the release script, submit its results, and generate a new GitHub Release corresponding to the new version's tag. The type of the new version may be automatically deducted from the semantic commits or determined by the user as a PATCH, MINOR or MAJOR.

```mermaid
flowchart TB
    startState(PR is merged into main) --> setReleaseEnvVar(1. Extract release type from PR labels)
    setReleaseEnvVar(Extract release type from PR labels) --If PR has 'release-auto', 'release-patch', 'release-minor' or 'release-major' label--> releaseVersionScript(Run release script)
    setReleaseEnvVar(Extract release type from PR labels) --If PR has no release label--> setDefaultAutoRelease(Set default auto release)
    setDefaultAutoRelease(Set default auto release) --> releaseVersionScript(Run release script)
    setReleaseEnvVar(Extract release type from PR labels) --If PR has 'release-no' label--> endState(Finish workflow)
    releaseVersionScript(Run release script) --> |Commit changes to CHANGELOG.md and package.json with the new version and create a new version tag| pushReleaseVersionScriptResult(Push script results to the remote repository)
    pushReleaseVersionScriptResult(Push script results to the remote repository) --> createRelease(Create new GitHub Release)
    createRelease(Create new GitHub Release) --> endState(Finish workflow)
```

## Tests

### Performance tests on desktop and mobile devices
  
[Lighthouse](https://github.com/GoogleChrome/lighthouse) is a tool that analyzes web apps and web pages to collect performance metrics and insights on developer best practices. To avoid significant performance drops introduced by Pull Requests, a pair of GitHub actions using [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) are running against PRs to collect the performance metrics of the code with the proposed changes at desktop and mobile devices (a report containing the results is hosted on a URL that is availaible at the end of the actions log).

### Automated tests

[Cypress](https://www.cypress.io/) is an automated testing tool that was added to the repository so pre-defined E2E or unitary tests (inside cypress directory) will be executed whenever a PR is opened.

## Development

1. Clone this repo, access the command line at its root directory and install all dependencies:

```bash
yarn install
```

2. To start the application development server, run:

```bash
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Project Pattern

Help Center is a [Next.js](https://nextjs.org/) app based on [React](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/).

#### Directory tree

The diagram below represents the base structure defined to organize the files and folders of the repository, where all file names must follow the kebab-case convention.

```mermaid
flowchart TB
    helpcenter --> src & public
    src --> messages & components & pages & styles & utils & tests
    messages --> ptJson{{pt.json}} & enJson{{en.json}} & esJson{{es.json}}
    components --> some-component --> stylesCompCss{{styles.component.css}} & compOther{{functions/other.ts}} & compIndex{{indext.tsx}} & compStyle{{styles.ts}}
    pages --> search & pagesLanding{{landing-page}} & announcements & docs & faq & known-issues & troubleshooting
    search --> searchSearchPage{{search-page}}
    announcements --> announcementsIndex{{index}}
    faq --> faqsIndex{{index}}
    know-issues --> knowissuesIndex{{index}}
    troubleshooting --> troubleshootingIndex{{index}}
    docs --> tracks & tutorial
    tracks --> tracksIndex{{index}}
    tutorial --> tutorialIndex{{index}}
    styles --> stylesGlobal{{global.css}}
    tests --> testsChildren{{tests files}}
    utils --> utilsChildren{{Global functions, types and constants}}
```

#### React preferences

- It is preferable to use **arrow functions**
- It is preferable to use **functional components** instead of class components
- It is preferable to use **Hooks** over Higher Order Components (HOCs)

#### Code linting and format

- [ESLint](https://eslint.org/) is used to lint code and identify errors based on a pre-defined ruleset (`.eslintrc.json` file)

    Before any change is committed, a pre-commit hook will run the ESLint on JavaScript and TypeScript files located at pre-defined paths (such as `src/pages`, `src/components` etc) to fix their errors (ignored paths are described in `.eslintignore`).

- [Prettier](https://prettier.io/) is used to standardize the code formatting based on a pre-defined ruleset (`.prettierrc` file)

    Before any change is committed, a pre-commit hook will run Prettier and correct errors found in the appropriate files (ignored paths are included in `.prettierignore`).

You might want to configure ESLint and Prettier in your code editor to see errors and correction suggestions at development time.

### Commits

Within the repository we can consider three types of commit:
- __commits__: default action performed by the user on GitHub
- __merge commits__: commit made action through the command `git merge <branch> --no-ff` (it is also generated when merging a Pull Request without squashing)
- __release commits__: commits made using [Standard Version](https://github.com/conventional-changelog/standard-version) tool

  [Standard Version](https://github.com/conventional-changelog/standard-version) is a tool that simplifies the versioning process of a project. It has a release script that generates a new version tag and creates a __*release commit*__ containing: a new version in `package.json` and updates in `CHANGELOG.md` based on changes introduced by the latest __*commits*__.

#### How to make a commit

- **Step 1.** Stage the desired changes:
  ```bash
  git add <filenames>
  ```
- **Step 2.** Commit your staged files:
  - **Option 1:** Use the [Commitizen](https://github.com/commitizen/cz-cli) script to make your **commit** with an interactive step-by-step via command line that helps generating semantic descriptions that follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) model. Instead of runing `git commit`, run the command below and follow the instructions that will appear:
    ```bash
    yarn cz-commit
    ```
  - **Option 2:** Make your **commit** manually following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) model:
    ```
    <type>[optional scope]: <description>

    [optional body]

    [optional footer(s)]
    ```

    If there are any breaking changes introduced by your changes, follow one of the options:
    - Append a `!` after `<type>[optional scope]`
      ```
      <type>[optional scope]!: <description>

      [optional body]

      [optional footer(s)]
      ```
    - Add `BREAKING CHANGE: < breaking change description>` to the footer
      ```
      <type>[optional scope]: <description>

      [optional body]

      BREAKING CHANGE: <breaking change description>
      ```

    The `<scope>` may specify the context of the applied changes (e.g. subject, component or file name), as well as the `<body>` may help explaning the commit in more details. The `<type>` helps making commit messages more semantic and all options are described in the table below.

    <a href="commit-types-table" id="commit-types-table"></a>
    Commit `<type>` Options | Description | Release*
    -----|-------------|---------------
    `fix` | fixes bugs in your codebase | PATCH
    `feat` | introduces a new feature to the codebase | MINOR
    `docs` | documentation only changes | PATCH
    `style` | changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) | PATCH
    `refactor` | a code change that neither fixes a bug nor adds a feature | PATCH
    `perf` | a code change that improves performance | PATCH
    `test` | adds missing tests or corrects existing tests | PATCH
    `build` | changes that affect the build system or external dependencies (scope examples: gulp, broccoli, npm) | PATCH
    `ci` | changes to CI configuration files and scripts (scope examples: Travis, Circle, BrowserStack, SauceLabs) | PATCH
    `chore` | other changes that don't modify src or test files | PATCH
    `revert` | changes that revert previous commits | PATCH


    __* [SemVer specification says the MAJOR version zero (0.y.z) is for initial development](https://semver.org/#spec-item-4). Because of this, until this repository reaches a first stable version of the Help Center Portal (with a specified major release), the automatic release won't lead to any MAJOR version, but only PATCH and MINOR (breaking changes commits will result in MINOR bumps).__


    **Examples:**
    ```bash
    # Commit message without scope, body, footer or breaking change
    chore: add favicon

    # Commit message with scope
    ci(versioning): add Release-Version GitHub workflow

    # Commit message with scope and breaking change
    feat(api)!: send an email to user when a request is submitted

    # Commit message with breaking change (footer)
    chore: drop support for Node 6

    BREAKING CHANGE: use JavaScript features not available in Node 6.
    ```

  **What *NOT* to do:**
  - Add dot in the end of text. E.g.: `chore: add favicon.`
  - Start with uppercase. E.g.: `feat(api): Send an email to user when a request is submitted`
  - Write in Portuguese. E.g.: `chore: Atualizar a navigation bar`

### Branches

Currently, we have one fixed branch: `main` .

The `main` branch must reflect exactly what is deployed in production, it should be treated as __*the single source of truth*__. It is from `main` where every development branch is created.

>**Important note:** Only *merge commits* should be made by developers on `main` branch.

#### Feature branches

You must create a branch based on `main` to start a feature, improvement, or fix. This branch is called a *feature branch*. It must have the following structure name: `<type>/<description>`
Choose the `type` that best summarizes your contribution at the [Commit Types Table](#commit-types-table).
 
The *feature branch* description must be short and written with kebab-case. It should give a basic understanding of what is being developed on the branch.

E.g.: `git checkout -b feature/landing-page`.

>**Important note:** Only *commits* should be made in a *feature branch*. None *release or merge commits* should be made.

## Contributing

### How to develop and propose a new contribution

- **Step 1.** Create a *feature branch* based on `main` (follow the naming pattern defined at [Feature Branches](#feature-branches) section).
    ```bash
    git checkout main
    git checkout -b feature/nice-new-thing
    ```

- **Step 2.** Develop the contribution in your *feature branch* by making commits (see [How to make a commit](#how-to-make-a-commit) section).

    ```bash
    git add <filenames>
    git commit -m "feat: add nice new thing"
    ```

- **Step 3.** Push your *feature branch* to the remote repository (in the following example represented by the *origin* alias)

    ```bash
    git push origin feature/nice-new-thing
    ```

- **Step 4.** Open a Pull Request (PR), select its reviewers and add it one of the release labels:

    Release Labels | Description | Release Type
    ---------------|-------------|-------------
    `release-no` | When no new version should be released when the PR is merged into the `main` branch | None
    `release-auto` | When the new version to be released should be deducted automatically based on the PR semantic commits when it is merged | [PATCH, MINOR, MAJOR]
    `release-patch` | When the new version should be released as a patch | PATCH
    `release-minor` | When the new version should be released as a minor | MINOR
    `release-major` | When the new version should be released as a major | MAJOR

    >**Important note:** If none of the labels are added, a version release corresponding to `release-auto` will be triggered.

- **Step 5.** Verify if your Pull Request passed all checks that run against opened Pull Requests. In case any of them fails, look for a solution and update your *feature branch*.

    >**Important note:** If your branch has been updated with new commits, you should request new reviews to your PR.

- **Step 6.** When your PR has been approved by reviewers, make sure your feature branch is still rebased on the `main` branch. If it needs to be rebased, run:

    ```bash
    # Bring to local main branch the remote main latest updates
    git checkout main
    git pull origin main

    # Checkout your feature branch and rebase it onto main (solve possible conflicts)
    git checkout feature/new-nice-thing
    git rebase main

    # Force push your rebased feature branch
    git push --force origin feature/new-nice-thing
    ```
    
    Go back to **Step 5**.

    >**Important note:** If your rebase process generated conflicts, new reviews must be requested.

- **Step 7.** After your PR has been rebased onto `main`, passed all checks and been approved by reviewers, click on **Merge Pull Request** option (the one that generates a merge commit). This way all commits from the *feature branch* will be added to the base branch and their semantic messages will be considered to update `CHANGELOG.md` when releasing a new version.

- **Step 8.** The merged PR, if set to release a new version in **Step 4**, will trigger a GitHub action that results in a new commit `chore(release): v*.*.*`, a new version tag and its corresponding GitHub Release (see [Versioning](#versioning) section for more details) - you can verify those changes in the repository initial page after the workflow has finished. Wait for the build in Netlify to end and your released version will be deployed.

- **Step 9.** Celebrate! You have just finished your contribution to the VTEX Help Center Portal repository.

### What to do when someone updated the `main` branch and I'm developing something on my *feature branch*

Make *rebase* of your *feature branch* on `main`:

```bash
# Bring to local main branch the remote main latest updates
git checkout main
git pull origin main

# Checkout your feature branch and rebase it onto main (solve possible conflicts)
git checkout feature/new-nice-thing
git rebase main

# Force push your rebased feature branch
git push --force origin feature/new-nice-thing
```

>**Important note:** Always maintain your *feature branch* rebased on `main`.
