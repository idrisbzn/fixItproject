from . import views
from django.urls import path

      

urlpatterns = [
    path('me/',views.MeView.as_view(),name='me'),
    path('auth/', views.LoginViewSet.as_view(), name='auth'),
    path('signup/', views.SignupViewSet.as_view(), name='signup'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('change_password/', views.ChangePassword.as_view(), name='change_password'),
    path('delete_account/', views.DeleteAccount.as_view(), name='delete_account'),
    path('forget_password/', views.Forget_password.as_view(), name='forget_password'),
    path('reset_password/<uid>/<token>/', views.ResetPassword.as_view(), name='reset_password'),
]
