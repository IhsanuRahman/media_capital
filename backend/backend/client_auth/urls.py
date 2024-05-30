
from django.urls import include, path
from . import views
from rest_framework_simplejwt import views as jwt_views
urlpatterns =[
    path('login',jwt_views.TokenObtainPairView.as_view()),
    path('token/refresh', jwt_views.TokenRefreshView.as_view()),
    path('token/verify', jwt_views.TokenVerifyView.as_view()),
    path('signup',views.signup),
    path('user',views.get_user),
    path('logout',views.logout),
    path('forgot-password',views.forgot_password),
    path('forgot-password/verify',views.verify_with_email),
    path('forgot-password/verify-resend',views.fp_resend_otp),
    path('forgot-password/change',views.fp_change_password),
    path('otp/send',views.verify_otp),
    path('otp/resend',views.resend_otp),
]