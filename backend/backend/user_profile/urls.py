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
    # admin
    path('admin/users',views.get_users),
    path('admin/user',views.get_user),
    path('admin/user/edit',views.edit_user),
    path('admin/users/ops',views.users_ops),
    path('admin/user/create',views.create_user),
    path('admin/user/ban',views.ban_user),
    path('admin/user/unban',views.unban_user),
    
]