from django.contrib import admin
from .models import CustomUser, Book, Group, Chapter, Discussion

# Defines a custom admin panel for the CustomUser model
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'role') # Specifies the field to display in the Django Admin Panel

# Register your models here.
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Book)
admin.site.register(Group)
admin.site.register(Chapter)
admin.site.register(Discussion)