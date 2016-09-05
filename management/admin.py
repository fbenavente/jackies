from django.contrib import admin
from management.models import *

class ProductAdmin(admin.ModelAdmin):
    list_display = ('category', 'flavor', 'size', 'price','image_html',)
    search_fields = ('category','flavor', 'size', 'description',)
    list_filter = (('category',admin.RelatedOnlyFieldListFilter),'flavor','size',)

    def image_html(self,obj):
        return u'<img height="100" src="%s/" />' % (obj.get_image_url())
    image_html.allow_tags = True
    image_html.short_description = "Imagen"

class ProductInOrderInline(admin.TabularInline):
    model = ProductInOrder
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'order_time','retire_time','order_source','status','total',)
    search_fields = ('id', 'name',)
    inlines = (ProductInOrderInline,)
    list_filter = ('order_time', 'retire_time', 'order_source', 'status',)

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone_number', 'image_html',)
    search_fields = ('email','first_name', 'last_name',)

    def image_html(self,obj):
        return u'<img height="100" src="%s/" />' % (obj.get_image_url())
    image_html.allow_tags = True
    image_html.short_description = "Image"

    def full_name(self,obj):
        return obj.get_full_name()
    full_name.short_description = "Full Name"

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Category)
admin.site.register(Order, OrderAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductInOrder)
admin.site.register(GlobalValues)
