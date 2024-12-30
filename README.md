## Information Office System
This is a copy repository of cs 319 course project for bilkent information office
## Technologies Used

- **Frontend:**
  - React.js
  - Material-UI (MUI)
  - Axios
  - React Router DOM
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JSON Web Tokens (JWT)
  - Bcrypt.js
  - Nodemailer
- **Others:**
  - Axios interceptors for API calls
  - Environment variables for configuration

## Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (local installation or cloud service like MongoDB Atlas)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/information-office-management.git
cd information-office-management
```

### 2. Setup Backend

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Add the following configurations to `.env`:

```env
MONGODB_URI= Your MongoDB connection string.
JWT_SECRET= A secret key for JWT token signing.
EMAIL_USER= Project's email address used for sending emails.
EMAIL_PASS= Project's email password
EMAIL_HOST= SMTP host (e.g., `smtp-mail.outlook.com` for outlook).
EMAIL_PORT=587
```

### 3. Setup Frontend

Navigate to the `frontend` directory and install dependencies:

```bash
cd ../frontend
npm install
```

## Running the Application

### 1. Start Backend Server

In the `backend` directory:

```bash
npm start
```

The backend server will start on `http://localhost:5000`.

### 2. Start Frontend Server

In the `frontend` directory:

```bash
npm start
```

The frontend application will be available at `http://localhost:3000`.
