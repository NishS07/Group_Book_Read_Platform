from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsAdmin, IsMember
from .models import CustomUser, Book, Group, Chapter, Discussion
from rest_framework.generics import CreateAPIView
from .serializers import RegisterSerializer, BookSerializer, GroupSerializer, ChapterSerializer, DiscussionSerializer, CustomUserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from django.db import transaction
from datetime import datetime
from django.utils.timezone import make_aware
from datetime import datetime
from django.utils import timezone

# View to register a new user
class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]  
    serializer_class = RegisterSerializer  

# View accessible only to Admin users
class AdminView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]  # Only authenticated users with admin permissions can access this view

    def get(self, request):
        return Response({"message": "Hello, Admin!"})

# View accessible only to Member users
class MemberView(APIView):
    permission_classes = [IsAuthenticated, IsMember]  # Only authenticated users with member permissions can access this view

    def get(self, request):
        return Response({"message": "Hello, Member!"})

# View to retrieve the role of the authenticated user
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        user = request.user
        return Response({
            "role": user.role,  # Return the user's role
        })

# API view to fetch the current authenticated user's ID
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_id(request):
    return Response({"userId": request.user.id}, status=status.HTTP_200_OK)

# Fetch a list of all books (only accessible to members)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def get_books(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

# Fetch details of a single book by ID (only accessible to members)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def get_book(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        serializer = BookSerializer(book)
        return Response(serializer.data)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

# Fetch a list of all groups (only accessible to members)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def get_groups(request):
    groups = Group.objects.all()
    serializer = GroupSerializer(groups, many=True)
    return Response(serializer.data)

# Fetch details of a single group by ID (only accessible to members)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def get_group(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
        serializer = GroupSerializer(group)
        return Response(serializer.data)
    except Group.DoesNotExist:
        return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

