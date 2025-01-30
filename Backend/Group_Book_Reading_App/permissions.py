from rest_framework.permissions import BasePermission
 
class IsAdmin(BasePermission):
    """
    Custom permission to allow only Admin users to access specific views.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
 
class IsMember(BasePermission):
    """
    Custom permission to allow only Member users to access specific views.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'member'