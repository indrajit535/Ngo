# NGO Backend API

## 🚀 Live API
`https://ngo-backend-api.onrender.com`

## 🔑 Admin Credentials
- Email: `ariyan208@gmail.com`
- Password: `ariyan@265`

## 📚 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | Get all campaigns |
| GET | `/api/campaigns/:id` | Get single campaign |
| POST | `/api/campaigns` | Create campaign (Admin) |
| PUT | `/api/campaigns/:id` | Update campaign (Admin) |
| DELETE | `/api/campaigns/:id` | Delete campaign (Admin) |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donations` | Create donation |
| GET | `/api/donations/my-donations` | Get user donations |
| GET | `/api/donations/campaign/:id` | Get campaign donations |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id/block` | Block/Unblock user |
| GET | `/api/admin/donations` | Get all donations |
| GET | `/api/admin/stats` | Dashboard stats |

## 🛠️ Tech Stack
- Node.js
- Express
- Supabase
- JWT Authentication
- Bcrypt

## 📦 Deployment
- Render.com
- GitHub Auto Deploy
