import requests
from django.conf import settings


def send_brevo_email(to_email, subject, message):

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    payload = {
        "sender": {
            "name": "TECH NEW SOFTWARES",
            "email": "technewsoftwares@gmail.com"
        },
        "to": [
            {
                "email": to_email
            }
        ],
        "subject": subject,
        "htmlContent": f"""
        <html>
        <body>
        <h2>{subject}</h2>
        <p>{message}</p>
        </body>
        </html>
        """
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload,
    )

    print(response.status_code)
    print(response.text)

    response.raise_for_status()
