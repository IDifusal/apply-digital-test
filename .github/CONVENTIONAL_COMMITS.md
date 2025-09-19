# Conventional Commits

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries
- **perf**: A code change that improves performance
- **ci**: Changes to our CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

## Examples

### Good Examples ✅

```bash
feat: add user authentication
fix: resolve memory leak in product service
docs: update API documentation
test: add unit tests for auth service
chore: update dependencies
ci: add commit validation workflow
```

### Bad Examples ❌

```bash
Add feature          # Missing type
FEAT: new feature    # Wrong case
feat: Add feature.   # Wrong case, ends with period
feat:add feature     # Missing space after colon
```

## Tools

### Using Commitizen (Recommended)

Instead of `git commit`, use:

```bash
pnpm run commit
```

This will prompt you with questions to create a properly formatted commit.

### Manual Validation

Check your last commit:

```bash
pnpm run commitlint
```

## Automation

- **GitHub Actions**: All commits in PRs are automatically validated
- **Build Failure**: PRs with invalid commit messages will fail CI
- **Protection**: Invalid commits cannot be merged to main branch

## Rules

1. **Type**: Must be one of the allowed types (lowercase)
2. **Subject**: Must be present and lowercase
3. **Length**: Header must be ≤ 72 characters
4. **Period**: Subject must not end with a period
5. **Case**: Subject must be lowercase

## Benefits

- **Automated Changelog**: Generate changelogs automatically
- **Semantic Versioning**: Determine version bumps automatically
- **Clear History**: Easy to understand project history
- **Team Consistency**: Standardized commit messages across team
