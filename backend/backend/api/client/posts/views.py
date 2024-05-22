
from io import BytesIO
import json
import uuid
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from api.models import Posts, Tags, Comments, UserModel,Ratings
from api.client.posts.serializers import PostsSerilizer
from PIL import Image
from rest_framework import serializers
from django.core.files.base import ContentFile
from django.db.models import Avg

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    print(request.data)
    post = Posts.objects.create(id=uuid.uuid4(),
                                description=request.data['description'],
                                user=request.user)
    im = Image.open(request.data['image'])

    thumb_io = BytesIO()
    im.save(thumb_io, "WEBP", quality=100)
    post.content.save(f'{uuid.uuid4()}.webp', ContentFile(
        thumb_io.getvalue()), save=False)
    tags = request.data.get('tags')
    print(tags)
    tags = json.loads(tags)
    for tag in tags:
        tagObj, created = Tags.objects.get_or_create(name=tag)
        print(tagObj)
        tagObj.save()
        post.tags.add(tagObj)
    post.save()
    return JsonResponse({'message': 'post creation success'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    posts = Posts.objects.all()
    print('posts')
    data = []
    for post in list(Posts.objects.all()):
        print()
        myRate=post.ratings.filter(user__id=request.user.id).first()
        if myRate:
            myRate=myRate.rate
        else:
            myRate=0
        data.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                    'description': post.description,
            'rating':post.rating,'my_rate':myRate, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})

    return JsonResponse({'posts': data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_own_posts(request):
    posts = Posts.objects.filter(user__id=request.user.id)
    print(posts)
    data = []
    for post in list(posts):
        print()

        myRate=post.ratings.filter(user__id=request.user.id).first()
        if myRate:
            myRate=myRate.rate
        else:
            myRate=0
        data.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                    'description': post.description,
            'rating':post.rating,'my_rate':myRate, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})

    return JsonResponse({'posts': data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post(request):
    try:
        post = Posts.objects.get(id=request.query_params['id'])
    except :
        return JsonResponse({'message':'not found'})
    comments = Comments.objects.filter(post__id=post.id)
    commentsFormated = []
    for comment in comments:
        commentsFormated.append(
            {'comment': comment.comment, 'user': comment.user.username, 'profile': comment.user.profile.url})
        print(comment.comment)

    myRate=post.ratings.filter(user__id=request.user.id).first()
    if myRate:
        myRate=myRate.rate
    else:
        myRate=0
    data = {'image': post.content.url,
            'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
            'description': post.description,
            'id': post.id,
            'tags': [tag.name for tag in post.tags.all()],
            'comments':commentsFormated,
            'rating':post.rating,'my_rate':myRate,

            }

    return JsonResponse({'post': data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request):
    post = Posts.objects.get(id=request.data.get('post_id', None))
    if post:
        user = UserModel.objects.get(id=request.user.id)
        comment = request.data.get('comment', None)
        if comment:
            commentObj = Comments(user=user, post=post, comment=comment)
            commentObj.save()
            return JsonResponse({'message': 'comment is added'}, status=201)
    return JsonResponse({'message': 'creadential error'}, status=401)

@api_view(['put'])
@permission_classes([IsAuthenticated])
def add_rate(request):
    rate=request.data.get('rate',None)
    post_id=request.data.get('id',None)
    if rate and post_id:
        post=Posts.objects.get(id=post_id)
        rate=float(rate)
        rateingObj=Ratings.objects.filter(post=post,user=UserModel.objects.get(id=request.user.id))
        if rateingObj:
            rateingObj=rateingObj.first()
        else:
            rateingObj=Ratings(post=post,user=UserModel.objects.get(id=request.user.id))
        rateingObj.rate =rate
        rateingObj.save()
        post.rating=post.ratings.aggregate(Avg('rate'))['rate__avg']
        post.save()
    return JsonResponse({'message':'added rate'})