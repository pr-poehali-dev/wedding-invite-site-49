import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Сохраняет анкету гостя в базу данных"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    if event.get("httpMethod") == "GET":
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, attending, guests_count, drinks, song, dietary, created_at "
            "FROM t_p76259693_wedding_invite_site_.guests ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        data = [
            {
                "id": r[0],
                "name": r[1],
                "attending": r[2],
                "guests_count": r[3],
                "drinks": r[4],
                "song": r[5],
                "dietary": r[6],
                "created_at": str(r[7]),
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": headers, "body": json.dumps(data, ensure_ascii=False)}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    attending = body.get("attending", "").strip()

    if not name or not attending:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Имя и ответ обязательны"}, ensure_ascii=False),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO t_p76259693_wedding_invite_site_.guests (name, attending, guests_count, drinks, song, dietary) "
        "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
        (
            name,
            attending,
            int(body.get("guests_count", 1)),
            body.get("drinks", ""),
            body.get("song", ""),
            body.get("dietary", ""),
        ),
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": True, "id": new_id}, ensure_ascii=False),
    }
