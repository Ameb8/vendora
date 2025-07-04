import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os
from .models import Order
from .models import PhoneAlert, EmailAlert

def email_credentials():
    load_dotenv()
    return os.getenv('EMAIL_ADDRESS'), os.getenv('EMAIL_PASSWORD')

def get_message(order):
    message = []
    address = order.shipping_address

    message.append(f"An order totalling ${order.total_amount} has been placed")
    message.append("Shipping adress:")
    message.append(f"{address.street_address}")
    message.append(f"{address.city}, {address.state} {address.postal_code}")
    message.append(f"{address.country}")

    return "\n".join(message)

def notify_order(order):
    address, password = email_credentials()
    phone_alert(order, address, password)
    email_alert(order, address, password)
    track_order(order, address, password)

def email_alert(order, address, password):
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(address, password)
            emails = EmailAlert.objects.filter(tenant=order.tenant).values_list('email', flat=True)

            for recipient in emails:
                msg = EmailMessage()
                msg['Subject'] = 'Hello from Django'
                msg['From'] = address
                msg['To'] = recipient
                msg.set_content(get_message(order))

                smtp.send_message(msg)
    except Exception as e:
        print(f'Error sending email alert: {e}')

def phone_alert(order, address, password):
    # Carrier domain lookup table
    CARRIER_GATEWAYS = {
        "att": "@txt.att.net",
        "verizon": "@vtext.com",
        "tmobile": "@tmomail.net",
        "sprint": "@messaging.sprintpcs.com",
        "boost": "@myboostmobile.com"
    }

    phones = PhoneAlert.objects.filter(tenant=order.tenant)

    for phone in phones:
        to_email = f"{phone.number}{CARRIER_GATEWAYS[phone.carrier]}"
        msg = EmailMessage()
        msg.set_content(get_message(order))
        msg['Subject'] = "Order Notification"
        msg['From'] = address
        msg['To'] = to_email

        try:
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login(address, password)
                smtp.send_message(msg)
        except Exception as e:
            print(f'Error sending phone alert: {e}')

def get_tracking_msg(order):
    msg = []

    msg.append("Thank you for your purchase!\n\n")
    msg.append(f"View your order at https://woolandwicker.vercel.app/shipment/{order.order_code}/")

    return ("").join(msg)

def track_order(order, address, password):
    if order.email:
        msg = EmailMessage()
        msg.set_content(get_tracking_msg(order))
        msg['Subject'] = "Order Placed"
        msg['From'] = address
        msg['To'] = order.email

        try: # Send message
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login(address, password)
                smtp.send_message(msg)
        except Exception as e:
            print(f'Error sending Email: {e}')