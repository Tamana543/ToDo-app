from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, HttpResponse, redirect
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView
from django.contrib import messages
from django.conf import settings
from django.contrib import auth
from .models import Todo
import json

link: str = f"{settings.ALLOWED_HOSTS[0]}:8000"
def mainpage_r(request):
    if request.user.is_authenticated:
        user = request.user
        todoThings = Todo.objects.filter(user=user)[::-1]
    else :
        todoThings = [{'name': "Sign Up/In :)"}]

    print(todoThings)
    return render(request, 'index.html', {"todoThings": todoThings})

def signup(request):
    print(1)
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(username, password)

        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                auth.login(request, user)
                return redirect('home')
            else:
                return HttpResponse("Incorrect password")
        except User.DoesNotExist:
            user = User.objects.create_user(username=username, password=password)
            user.save()
            auth.login(request, user)
            return redirect('home')

def signin(request):
    if request.method == "POST":
        user = auth.authenticate(username=request.POST['username'], 
                                password=request.POST['password']) 
        print(user)
        if user is not None :
            auth.login(request, user)
            return redirect('home')
        else :
            return HttpResponse('Error; authenticate, \nyour password or username is wrong.')
    else :
        return redirect('home')


class submit(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            body = request.data['tasks'][::-1][0]
            Todo.objects.create(user=request.user, name=body)

        return Response({"status": 200})
