# Sanawy Bible App

A Node.js Express application for managing student attendance and points system.

## Features

- Student management system
- Attendance tracking with QR codes
- Points system for various activities
- User authentication and authorization
- Ranking system
- Admin dashboard

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB database
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd sanawy-Bible1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   SESSION_SECRET=your-super-secret-session-key-here
   PORT=8080
   NODE_ENV=development
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `SESSION_SECRET` | Secret key for sessions | Yes | - |
| `PORT` | Server port | No | 8080 |
| `NODE_ENV` | Environment mode | No | development |

## Deployment

### Heroku

1. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**
   ```bash
   heroku config:set SESSION_SECRET=your-super-secret-key
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in the dashboard
4. Deploy automatically

### DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy

## Project Structure

```
sanawy-Bible1/
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── student_data.js      # Student model
│   ├── log_student.js       # Student logs model
│   ├── points_value.js      # Points configuration
│   ├── user_login.js        # User authentication
│   └── user_status.js       # User session status
├── views/
│   └── events/              # EJS templates
├── public/                  # Static files
├── files/                   # Uploaded files
├── sanawy_app.js           # Main application file
├── package.json            # Dependencies and scripts
├── Procfile               # Heroku deployment config
└── README.md              # This file
```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Redirect to login/home | No |
| GET | `/login` | Login page | No |
| POST | `/login` | Authenticate user | No |
| GET | `/home` | Dashboard | Yes |
| POST | `/home` | Logout | Yes |
| GET | `/ranking` | Student rankings | No |
| GET | `/add_student` | Add student form | Yes (Admin) |
| POST | `/add_student` | Create student | Yes (Admin) |
| GET | `/attendance` | Attendance form | Yes (Admin) |
| POST | `/attendance` | Record attendance | Yes (Admin) |
| GET | `/all_student` | List all students | Yes (Admin) |
| GET | `/add_student_points` | Add points form | Yes (Admin) |
| POST | `/add_student_points` | Add points | Yes (Admin) |

## Security Features

- Session-based authentication
- Role-based access control (Admin/Creator)
- Input validation
- Secure cookie settings
- Environment variable configuration

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB URI in environment variables
   - Ensure MongoDB Atlas IP whitelist includes your deployment platform

2. **Session Issues**
   - Verify SESSION_SECRET is set
   - Check cookie settings for production

3. **Port Issues**
   - Ensure PORT environment variable is set correctly
   - Check if port is available

### Logs

Check application logs for debugging:
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# Local
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 