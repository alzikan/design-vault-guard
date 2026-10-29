import { test, expect } from 'bun:test';
import { isRecoveryCallback, resetRedirectUrl, passwordValidation } from './password-recovery';

test('email callback always uses the requesting origin and public reset route', () => {
  expect(resetRedirectUrl('https://mobile.alzakan.net')).toBe('https://mobile.alzakan.net/reset-password');
  expect(resetRedirectUrl('http://localhost:8080')).toBe('http://localhost:8080/reset-password');
});
test('recovery callbacks are distinguished from ordinary sign-in', () => {
  expect(isRecoveryCallback('#type=recovery', '')).toBe(true);
  expect(isRecoveryCallback('', '?type=recovery')).toBe(true);
  expect(isRecoveryCallback('#type=signup', '')).toBe(false);
});
test('mismatched passwords cannot be submitted', () => {
  expect(passwordValidation('example-one', 'example-two')).toBe('auth.passwordMismatch');
  expect(passwordValidation('example-one', 'example-one')).toBeNull();
});
test('existing six-character minimum is preserved', () => {
  expect(passwordValidation('12345', '12345')).toBe('auth.passwordTooShort');
  expect(passwordValidation('123456', '123456')).toBeNull();
});