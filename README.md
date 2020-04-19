## Pre-requisites
1. Install [Git](https://git-scm.com/downloads).
2. Install [Node.js](https://nodejs.org/en/download). LTS (long term support) version will suffice.

## Getting started
1. Clone repository:
* HTTPS: `git clone https://github.com/anthonyelewo/webxploits.git`
* SSH (recommended): `git@github.com:anthonyelewo/webxploits.git`
2. Install project dependencies:
```
npm install
```
Following __devDependencies__ (`npm install --save-dev`) will be installed:
* [eslint](https://www.npmjs.com/package/eslint)
* [husky](https://www.npmjs.com/package/husky)

## Configuration
* __.eslintrc__ file contains ESLint rules.
* __.gitattributes__ file is used for normalising line endings.
* __.gitignore__ file contains a list of directories and files to be excluded from version-control.
* __.huskyrc.json__ file is a Git hook which ensures all code passes linting before any commits to the repository can be made.

## Terminal commands
Following terminal commands can be utilised from within the __tealium__ directory (`/example/path/to/tealium`):
* `npm run lint`
* `npm run lintfix`

## Updating code and committing changes
1. Navigate to the __tealium__ directory: `cd /example/path/to/tealium/`
2. Switch to the __master__ branch: `git checkout master`
3. Download updates from the remote repository: `git pull`
4. Create a new branch with a unique name (e.g. Jira ticket ID): `git checkout -b Draft-001`
5. Code :neckbeard:
6. Add changes to the local repository: `git add .`
7. Commit changes to the local repository with appropriate comments: `git commit -am "I'm Batman! The commit without parents :("`
8. Upload changes to the remote repository: `git push origin -f Draft-01`
9. Visit https://github.com/anthonyelewo/webxploits/pulls and create a pull request (PR)
10. Ensure changes are reviewed and tested