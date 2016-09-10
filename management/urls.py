from django.conf.urls import url
from management import views


urlpatterns = [
                url(r'^manage_categories/$',
                   views.CategoryList.as_view(),
                   name='admin_categories'),
                url(r'^manage_categories/(?P<pk>[\d]+)$',
                   views.CategoryDetail.as_view(),
                   name='admin_categories_with_pk'),
                url(r'^manage_orders/$',
                   views.OrderList.as_view(),
                   name='admin_orders'),
                url(r'^manage_orders/(?P<pk>[\d]+)$',
                   views.OrderDetail.as_view(),
                   name='admin_orders_with_pk'),
                url(r'^manage_products/$',
                   views.ProductList.as_view(),
                   name='admin_products'),
                url(r'^manage_products/(?P<pk>[\d]+)$',
                   views.ProductDetail.as_view(),
                   name='admin_products_with_pk'),
                url(r'^manage_users/$',
                   views.UserList.as_view(),
                   name='admin_users'),
                url(r'^manage_users/(?P<pk>[\d]+)$',
                   views.UserDetail.as_view(),
                   name='admin_users_with_pk'),
                url(r'^testing/$',
                   views.testing),
                ]
