# Backend Email Server

Simple Node.js server for sending registration emails via SMTP.

## Setup

```bash
cd backend
npm install
npm start
```

## Environment

The server runs on port 3001 by default.

## API

### POST /api/send-email

Send a registration email.

**Body:**
```json
{
  "to": "user@example.com",
  "prenom": "John",
  "tempPassword": "abc123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```
