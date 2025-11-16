from app import app, db, Server, Patch, PatchActivity, Activity
from datetime import datetime, date

with app.app_context():
    db.drop_all()
    db.create_all()

    s1 = Server(name="Server-01", ip_address="10.0.0.1", os_type="Ubuntu", status="online", last_sync=datetime.now())
    s2 = Server(name="Server-02", ip_address="10.0.0.2", os_type="Rocky", status="offline", last_sync=datetime.now())

    db.session.add_all([s1, s2])

    p1 = Patch(package_name="openssl", severity="critical", status="pending", server_id=1)
    p2 = Patch(package_name="nginx", severity="high", status="applied", server_id=2)
    db.session.add_all([p1, p2])

    # 7 days of patch activity
    data = [
        ("2025-10-15", 24, 8), ("2025-10-16", 18, 5),
        ("2025-10-17", 32, 12), ("2025-10-18", 28, 9),
        ("2025-10-19", 15, 4), ("2025-10-20", 22, 7),
        ("2025-10-21", 35, 11)
    ]
    for d, t, c in data:
        db.session.add(PatchActivity(date=date.fromisoformat(d), total_patches=t, critical_patches=c))

    a1 = Activity(action="Patch deployment successful", server_name="Server-01", activity_type="success", created_at=datetime.now())
    a2 = Activity(action="Critical updates available", server_name="Server-02", activity_type="warning", created_at=datetime.now())
    db.session.add_all([a1, a2])

    db.session.commit()
    print("Database seeded successfully ✅")
