from django.urls import path

from . import views

urlpatterns = [
    path('restaurants/', views.restaurant_create_or_update, name='restaurant-create'),
    path('restaurants/<int:pk>/', views.restaurant_create_or_update, name='restaurant-update'),
    path('restaurants/delete/<int:pk>/', views.restaurant_delete, name='restaurant-delete'),

    path('reservations/', views.reservation_create, name='reservation-create'),
    path('reservations/<int:pk>/move/', views.reservation_move, name='reservation-move'),
    path('reservations/<int:pk>/cancel/', views.reservation_cancel, name='reservation-cancel'),
]
