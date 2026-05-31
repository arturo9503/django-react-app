from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello),
    path('notes/', views.notes),
    path('notes/<int:pk>/', views.note_detail),
    path('login/', views.login_view),
    path('logout/', views.logout_view),
]
