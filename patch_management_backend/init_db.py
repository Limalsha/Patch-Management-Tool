from app import app, db

if __name__ == "__main__":
    with app.app_context():
        print("🔄 Initializing MySQL database...")
        try:
            db.create_all()
            print("✅ Tables created successfully in MySQL database.")
        except Exception as e:
            print("❌ Error creating tables:")
            print(e)