# Only Friends Backend API

A FastAPI-based backend for the Only Friends social app with Twilio Verify integration for phone number verification.

## Features

- 📱 **Phone Number Authentication** with Twilio Verify service
- 🔐 **JWT Token-based Authentication** with access and refresh tokens
- 👥 **Social Features**: Posts, Messages, Friend Requests
- 🗄️ **Supabase Integration** for database and storage
- 🛡️ **Security**: Password hashing, input validation, CORS protection
- 📝 **API Documentation** with automatic OpenAPI/Swagger docs

## Quick Start

### 1. Install Dependencies

```bash
cd backend/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Twilio Verify
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
```

### 3. Test Connections

Test your database connection:
```bash
python test_connection.py
```

Test your Twilio Verify setup:
```bash
python test_twilio_verify.py
```

### 4. Run the API

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/send-verification` | Send SMS verification code |
| POST | `/auth/verify-phone` | Verify phone number with code |
| POST | `/auth/register` | Complete user registration |
| POST | `/auth/login` | Login with phone/password |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user info |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PUT | `/users/me` | Update current user profile |
| GET | `/users/{user_id}` | Get user profile by ID |
| GET | `/users/search/{query}` | Search users |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts/` | Get feed posts |
| POST | `/posts/` | Create new post |
| GET | `/posts/{post_id}` | Get post by ID |
| DELETE | `/posts/{post_id}` | Delete post |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messages/` | Get conversations |
| GET | `/messages/{user_id}` | Get conversation with user |
| POST | `/messages/` | Send message |
| PUT | `/messages/{message_id}/read` | Mark message as read |
| GET | `/messages/unread/count` | Get unread count |

### Friends

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/friends/` | Get friends list |
| POST | `/friends/request` | Send friend request |
| GET | `/friends/requests` | Get friend requests |
| PUT | `/friends/requests/{request_id}` | Accept/reject request |
| DELETE | `/friends/{friend_id}` | Remove friend |
| GET | `/friends/suggestions` | Get friend suggestions |

## Authentication Flow

### 1. Phone Verification

```bash
# Send verification code
curl -X POST "http://localhost:8000/auth/send-verification" \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+1234567890"}'

# Verify code
curl -X POST "http://localhost:8000/auth/verify-phone" \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+1234567890", "code": "123456"}'
```

### 2. Registration (for new users)

```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "password": "securepassword",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  }'
```

### 3. Login (for existing users)

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "password": "securepassword"
  }'
```

### 4. Using Protected Endpoints

Include the access token in the Authorization header:

```bash
curl -X GET "http://localhost:8000/users/me" \
  -H "Authorization: Bearer your-access-token"
```

## Project Structure

```
backend/api/
├── main.py              # FastAPI app entry point
├── config.py            # Configuration settings
├── database.py          # Supabase client setup
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── test_connection.py   # Database connection test
├── test_twilio_verify.py # Twilio Verify test
├── models/              # Pydantic models
│   ├── __init__.py
│   ├── user.py         # User models
│   ├── auth.py         # Authentication models
│   └── social.py       # Social feature models
├── routers/             # API route handlers
│   ├── __init__.py
│   ├── auth.py         # Authentication routes
│   ├── users.py        # User management routes
│   ├── posts.py        # Post management routes
│   ├── messages.py     # Messaging routes
│   └── friends.py      # Friend management routes
├── services/            # Business logic
│   ├── __init__.py
│   ├── auth_service.py # Authentication service
│   ├── sms_service.py  # Twilio Verify service
│   └── user_service.py # User management service
└── utils/               # Utility functions
    ├── __init__.py
    ├── security.py     # JWT and password utilities
    └── helpers.py      # Helper functions
```

## Development

### Running Tests

```bash
# Test database connection
python test_connection.py

# Test Twilio Verify
python test_twilio_verify.py

# Run with auto-reload for development
uvicorn main:app --reload
```

### API Documentation

Visit http://localhost:8000/docs for interactive API documentation.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Yes |
| `TWILIO_VERIFY_SERVICE_SID` | Twilio Verify Service SID | Yes |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | Yes |
| `JWT_ALGORITHM` | JWT algorithm (default: HS256) | No |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Access token expiry (default: 30) | No |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token expiry (default: 7) | No |

## Deployment

### Production Checklist

- [ ] Change `JWT_SECRET_KEY` to a secure random value
- [ ] Set up proper CORS origins in `ALLOWED_ORIGINS`
- [ ] Use environment variables for all sensitive data
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Set up monitoring and health checks
- [ ] Use HTTPS in production

### Deploy to Railway/Heroku

1. Create a new app on your platform
2. Set environment variables
3. Deploy the code
4. Run database migrations if needed

## Troubleshooting

### Common Issues

1. **Supabase Connection Failed**
   - Check your `SUPABASE_URL` and `SUPABASE_KEY`
   - Ensure your Supabase project is active
   - Verify network connectivity

2. **Twilio Verify Not Working**
   - Check your Twilio credentials
   - Ensure your Verify Service is active
   - Verify phone number format (E.164)
   - Check Twilio Console for error logs

3. **JWT Token Issues**
   - Ensure `JWT_SECRET_KEY` is set and consistent
   - Check token expiration times
   - Verify token format in Authorization header

4. **CORS Errors**
   - Add your frontend domain to `ALLOWED_ORIGINS`
   - Check that CORS middleware is properly configured

### Getting Help

- Check the logs for detailed error messages
- Use the test scripts to isolate issues
- Review the API documentation at `/docs`
- Check Supabase and Twilio dashboards for service status
