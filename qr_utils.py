import uuid

def generate_qr_token(prefix: str):
    return f"{prefix}-{uuid.uuid4()}"
