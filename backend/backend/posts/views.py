from django.core import serializers
from django.contrib.postgres.search import SearchVector
from io import BytesIO
import json
import uuid
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from admin_auth.utils import admin_only
from client_auth.serilizers import UserSerializer
from .serializers import PostsSerilizer, ReplySerilizers, ReportSerilizer, TagsSerilizer,CommentSerilizers
from .models import Reports, Tags
from client_auth.models import UserModel
from .models import Posts, Comments, Ratings, CommentsReply
from PIL import Image
from django.db.models import Q
from django.core.files.base import ContentFile
from django.db.models import Avg
from django.core.paginator import Paginator
from notifications.models import Notifications
from django.db.models import Count,Case, When, Value, IntegerField





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    print(request.data)
    post = Posts(id=uuid.uuid4(),
                                description=request.data['description'],
                                user=request.user)
    im = Image.open(request.data['image'])

    thumb_io = BytesIO()
    print('type:',im.format)
    if (im.format=="GIF" and im.is_animated):
        frames = []
        try:
            while True:
                im.seek(im.tell() + 1)
                frame = im.copy()
                frames.append(frame)
        except EOFError:
            pass

        if frames:
            frames[0].save(thumb_io, format="GIF", save_all=True, append_images=frames[1:], loop=0)
        else:
            im.save(thumb_io, format="GIF", save_all=True)

        post.content.save(f'{uuid.uuid4()}.gif', ContentFile(thumb_io.getvalue()), save=True)
    else:
        im.save(thumb_io, "WEBP", quality=100)
        post.content.save(f'{uuid.uuid4()}.webp', ContentFile(
            thumb_io.getvalue()), save=False)
    tags = request.data.get('tags')
    print(tags)
    tags = json.loads(tags)
    post.save()
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
    objects=None
    if request.user.is_superuser:
        objects = Posts.all.all()
    else:
        objects = Posts.objects.all()
    print('posts')
    page = Paginator(objects, 10)
    n = request.query_params.get('page', 1)
    if int(page.num_pages) < int(n):
        return JsonResponse({'posts': []})
    posts = page.page(n).object_list
    data = []
    for post in list(posts):
        print()
        myRate = post.ratings.filter(user__id=request.user.id).first()
        if myRate:
            myRate = myRate.rate
        else:
            myRate = 0
        comments = Comments.objects.filter(post__id=post.id)
        commentsFormated = []
        for comment in comments:
            replyData = serializers.serialize('json', comment.replys.all())
            fData = []
            for rply in json.loads(replyData):
                print(rply)
                userObj = UserModel.objects.get(id=rply['fields']['user'])
                rply['fields']['user'] = {
                    'id': userObj.id, 'username': userObj.username, 'profile': userObj.profile.url}
                fData.append(rply['fields'])
            commentsFormated.append(
                {'id': comment.id, 'comment': comment.comment, 'posted_at': comment.posted_at.strftime('%Y-%m-%d %H:%M:%S%z'), 'user': comment.user.username, 'user_id': comment.user.id, 'profile': comment.user.profile.url, 'replys': fData})
            print(comment.comment)
        saved = False
        if post.saved_users.filter(id=request.user.id).exists():
            saved = True
        data.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                    'description': post.description,
                     'is_saved': saved,'is_hidded':post.is_hidded,'no_raters':post.ratings.count(),
                     'rating': post.rating, 'my_rate': myRate, 'comments': commentsFormated, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})

    return JsonResponse({'posts': data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_own_posts(request):
    posts = Posts.objects.filter(user__id=request.user.id)
    print(posts)
    data = []
    for post in list(posts):
        print()

        myRate = post.ratings.filter(user__id=request.user.id).first()
        if myRate:
            myRate = myRate.rate
        else:
            myRate = 0
        data.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                    'description': post.description,
                     'rating': post.rating, 'my_rate': myRate, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})

    return JsonResponse({'posts': data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post(request):
    post=None
    try:
        if request.user.is_superuser:
            post =Posts.all.get(id=request.query_params['id'])
        else:
            post = Posts.objects.get(id=request.query_params['id'])
    except:
        return JsonResponse({'message': 'not found'},status=404)
    comments = Comments.objects.filter(post__id=post.id)
    commentsFormated = []
    for comment in comments:
        data = serializers.serialize('json', comment.replys.all())
        fData = []
        for rply in json.loads(data):
            print(rply)
            userObj = UserModel.objects.get(id=rply['fields']['user'])
            rply['fields']['user'] = {
                'id': userObj.id, 'username': userObj.username, 'profile': userObj.profile.url}
            fData.append(rply['fields'])
        commentsFormated.append(
            {'id': comment.id, 'comment': comment.comment, 'posted_at': comment.posted_at.strftime('%Y-%m-%d %H:%M:%S%z'), 'user': comment.user.username, 'user_id': comment.user.id, 'profile': comment.user.profile.url, 'replys': fData})
        print(comment.comment)

    myRate = post.ratings.filter(user__id=request.user.id).first()
    if myRate:
        myRate = myRate.rate
    else:
        myRate = 0
    data = {'image': post.content.url,
            'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
            'description': post.description,
            'id': post.id,
            'tags': [tag.name for tag in post.tags.all()],
            'comments': commentsFormated,
            'rating': post.rating, 'my_rate': myRate,'no_raters':post.ratings.count(),
            'is_saved':post.saved_users.filter(id=request.user.id).exists(),
            'posted_at': post.posted_at.strftime('%Y-%m-%d %H:%M:%S%z')
            }

    return JsonResponse({'post': data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def posts_personilized(request):
    user=UserModel.objects.get(id=request.user.id)
    objects=None
    if user.supportings.filter().exists():
        try:
            objects=Posts.objects.annotate(is_supportings=Case(
                When(user__id__in=user.supportings.all().values('id'),then=Value(True)),
                default=Value(False),
            output_field=IntegerField(),
            )).order_by('-is_supportings')
        except:
            return JsonResponse({'posts': data})
    else:
        objects = Posts.objects.all()
    print('posts')
    page = Paginator(objects, 10)
    n = request.query_params.get('page', 1)
    if int(page.num_pages) < int(n):
        return JsonResponse({'posts': []})
    posts = page.page(n).object_list
    data = []
    for post in list(posts):
        print()
        myRate = post.ratings.filter(user__id=request.user.id).first()
        if myRate:
            myRate = myRate.rate
        else:
            myRate = 0
        comments = Comments.objects.filter(post__id=post.id)
        commentsFormated = []
        for comment in comments:
            replyData = serializers.serialize('json', comment.replys.all())
            fData = []
            for rply in json.loads(replyData):
                print(rply)
                userObj = UserModel.objects.get(id=rply['fields']['user'])
                rply['fields']['user'] = {
                    'id': userObj.id, 'username': userObj.username, 'profile': userObj.profile.url}
                fData.append(rply['fields'])
            commentsFormated.append(
                {'id': comment.id, 'comment': comment.comment, 'posted_at': comment.posted_at.strftime('%Y-%m-%d %H:%M:%S%z'), 'user': comment.user.username, 'user_id': comment.user.id, 'profile': comment.user.profile.url, 'replys': fData})
            print(comment.comment)
        saved = False
        if post.saved_users.filter(id=request.user.id).exists():
            saved = True
        data.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                    'description': post.description,
                     'is_saved': saved,'is_hidded':post.is_hidded,
                     'rating': post.rating, 'my_rate': myRate,'no_raters':post.ratings.count(), 'comments': commentsFormated, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})

    return JsonResponse({'posts': data})


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
            return JsonResponse({'message': 'comment is added','id':commentObj.id}, status=201)
    return JsonResponse({'message': 'creadential error'}, status=400)


@api_view(['put'])
@permission_classes([IsAuthenticated])
def add_rate(request):
    rate = request.data.get('rate', None)
    post_id = request.data.get('id', None)
    if rate!=None and post_id:
        print(float(rate))
        post = Posts.objects.get(id=post_id)
        print('add rate on zero worker first',rate in [0,0.0,'0'],rate)
        
        rate = float(rate)
        rateingObj = Ratings.objects.filter(
            post=post, user=UserModel.objects.get(id=request.user.id))
        print(rate)
        if rateingObj.exists():
            rateingObj = rateingObj.first()
            print('add rate on zero worker second',rate in [0,0.0,'0'],rate)

            if rate in [0,0.0,'0']:
                rateingObj.delete()
                print('add rate on zero worker second')
                avg_rate=post.ratings.aggregate(Avg('rate'))['rate__avg']
                if not avg_rate:
                    avg_rate=0.0
                post.rating = avg_rate
                post.save()
                return JsonResponse({'message': 'added rate', 'rate': post.rating,'no_raters':post.ratings.count()})
        else:
            rateingObj = Ratings(
                post=post, user=UserModel.objects.get(id=request.user.id))
        rateingObj.rate = rate
        rateingObj.save()
        post.rating = post.ratings.aggregate(Avg('rate'))['rate__avg']
        post.save()
        return JsonResponse({'message': 'added rate', 'rate': post.rating,'no_raters':post.ratings.count()})
    else:
        return JsonResponse({'message': 'not added'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(request):
    search = request.query_params['search']
    print(request.query_params)
    posts = Posts.objects.annotate(
        search=SearchVector('description', 'tags__name'),
    ).filter(search=search).distinct()
    postData = []
    for post in list(posts):
        myRate = post.ratings.filter(user__id=request.user.id).first()
        if myRate:
            myRate = myRate.rate
        else:
            myRate = 0
        comments = Comments.objects.filter(post__id=post.id)
        commentsFormated = []
        for comment in comments:
            replyData = serializers.serialize('json', comment.replys.all())
            fData = []
            for rply in json.loads(replyData):
                print(rply)
                userObj = UserModel.objects.get(id=rply['fields']['user'])
                rply['fields']['user'] = {
                    'id': userObj.id, 'username': userObj.username, 'profile': userObj.profile.url}
                fData.append(rply['fields'])
            commentsFormated.append(
                {'id': comment.id, 'comment': comment.comment, 'posted_at': comment.posted_at.strftime('%Y-%m-%d %H:%M:%S%z'), 'user': comment.user.username, 'user_id': comment.user.id, 'profile': comment.user.profile.url, 'replys': fData})
            print(comment.comment)
        saved = False
        if post.saved_users.filter(id=request.user.id).exists():
            saved = True
        postData.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                    'description': post.description,
                     'is_saved': saved,
                     'rating': post.rating, 'my_rate': myRate,'no_raters':post.ratings.count(), 'comments': commentsFormated, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})
    users = UserModel.objects.filter(Q(username__icontains=search) | Q(
        first_name__icontains=search) | Q(last_name__icontains=search) | Q(description__icontains=search))
    users = UserModel.objects.annotate(
        search=SearchVector('username', 'first_name',
                            'description', 'last_name'),
    ).filter(search=search).distinct()

    usersData = []
    for user in list(users):
        usersData.append({
            'username': user.username, 'first_name': user.first_name,
            'last_name': user.last_name, 'profile': user.profile.url, 'id': user.id,
        })
    return JsonResponse({'users': usersData, 'posts': postData})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_suggestions(request):
    search = request.query_params['search']
    result = []
    if (search != ''):
        result += list(Posts.objects.filter(
            description__icontains=search).distinct().values_list('description'))
        result += list(Posts.objects.filter(
            tags__name__icontains=search).distinct().values_list('tags__name'))
        result += list(UserModel.objects.filter(
            username__icontains=search).values_list('username'))
        result += list(UserModel.objects.filter(
            first_name__icontains=search).values_list('first_name'))
        result += list(UserModel.objects.filter(
            last_name__icontains=search).values_list('last_name'))
        result += list(UserModel.objects.filter(
            description__icontains=search).values_list('description'))
        result = list(set(result))
        result.sort(key=lambda res: res[0].index(search))
    
    return JsonResponse({'data': result})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment_reply(request):
    print(request.data)
    comment = Comments.objects.get(id=request.data.get('comment_id', None))
    if comment:
        user = UserModel.objects.get(id=request.user.id)
        reply = CommentsReply(reply=request.data.get(
            'reply', None), user=user, comment=comment)
        reply.save()
        data = serializers.serialize('json', [reply])
        fData = []
        for rply in json.loads(data):
            print(rply)
            userObj = UserModel.objects.get(id=rply['fields']['user'])
            rply['fields']['user'] = {
                'id': userObj.id, 'username': userObj.username, 'profile': userObj.profile.url}
            fData.append(rply['fields'])
        return JsonResponse({'reply': fData[0]}, status=201)
    return JsonResponse({'message': 'not found'}, status=400)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def save_post(request):
    post_id = request.data['post_id']
    user = UserModel.objects.get(id=request.user.id)
    postObj = Posts.objects.get(id=post_id)
    if postObj.saved_users.filter(id=user.id).exists():
        postObj.saved_users.remove(user)
    else:
        postObj.saved_users.add(user)
    return JsonResponse({'message': 'post is saved'}, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request):
    post_id = request.data['post_id']
    postObj=None
    if request.user.is_superuser:
        postObj = Posts.all.get(id=post_id)
    else:
        postObj = Posts.objects.get(id=post_id, user__id=request.user.id)
    if postObj:
        postObj.delete()
    else:
        return JsonResponse({'message':'post not found'},status=404)
    return JsonResponse({'message': 'post is delete'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_post(request):
    posts = Posts.objects.filter(saved_users__id=request.user.id)
    print('posts')
    data = []
    for post in list(posts):
        print()
        myRate = post.ratings.filter(user__id=request.user.id).first()
        if myRate:
            myRate = myRate.rate
        else:
            myRate = 0
        comments = Comments.objects.filter(post__id=post.id)
        commentsFormated = []
        for comment in comments:
            replyData = serializers.serialize('json', comment.replys.all())
            fData = []
            for rply in json.loads(replyData):
                print(rply)
                userObj = UserModel.objects.get(id=rply['fields']['user'])
                rply['fields']['user'] = {
                    'id': userObj.id, 'username': userObj.username, 'profile': userObj.profile.url}
                fData.append(rply['fields'])
            commentsFormated.append(
                {'id': comment.id, 'comment': comment.comment, 'posted_at': comment.posted_at.strftime('%Y-%m-%d %H:%M:%S%z'), 'user': comment.user.username, 'user_id': comment.user.id, 'profile': comment.user.profile.url, 'replys': fData})
            print(comment.comment)
        saved = False
        if post.saved_users.filter(id=request.user.id).exists():
            saved = True
        data.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                    'description': post.description,
                     'is_saved': saved,
                     'rating': post.rating, 'my_rate': myRate,'no_raters':post.ratings.count(), 'comments': commentsFormated, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})

    return JsonResponse({'posts': data})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request):
    comment_id = request.data.get('comment_id', None)
    comment=None
    if request.user.is_superuser:
        comment = Comments.objects.get( id=comment_id)
    else:
        comment = Comments.objects.get(user__id=request.user.id, id=comment_id)
        
    comment.delete()
    return JsonResponse({'message': 'comment deletion success'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_comment(request):
    comment_id = request.data.get('comment_id', None)
    commentObj = Comments.objects.get(user__id=request.user.id, id=comment_id)
    comment = request.data.get('comment', None)
    if comment:
        commentObj.comment = comment
        commentObj.save()
        return JsonResponse({'message': 'edit comment is success'})
    return JsonResponse({'message': 'edit comment is fail'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_post(request):
    post_id=request.data.get('post_id',None)
    reson=request.data.get('reson',None)
    detail=request.data.get('detail',None)
    user=UserModel.objects.get(id=request.user.id)
    if post_id and reson and detail :
        post=Posts.objects.get(id=post_id)
        report=Reports(user=user,detail=detail,reson=reson,post=post)
        report.save()
        return JsonResponse({'message':'report is submited'})
    return JsonResponse({'message':'missing data'},status=401)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommended(request):
    user=UserModel.objects.get(id=request.user.id)
    objects = Posts.objects.filter(tags__users=user).exclude(user=user,user__in=user.supportings.all(),saved_users__id=request.user.id,ratings__user__id=request.user.id)
    print('posts')
    page = Paginator(objects, 10)
    n = request.query_params.get('page', 1)
    if int(page.num_pages) < int(n):
        return JsonResponse({'posts': []})
    posts = page.page(n).object_list
    data = []
    for post in list(posts):
        print()
        myRate = post.ratings.filter(user__id=request.user.id).first()
        if myRate:
            myRate = myRate.rate
        else:
            myRate = 0
        comments = Comments.objects.filter(post__id=post.id)
        commentsFormated = []
        for comment in comments:
            replyData = serializers.serialize('json', comment.replys.all())
            fData = []
            for rply in json.loads(replyData):
                print(rply)
                userObj = UserModel.objects.get(id=rply['fields']['user'])
                rply['fields']['user'] = {
                    'id': userObj.id, 'username': userObj.username, 'profile': userObj.profile.url}
                fData.append(rply['fields'])
            commentsFormated.append(
                {'id': comment.id, 'comment': comment.comment, 'posted_at': comment.posted_at.strftime('%Y-%m-%d %H:%M:%S%z'), 'user': comment.user.username, 'user_id': comment.user.id, 'profile': comment.user.profile.url, 'replys': fData})
            print(comment.comment)
        saved = False
        if post.saved_users.filter(id=request.user.id).exists():
            saved = True
        data.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                    'description': post.description,
                     'is_saved': saved,'is_hidded':post.is_hidded,
                     'rating': post.rating, 'my_rate': myRate,'no_raters':post.ratings.count(), 'comments': commentsFormated, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})

    return JsonResponse({'posts': data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_top(request):
    MINIMUM_RATING=2
    user=UserModel.objects.get(id=request.user.id)
    objects = Posts.objects.all().annotate(no_raters=Count('ratings')).filter(no_raters__gte=MINIMUM_RATING).order_by('-rating','no_raters')
    print('posts')
    page = Paginator(objects, 10)
    n = request.query_params.get('page', 1)
    if int(page.num_pages) < int(n):
        return JsonResponse({'posts': []})
    posts = page.page(n).object_list
    data = []
    for post in list(posts):
        print()
        myRate = post.ratings.filter(user__id=request.user.id).first()
        if myRate:
            myRate = myRate.rate
        else:
            myRate = 0
        comments = Comments.objects.filter(post__id=post.id)
        commentsFormated = []
        for comment in comments:
            replyData = serializers.serialize('json', comment.replys.all())
            fData = []
            for rply in json.loads(replyData):
                print(rply)
                userObj = UserModel.objects.get(id=rply['fields']['user'])
                rply['fields']['user'] = {
                    'id': userObj.id, 'username': userObj.username, 'profile': userObj.profile.url}
                fData.append(rply['fields'])
            commentsFormated.append(
                {'id': comment.id, 'comment': comment.comment, 'posted_at': comment.posted_at.strftime('%Y-%m-%d %H:%M:%S%z'), 'user': comment.user.username, 'user_id': comment.user.id, 'profile': comment.user.profile.url, 'replys': fData})
            print(comment.comment)
        saved = False
        if post.saved_users.filter(id=request.user.id).exists():
            saved = True
        data.append({'image': post.content.url, 'user': {'username': post.user.username, 'id': post.user.id, 'profile': post.user.profile.url},
                    'description': post.description,
                     'is_saved': saved,'is_hidded':post.is_hidded,'no_raters':post.ratings.count(),
                     'rating': post.rating, 'my_rate': myRate, 'comments': commentsFormated, 'id': post.id, 'tags': [tag.name for tag in post.tags.all()]})

    return JsonResponse({'posts': data})


## admin

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@admin_only
def hide_post(request):
    post_id = request.data['post_id']
    postObj = Posts.all.get(id=post_id)
    if postObj:
        postObj.is_hidded= not postObj.is_hidded
        if postObj.is_hidded:
            Notifications.objects.create(title='your post is hidded',description='verify it is no violent content',user=postObj.user)
        else:
            Notifications.objects.create(title='your post is now view to all',description=' ',user=postObj.user)
        postObj.save()

    else:
        return JsonResponse({'message':'post not found'},status=404)
    return JsonResponse({'message': 'post is hide success'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def get_reports(request):
    reports=Reports.objects.all()
    return JsonResponse({'reports':ReportSerilizer(reports,many=True).data})


@api_view(['put'])
@permission_classes([IsAuthenticated])
@admin_only
def take_action(request):
    report_id=request.data.get('report_id',None)
    action=request.data.get('action',None)
    report=Reports.objects.get(id=report_id)
    if report_id and action:
        if action =='avoid':
            report.is_action_taked=True
            report.action_type=action
            report.save()
        elif action =='ban':
            user=report.post.user
            user.is_banned=True
            report.is_action_taked=True
            report.save()
            user.save()
        elif action == 'hide':
            post=report.post
            post.is_hidded=True
            report.is_action_taked=True
            post.save()
            report.save()
        else:
            return JsonResponse({'message':'give proper action name'},status=400)
        return JsonResponse({'message':'action success'})
    return JsonResponse({'message':'args are missing'},status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def get_tags(request):
    tags=TagsSerilizer(Tags.objects.all(),many=True).data
    tagDict={}
    for i in range(len(tags)):
        
        tags[i]['users']=UserSerializer(UserModel.all.filter(interests__name=tags[i]['name']),many=True).data
        tags[i]['posts']=PostsSerilizer(Posts.all.filter(tags__name=tags[i]['name']),many=True).data
        
    print(tags)
    tags.sort(key=lambda x : len(x['users']),reverse=True)
    return JsonResponse({'tags':tags})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_only
def get_comments(request):
    comments=CommentSerilizers(Comments.all.all(),many=True).data
    replys=CommentsReply.all.all()
    for i in range(len(comments)):
        comments[i]['replys']=ReplySerilizers(CommentsReply.all.filter(comment__id=comments[i]['id']),many=True).data
    return JsonResponse({'comments':comments})