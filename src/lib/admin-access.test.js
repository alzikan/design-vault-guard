import { test, expect } from 'bun:test';
import { canManageUserAccess } from './admin-access';

test('a signed-in administrator cannot change their own access', () => {
  expect(canManageUserAccess('admin-1', 'admin-1')).toBe(false);
});
test('a signed-in administrator can manage another account', () => {
  expect(canManageUserAccess('admin-1', 'user-2')).toBe(true);
});
test('access changes are blocked before the signed-in account is known', () => {
  expect(canManageUserAccess(undefined, 'user-2')).toBe(false);
});