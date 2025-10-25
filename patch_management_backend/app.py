from flask import Flask, jsonify, request
from flask_cors import CORS
from db_config import get_connection  # Make sure this returns a MySQL connection

app = Flask(__name__)
CORS(app)


# ==========================================================
# 🧩 DASHBOARD ENDPOINT
# ==========================================================
@app.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # --- Basic stats ---
        cursor.execute("SELECT COUNT(*) AS total FROM servers")
        total_servers = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS online FROM servers WHERE status='online'")
        online_servers = cursor.fetchone()["online"]

        cursor.execute("SELECT COUNT(*) AS offline FROM servers WHERE status='offline'")
        offline_servers = cursor.fetchone()["offline"]

        cursor.execute("SELECT SUM(pending_updates) AS pending FROM servers")
        pending_patches = cursor.fetchone()["pending"] or 0

        cursor.execute("SELECT MAX(last_check_in) AS last_sync FROM servers")
        last_sync = cursor.fetchone()["last_sync"]

        # --- Patch activity (sample) ---
        patch_activity = [
            {"date": "Oct 15", "patches": 24, "critical": 8},
            {"date": "Oct 16", "patches": 18, "critical": 5},
            {"date": "Oct 17", "patches": 32, "critical": 12},
            {"date": "Oct 18", "patches": 28, "critical": 9},
            {"date": "Oct 19", "patches": 15, "critical": 4},
            {"date": "Oct 20", "patches": 22, "critical": 7},
            {"date": "Oct 21", "patches": 35, "critical": 11},
        ]

        # --- Recent activities (optional table: activities) ---
        try:
            cursor.execute("""
                SELECT action, server_name AS server, activity_type AS type,
                       DATE_FORMAT(created_at, '%H:%i') AS time
                FROM activities
                ORDER BY created_at DESC
                LIMIT 6
            """)
            recent_activities = cursor.fetchall()
        except Exception:
            # fallback data
            recent_activities = [
                {"action": "Security patches deployed", "server": "Server-01", "type": "success", "time": "5m ago"},
                {"action": "Agent sync completed", "server": "Server-03", "type": "info", "time": "12m ago"},
                {"action": "Critical updates available", "server": "Server-05", "type": "warning", "time": "23m ago"},
                {"action": "Patch deployment successful", "server": "Server-02", "type": "success", "time": "1h ago"},
                {"action": "New agent connected", "server": "Server-08", "type": "info", "time": "2h ago"},
                {"action": "Scheduled scan completed", "server": "Server-04", "type": "success", "time": "3h ago"},
            ]

        return jsonify({
            "total_servers": total_servers or 0,
            "online_servers": online_servers or 0,
            "offline_servers": offline_servers or 0,
            "pending_patches": pending_patches or 0,
            "critical_patches": sum(i["critical"] for i in patch_activity),
            "last_sync": str(last_sync) if last_sync else "N/A",
            "patch_activity": patch_activity,
            "recent_activities": recent_activities
        })

    except Exception as e:
        print("Dashboard Error:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


# ==========================================================
# 🧩 SERVER MANAGEMENT ENDPOINTS
# ==========================================================

# 🔹 GET ALL SERVERS
@app.route("/api/servers", methods=["GET"])
def get_servers():
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM servers ORDER BY id ASC")
        servers = cursor.fetchall()
        return jsonify(servers)
    except Exception as e:
        print("Error fetching servers:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


# 🔹 GET SINGLE SERVER BY ID
@app.route("/api/servers/<int:server_id>", methods=["GET"])
def get_server(server_id):
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM servers WHERE id=%s", (server_id,))
        server = cursor.fetchone()
        if not server:
            return jsonify({"message": "Server not found"}), 404
        return jsonify(server)
    except Exception as e:
        print("Error fetching server:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


# 🔹 ADD NEW SERVER
@app.route("/api/servers", methods=["POST"])
def add_server():
    data = request.get_json()
    required = ["name", "ip_address", "os_type"]

    if not all(k in data and data[k] for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO servers 
            (name, ip_address, os_type, kernel_version, agent_version, status, last_check_in, description, auth_token, uptime, pending_updates)
            VALUES (%s, %s, %s, 'N/A', 'N/A', 'offline', NOW(), %s, %s, '0 days', 0)
        """, (
            data["name"],
            data["ip_address"],
            data["os_type"],
            data.get("description", ""),
            data.get("auth_token", "")
        ))

        connection.commit()
        return jsonify({"message": "Server added successfully"}), 201

    except Exception as e:
        print("Error adding server:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


# 🔹 UPDATE SERVER
@app.route("/api/servers/<int:server_id>", methods=["PUT"])
def update_server(server_id):
    data = request.get_json()
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE servers 
            SET name=%s, ip_address=%s, os_type=%s, description=%s, status=%s, pending_updates=%s 
            WHERE id=%s
        """, (
            data["name"],
            data["ip_address"],
            data["os_type"],
            data.get("description", ""),
            data.get("status", "offline"),
            data.get("pending_updates", 0),
            server_id
        ))

        connection.commit()
        return jsonify({"message": "Server updated successfully"})
    except Exception as e:
        print("Error updating server:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


# 🔹 DELETE SERVER
@app.route("/api/servers/<int:server_id>", methods=["DELETE"])
def delete_server(server_id):
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM servers WHERE id=%s", (server_id,))
        connection.commit()
        return jsonify({"message": "Server deleted successfully"})
    except Exception as e:
        print("Error deleting server:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()

# ==========================================================
# 🧩 PATCH MANAGEMENT ENDPOINTS
# ==========================================================

# 🔹 GET STATS for Patch Page (total, online, offline, pending)
@app.route("/api/patches/stats", methods=["GET"])
def get_patch_stats():
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) AS total FROM servers")
        total_servers = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS online FROM servers WHERE status='online'")
        online = cursor.fetchone()["online"]

        cursor.execute("SELECT COUNT(*) AS offline FROM servers WHERE status='offline'")
        offline = cursor.fetchone()["offline"]

        cursor.execute("SELECT SUM(pending_updates) AS pending FROM servers")
        pending = cursor.fetchone()["pending"] or 0

        return jsonify({
            "total_servers": total_servers or 0,
            "online_servers": online or 0,
            "offline_servers": offline or 0,
            "pending_updates": pending or 0
        })
    except Exception as e:
        print("Patch stats error:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


# 🔹 GET PATCH DETAILS for a given server
@app.route("/api/patches/<int:server_id>", methods=["GET"])
def get_patches_for_server(server_id):
    connection = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT id, package_name AS packageName, current_version AS currentVersion,
                   available_version AS availableVersion, description, severity, status
            FROM patches
            WHERE server_id = %s
        """, (server_id,))
        patches = cursor.fetchall()

        return jsonify({"server_id": server_id, "patches": patches})
    except Exception as e:
        print("Error fetching patch details:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()




# ==========================================================
# 🧩 ROOT CHECK
# ==========================================================
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Patch Management API is running 🚀"})


# ==========================================================
# 🧩 RUN APP
# ==========================================================
if __name__ == "__main__":
    app.run(debug=True)
