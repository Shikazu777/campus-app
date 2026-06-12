# Campus App Management System

## Overview

Campus App Management System is a full-stack smart campus platform designed to centralize student services, canteen operations, event management, analytics, trust scoring, and administrative controls into a single web application.

The project was developed as a mini-project to demonstrate modern full-stack application development using FastAPI, React, PostgreSQL, and Role-Based Access Control (RBAC).

The system provides separate functionality for students and administrators while maintaining a scalable architecture suitable for future deployment and expansion.

---

# Objectives

The primary goals of the project are:

* Digitize campus operations
* Reduce manual administrative tasks
* Improve student engagement
* Provide real-time analytics
* Track student participation
* Enable QR-based verification workflows
* Demonstrate role-based access management
* Build a scalable smart-campus foundation

---

# Key Features

## Student Module

### Student Dashboard

Students can:

* View profile information
* Track trust score
* Monitor campus activity
* View participation history

---

### Canteen Ordering System

Features:

* Browse available food items
* View pricing information
* Place food orders
* Track order status
* View order history
* QR-based order collection

Benefits:

* Reduced waiting time
* Digital order management
* Improved canteen workflow

---

### Event Registration System

Students can:

* View available events
* Register for events
* Monitor registration status
* Receive attendance QR codes
* View event history

---

### Analytics Dashboard

Provides:

* Spending trends
* Category-wise spending breakdown
* Most ordered food items
* Participation statistics
* Trust score visualization

Visualizations include:

* Pie Charts
* Bar Charts
* Trend Analysis

---

### Trust Score System

Each student receives a dynamic trust score.

Trust score is influenced by:

Positive Factors:

* Event attendance
* Successful transactions
* Order collection completion

Negative Factors:

* Event no-shows
* Uncollected orders
* Repeated inactive registrations

Trust score tiers:

* High Trust
* Normal
* Low Trust

---

# Administrative Module

## Administrative Dashboard

Provides institution-wide monitoring.

Administrators can:

* Monitor campus activity
* Review student statistics
* Analyze ordering trends
* Track participation metrics

---

## Event Management

Administrators can:

* Create events
* Edit events
* Disable events
* View registrations
* Confirm attendance

---

## Canteen Management

Administrators can:

* Add food items
* Update stock
* Enable/disable products
* Monitor orders
* Mark orders as completed

---

## Analytics Management

Provides:

* Spending analytics
* Most ordered products
* Participation statistics
* Trust score distribution

---

# Role-Based Access Control (RBAC)

The system implements role-based permissions.

Supported Roles:

### OWNER

Full system access.

Capabilities:

* User management
* Event management
* Analytics access
* Role assignment

---

### EVENT_EDITOR

Capabilities:

* Create events
* Update events
* Manage registrations

---

### CANTEEN_EDITOR

Capabilities:

* Manage menu items
* Manage stock
* Process orders

---

# Technology Stack

## Frontend

### React

Used for:

* User Interface
* Routing
* State Management
* Dashboard Rendering

Features:

* Component-Based Architecture
* Responsive Layouts
* API Integration

---

## Backend

### FastAPI

Used for:

* REST API Development
* Business Logic
* Validation
* Authentication Foundation

Benefits:

* High Performance
* Automatic Documentation
* Type Safety
* Easy Scalability

Swagger Documentation:

http://localhost:8000/docs

---

## Database

### PostgreSQL

Stores:

* Students
* Transactions
* Orders
* Events
* Registrations
* Roles
* Permissions

### Cloud Database

The application supports cloud-hosted PostgreSQL databases such as:

* Neon PostgreSQL

Benefits:

* Online access
* Automatic backups
* Easy deployment integration

---

# Database Schema

## Students

| Field       | Type    |
| ----------- | ------- |
| id          | Integer |
| email       | String  |
| trust_score | Float   |
| trust_tier  | String  |

---

## Transactions

| Field      | Type     |
| ---------- | -------- |
| id         | Integer  |
| student_id | Integer  |
| amount     | Float    |
| category   | String   |
| status     | String   |
| timestamp  | DateTime |

---

## Canteen Items

| Field        | Type    |
| ------------ | ------- |
| id           | Integer |
| name         | String  |
| price        | Float   |
| category     | String  |
| stock        | Integer |
| is_available | Boolean |

---

## Canteen Orders

| Field        | Type    |
| ------------ | ------- |
| id           | Integer |
| student_id   | Integer |
| total_amount | Float   |
| status       | String  |
| qr_token     | String  |

---

## Events

| Field       | Type     |
| ----------- | -------- |
| id          | Integer  |
| name        | String   |
| department  | String   |
| eligibility | String   |
| event_time  | DateTime |

---

## Event Registrations

| Field      | Type    |
| ---------- | ------- |
| id         | Integer |
| student_id | Integer |
| event_id   | Integer |
| status     | String  |
| qr_token   | String  |

---

# Project Architecture

Frontend

↓

React

↓

FastAPI Backend

↓

SQLAlchemy ORM

↓

PostgreSQL Database

---

# Project Structure

```text
campus-app
│
├── main.py
├── database.py
├── models.py
├── schemas.py
├── scoring.py
├── rbac.py
├── seed_roles.py
├── qr_utils.py
│
├── analytics/
│
├── ui/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── requirements.txt
└── README.md
```

# Local Development Setup

## Clone Repository

```bash
git clone git@github.com:Shikazu777/campus-app.git
cd campus-app
```

## Create Python Virtual Environment

```bash
python3 -m venv .venv
```

Activate:

```bash
source .venv/bin/activate
```

---

## Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create:

```text
.env
```

Example:

```env
DATABASE_URL=postgresql://username:password@host/database
```

The backend loads environment variables using:

```python
load_dotenv()
```

---

## Start Backend

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API Docs:

```text
http://127.0.0.1:8000/docs
```

---

## Start Frontend

```bash
cd ui

npm install

npm start
```

Frontend URL:

```text
http://localhost:3000
```

---

# Future Enhancements

* JWT Authentication
* Mobile Application
* Push Notifications
* AI-Based Recommendations
* Power BI Integration
* Real-Time Event Updates
* Payment Gateway Integration
* Advanced Analytics
* Attendance Prediction Models

---

# Author

**Dhanraj Nagarajan**

OnS1

Campus App Management System

2025-2026



begin

cd ~/Projects/campus-app

Terminal 1:

FastAPI Backend
http://127.0.0.1:8000

Terminal 2:

React Frontend
http://localhost:3000

BACKEND

source .venv/bin/activate
uvicorn main:app --reload

FRONTEND

cd ~/Projects/campus-app/ui
npm start


GITPUSH

git status

git add .

git commit -m "Describe what changed"

git push