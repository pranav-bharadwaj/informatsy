from django.contrib.auth.password_validation import validate_password
from django.http import response
from django.http.request import RAISE_ERROR
from django.shortcuts import redirect, render
from decouple import config
from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.exceptions import *
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from backend import oauthall
from backend import essentialClass
from . models import *
from . serializers import *
from backend import mails
import os
from django.http import HttpResponse
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken


class UserProfileView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug=None, format=None):
        if slug is not None:
            profile = UserProfile.objects.get(user_slug=slug)
            serializer = UserProfileSerializer(
                profile, context={"request": request})
            followers = profile.followers.all()

            is_following = (True if followers.filter(
                pk=request.user.id).exists() else False)

            data = {
                'is_following': is_following,
            }

            data.update(serializer.data)
            return Response(data, status=status.HTTP_200_OK)

        profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(
            profiles, context={"request": request}, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, slug, format=None):
        profile = UserProfile.objects.get(user_slug=slug)
        serializer = UserProfileSerializer(
            profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddFollower(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self, request, slug, format=None):
        profile = UserProfile.objects.get(user_slug=slug)
        profile.followers.add(request.user.id)
        return Response(status=status.HTTP_200_OK)


class RemoveFollower(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self, request, slug, format=None):
        profile = UserProfile.objects.get(user_slug=slug)
        profile.followers.remove(request.user.id)
        return Response(status=status.HTTP_200_OK)


class ContactFormView(APIView):

    serializer_class = ContactFormSerializer

    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        if(serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SyllabusView(APIView):
    serializer_class = SyllabusSerializer

    def get(self, request, format=None):
        query = Syllabus.objects.all()
        serializer = SyllabusSerializer(
            query, context={"request": request}, many=True)
        return Response(serializer.data)

# ---------Signup view-----------------

# ----------oauth view-------------


class AllOauthView(APIView):
    def oauth_db_includer(data):

        userObjects = User
        userProfileObj = UserProfile
        if userObjects.objects.filter(email=data["email"]):
            return False
        else:
            oauthserilizersBasic = alloauthBasic(data=data)
            oauthserilizersExtend = alloauthExtendProfile(data=data)
            if oauthserilizersBasic.is_valid() and oauthserilizersExtend.is_valid():
                oauthserilizersBasic.save()
                oauthserilizersExtend.save()
                return True
            return Response("Something went wrong try again after sometime", status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request):
        # print(request.data["accesstoken"])
        authInstance = oauthall.Alloauth()
        if request.data["authProvider"] == "facebook":
            auth_status = authInstance.facebookAuth(
                request.data["accesstoken"])

            if auth_status["status"]:
                data = auth_status['res']
                dbData = {"first_name": data["first_name"], "last_name": data["last_name"], "uniqueId": essentialClass.UniqueidGen.uniqueIdGenerator(
                ), "userEmail": data["email"], "profileImg": data["picture"]["data"]["url"]}
                oathStatus = AllOauthView.oauth_db_includer(dbData)
                return Response("User created successfully", status=status.HTTP_200_OK) if oathStatus else Response("Your account is already created...!", status=status.HTTP_409_CONFLICT)

            else:
                return Response("Something went wrong", status=status.HTTP_409_CONFLICT)
        elif request.data["authProvider"] == "google":
            auth_status = authInstance.googleAuth(
                request.data["accesstoken"])
            if auth_status["status"]:
                data = auth_status['res']
                dbData = {"first_name": data["given_name"], "last_name": data["family_name"], "password": essentialClass.UniqueidGen.uniqueIdGenerator(
                ), "email": data["email"], "profile_picture": data["picture"], "username": data['given_name']}

                oathStatus = AllOauthView.oauth_db_includer(dbData)
                return Response("User created successfully", status=status.HTTP_200_OK) if oathStatus else Response("Your account is already created...!", status=status.HTTP_409_CONFLICT)

            else:
                return Response("Something went wrong", status=status.HTTP_409_CONFLICT)
        else:
            auth_status = authInstance.linkedInAuth(
                request.data["accesstoken"])
            return Response("User created successfully", status=status.HTTP_200_OK)


class SignupView(APIView):
    def post(self, request):
        dataObjects = User
        # method to generate uniqueid for users
        if request.method == "POST":
            if dataObjects.objects.filter(email=request.data["email"]):
                return Response("Your Email already registered...!", status=status.HTTP_409_CONFLICT)
            # if no user registered then proceed next
            if request.data['confirm_password'] != request.data['password']:
                return Response("Password does not match..!", status=status.HTTP_409_CONFLICT)

            else:
                data = request.data
                data["is_active"] = False
                serializersWithUniqueid = SignupSerializer(data=data)
                if serializersWithUniqueid.is_valid():
                    serializersWithUniqueid.save(
                        password=make_password(data["password"]))
                    user = dataObjects.objects.get(email=data['email'])
                    print(user)
                    tokenInstance = essentialClass.UniqueidGen
                    activation_token = tokenInstance.tokenForActivatingEmail(
                        user)
                    mails.MailService.sendMail(
                        data['email'], data['username'], activation_token)
                    return Response("User created successfully")
                print(serializersWithUniqueid.errors)
                return Response(serializersWithUniqueid.errors.get(list(serializersWithUniqueid.errors.keys())[0])[0], status=status.HTTP_405_METHOD_NOT_ALLOWED)


class CourseView(APIView):
    serializer_class = CourseSerializer

    def get(self, request):
        query = Course.objects.all()
        serializer = CourseSerializer(query, many=True)
        return Response(serializer.data)


class YearOrSemView(APIView):
    serializer_class = YearOrSemSerializer

    def get(self, request):
        query = YearOrSem.objects.all()
        serializer = YearOrSemSerializer(query, many=True)
        return Response(serializer.data)


class NotesView(viewsets.ReadOnlyModelViewSet):
    queryset = Notes.objects.all()
    serializer_class = NotesSerializer


class QuestionPapersView(viewsets.ReadOnlyModelViewSet):
    queryset = QuestionPapers.objects.all()
    serializer_class = QuestionPapersSerializer

# custom claims for jwt auth


# class for activationg user via mail


class ActivateAccount(APIView):
    def post(self, request):
        if request.method == "POST":
            try:
                payload = jwt.decode(
                    request.data['token'], config('token_secret'), 'HS256')

                user = User.objects.get(id=payload['user_id'])
                print(user)
                if not user.is_active:
                    user.is_active = True
                    user.save()
                    Refresh_token = RefreshToken.for_user(user)
                    Access_token = Refresh_token.access_token
                    response = HttpResponse("Activated successfully")
                    print({"refresh": str(Refresh_token),
                           "access": str(Access_token)})
                    response.set_cookie(
                        'refresh', Refresh_token, httponly=True)
                    return response

                return Response("Your account is already activated please login", status=status.HTTP_409_CONFLICT)
            except jwt.ExpiredSignatureError:
                return Response("Link is expired please contact informatsy@gmail.com", status=status.HTTP_400_BAD_REQUEST)
            except jwt.InvalidSignatureError:
                return Response("This request not authorized by informatsy", status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response("Something is missing you are not authenticated", status=status.HTTP_405_METHOD_NOT_ALLOWED)
