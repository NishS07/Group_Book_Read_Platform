from rest_framework import serializers
from .models import CustomUser, Book, Group, Chapter, Discussion
from django.contrib.auth.password_validation import validate_password

# Serializer for user registration
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required = True, validators = [validate_password])
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}  
        }
    # Custom method to create a new user with hashed password
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user


# Serializer for basic user details based on the roles admin/member.
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username','role']  # Only return ID and username


# Serializer for books
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'  # Include all fields in the Book model


# Serializer for members within a group
class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username']  # Include only ID and username


# Serializer for groups
class GroupSerializer(serializers.ModelSerializer):
    book = BookSerializer()  # Include book details within the group
    members = MemberSerializer(many=True)  # Include member details within the group    
    class Meta:
        model = Group
        fields = '__all__'  # Include all fields in the Group model


# Serializer for chapters
class ChapterSerializer(serializers.ModelSerializer):
    is_read = serializers.SerializerMethodField()  # Custom field to track users who read the chapter
    class Meta:
        model = Chapter
        fields = '__all__'  # Include all fields in the Chapter model
    # Method to return a list of users who have read the chapter
    def get_is_read(self, obj):
        return [{"id": user.id, "username": user.username} for user in obj.is_read.all()]


# Serializer for discussions
class DiscussionSerializer(serializers.ModelSerializer):
    user = MemberSerializer()  # Include user details
    replies = serializers.SerializerMethodField()  # Custom field for nested replies
    class Meta:
        model = Discussion
        fields = ['id', 'chapter', 'user', 'content', 'parent', 'created_at', 'replies']    
    # Method to get replies for a discussion, ordered by creation time
    def get_replies(self, obj):
        replies = obj.replies.order_by('created_at')
        return DiscussionSerializer(replies, many=True).data