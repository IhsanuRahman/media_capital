from django.urls import include, path
from . import views
urlpatterns =[
    path('profile/edit',views.edit_profile),
    path('profile/user',views.get_userdata),
    path('profile/user/support',views.support),
    path('profile/change-password',views.change_password),
    path('profile/edit-email',views.edit_email),
    path('profile/edit-email/verify',views.email_verify),
    path('profile/edit-email/resend',views.resend_otp),
]