# Contributing Guide

## Getting Started

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Create a feature branch: `git checkout -b feat/your-feature`

## Development Workflow

```bash
# Start development server
pnpm run start:dev

# Run tests
pnpm run test

# Run tests with coverage
pnpm run test:cov

# Run linter
pnpm run lint

# Build application
pnpm run build
```

## Commit Guidelines

This project uses [Conventional Commits](https://conventionalcommits.org/). 

### Quick Start

Use the interactive commit tool:

```bash
pnpm run commit
```

This will guide you through creating a proper commit message.

### Manual Format

```bash
git commit -m "type(scope): description"
```

**Examples:**
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve memory leak in product service"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for auth service"
git commit -m "chore: update dependencies"
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

## Pull Request Process

1. **Create Feature Branch**: `git checkout -b feat/your-feature`
2. **Make Changes**: Follow coding standards
3. **Write Tests**: Ensure ≥30% coverage
4. **Commit Changes**: Use conventional commits
5. **Push Branch**: `git push origin feat/your-feature`
6. **Create PR**: Against `main` branch

## Code Quality Standards

- ✅ **ESLint**: Code must pass linting
- ✅ **Tests**: Minimum 30% test coverage required
- ✅ **Build**: Code must build successfully
- ✅ **Conventional Commits**: All commits must follow format

## Automated Checks

All PRs automatically run:

1. **Linting**: ESLint validation
2. **Testing**: Unit tests with coverage check
3. **Build**: Application build verification
4. **Commit Validation**: Conventional commit format check

PRs cannot be merged if any checks fail.

## Local Validation

Before pushing, run:

```bash
# Check linting
pnpm run lint

# Run tests with coverage
pnpm run test:cov

# Validate last commit message
pnpm run commitlint

# Build check
pnpm run build
```

## Need Help?

- Check existing issues and PRs
- Review documentation in `.github/` folder
- Follow conventional commit examples
- Use `pnpm run commit` for guided commits
