def update_trust_score(current_score, transaction_status):
    if transaction_status == "success":
        current_score += 2
    else:
        current_score -= 5

    current_score = max(0, min(100, current_score))

    if current_score < 40:
        tier = "Weak"
    elif current_score < 70:
        tier = "Normal"
    else:
        tier = "Good"

    return current_score, tier
