from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth import get_user_model

# CustomUser model inherits from Django's AbstractUser, adding extra fields and functionality
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    # Many-to-many relationship with Group, allowing users to belong to multiple groups
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_groups",  
        blank=True  # Users can belong to zero or more groups
    )
    # Many-to-many relationship with Permission, allowing users to have multiple permissions
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_permissions",  
        blank=True  # Users can have no permissions, or multiple permissions
    )

# The Book model represents a book entity with title, author, genre, and description fields
class Book(models.Model):
    title = models.CharField(max_length=200)  
    author = models.CharField(max_length=100)  
    genre = models.CharField(max_length=100)  
    description = models.TextField()  

    def __str__(self):
        return f" Book {self.id} - {self.title} "

# The Group model represents a reading group associated with a particular book
class Group(models.Model):
    name = models.CharField(max_length=200)  
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='groups')  
    members = models.ManyToManyField(get_user_model(), related_name='user_groups', blank=True)  
    reading_goals = models.TextField()  

    def __str__(self):
        return f" Group {self.id} - {self.name} for the {self.book} created."

# The Chapter model represents a chapter within a group reading the associated book
class Chapter(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='chapters')  
    title = models.CharField(max_length=200)  
    deadline = models.DateField()  
    is_read = models.ManyToManyField(CustomUser, related_name='read_chapters', blank=True)  

    def __str__(self):
        return f" Chapter {self.id} - {self.title} for the {self.group}"

# The Discussion model represents a discussion thread related to a chapter
class Discussion(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='discussions')  
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    content = models.TextField()  
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')  
    created_at = models.DateTimeField(auto_now_add=True)  
   
    def __str__(self):
        return f" Discussion {self.id} of member {self.user} created for the {self.chapter}"