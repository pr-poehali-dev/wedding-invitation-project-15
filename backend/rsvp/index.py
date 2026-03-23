"""
RSVP — сохранение ответов гостей свадьбы в БД и отправка уведомления на почту организатора.
"""

import json
import os
import psycopg2

import requests

UNISENDER_GO_API_URL = "https://go2.unisender.ru/ru/transactional/api/v1"
NOTIFY_EMAIL = "bogatkin-2002@mail.ru"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def resp(status: int, body: dict) -> dict:
    return {"statusCode": status, "headers": CORS_HEADERS, "body": json.dumps(body, ensure_ascii=False)}


def send_notification(name: str, attend: str, guests: str, alcohol: list, music: str):
    api_key = os.environ.get("UNISENDER_API_KEY", "")
    sender_email = os.environ.get("UNISENDER_SENDER_EMAIL", "")
    if not api_key or not sender_email:
        return

    attend_text = "✅ Придёт" if attend == "yes" else "❌ Не придёт"
    alcohol_text = ", ".join(alcohol) if alcohol else "—"
    music_text = music if music else "—"
    guests_text = guests if attend == "yes" else "—"

    body_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f0f8ff; border-radius: 12px;">
        <h2 style="color: #2c4a6e; margin-bottom: 16px;">💌 Новый ответ гостя</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 160px;">Имя:</td><td style="padding: 8px 0; color: #2c4a6e; font-weight: bold;">{name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Участие:</td><td style="padding: 8px 0; color: #2c4a6e;">{attend_text}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Гостей:</td><td style="padding: 8px 0; color: #2c4a6e;">{guests_text}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Алкоголь:</td><td style="padding: 8px 0; color: #2c4a6e;">{alcohol_text}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Музыка:</td><td style="padding: 8px 0; color: #2c4a6e;">{music_text}</td></tr>
        </table>
    </div>
    """

    message = {
        "recipients": [{"email": NOTIFY_EMAIL}],
        "from_email": sender_email,
        "from_name": os.environ.get("UNISENDER_SENDER_NAME", "Свадебный сайт"),
        "subject": f"Новый ответ от {name}",
        "body": {"html": body_html},
        "track_links": 0,
        "track_read": 0,
    }

    requests.post(
        f"{UNISENDER_GO_API_URL}/email/send.json",
        headers={"Content-Type": "application/json", "X-API-KEY": api_key},
        json={"message": message},
        timeout=15,
    )


def handler(event: dict, context) -> dict:
    """Сохраняет ответ гостя в БД и отправляет уведомление организатору."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 204, "headers": CORS_HEADERS, "body": ""}

    if event.get("httpMethod") != "POST":
        return resp(405, {"error": "Method not allowed"})

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return resp(400, {"error": "Invalid JSON"})

    name = (body.get("name") or "").strip()
    attend = (body.get("attend") or "").strip()
    guests = (body.get("guests") or "1").strip()
    alcohol = body.get("alcohol") or []
    music = (body.get("music") or "").strip()

    if not name:
        return resp(400, {"error": "Имя обязательно"})
    if attend not in ("yes", "no"):
        return resp(400, {"error": "Укажите участие"})

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO rsvp_responses (name, attend, guests, alcohol, music) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (name, attend, guests if attend == "yes" else None, alcohol if attend == "yes" else [], music if attend == "yes" else None),
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    send_notification(name, attend, guests, alcohol if attend == "yes" else [], music if attend == "yes" else "")

    return resp(200, {"success": True, "id": row[0]})
