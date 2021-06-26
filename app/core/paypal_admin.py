import requests
import json
from app.core.config import settings

session = requests.Session()


def get_access_token():
    url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"

    payload = 'grant_type=client_credentials'
    headers = {
        'Authorization': f'Basic {settings.PYPL_SECRET}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = session.request("POST", url, headers=headers, data=payload)

    return json.loads(response.text)["access_token"]


def make_payment_to_receiver(receiver_id, trans_id, amount, sender):
    token = get_access_token()
    url = "https://api-m.sandbox.paypal.com/v1/payments/payouts"

    payload = json.dumps({
        "sender_batch_header": {
            "sender_batch_id": trans_id,
            "recipient_type": "EMAIL",
            "email_subject": "Money received",
            "email_message": f"You received a payment from {sender}. Thanks for using our service!"
        },
        "items": [
            {
                "amount": {
                    "value": amount,
                    "currency": "USD"
                },
                "sender_item_id": trans_id,
                "recipient_wallet": "PAYPAL",
                "receiver": receiver_id
            }
        ]
    })
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    try:
        response = session.request("POST", url, headers=headers, data=payload)
        response = json.loads(response.text)
        status = response["batch_header"]["batch_status"]

        if status == "PENDING":
            pass
        else:
            raise Exception()

    except:
        raise Exception("Unknown Error!")
