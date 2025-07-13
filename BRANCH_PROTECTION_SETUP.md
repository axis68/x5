# Branch Protection Setup Guide

This guide explains how to configure the `main` branch as a protected branch with required tests and approvals.

## Steps to Configure Branch Protection

### 1. Navigate to Repository Settings

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Branches**

### 2. Add Branch Protection Rule

1. Click **Add rule** button
2. In **Branch name pattern**, enter: `main`

### 3. Configure Protection Settings

Enable the following options:

#### Required Settings:

- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals** (set to 1 required approval)
  - ✅ **Dismiss stale reviews when new commits are pushed**
  - ✅ **Require review from code owners** (if you have CODEOWNERS file)

#### Status Checks:

- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**
- ✅ **Status checks that are required:**
  - Search for and select: `test` (this matches our GitHub Action job name)

#### Additional Protections:

- ✅ **Require conversation resolution before merging**
- ✅ **Include administrators** (applies rules to admins too)

### 4. Save the Rule

Click **Create** to save the branch protection rule.

## What This Achieves

After setup, the following workflow will be enforced:

1. **No Direct Pushes**: Nobody can push directly to `main` branch
2. **Pull Request Required**: All changes must go through a Pull Request
3. **Tests Must Pass**: The `test` GitHub Action must pass before merging
4. **Approval Required**: At least 1 approval is needed before merging
5. **Up-to-Date Branch**: Branch must be updated with latest `main` before merging

## Workflow for Developers

```bash
# 1. Create a feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push to GitHub
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
# 5. Wait for tests to pass (automatic via GitHub Actions)
# 6. Request review and approval
# 7. Merge after approval and passing tests
```

## GitHub Actions Integration

Our repository is already configured with the following workflows:

- **`.github/workflows/test.yml`**: Runs unit tests on all branches except `main`
- **`.github/workflows/deploy.yml`**: Deploys to GitHub Pages from `main` branch

The branch protection will automatically use the `test` workflow as a required status check.