# Allow users to create or join a group for a specific book (only accessible to members)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def create_or_join_group(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

    group_name = request.data.get('name')
    reading_goals = request.data.get('reading_goals')

    if not group_name:
        return Response({"error":"Group name is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():  # Ensure atomicity when creating or joining the group
            group, created = Group.objects.get_or_create(book=book, name=group_name, defaults={"reading_goals": reading_goals})
            if request.user in group.members.all():
                return Response({"error":"You are already part of the selected group."}, status=status.HTTP_400_BAD_REQUEST)
            group.members.add(request.user)  # Add the user to the group
            serializer = GroupSerializer(group)
            return Response(
                {
                    "group": serializer.data,
                    "created": created,  
                },
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
            )
    except Exception as e:
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

# Fetch groups by book (only accessible to members)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def get_groups_by_book(request):
    book_id = request.query_params.get('book')
    if not book_id:
        return Response({'error':'Book ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({'error':'Book not found'}, status=status.HTTP_404_NOT_FOUND)

    groups = Group.objects.filter(book=book)
    serializer = GroupSerializer(groups, many=True)
    return Response(serializer.data)

# Fetch groups that the authenticated user is a member of (only accessible to members)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def get_member_groups(request):
    try:
        user_groups = Group.objects.filter(members=request.user)
        if not user_groups.exists():
            return Response({"message":"You are not part of any group."}, status=status.HTTP_200_OK)
        serializer = GroupSerializer(user_groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error":f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

# Mark a chapter as read/unread for the user (only accessible to members)
@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def mark_chapter_as_read(request, group_id, chapter_id):
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"error": "Group with the provided ID does not exist."}, status=status.HTTP_404_NOT_FOUND)

    if request.user not in group.members.all():
        return Response({"error": "You are not a member of this group."}, status=status.HTTP_403_FORBIDDEN)

    try:
        chapter = group.chapters.get(id=chapter_id)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter with the provided ID does not exist in this group."}, status=status.HTTP_404_NOT_FOUND)

    if request.user in chapter.is_read.all():
        chapter.is_read.remove(request.user)  # Mark as unread
        action = "unread"
    else:
        chapter.is_read.add(request.user)  # Mark as read
        action = "read"

    chapter.save()
    serializer = ChapterSerializer(chapter)
    return Response(
        {
            "message": f'Chapter successfully marked as {action}.',
            "chapter": serializer.data,
        },
        status=status.HTTP_200_OK
    )

# Fetch the user's reading progress across all groups they belong to (only accessible to members)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def view_progress(request):
    if request.user:
        groups = Group.objects.filter(members=request.user)  # Get groups the user is part of
    else:
        groups = request.user.groups.all()
    if not groups.exists():
        return Response({"error": "User is not a member of any group."}, status=status.HTTP_400_BAD_REQUEST)
    progress_data = []
    for group in groups:
        chapters = group.chapters.all()
        if not chapters.exists():
            continue
        total_members = group.members.count()
        group_data = {
            "group_id": group.id,
            "group_name": group.name,
            "total_members": total_members,
            "chapters": []
        }
        for chapter in chapters:
            read_users = chapter.is_read.all()
            read_count = read_users.count()
            read_percentage = (read_count / total_members) * 100 if total_members > 0 else 0
            read_percentage = min(read_percentage, 100.0)
            read_user_data = [{"id": user.id, "username": user.username} for user in read_users]
            not_read_users = group.members.exclude(id__in=[user.id for user in read_users])
            not_read_user_data = [{"id": user.id, "username": user.username} for user in not_read_users]
            chapter_data = {
                "chapter_id": chapter.id,
                "title": chapter.title,
                "deadline": chapter.deadline,
                "read_percentage": read_percentage,
                "read_users": read_user_data,
                "not_read_users": not_read_user_data
            }
            group_data["chapters"].append(chapter_data)
        progress_data.append(group_data)
    if not progress_data:
        return Response([], status=status.HTTP_200_OK)
    return Response(progress_data, status=status.HTTP_200_OK)

# Fetch chapters for a group (only accessible to members)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def group_chapters(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
        if request.user not in group.members.all():
            return Response(
                {"detail":"You are not a member of this group."},
                status=status.HTTP_403_FORBIDDEN,
            )
        chapters = Chapter.objects.filter(group=group)
        serializer = ChapterSerializer(chapters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Group.DoesNotExist:
        return Response(
            {"detail":"Group not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

# Fetch discussions by chapter for a group (only accessible to members and supports threaded discussions and polling for new posts). 
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def fetch_discussions_by_chapter(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"error": "Group with the provided ID does not exist."}, status=status.HTTP_404_NOT_FOUND) 
    chapter_id = request.query_params.get('chapter_id')
    last_fetched_at = request.query_params.get('last_fetched_at')  # Optional for polling 
    if not chapter_id:
        return Response({"error": "Chapter ID is required."}, status=status.HTTP_400_BAD_REQUEST) 
    try:
        chapter = group.chapters.get(id=chapter_id)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter with the provided ID does not exist."}, status=status.HTTP_404_NOT_FOUND) 
    # Fetch discussions
    discussions = chapter.discussions.filter(parent=None).order_by('created_at')
    if last_fetched_at:
        try:
            # Parse the timestamp and make it timezone-aware
            last_fetched_time = datetime.fromisoformat(last_fetched_at)
            if not last_fetched_time.tzinfo:  # If the datetime is naive, make it UTC-aware
                last_fetched_time = make_aware(last_fetched_time, timezone=pytz.UTC)
            # Filter discussions created after the provided timestamp
            discussions = discussions.filter(created_at__gt=last_fetched_time)
        except (ValueError, TypeError):
            return Response({"error": "Invalid timestamp format for last_fetched_at. Use ISO 8601 format like '2025-01-27T05:37:00Z'."}, status=status.HTTP_400_BAD_REQUEST)
 
    def serialize_discussion(discussion):
        """Recursive function to serialize a discussion and its replies."""
        return {
            "id": discussion.id,
            "chapter": discussion.chapter.id,
            "user": {
                "id": discussion.user.id,
                "username": discussion.user.username,
            },
            "content": discussion.content,
            "parent": discussion.parent.id if discussion.parent else None,
            "created_at": discussion.created_at,
            "replies": [serialize_discussion(reply) for reply in discussion.replies.order_by('created_at')],
        } 
    # Serialize all top-level discussions with their replies
    serialized_data = [serialize_discussion(discussion) for discussion in discussions]
    return Response(serialized_data, status=status.HTTP_200_OK)

# Add a new discussion post in a thread for a chapter. (only accessible to members) 
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def add_discussion_by_chapter(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"error": "Group with the provided ID does not exist."}, status=status.HTTP_404_NOT_FOUND) 
    chapter_id = request.data.get('chapter_id')
    parent_id = request.data.get('parent_id')  # For threads
    content = request.data.get('content') 
    if not chapter_id:
        return Response({"error": "Chapter ID is required."}, status=status.HTTP_400_BAD_REQUEST)
    if not content:
        return Response({"error": "Content is required."}, status=status.HTTP_400_BAD_REQUEST) 
    try:
        chapter = group.chapters.get(id=chapter_id)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter with the provided ID does not exist."}, status=status.HTTP_404_NOT_FOUND) 
    parent_discussion = None
    if parent_id:
        try:
            parent_discussion = Discussion.objects.get(id=parent_id, chapter=chapter)
        except Discussion.DoesNotExist:
            return Response({"error": "Parent discussion does not exist."}, status=status.HTTP_404_NOT_FOUND)
    discussion = Discussion.objects.create(
        chapter=chapter,
        user=request.user,
        content=content,
        parent=parent_discussion
    )
    serializer = DiscussionSerializer(discussion)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# Fetch chapter details for a group (only accessible to members) 
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def get_chapter_details(request, group_id, chapter_id):
    try:
        chapter = Chapter.objects.get(id=chapter_id, group=group_id)
    except Chapter.DoesNotExist:
        return Response({"error":"Chapter not found"}, status=status.HTTP_404_NOT_FOUND)
 
    serializer = ChapterSerializer(chapter)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Getting Chapter Deadline Notification view that a member part of
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsMember])
def chapter_deadline_notification(request):
    user = request.user    
    # Get all the groups the user is a member of
    groups = Group.objects.filter(members=user)    
    # Check if user is part of any group
    if not groups.exists():
        return Response({"error": "User is not a member of any group."}, status=status.HTTP_400_BAD_REQUEST)    
    notifications = []    
    for group in groups:
        chapters = group.chapters.all()
        # Check if there are chapters in the group
        if not chapters.exists():
            continue
        for chapter in chapters:
            # Calculate the difference in days between the deadline and today
            today = timezone.now().date()
            days_left = (chapter.deadline - today).days            
            # If the deadline has passed and the chapter is not read, create a notification
            if days_left < 0 and user not in chapter.is_read.all():
                notification_message = f"The deadline for chapter '{chapter.title}' has passed {abs(days_left)} days ago!"                
                # Add the notification message to the notifications list
                notifications.append({
                    "group_name": group.name,
                    "chapter_id": chapter.id,
                    "chapter_title": chapter.title,
                    "notification": notification_message
                })   
    # If no notifications, return an empty response
    if not notifications:
        return Response([], status=status.HTTP_200_OK)    
    return Response(notifications, status=status.HTTP_200_OK)  
 
  
""" 

         Views for Admin Part
 
""" 
 
 

# Books CRUD operations

# Fetch all books (Admin only)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def get_books_admin(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

# Create a new book (Admin only)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def create_book(request):
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update an existing book (Admin only)
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def update_book(request, book_id):
    try:
        # Fetch the book with the provided ID
        book = Book.objects.get(id=book_id)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

# Delete a book (Admin only)
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def delete_book(request, book_id):
    try:
        # Try to fetch the book by ID and delete it
        book = Book.objects.get(id=book_id)
        book.delete()
        return Response({'message': 'Book deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)


# Groups CRUD operations

# Fetch all groups (Admin only)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def get_groups_admin(request):
    groups = Group.objects.all()
    serializer = GroupSerializer(groups, many=True)
    return Response(serializer.data)

# Create a new group (Admin only)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def create_group(request):
    data = request.data
    book_data = data.get('book', None)
    member_data = data.get('members', [])
    group_name = data.get('name', None)
    reading_goals = data.get('reading_goals', None)
    # Ensure the group has a name
    if not group_name:
        return Response({"detail": "Group name is required."}, status=status.HTTP_400_BAD_REQUEST)
    # Ensure a valid book is provided
    if book_data and book_data.get('id'):
        try:
            book = Book.objects.get(id=book_data['id'])
        except Book.DoesNotExist:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"detail": "Book ID is required."}, status=status.HTTP_400_BAD_REQUEST)
    # Validate and create users (members)
    members = []
    for member in member_data:
        username = member.get('username')
        if not username:
            return Response({"detail": "Username is required for members."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            # Create a new user if they don't exist
            user = CustomUser.objects.create(username=username)
        members.append(user)
    # Create the new group and associate it with the book and members
    group = Group.objects.create(name=group_name, book=book, reading_goals=reading_goals)
    group.members.set(members)
    group.save()
    serializer = GroupSerializer(group)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# Fetch all users with 'member' role
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def fetch_users(request):
    # Fetch users with the 'member' role
    members = CustomUser.objects.filter(role='member')
    # Serialize and return the member data
    serializer = CustomUserSerializer(members, many=True)
    return Response(serializer.data)

# Update an existing group (Admin only)
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def update_group(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND)
    data = request.data
    book_data = data.get('book', None)
    member_data = data.get('members', None)
    group_name = data.get('name', group.name)
    reading_goals = data.get('reading_goals', group.reading_goals)
    # Validate and update the book for the group
    if book_data and book_data.get('id'):
        try:
            book = Book.objects.get(id=book_data['id'])
            group.book = book
        except Book.DoesNotExist:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
    # Validate and update group members
    if member_data is not None:
        members = []
        for member in member_data:
            username = member.get('username')
            if not username:
                return Response({"detail": "Username is required for members."}, status=status.HTTP_400_BAD_REQUEST)
            try:
                user = CustomUser.objects.get(username=username)
            except CustomUser.DoesNotExist:
                user = CustomUser.objects.create(username=username)
            members.append(user)
        group.members.set(members)
    # Save the updated group
    group.name = group_name
    group.reading_goals = reading_goals
    group.save()
    # Serialize and return the updated group
    serializer = GroupSerializer(group)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Delete a group (Admin only)
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def delete_group(request, group_id):
    try:
        group = Group.objects.get(id=group_id)
        group.delete()
        return Response({'message': 'Group deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Group.DoesNotExist:
        return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)


# Chapter CRUD operations

# Fetch a specific chapter or all chapters
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def view_chapter(request, chapter_id=None):
    if chapter_id:
        try:
            chapter = Chapter.objects.get(id=chapter_id)
            serializer = ChapterSerializer(chapter)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Chapter.DoesNotExist:
            return Response({"detail": "Chapter not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        chapters = Chapter.objects.all()
        serializer = ChapterSerializer(chapters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Create a new chapter (Admin only) 
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def create_chapter(request):
    serializer = ChapterSerializer(data=request.data)
    if serializer.is_valid():
        chapter = serializer.save()  # Save the chapter first
        # Now handle the `is_read` field, which is a ManyToMany relationship
        if 'is_read' in request.data:
            users = CustomUser.objects.filter(id__in=request.data['is_read'])
            chapter.is_read.set(users)  # Set the ManyToMany relation
            chapter.save()  # Save the chapter with the updated `is_read`
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update an existing chapter (Admin only) 
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def update_chapter(request, chapter_id):
    try:
        chapter = Chapter.objects.get(id=chapter_id)
        group_members = chapter.group.members.all()   
        # Update fields other than `is_read`
        serializer = ChapterSerializer(chapter, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save() 
            # Handle the `is_read` field specifically
            if 'is_read' in request.data:
                # Filter the provided user IDs to only include those in the group
                valid_users = group_members.filter(id__in=request.data['is_read'])
                chapter.is_read.set(valid_users)  # Set or update the ManyToMany relation
                chapter.save()  
            # Return the updated chapter data
            return Response(ChapterSerializer(chapter).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    except Chapter.DoesNotExist:
        return Response({"detail": "Chapter not found"}, status=status.HTTP_404_NOT_FOUND)
 
# Delete a chapter (Admin only) 
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated, IsAdmin])
def delete_chapter(request, chapter_id):
    try:
        chapter = Chapter.objects.get(id=chapter_id)
        chapter.delete()
        return Response({"detail": "Chapter deleted"}, status=status.HTTP_204_NO_CONTENT)
    except Chapter.DoesNotExist:
        return Response({"detail": "Chapter not found"}, status=status.HTTP_404_NOT_FOUND)
 