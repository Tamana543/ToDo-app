from django.shortcuts import render, HttpResponse, redirect
from rest_framework.response import Response
from django.contrib.auth.models import User
from captchaSaz import *
from rest_framework.views import APIView
from django.contrib import auth
from .models import Todo
import time
import json
import os

def mainpage_r(request):
    captcha_img, captcha_txt = generate()
    todoThings = None
    if request.user.is_authenticated:
        user = request.user
        todoThings = Todo.objects.filter(user=user)[::-1]
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
            body = request.data.get("task")
            Todo.objects.create(user=request.user, name=body)

        return Response({"status": 200})

class checked(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            body = request.data.get("task")
            print(body, request.user)
            taskObject = Todo.objects.get(id=body, user=request.user)
            print(taskObject)
            taskObject.delete()

        return Response({"status": 200})
    
class captcha(APIView):
    def post(self, request):
        for dirpath, dirnames, filenames in os.walk("./static/captcha_imgs/"):
            for filename in filenames:
                os.remove(dirpath + filename)
        if not request.user.is_authenticated:
            captcha_img, captcha_txt = generate()
            tt = str(time.time()).replace('.', '')
            print(tt)
            captcha_img.save(f"./static/captcha_imgs/captcha-{tt}.jpg")
            
            return Response({"status": 202, "captcha_url": f"captcha-{tt}.jpg"})
        return Response({"status": 403})
    