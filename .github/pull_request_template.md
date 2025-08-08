# Pull Request

## Summary
- What does this PR change and why?
- Any relevant context or background?

## Area of change
- [ ] Frontend
- [ ] Backend
- [ ] Database
- [ ] DevOps
- [ ] Documentation
- [ ] Other (describe below)

## Type of change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Performance
- [ ] Accessibility
- [ ] Documentation
- [ ] CI/CD / Chore
- [ ] Other (describe below)

If Other, describe:

## Screenshots or recordings (UI changes)
- Add before/after images or a short clip. Note light/dark mode where relevant, if applicable.

## How to test
- Prereqs: Node LTS
- Steps to validate locally:
  1. npm ci
  2. npm run lint
  3. npm run build
  4. npm start
  5. Navigate to affected pages and verify behavior
- Include any mock data, flags, or URLs.

## Acceptance criteria checklist
- [ ] Lint passes locally (npm run lint)
- [ ] Production build succeeds (npm run build)
- [ ] No console errors or TypeScript errors in dev
- [ ] UX reviewed (if UI changes)
- [ ] i18n/text reviewed (if user-facing text)
- [ ] Docs updated where needed (README.md / DEPLOYMENT.md)

## Accessibility checklist (if UI)
- [ ] Keyboard navigation and focus order make sense
- [ ] Sufficient color contrast
- [ ] ARIA roles/labels where appropriate
- [ ] Images/icons have accessible names or alt text

## Security & privacy
- [ ] No secrets committed; uses environment variables
- [ ] No introduction of new PII collection/storage
- [ ] Input validated/sanitized where applicable
- [ ] Third-party deps reviewed (scope minimal)

## Breaking changes
- [ ] Yes (describe migration/rollback)
- [ ] No

If breaking, describe migration steps and rollback plan:

## Deployment notes
- Any special steps or config? Reference DEPLOYMENT.md if needed.
- Service/restart impacts? (see deploy/govlink.service and scripts)

## Additional notes
- Risks, follow-ups, or related issues/PRs.
