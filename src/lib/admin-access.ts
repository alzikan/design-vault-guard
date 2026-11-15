export function canManageUserAccess(actorId: string | undefined, targetId: string): boolean {
  return Boolean(actorId) && actorId !== targetId;
}