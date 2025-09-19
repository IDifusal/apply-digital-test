# Branch Protection Rules

To ensure code quality and prevent issues, configure the following branch protection rules for the `main` branch:

## Required Settings

### General Protection Rules
- ✅ Require a pull request before merging
- ✅ Require approvals: **1**
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require review from code owners (if CODEOWNERS file exists)

### Status Checks
Require the following status checks to pass before merging:

#### Required Checks
- ✅ `test / Run Tests and Linting`
- ✅ `validate / Validate Pull Request`
- ✅ `test-and-lint / Test and Lint (20.x)`
- ✅ `e2e-tests / E2E Tests`
- ✅ `security-scan / Security Scan`

#### Additional Options
- ✅ Require branches to be up to date before merging
- ✅ Require status checks to pass
- ✅ Require conversation resolution before merging

### Administrative Settings
- ✅ Restrict pushes that create files larger than 100MB
- ✅ Include administrators in restrictions
- ✅ Allow force pushes: **Disabled**
- ✅ Allow deletions: **Disabled**

## GitHub CLI Setup (Optional)

You can configure these rules using GitHub CLI:

```bash
# Enable branch protection
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["test / Run Tests and Linting","validate / Validate Pull Request"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null
```

## Automated Quality Gates

The CI/CD pipeline enforces:

1. **Code Quality**
   - ESLint must pass
   - Code formatting must be consistent
   - No TypeScript errors

2. **Test Coverage**
   - Minimum 30% test coverage required
   - All unit tests must pass
   - E2E tests must pass

3. **Security**
   - Dependency vulnerability scanning
   - No high/critical vulnerabilities allowed

4. **Build Verification**
   - Application must build successfully
   - No build errors or warnings

These rules ensure that only high-quality, tested code reaches the main branch.
