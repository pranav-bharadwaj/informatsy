# Python code to illustrate Sending mail from
# your Gmail account
from decouple import config
import smtplib
from django.conf import settings
from . serializers import *
from django.core.mail import send_mail
# creates SMTP session
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


class MailService:
    def sendMail(reciever, username, urlToken):

        print(urlToken)
        subject = 'welcome to Informatsy'
        email_from = settings.EMAIL_HOST_USER

        topic = "Activate your account"
        message = f'<!DOCTYPE html> <html> <head> <title></title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> </head> <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;"> <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: "Lato", Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We\'re thrilled to have you here! Get ready to dive into your new account. </div> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td bgcolor="#FFA73B" align="center"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td> </tr> </table> </td> </tr> <tr> <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: "Lato", Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;"> <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;"> </td> </tr> </table> </td> </tr> <tr> <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: "Lato", Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"> <p style="margin: 15;">We\'re excited to have you get started. First, you need to confirm your account. Just press the button below.</p> </td> </tr> <tr> <td bgcolor="#ffffff" align="left"> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;"> <table border="0" cellspacing="0" cellpadding="0"> <tr> <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href={config("activationDomain")+str(urlToken)} target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: "Lato", Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"> <p style="margin: 0;">If that doesn\'t work, copy and paste the following link in your browser:</p> </td> </tr> <tr> <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: "Lato", Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"> <p style="margin: 0;"><a href={config("activationDomain")+str(urlToken)} target="_blank" style="color: #FFA73B;">copy link address</a></p> </td> </tr> <tr> <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: "Lato", Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"> <p style="margin: 0;">If you have any questions, just reply to this email—we\'re always happy to help out.</p> </td> </tr> <tr> <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: "Lato", Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"> <p style="margin: 0;">Cheers,<br>Informatsy Team</p> </td> </tr> </table> </td> </tr> <tr> <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: "Lato", Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"> <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2> <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We’re here to help you out</a></p> </td> </tr> </table> </td> </tr> <tr> <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: "Lato", Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br> <p style="margin: 0;">If these emails get annoying, please feel free to <a href="informatsy.in" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p> </td> </tr> </table> </td> </tr> </table> </body> </html>'
        recipient_list = [reciever]
        send_mail(subject, email_from, topic,
                  recipient_list, html_message=message)
        # terminating the sessio

    def sendPasswordResetReq(data):
        try:
            passwordResetLink = f'{config("domain")}forgotPass/passwordReset/?token="{data["token"]}'
            print(passwordResetLink)
            emailto = data['email']
            html_content = render_to_string("passwordresetrequest.html", {
                                            'title': "Password reset request", 'name': data['name'], "passwordResetLink": passwordResetLink})
            text_content = strip_tags(html_content)

            email = EmailMultiAlternatives(
                "Password recovery mail...!",
                text_content,
                "noreply@informatsy.in",
                [emailto],
                bcc=["noreply@informatsy.in"],
                cc=['noreply@informatsy.in']

            )

            email.attach_alternative(html_content, "text/html")

            email.send()
        except Exception as e:
            print(e)
