# Phase 03: Auth UI Polish

## Context
- **Plan:** [84tea Phase 02 Completion](../plan.md)
- **Goal:** Improve the Authentication UI/UX to match the premium brand feel and ensure smooth user flows.

## Requirements

### UX Improvements
- **Loading States:** Clear visual feedback during async operations (OTP sending, Google login).
- **Error Handling:** Friendly error messages instead of raw Supabase errors.
- **Registration:** Explicit flow or clear indication that "Login = Register" for OTP/Google.
- **Profile Completion:** After first login, prompt for Name/Phone if missing.

### UI Polish (MD3 Standards)
- Ensure Modal fits mobile screens perfectly (responsive width/padding).
- Use correct Typography tokens (`headline-small` for titles, `body-medium` for inputs).
- Align colors with `Imperial Green` (#1b5e20) theme.

## Implementation Steps

### 1. Refactor `auth-modal.tsx`
- [ ] Review current implementation (found in `src/components/auth/auth-modal.tsx`).
- [ ] Update `isSubmitting` state to handle all interaction phases.
- [ ] Improve Error Alert UI (use `Alert` component if available, or style standard div with MD3 error tokens).
- [ ] Check Responsive styles: `className="sm:max-w-[400px]"` is good, but check mobile padding.

### 2. Implement Profile Completion Check
- **Context:** `auth-context.tsx` already fetches profile.
- [ ] In `AuthModal` or a new `OnboardingModal`:
    - Check if `profile.full_name` is empty after login.
    - If empty, show form to update Name and Phone.
    - Use `updateProfile` function from context (need to expose it if not available).

### 3. Add Email Verification Instructions
- [ ] When OTP is sent, show a clear, nicely formatted success view replacing the form.
- [ ] "Check your email" instruction with an icon.
- [ ] "Resend code" timer/button (optional but good).

### 4. Component Updates
- **`src/components/auth/auth-modal.tsx`**:
    - Add `ProfileSetupStep` component (internal or separate).
    - Improve `SuccessView` for OTP.

## Todo List
- [ ] Extract `AuthForm` into smaller components if it grows too large.
- [ ] Add `updateProfile` to `AuthContext` return values.
- [ ] Style the "Check Email" state with a clear illustration or icon.
- [ ] Test Auth Flow on Mobile view.

## Success Criteria
- [ ] Login flow feels fast and responsive.
- [ ] Errors are readable and helpful.
- [ ] New users are prompted to complete their profile (Name/Phone).
- [ ] UI matches 84tea brand guidelines (Imperial Green, etc.).
