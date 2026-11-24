# FixIt — Find a Trusted Repair Shop

FixIt is a platform that connects users who need electronic repairs (smartphones, tablets, PCs, and laptops) with trusted, local repair shops.

---

## Prerequisites

Make sure the following are installed on your machine before starting:

- **Python** 3.12+ — https://www.python.org/downloads/
- **Node.js** 22+ — https://nodejs.org/
- **npm** 10+ — *(comes with Node.js)*
- **MySQL** 8.0+ — https://dev.mysql.com/downloads/
- **MySQL client dev libraries** (Linux only, required by `mysqlclient`):
  ```bash
  sudo apt-get install python3-dev default-libmysqlclient-dev build-essential pkg-config
  ```

---

## Project Structure

```
fixit/
├── backend/            # Django REST API
│   ├── accounts/       # User authentication & profiles
│   ├── shops/          # Shop management
│   ├── request/        # Repair requests
│   ├── review/         # Reviews system
│   ├── FIX_IT/         # Django project settings
│   ├── media/          # Uploaded files (avatars, portfolio images)
│   ├── requirements.txt
│   ├── .env.exemple    # Environment variables template
│   └── manage.py
├── frontend/           # React + Vite SPA
│   ├── src/
│   │   ├── pages/      # Pages grouped by role (visitor, customer, shop)
│   │   ├── components/ # Reusable UI components
│   │   ├── api/        # Axios API layer
│   │   ├── styles/     # CSS modules & global styles
│   │   ├── constants/  # Static data (Algerian wilayas/cities)
│   │   └── assets/     # Logos & fonts
│   ├── package.json
│   └── vite.config.js
├── PROJECT_DETAILS.md  # Full project documentation
```

---

## Setup Instructions

### 1. Start MySQL & Create the Database

First, make sure MySQL is running:

```bash
sudo systemctl start mysql
```

Then enter the MySQL shell:

```bash
mysql -u root -p
```

> It will ask for your **MySQL root password**. Type it and press Enter (characters won't be visible — that's normal).

Once inside the MySQL shell (you'll see `mysql>`), run:

```sql
CREATE DATABASE fix_it_db;
EXIT;
```

### 2. Backend Setup (Django)

```bash
# Navigate to the backend directory
cd backend

# Create a Python virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate        # Linux / macOS
# venv\Scripts\activate         # Windows

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.exemple .env
```

Now open the `.env` file and set your MySQL credentials:

```
DB_NAME=fix_it_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

> ⚠️ Replace `your_mysql_password` with your actual MySQL root password.

Then run:

```bash
# Run database migrations
python manage.py migrate

# (Optional) Create an admin superuser
python manage.py createsuperuser

# Start the backend server
python manage.py runserver 8000
```

The backend API will be available at: **http://127.0.0.1:8000/**

### 3. Frontend Setup (React + Vite)

Open a **new terminal** (keep the backend running in the first one):

```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: **http://localhost:5173/**

> ⚠️ **Important:** The frontend **must** run on port `5173` (configured in `vite.config.js` with `strictPort: true`). If you get a port conflict error, see the Troubleshooting section below.

---

## Testing the Application

1. Open your browser and go to **http://localhost:5173/**
2. You should see the FixIt landing page.
3. You can:
   - **Register** a new account as a **Customer** or a **Shop**.
   - **Search** for repair shops by location, device type, and rating.
   - **Log in** and explore the role-specific dashboards.

### Default API Endpoints

| Endpoint                        | Description                  |
|---------------------------------|------------------------------|
| `GET /api/shops/`               | List all shops               |
| `GET /api/list-shops/`          | Public shop listing          |
| `GET /api/reviews/`             | List reviews                 |
| `GET /api/saved-shops/`         | Saved shops (authenticated)  |
| `GET /api/repair_requests/`     | Repair requests              |
| `POST /accounts/register/`      | Register a new user          |
| `POST /accounts/login/`         | Login (JWT token)            |
| `GET /admin/`                   | Django admin panel           |

### Admin Panel

If you created a superuser, access the Django admin at:
**http://127.0.0.1:8000/admin/**

---

## Important Notes

- Both the **backend** and **frontend** servers must be running simultaneously.
- The backend runs on port **8000** and the frontend on port **5173**.
- Make sure MySQL is running before starting the backend.
- Uploaded media files (avatars, portfolio images) are stored in `backend/media/`.

---

## Troubleshooting

### `mysqlclient` fails to install

If you get an error when running `pip install -r requirements.txt` related to `mysqlclient`, install the required system libraries first:

```bash
sudo apt-get install python3-dev default-libmysqlclient-dev build-essential pkg-config
```

Then run `pip install -r requirements.txt` again.

### Port 5173 already in use

The frontend must run on port **5173** because the backend CORS settings only allow requests from that port. If you get a port error:

```bash
# Find and kill the process using port 5173
sudo kill $(sudo lsof -t -i:5173)

# Then restart the frontend
npm run dev
```

### Port 8000 already in use

If the backend can't start because port 8000 is occupied:

```bash
# Find and kill the process using port 8000
sudo kill $(sudo lsof -t -i:8000)

# Then restart the backend
python manage.py runserver 8000
```

### MySQL is not running

If you get a database connection error when running `python manage.py migrate`:

```bash
# Start the MySQL service
sudo systemctl start mysql

# Verify it's running
sudo systemctl status mysql
```

### "Access denied" for MySQL

If you get `Access denied for user 'root'@'localhost'`, double-check your `.env` file has the correct password. If you forgot your MySQL password, you can reset it:

```bash
# Stop MySQL
sudo systemctl stop mysql

# Create the socket directory if it doesn't exist
sudo mkdir -p /var/run/mysqld
sudo chown mysql:mysql /var/run/mysqld

# Start MySQL without password checking
sudo mysqld_safe --skip-grant-tables &

# Wait a moment, then connect
sleep 3 && mysql -u root

# Inside MySQL, set a new password:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
EXIT;

# Kill the safe mode process and restart normally
sudo killall mysqld mysqld_safe
sleep 2 && sudo systemctl start mysql
```

Then update your `.env` file with the new password.

### "Network error" when using the app

Make sure both servers are running:
- **Backend**: `python manage.py runserver 8000` (in one terminal)
- **Frontend**: `npm run dev` (in another terminal)

Both must be active at the same time. If one is stopped, the app won't function properly.
