export function isOwner(tenant: Tenant | null): boolean {
  return tenant?.role === "owner";
}

export function isAdminOrOwner(tenant: Tenant | null): boolean {
  return tenant?.role === "owner" || tenant?.role === "admin";
}
