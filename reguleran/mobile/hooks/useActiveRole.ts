import { useRoleStore } from '../stores/useRoleStore'

export function useActiveRole() {
  const role = useRoleStore((s) => s.role)
  return role
}
