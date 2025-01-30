# Group Book Reading App

## Introduction
The Group Book Reading Platform is a web-based platform that allows users to form reading groups, set reading deadlines, engage in discussions, and track reading progress. It is built using Django for the backend and React for the frontend.

## Table of Contents
- [Project Setup](#project-setup)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Role-Based Authentication](#role-based-authentication)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)

## Project Setup

### Backend Setup (Django)
1. Clone the repository:
   ```bash
   git clone https://github.com/NishS07/Group_Book_Reading_Platform.git
   cd Group_Book_Reading_platform/Backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```
6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)
1. Navigate to the frontend directory:
   ```bash
   cd ../Group_Book_Reading_Platform/Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Architecture
The project follows a client-server architecture with the following tech stack:
- **Frontend**: React (with React Router for navigation and state management)
- **Backend**: Django REST Framework (DRF) for API development
- **Database**: SQLite for development
- **Authentication**: JWT-based authentication using Django Simple JWT
- **Role-Based Authentication**: Users are assigned roles (admin, member) with permissions to access specific features.

## Features
### User Authentication
- Register/Login with JWT authentication
- Secure access control for different user roles (admin, member)

### Book & Group Management
- View available books and their details
- Join or create a reading group
- View and manage group details

### Reading Progress
- Track chapter reading progress
- Set and view reading deadlines
- Mark chapters as read

### Discussion Forum
- View discussions for each chapter
- Post and reply to discussion threads

## Project Structure
```
Group_Book_Reading_Platform/
│
├── Backend/              # Django backend
│   ├── manage.py        # Django management script
│   ├── admin.py        # Admin configuration
│   ├── models.py       # Database models
│   ├── permissions.py  # Role-based access control
│   ├── serializers.py  # Data serialization
│   ├── urls.py         # API routes
│   ├── views.py        # API views
│   ├── tests.py        # Backend tests
│   └── db.sqlite3       # SQLite database (use PostgreSQL in production)
│
├── Frontend/             # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   │   ├── AdminHomePage.jsx - Admin dashboard homepage
│   │   │   ├── AdminBookPage.jsx - Admin interface for managing books
│   │   │   ├── AdminChapterPage.jsx - Admin panel for chapter management
│   │   │   ├── AdminGroupsPage.jsx - Admin view for managing groups
│   │   │   ├── HomePage.jsx - Landing page for all users
│   │   │   ├── LoginPage.jsx - User login interface
│   │   │   ├── SignUpPage.jsx - User registration page
│   │   │   ├── ProtectedRoute.jsx - Route protection component
│   │   │   ├── UnauthorizedPage.jsx - Page for unauthorized access attempts
│   │   │   ├── BookSelectionPage.jsx - Page for selecting books
│   │   │   ├── DiscussionPage.jsx - Forum page for book discussions
│   │   │   ├── GroupPage.jsx - Group details and member interactions
│   │   │   ├── MemberGroupPage.jsx - Member-specific group interactions
│   |   ├── tests/          # Frontend tests
│   ├── public/         # Static assets
│   ├── package.json    # Frontend dependencies
│   
```

## Models
The backend includes the following models:
- **User**: Stores user information (username, email, password, role).
- **Book**: Stores information about books, including title, author, genre and description.
- **Group**: Stores reading group details (name, members, reading goals).
- **Chapter**: Stores chapter-wise information, deadlines, and read/unread status.
- **Discussion**: Stores discussion threads for each chapter.

## Role-Based Authentication
The system implements role-based authentication with the following roles:

- **Admin**:
  - Manages books 
  - Manages groups 
  - Manages chapters 

- **Member**:
  - Joins reading groups
  - Reads books and marks progress
  - Participates in discussions

## Testing
The frontend testing is performed using Jest and React Testing Library.

### Running Tests
To run the frontend tests, use the following command:
```bash
npm test
```

## API Endpoints

### Authentication
- `POST /api/register/` - Register a new user
- `POST /api/login/` - Authenticate and retrieve JWT tokens

### Books
- `GET /api/books/` - Retrieve list of books
- `POST /api/books/create/` - Create a new book (admin only)

### Groups
- `GET /api/groups/` - Retrieve list of groups
- `POST /api/books/<book_id>/groups/` - Create or join a group

### Discussions
- `GET /api/groups/<group_id>/discussions_by_chapter/` - Fetch discussions
- `POST /api/groups/<group_id>/discussions_by_chapter/post/` - Add discussion

### Progress Tracking
- `PUT /api/groups/<group_id>/chapter/<chapter_id>/` - Mark a chapter as read
- `GET /api/progress/` - View user’s reading progress

### Admin API Endpoints
- **Books Management:**
  - `GET /api/books-admin/` - Retrieve all books.
  - `POST /api/books/create/` - Add a new book.
  - `PUT /api/books/{book_id}/update/` - Update a book.
  - `DELETE /api/books/{book_id}/delete/` - Remove a book.

- **Groups Management:**
  - `GET /api/groups-admin/` - Retrieve all groups.
  - `POST /api/groups/create/` - Create a new group.
  - `PUT /api/groups/{group_id}/update/` - Update a group.
  - `DELETE /api/groups/{group_id}/delete/` - Remove a group.

- **Chapters Management:**
  - `POST /api/chapter/create/` - Create a new chapter.
  - `GET /api/chapter/` - Retrieve all chapters.
  - `PUT /api/chapter/{chapter_id}/update/` - Update a chapter.
  - `DELETE /api/chapter/{chapter_id}/delete/` - Remove a chapter.

# Login Page 
- User login page with authentication form.

<img width="932" alt="LoginPage" src="https://github.com/user-attachments/assets/98b17857-4efa-4e7c-b9cf-95d733a993ea" />

# Signup Page 
- Registration form for new users, admin.
<img width="905" alt="SignUp" src="https://github.com/user-attachments/assets/ead33483-ba5f-4680-a9bb-5ba4b30b613c" />

# Admin Pages

## AdminHomePage 
- Admin dashboard displaying an overview of books, groups, and chapters.
  
<img width="943" alt="AdminHomepage" src="https://github.com/user-attachments/assets/ba49ffe5-87e9-403f-ae4b-3368a63be376" />

## AdminBooksPage
- Allows admin to manage books (add, read, update, delete).

<img width="926" alt="AdminBooksPage" src="https://github.com/user-attachments/assets/722b235e-ebf8-4c67-aa9c-603b018e75fe" />

## AdminGroupsPage
- Enables admin to create, get, edit, or remove reading groups.

<img width="929" alt="AdminGroupsPage" src="https://github.com/user-attachments/assets/470957dd-b861-427f-9ac8-a8ebde25eeda" />

## AdminChaptersPage
- Admin panel for managing chapters, deadlines, and progress.

<img width="936" alt="AdminChapterPage" src="https://github.com/user-attachments/assets/24b33a77-93d6-4bfd-8bfc-e9e41ef9d6e5" />

# Member Pages

## Home Page
- Displays available books, reading groups, and platform introduction.

<img width="947" alt="Homepage" src="https://github.com/user-attachments/assets/a7e94c5c-985f-49ae-be46-82bcda543842" />

## Notifications Page
- Displays notification based on the chapter deadline.

<img width="934" alt="Notifications" src="https://github.com/user-attachments/assets/5255c54a-b633-4bb6-81a8-b4bb9f0d740c" />

## Book Selection Page 
- Allows users to browse books and create/join groups.

<img width="940" alt="Book-selection Page" src="https://github.com/user-attachments/assets/8f8fc88d-613a-4b64-a709-fddd10b4a65d" />

- In book selection page, we can view groups for a particular book.
  
  <img width="909" alt="grupsforabook" src="https://github.com/user-attachments/assets/3ba11026-7d35-4f69-ae0d-5d33fcc8f425" />
  
- In book selection page, we can create a group for a particular book.
  
  <img width="938" alt="Create group" src="https://github.com/user-attachments/assets/fe589edf-ae93-458b-ad69-90967b9e3acd" />
  
## MemberGroup Page
- Lists all groups the logged-in member is part of.

<img width="937" alt="membergrouppage" src="https://github.com/user-attachments/assets/0b2438f9-8cd5-4274-98d7-17e17c7ce4a3" />

## View Progress Page 
- It displays the progress of whole group, and members that are part of and shows whether the user has read/unread the chapter.

<img width="941" alt="viewprogress" src="https://github.com/user-attachments/assets/e0ea6e90-484a-4fd9-b2d2-83c0dd6680f9" />

## Discussion Page
- Displays chapter-wise discussions and allows users to post comments.

<img width="934" alt="Discussionpage" src="https://github.com/user-attachments/assets/d84efde6-568b-4fdb-9431-027432996cc8" />



