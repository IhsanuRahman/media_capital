import datetime
import random
import uuid
from django.core.mail import send_mail

from api.models import OTP, TempUser


def otp_generator(user,email=None):
    otp=random.randint(100000,999999)
#    user=TempUser.objects.get(id=user.id)
    otpObj=OTP(otp=otp,otp_datetime=datetime.datetime.now(),id=uuid.uuid4())
    user.stored_time=datetime.datetime.now()
#    user.save()
    if email:
        send_mail(
        "verify media capital account",
        f"your account is created and your verification code is {otp}.and note the link only valid until 3 minutes",
        "mediacapital.webservice@gmail.com",
        [email]
        )
        print(email)

    print(otp)
    return otpObj

def otp_resender(otpObj,email):
    otp=random.randint(100000,999999)
    otpObj.otp=otp
    if email :
        send_mail(
        "verify media capital account",
        f"your account is created and your verification code is {otp}.and note the link only valid until 3 minutes",
        "mediacapital.official@gmail.com",
        [email]
        )
        print(email)
    otpObj.otp_datetime=datetime.datetime.now()
    return otpObj

def otp_verify(request,otp):

    if request.session['otp']==otp:
        return True
    return False