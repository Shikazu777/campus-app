# Campus App Management System

## Overview

The Campus App Management System is a full-stack web application designed to digitize and streamline campus operations through a unified platform. The system integrates canteen ordering, event management, analytics dashboards, trust scoring, role-based access control, and administrative monitoring into a single ecosystem.

The primary objective of this project is to reduce manual campus processes, improve operational efficiency, provide real-time insights, and create a scalable foundation for future smart-campus initiatives.

---

# Features

## Student Features

### Canteen Ordering

* Browse available food items
* View item prices and stock availability
* Place digital food orders
* Track order status in real time
* View order history
* QR-based order collection

### Analytics Dashboard

* Personal spending analytics
* Spending trends over time
* Category-wise spending breakdown
* Most ordered food item
* Trust score visualization

### Event Management

* Browse available events
* Register for events
* View registration status
* QR-based event attendance
* Event participation history

### Trust Score System

* Dynamic trust score calculation
* Trust tier classification
* Attendance tracking
* Order collection tracking
* Behavioral analytics

---

## Administrator Features

### Campus Analytics

* Student spending analytics
* Campus-wide food ordering statistics
* Most ordered food reports
* Trust score monitoring
* Risk identification

### Event Management

* Create events
* Update events
* Close events
* Manage registrations
* Monitor attendance

### Canteen Management

* Add food items
* Update stock levels
* Toggle item availability
* Monitor orders
* Mark orders as ready

### Role-Based Access Control (RBAC)

* Assign user roles
* Manage permissions
* Separate administrative responsibilities

---

# Technology Stack

## Frontend

### ReactJS

Used to build the interactive user interface.

Key React Concepts:

* Functional Components
* Hooks
* Context API
* React Router
* State Management

### Chart.js

Used for analytics visualization.

Charts:

* Pie Charts
* Line Charts
* Bar Charts

---

## Backend

### FastAPI

FastAPI was chosen because of:

* High performance
* Automatic Swagger documentation
* Type safety
* Simple API development
* Excellent scalability

API Documentation:

```bash
http://localhost:8000/docs
```

---

## Database

### PostgreSQL

Used for:

* User Management
* Transactions
* Orders
* Event Registrations
* Analytics Data

### Neon PostgreSQL

Cloud-hosted PostgreSQL database used during deployment.

---

## Deployment

### Frontend

Hosted using:

* Vercel

Benefits:

* Automatic deployments
* GitHub integration
* Global CDN

---

### Backend

Hosted using:

* Render

Benefits:

* Free deployment
* FastAPI support
* Environment variable management

---

### Database

Hosted using:

* Neon PostgreSQL

Benefits:

* Free cloud PostgreSQL
* Automatic backups
* Easy connection management

---

# System Architecture

```
┌─────────────────────┐
│      React UI       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      FastAPI        │
│   Business Logic    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    PostgreSQL DB    │
└─────────────────────┘
```

---

# Project Modules

## 1. Authentication Module

Responsibilities:

* User Login
* User Identification
* Role Detection
* Session Management

User Types:

* Student
* Owner/Admin

---

## 2. Analytics Module

Responsibilities:

* Spending aggregation
* Transaction analysis
* Visualization preparation
* Export functionality

Endpoints:

```http
GET /analytics/student/{student_id}
GET /analytics/admin
GET /analytics/trust/student/{student_id}
GET /analytics/trust/admin
```

---

## 3. Canteen Module

Responsibilities:

* Menu management
* Order processing
* Stock management
* QR verification

Endpoints:

```http
GET /canteen/items
POST /canteen/order
GET /canteen/orders
POST /canteen/mark-ready
POST /canteen/scan
```

---

## 4. Event Module

Responsibilities:

* Event creation
* Registration management
* Attendance tracking
* Event analytics

Endpoints:

```http
POST /event/create
POST /event/register
POST /event/confirm
POST /event/scan
```

---

## 5. Trust Score Module

Responsibilities:

* Score calculation
* Behavioral monitoring
* Attendance tracking
* Risk identification

Factors Affecting Trust Score:

Positive:

* Event attendance
* Successful transactions
* Order collection

Negative:

* Event no-shows
* Uncollected orders

---

# Database Design

## Student

| Field       | Type    |
| ----------- | ------- |
| id          | Integer |
| email       | String  |
| trust_score | Integer |
| trust_tier  | String  |

---

## Transaction

| Field      | Type     |
| ---------- | -------- |
| id         | Integer  |
| student_id | Integer  |
| amount     | Float    |
| category   | String   |
| status     | String   |
| timestamp  | DateTime |

---

## CanteenOrder

| Field        | Type    |
| ------------ | ------- |
| id           | Integer |
| student_id   | Integer |
| total_amount | Float   |
| status       | String  |
| qr_token     | String  |

---

## Event

| Field       | Type     |
| ----------- | -------- |
| id          | Integer  |
| name        | String   |
| description | String   |
| department  | String   |
| event_time  | DateTime |

---

# Analytics Implemented

## Student Analytics

Displays:

* Spending by category
* Spending over time
* Most ordered food item

Visualization:

* Pie Chart
* Line Chart

---

## Administrative Analytics

Displays:

* Student spending comparison
* Most ordered campus food
* Trust score overview

Visualization:

* Bar Chart
* Tables
* Summary Cards

---

# Challenges Faced

## Analytics Data Errors

Issue:

* Student analytics API returned null data

Solution:

* Seeded realistic transaction data
* Added defensive React rendering
* Added loading state management

---

## CSV Export Errors

Issue:

```python
AttributeError:
Transaction.created_at
```

Solution:

```python
Transaction.timestamp
```

Used the correct database field.

---

## Deployment Issues

Issue:

```python
DATABASE_URL = None
```

Solution:

Configured environment variables correctly on Render.

---

## React Hook Errors

Issue:

```javascript
React Hook useMemo called conditionally
```

Solution:

Moved hooks outside conditional rendering blocks.

---

# Future Enhancements

### JWT Authentication

* Secure login
* Refresh tokens
* Role-based authorization

### Power BI Integration

* Advanced dashboards
* Predictive analytics
* KPI tracking

### Mobile Application

* Android support
* iOS support

### AI Recommendations

* Food recommendations
* Event recommendations
* Personalized suggestions

### Real Payment Gateway

* Razorpay
* Stripe
* UPI support

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/campus-app.git
```

---

## Backend Setup

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn main:app --reload
```

---

## Frontend Setup

```bash
cd ui
npm install
npm start
```

---

# Project Status

Current Version: v1.0

Completed Modules:

* Student Dashboard
* Admin Dashboard
* Analytics System
* Trust Scoring
* Canteen Ordering
* Event Management
* CSV Export
* Role-Based Access Control
* Deployment

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