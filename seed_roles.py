from sqlalchemy.orm import Session
from database import SessionLocal
from models import Role, User, UserRole

db: Session = SessionLocal()

# Create roles
role_names = ["OWNER", "EVENT_EDITOR", "CANTEEN_EDITOR"]
roles = {}

for r in role_names:
    role = db.query(Role).filter(Role.name == r).first()
    if not role:
        role = Role(name=r)
        db.add(role)
        db.commit()
    roles[r] = role

# Create OWNER
owner = db.query(User).filter(User.email == "owner@college.edu").first()
if not owner:
    owner = User(
        email="owner@college.edu",
        user_type="owner",
        trust_score=100,
        trust_tier="Good"
    )
    db.add(owner)
    db.commit()

# Assign OWNER role
existing = db.query(UserRole).filter(
    UserRole.user_id == owner.id,
    UserRole.role_id == roles["OWNER"].id
).first()

if not existing:
    db.add(UserRole(user_id=owner.id, role_id=roles["OWNER"].id))
    db.commit()

print("OWNER & roles seeded")
