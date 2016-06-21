from django.contrib import admin
from management.models import *

admin.site.register(CustomUser)
admin.site.register(Category)
admin.site.register(Order)
admin.site.register(Product)
admin.site.register(ProductInOrder)
