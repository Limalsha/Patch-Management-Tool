# db_config.py
import pymysql

def get_connection():
    connection = pymysql.connect(
        host="localhost",
        user="root",        # default XAMPP MySQL username
        password="",        # leave empty if no password set in phpMyAdmin
        database="patch-management-tool",  # your DB name
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection
