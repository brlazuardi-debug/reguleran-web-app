import useRoleStore from '../stores/roleStore'

export function useActiveRole() {
  const role = useRoleStore((s) => s.role)
  return role
}
