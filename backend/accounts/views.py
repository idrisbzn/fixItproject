from rest_framework import viewsets, status
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .seiralizer import (
    UserSerializer,
    AuthSerializer,
    SignupSerializer,
    ChangePasswordSerializer,
    DeleteAccountSerializer,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .permission import IsOwnerOrReadOnly
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail




class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


from rest_framework_simplejwt.tokens import RefreshToken

class LoginViewSet(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = AuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
           
class SignupViewSet(APIView):
    permission_classes = [AllowAny]

    
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)  
        user = serializer.save()
        refresh = RefreshToken.for_user(user)     
      
        
        return Response({
            'message': 'Signup successful',
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)
        
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class DeleteAccount(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeleteAccountSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Account deleted successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
          
class Forget_password(APIView):
    
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        try:
            user =User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f'http://localhost:5173/reset-password/{uid}/{token}'
        
        send_mail(
            'Password Reset Request',
            f'Click the link to reset your password: {reset_link}',
            'm64085250@gmail.com',
            [user.email],
            fail_silently=False,                    
        )
        return Response({'message': 'Password reset link has been sent to your email.'}, status=status.HTTP_200_OK)       

class ResetPassword(APIView):
    permission_classes = [AllowAny]
    def get(self,request,uid,token):
        try:
           user_id = urlsafe_base64_decode(uid).decode()
           user = User.objects.get(pk=int(user_id))
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error':'invalid reset link'},status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user,token):
            return Response({'error':'expired token'},status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message':'valid reset link'})
        
    def post(self,request,uid,token): 
        
        new_password = request.data.get('new_password')
        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=int(user_id))
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid reset link'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)

