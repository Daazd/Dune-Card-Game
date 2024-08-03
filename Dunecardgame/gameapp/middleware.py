from django.utils import timezone

class SessionRefreshMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            request.session.modified = True
            request.session['last_activity'] = timezone.now().isoformat()
        response = self.get_response(request)
        return response