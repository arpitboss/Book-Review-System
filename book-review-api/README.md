# Book Review API

A RESTful API built with Node.js and Express for managing book reviews. The API allows users to register, login, add books, write reviews, and search for books by title or author.

## Features

- User authentication with JWT
- Book management (add, update, delete, view)
- Review system (add, update, delete reviews)
- Search functionality for books by title or author
- Pagination for books and reviews
- Input validation
- Error handling

## Tech Stack

- Node.js with Express.js
- MongoDB with Mongoose for database operations
- JWT for authentication
- Express Validator for input validation
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or above)
- MongoDB (local or Atlas)
- npm or yarn

## Installation and Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/arpitboss/Book-Review-System.git
    cd book-review-api
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/book_review_db
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRE=30d
    ```

4. Run the server:

    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm start
    ```

## API Documentation

### Authentication Endpoints

#### Register a New User

```
POST /api/auth/signup
```

Request body:

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

Response:

```json
{
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```
POST /api/auth/login
```

Request body:

```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

Response:

```json
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User

```
GET /api/auth/me
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
    "success": true,
    "data": {
        "_id": "60c72b2f9b1d8c34e0f7b4d2",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2023-05-01T10:30:40.000Z"
    }
}
```

### Book Endpoints

#### Create a New Book

```
POST /api/books
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request body:

```json
{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic",
    "description": "A novel about the mysterious Jay Gatsby and his love for Daisy Buchanan.",
    "publishedYear": 1925,
    "publisher": "Charles Scribner's Sons"
}
```

Response:

```json
{
    "success": true,
    "data": {
        "_id": "60c72c2f9b1d8c34e0f7b4d3",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Classic",
        "description": "A novel about the mysterious Jay Gatsby and his love for Daisy Buchanan.",
        "publishedYear": 1925,
        "publisher": "Charles Scribner's Sons",
        "createdBy": "60c72b2f9b1d8c34e0f7b4d2",
        "createdAt": "2023-05-01T10:35:27.000Z"
    }
}
```

#### Get All Books (with pagination)

```
GET /api/books?page=1&limit=10&author=Fitzgerald&genre=Classic
```

Response:

```json
{
    "success": true,
    "pagination": {
        "total": 1,
        "current_page": 1,
        "items_per_page": 10,
        "total_pages": 1,
        "first_page": 1,
        "last_page": 1,
        "first_item": 1,
        "last_item": 1,
        "links": {
        "first": "http://localhost:5000/api/books?author=Fitzgerald&genre=Classic&page=1&limit=10",
        "last": "http://localhost:5000/api/books?author=Fitzgerald&genre=Classic&page=1&limit=10"
        }
    },
    "count": 1,
    "data": [
        {
        "_id": "60c72c2f9b1d8c34e0f7b4d3",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Classic",
        "description": "A novel about the mysterious Jay Gatsby and his love for Daisy Buchanan.",
        "publishedYear": 1925,
        "publisher": "Charles Scribner's Sons",
        "createdBy": "60c72b2f9b1d8c34e0f7b4d2",
        "createdAt": "2023-05-01T10:35:27.000Z"
        }
    ]
}
```

#### Get Book Details with Reviews

```
GET /api/books/60c72c2f9b1d8c34e0f7b4d3?page=1&limit=10
```

Response:

```json
{
    "success": true,
    "data": {
        "_id": "60c72c2f9b1d8c34e0f7b4d3",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Classic",
        "description": "A novel about the mysterious Jay Gatsby and his love for Daisy Buchanan.",
        "publishedYear": 1925,
        "publisher": "Charles Scribner's Sons",
        "createdBy": "60c72b2f9b1d8c34e0f7b4d2",
        "createdAt": "2023-05-01T10:35:27.000Z",
        "rating": {
        "averageRating": 4.5,
        "reviewCount": 2
        },
        "reviews": {
        "pagination": {
            "total": 2,
            "current_page": 1,
            "items_per_page": 10,
            "total_pages": 1,
            "first_page": 1,
            "last_page": 1,
            "first_item": 1,
            "last_item": 2,
            "links": {
            "first": "http://localhost:5000/api/books/60c72c2f9b1d8c34e0f7b4d3?page=1&limit=10",
            "last": "http://localhost:5000/api/books/60c72c2f9b1d8c34e0f7b4d3?page=1&limit=10"
            }
        },
        "count": 2,
        "data": [
            {
            "_id": "60c72d2f9b1d8c34e0f7b4d4",
            "rating": 5,
            "title": "A masterpiece!",
            "comment": "One of the greatest American novels ever written.",
            "book": "60c72c2f9b1d8c34e0f7b4d3",
            "user": {
                "_id": "60c72b2f9b1d8c34e0f7b4d2",
                "name": "John Doe"
            },
            "createdAt": "2023-05-01T10:40:15.000Z"
            },
            {
            "_id": "60c72e2f9b1d8c34e0f7b4d5",
            "rating": 4,
            "title": "Great read",
            "comment": "Beautifully written with complex characters.",
            "book": "60c72c2f9b1d8c34e0f7b4d3",
            "user": {
                "_id": "60c72b3f9b1d8c34e0f7b4d6",
                "name": "Jane Smith"
            },
            "createdAt": "2023-05-01T10:43:27.000Z"
            }
        ]
        }
    }
}
```

