from django.urls import path

from . import views

urlpatterns = [
    # Restaurants
    path("restaurants/", views.restaurant_list, name="restaurant-list"),
    path("restaurants/create/", views.restaurant_create, name="restaurant-create"),
    path("restaurants/<int:pk>/", views.restaurant_update, name="restaurant-update"),
    path(
        "restaurants/delete/<int:pk>/",
        views.restaurant_delete,
        name="restaurant-delete",
    ),
    path(
        "restaurants/<int:pk>/layout/",
        views.restaurant_get_layout,
        name="restaurant-get-layout",
    ),
    path(
        "restaurants/<int:pk>/layout/update/",
        views.restaurant_update_layout,
        name="restaurant-update-layout",
    ),
    path(
        "restaurants/<int:pk>/available-dates/",
        views.restaurant_available_dates,
        name="restaurant-available-dates",
    ),
    path(
        "restaurants/<int:pk>/available-times/",
        views.restaurant_available_times,
        name="restaurant-available-times",
    ),
    path(
        "restaurants/<int:pk>/available-tables/",
        views.restaurant_available_tables,
        name="restaurant-available-tables",
    ),
    # Reservations
    path("reservations/", views.reservation_create, name="reservation-create"),
    path(
        "reservations/today/",
        views.reservation_list_today,
        name="reservation-list-today",
    ),
    path(
        "reservations/by-table/",
        views.reservation_by_table,
        name="reservation-by-table",
    ),
    path(
        "reservations/<int:pk>/move/", views.reservation_move, name="reservation-move"
    ),
    path(
        "reservations/<int:pk>/cancel/",
        views.reservation_cancel,
        name="reservation-cancel",
    ),
    path(
        "reservations/<int:pk>/status/",
        views.reservation_update_status,
        name="reservation-update-status",
    ),
    path(
        "reservations/<int:pk>/delete/",
        views.reservation_delete,
        name="reservation-delete",
    ),
]
