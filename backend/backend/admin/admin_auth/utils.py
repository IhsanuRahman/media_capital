from django.http import JsonResponse


def admin_only(func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_superuser:
            return JsonResponse({'message':'only super user can access'},status=400)
        return func(request, *args, **kwargs)
    return wrapper