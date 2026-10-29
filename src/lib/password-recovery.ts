export function isRecoveryCallback(hash: string, search: string) {
  const fragment = new URLSearchParams(hash.replace(/^#/, ''));
  const query = new URLSearchParams(search);
  return fragment.get('type') === 'recovery' || query.get('type') === 'recovery';
}

export function resetRedirectUrl(origin: string) {
  return `${origin}/reset-password`;
}

export function passwordValidation(password: string, confirmation: string) {
  if (password.length < 6) return 'auth.passwordTooShort';
  if (password !== confirmation) return 'auth.passwordMismatch';
  return null;
}