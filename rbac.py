def has_role(user, role_name: str):
    return any(r.role_id and role_name for r in user.roles)
