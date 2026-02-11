# FormBuilder API Server

Backend server for FormBuilder using Bun, Elysia, and MongoDB.

## Setup

1. Install dependencies:
```bash
cd server
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

3. Start MongoDB:
```bash
# Using local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. Run the server:
```bash
bun run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/formbuilder` | MongoDB connection string |
| `JWT_SECRET` | - | JWT signing secret |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |

## API Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/user/:email` - Get user by email

### Forms
- `GET /forms?userId=` - Get user's forms
- `POST /forms` - Create form
- `GET /forms/:id` - Get form
- `PUT /forms/:id` - Update form
- `DELETE /forms/:id` - Delete form

### Templates
- `GET /templates` - Get all templates
- `GET /templates/:id` - Get template
- `POST /templates/:id/use` - Create form from template