#### Search Books

```
GET /api/books/search?q=gatsby&page=1&limit=10
```

Response:

```json
{
    "success": true,
    "pagination": {
        "total": 1,
        "current_page": 1,
        "items_per_page": 10,
        "total_pages": 1,
        "first_page": 1,
        "last_page": 1,
        "first_item": 1,
        "last_item": 1,
        "links": {
        "first": "http://localhost:5000/api/books/search?q=gatsby&page=1&limit=10",
        "last": "http://localhost:5000/api/books/search?q=gatsby&page=1&limit=10"
        }
    },
    "count": 1,
    "data": [
        {
        "_id": "60c72c2f9b1d8c34e0f7b4d3",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Classic",
        "description": "A novel about the mysterious Jay Gatsby and his love for Daisy Buchanan.",
        "publishedYear": 1925,
        "publisher": "Charles Scribner's Sons",
        "createdBy": "60c72b2f9b1d8c34e0f7b4d2",
        "createdAt": "2023-05-01T10:35:27.000Z"
        }
    ]
}
```

### Review Endpoints

#### Add a Review to a Book

```
POST /api/books/60c72c2f9b1d8c34e0f7b4d3/reviews
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request body:

```json
{
    "rating": 5,
    "title": "A masterpiece!",
    "comment": "One of the greatest American novels ever written."
}
```

Response:

```json
{
    "success": true,
    "data": {
        "_id": "60c72d2f9b1d8c34e0f7b4d4",
        "rating": 5,
        "title": "A masterpiece!",
        "comment": "One of the greatest American novels ever written.",
        "book": "60c72c2f9b1d8c34e0f7b4d3",
        "user": "60c72b2f9b1d8c34e0f7b4d2",
        "createdAt": "2023-05-01T10:40:15.000Z"
    }
}
```

#### Update a Review

```
PUT /api/reviews/60c72d2f9b1d8c34e0f7b4d4
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request body:

```json
{
    "rating": 4,
    "title": "Still amazing",
    "comment": "Updated my review after a second reading."
}
```

Response:

```json
{
    "success": true,
    "data": {
        "_id": "60c72d2f9b1d8c34e0f7b4d4",
        "rating": 4,
        "title": "Still amazing",
        "comment": "Updated my review after a second reading.",
        "book": "60c72c2f9b1d8c34e0f7b4d3",
        "user": "60c72b2f9b1d8c34e0f7b4d2",
        "createdAt": "2023-05-01T10:40:15.000Z"
    }
}
```

#### Delete a Review

```
DELETE /api/reviews/60c72d2f9b1d8c34e0f7b4d4
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
    "success": true,
    "message": "Review deleted successfully"
}
```

## Database Schema

### User

```
{
    name: String (required),
    email: String (required, unique),
    password: String (required, hashed),
    createdAt: Date
}
```

### Book

```
{
    title: String (required),
    author: String (required),
    genre: String (required),
    description: String (required),
    isbn: String (unique),
    publishedYear: Number,
    publisher: String,
    createdBy: ObjectId (ref: User),
    createdAt: Date,
    averageRating: Number (virtual)
}
```

### Review

```
{
    rating: Number (required, 1-5),
    title: String,
    comment: String (required),
    book: ObjectId (ref: Book),
    user: ObjectId (ref: User),
    createdAt: Date
}
```

## Error Handling

The API implements proper error handling for:

- Validation errors
- Database errors (duplicate keys, etc.)
- Authentication errors
- Not found errors
- Server errors

## Security Measures

- Password hashing with bcrypt
- JWT authentication
- Input validation
- HTTP security headers with Helmet
- Environment variables for sensitive data