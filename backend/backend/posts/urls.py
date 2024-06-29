from django.urls import include, path
from . import views
urlpatterns =[
    path('posts/create',views.create_post),
    path('posts',views.get_posts),
    path('posts/recommended',views.get_recommended),
    path('posts/posts_personilized',views.posts_personilized),
    path('posts/top',views.get_top),
    path('posts/own',views.get_own_posts),
    path('posts/get',views.get_post),
    path('posts/saved',views.get_saved_post),
    path('post/save',views.save_post),
    path('post/delete',views.delete_post),
    path('posts/comment/add',views.add_comment),
    path('posts/comment/delete',views.delete_comment),
    path('posts/comment/edit',views.edit_comment),
    path('posts/comment-reply/add',views.comment_reply),
    path('posts/rate/add',views.add_rate),
    path('post/report/add',views.report_post),
    # admin
    path('admin/post/hide',views.hide_post),
    path('admin/reports',views.get_reports),
    path('admin/tags',views.get_tags),
    path('admin/comments',views.get_comments),
    path('admin/report/action',views.take_action),
]