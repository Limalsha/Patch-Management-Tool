# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Server(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    ip_address = db.Column(db.String(50))
    os_type = db.Column(db.String(50))
    status = db.Column(db.String(10))  # online/offline
    last_sync = db.Column(db.DateTime)

class Patch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    package_name = db.Column(db.String(150))
    severity = db.Column(db.String(20))
    status = db.Column(db.String(20))  # pending/applied
    server_id = db.Column(db.Integer, db.ForeignKey('server.id'))

class PatchActivity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    total_patches = db.Column(db.Integer)
    critical_patches = db.Column(db.Integer)

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(255))
    server_name = db.Column(db.String(100))
    activity_type = db.Column(db.String(20))  # success/info/warning
    created_at = db.Column(db.DateTime)
