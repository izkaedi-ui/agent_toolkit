# Production Reality Checklist

Use this checklist before any production deployment claim.

## Pre-deploy
- [ ] All tests pass on CI
- [ ] No critical/high severity vulnerabilities (`npm audit`)
- [ ] Environment variables documented and validated at startup
- [ ] Error boundaries/handlers in place
- [ ] Logging configured for production

## Performance
- [ ] LCP < 2.5s on representative hardware (evidence required)
- [ ] TTI < 5s on representative hardware (evidence required)
- [ ] Bundle size within defined budget

## Accessibility
- [ ] Automated a11y scan passes (axe-core or equivalent)
- [ ] Keyboard navigation tested
- [ ] Screen reader tested on at least one platform

## Security
- [ ] No secrets in source
- [ ] CSP headers defined
- [ ] Input validation on all user-facing fields

> No claim may exceed evidence.
