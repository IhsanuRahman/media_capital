import datetime
import random
import uuid
from django.core.mail import send_mail

from api.models import OTP, TempUser


def otp_generator(request,user,email=None):
    otp=random.randint(100000,999999)
    user=TempUser.objects.get(id=user.id)
    otpObj=OTP(otp=otp,otp_datetime=datetime.datetime.now(),temp_user=user,id=uuid.uuid4())
    user.stored_time=datetime.datetime.now()
    user.save()
    if user:
        if email is None:
            email=user.email
        send_mail(
        "verify media capital account",
        f"your account is created and your verification code is {otp}.and note the link only valid until 3 minutes",
        "mediacapital.webservice@gmail.com",
        [email]
        )
        print(email)
    otpObj.save()

    print(otp)
    return otpObj.id

def otp_resender(otpObj,email=None):
    otp=random.randint(100000,999999)
    otpObj.otp=otp
    user=otpObj.temp_user
    if user:
        if email is None:
            email=user.email
        send_mail(
        "verify media capital account",
        f"your account is created and your verification code is {otp}.and note the link only valid until 3 minutes",
        "mediacapital.official@gmail.com",
        [email]
        )
        print(email)
    otpObj.otp_datetime=datetime.datetime.now()
    otpObj.save()

def otp_verify(request,otp):

    if request.session['otp']==otp:
        return True
    return False