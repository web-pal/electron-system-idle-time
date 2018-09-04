# electron-system-idle-time

Jump to:

- [Git flow](#git-flow)
  * [Commit message](#commit-message)
  * [Contributing git instruction](#contributing-git-instruction)

## Git flow
We use [Vincent Driessen's branching model.](http://nvie.com/posts/a-successful-git-branching-model/)

Read details here:
- http://nvie.com/posts/a-successful-git-branching-model/
- http://danielkummer.github.io/git-flow-cheatsheet/

To make the git flow experience smoother you can use **custom git commands**(regular shell scripts) -
[git-flow](https://github.com/petervanderdoes/gitflow-avh)

- **[Installation instruction](https://github.com/petervanderdoes/gitflow-avh/wiki/Installing-on-Mac-OS-X)**
- **[git-flow commands](https://github.com/petervanderdoes/gitflow-avh/wiki#reference)**

[Setup](https://github.com/petervanderdoes/gitflow-avh#initialization) a git repository
for **git-flow** usage(store **git-flow** config in .git/config):
```sh
git flow init -d
```

### Commit message
We use [conventional commits specification](https://conventionalcommits.org/) for commit messages.

#### Commitizen
To ensure that all commit messages are formatted correctly, you can use
[Commitizen](http://commitizen.github.io/cz-cli/) cli tool.
It provides interactive interface that creates your commit messages for you.

```sh
sudo npm install -g commitizen cz-customizable
```

From now on, instead of `git commit` you type `git cz` and let the tool do the work for you.

The following commit types are used on the project:
- **feat** - A new feature
- **fix**- A bug fix
- **improvement** - Improve a current implementation without adding a new feature or fixing a bug
- **docs** - Documentation only changes
- **style** - Changes that do not affect the meaning of the code(white-space, formatting, missing semi-colons, etc)
- **refactor** - A code change that neither fixes a bug nor adds a feature
- **perf** - A code change that improves performance
- **test** - Adding missing tests
- **chore** - Changes to the build process or auxiliary tools and libraries such as documentation generation
- **revert** - Revert to a commit
- **WIP** - Work in progress

You should strive for a clear informative commit message.
Read **[How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)**.

**Helpful hint**: You can always edit your last commit message, before pushing, by using:
```sh
git commit --amend
```

### Contributing git instruction
When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Instruction below is intended for the internal usage, if you are an external contributor then
just clone the repo and create a PR.

After cloning the repo, initialize the local repository with gitflow(if you use it):
```sh
git flow init -d
```

When starting work on a new issue, branch off from the develop branch.
```sh
git checkout -b feature/<feature> develop
# git-flow:
git flow feature start <feature>
```
If your feature/bug/whatever have an **github issue** then use issue id as a feature name.
For instance:
```sh
git checkout -b feature/1 develop
# git-flow:
git flow feature start 1
```
Which mean you start working on #1 issue(/issues/1 regarding the repo).

Then, do work and commit your changes.
```sh
git push origin feature/<fature>
# git-flow:
git flow feature publish <feature>
```
When done, open a pull request to your feature branch.

If you have a permit to close the feature yourself:
```sh
git checkout develop
# Switched to branch 'develop'
git merge --no-ff feature/<feature>
# Use --no-ff to avoid losing information about the historical existence of a feature branch
git branch -d feature<fature>
# Deleted branch
git push origin develop
```

Same with **git-flow**:
```sh
git flow feature finish
```

## Preparing a good PR
- A pull request should have a specific goal and have a descriptive title.
Do not put multiple unrelated changes in a single pull request
- Do not include any changes that are irrelevant to the goal of the pull request.
This includes refactoring or reformatting unrelated code and changing or adding auxiliary files
(.gitignore, etc.) in a way that is not related to your main changes.
- Make logical, not historical commits. Before you submit your work for review, you should rebase
your branch (**git rebase -i**) and regroup your changes into logical commits.
Logical commits achieve different parts of the pull request goal.
Each commit should have a descriptive commit message.
Logical commits within a single pull request rarely overlap in the lines of code they touch.
- If you want to amend your pull request, rewrite the branch and force-push it instead of
adding new (historical) commits or creating a new pull request.
