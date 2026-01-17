def has_role(user, role_name: str):
    return any(ur.role.name == role_name for ur in user.roles)
