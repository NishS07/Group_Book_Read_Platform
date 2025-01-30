from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AdminView, MemberView, RegisterView, UserInfoView, get_book, get_books, get_group, get_groups, create_or_join_group, get_groups_by_book, get_member_groups, mark_chapter_as_read, view_progress, group_chapters, get_user_id, fetch_discussions_by_chapter, add_discussion_by_chapter, get_chapter_details, create_book, update_book, delete_book, create_group, update_group, delete_group, fetch_users, view_chapter, create_chapter, update_chapter, delete_chapter, get_books_admin, get_groups_admin, chapter_deadline_notification
 
urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/admin-view/', AdminView.as_view(), name='admin_view'),
    path('api/member-view/', MemberView.as_view(), name='member_view'),
    path('api/user-info/', UserInfoView.as_view(), name='user_info'),
    path('api/books/', get_books, name='get_books'),
    path('api/books/<int:book_id>/', get_book, name='get_book'),
    path('api/groups/', get_groups, name='get_groups'),
    path('api/groups/<int:group_id>/', get_group, name='get_group'),
    path('api/books/<int:book_id>/groups/', create_or_join_group, name='create_or_join_group'),
    path('api/group-by-book/', get_groups_by_book, name='get_groups_by_book'),
    path('api/member/groups/', get_member_groups, name="get_member_groups"),
    path('api/groups/<int:group_id>/chapter/<int:chapter_id>/', mark_chapter_as_read, name='mark_chapter_as_read'),
    path('api/progress/', view_progress, name='view_progress'),
    path('api/groups/<int:group_id>/chapters/', group_chapters, name='group-chapters'),
    path('api/user-id/', get_user_id, name='get_user_id'),
    path('api/groups/<int:group_id>/discussions_by_chapter/', fetch_discussions_by_chapter, name='fetch_discussions_by_chapter'),
    path('api/groups/<int:group_id>/discussions_by_chapter/post/', add_discussion_by_chapter, name='add_discussion_by_chapter'),
    path('api/groupchapter/<int:group_id>/chapter/<int:chapter_id>/', get_chapter_details, name='get_chapter_details'),
    path('api/chapter-deadline-notifications/', chapter_deadline_notification, name='chapter_deadline_notifications'),
    #book CRUD
    path('api/books-admin/', get_books_admin, name='get_books'),
    path('api/books/create/', create_book, name='create_book'),
    path('api/books/<int:book_id>/update/', update_book, name='update_book'),
    path('api/books/<int:book_id>/delete/', delete_book, name='delete_book'),
    #group CRUD
    path('api/groups-admin/', get_groups_admin, name='get_groups'),
    path('api/groups/create/', create_group, name='create_group'),
    path('api/groups/<int:group_id>/update/', update_group, name='update_group'),
    path('api/groups/<int:group_id>/delete/', delete_group, name='delete_group'),
    path('api/users/', fetch_users, name='fetch-users'),
    #chapter CRUD
    path('api/chapter/create/', create_chapter, name='create_chapter'),
    path('api/chapter/', view_chapter, name='view_all_chapters'),  # For retrieving all chapters
    path('api/chapter/<int:chapter_id>/update/', update_chapter, name='update_chapter'),
    path('api/chapter/<int:chapter_id>/delete/', delete_chapter, name='delete_chapter'),
]
 