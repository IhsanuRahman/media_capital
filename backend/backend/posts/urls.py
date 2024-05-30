from django.urls import include, path
from . import views
urlpatterns =[
    path('posts/create',views.create_post),
    path('posts',views.get_posts),
    path('posts/own',views.get_own_posts),
    path('posts/get',views.get_post),
    path('posts/comment/add',views.add_comment),
    path('posts/comment-reply/add',views.comment_reply),
    path('posts/rate/add',views.add_rate),
]