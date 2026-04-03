# Software Requirements Specification (SRS)
## Project: HiTech Smartphone Repair Platform
**Version:** 1.0.0  
**Date:** April 4, 2026  
**Status:** Final Draft  
**Deployment Environment:** Vercel (Production)  
**Database:** Neon (PostgreSQL)

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to provide a comprehensive and detailed specification for the **HiTech Smartphone Repair Platform**. This document outlines the functional and non-functional requirements, system architecture, database design, API specifications, and deployment infrastructure. It serves as a guide for developers, project managers, and stakeholders to understand the "Why, What, How, and Where" of every system component.

### 1.2 Scope
The HiTech platform is a web-based service designed to streamline the process of smartphone repairs for both customers and workshop administrators. 
- **For Customers**: It provides a transparent interface to select phone models, choose repair services (e.g., screen repair, battery replacement), calculate costs, and book a repair with an integrated payment screenshot verification system.
- **For Admins**: It offers a centralized dashboard to manage repair catalogs, monitor incoming bookings, verify payments, and update the status of repairs in real-time.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification.
- **SSG**: Static Site Generation.
- **SSR**: Server-Side Rendering.
- **JWT**: JSON Web Token (used for authentication).
- **ORM**: Object-Relational Mapping (Prisma).
- **UPI**: Unified Payments Interface (Indian digital payment system).
- **CRUD**: Create, Read, Update, Delete.

### 1.4 References
- Next.js Documentation (App Router)
- Prisma ORM Documentation
- Vercel Deployment Guides
- Neon.tech Serverless PostgreSQL Documentation

---

## 2. Overall Description

### 2.1 Product Perspective
HiTech is an independent, full-stack web application built using the **Next.js 16** framework. It replaces manual or paper-based repair tracking with a digital workflow. The system interacts with a cloud-hosted PostgreSQL database (Neon) and is deployed on Vercel for high availability and performance.

### 2.2 Product Functions
The high-level functions provided by the system include:
1.  **User Authentication**: Secure registration and login using encrypted phone numbers and passwords.
2.  **Repair Configuration**: Dynamic selection of phone brands, models, and repair services with instant price calculation.
3.  **Booking Management**: Submitting repair requests with specific delivery methods (Drop-off or Parcel).
4.  **Payment Verification**: Uploading screenshots for UPI/Online payments and admin-side verification.
5.  **Admin Catalog Management**: Ability to add new brands, models, and service types without editing code.
6.  **Status Tracking**: Real-time updates on repair progress (Pending, Repairing, Repaired).

### 2.3 User Classes and Characteristics
- **Customer**: Non-technical users who want a simple interface to book repairs. They can see their own dashboard and history.
- **Success/Super User (Admin)**: Technical or administrative staff who manage the entire business flow. They have access to sensitive financial data (screenshots) and can modify the system catalog.

### 2.4 Operating Environment
- **Client**: Modern web browsers (Chrome, Safari, Firefox, Edge) on Desktop and Mobile.
- **Server**: Node.js environment (Vercel Serverless Functions).
- **Database**: PostgreSQL 16+ (Managed by Neon.tech).

### 2.5 Design and Implementation Constraints
- **Database Scalability**: Must use a serverless-compatible connection pooler (Neon HTTP/WebSockets).
- **Security**: Passwords must never be stored in plain text (bcrypt hashing).
- **Mobile First**: 80% of users are expected to access the site via mobile devices.

---

## 3. System Features (Why, What, How)

### 3.1 Authentication Module
- **Why**: To ensure data privacy and associate bookings with specific user accounts.
- **What**: A secure login and registration system.
- **How**: 
  - **Registration**: Users provide a username, phone number (unique), and password.
  - **Hashing**: `bcryptjs` is used with a salt factor of 10 to hash passwords before database storage.
  - **Login**: `NextAuth` handles the session via **JWT (JSON Web Tokens)** stored in secure cookies.
- **Where**: `src/app/login`, `src/app/register`, and `src/app/api/auth`.

### 3.2 Dynamic Repair Booking Flow
- **Why**: To provide users with instant quotes and clear instructions without manual inquiry.
- **What**: A three-step interactive form (Brand -> Model -> Services).
- **How**: 
  - Use React state to filter models based on the selected brand.
  - Use Prisma to fetch the latest repair catalog from PostgreSQL.
  - Calculate totals dynamically in the frontend to provide immediate feedback.
- **Where**: `src/app/repairs`, `src/components/RepairBookingFlow`.

### 3.3 Admin Super-Dashboard
- **Why**: To allow business owners to manage operations without developer intervention.
- **What**: A secure area for managing bookings and the repair catalog.
- **How**: 
  - **Catalog Management**: Admins can add new brands/models directly through UI components.
  - **Status Updates**: Simple dropdowns to update `paymentStatus`, `bookingStatus`, and `repairStatus`.
- **Where**: `src/app/admin`, `src/components/AdminBookingList`.

---

## 4. Technical Specification & API Documentation

### 4.1 Technology Stack
- **Framework**: Next.js 16 (App Router + Turbopack).
- **Language**: TypeScript (Type-safe development).
- **Database Layer**: Prisma ORM with PostgreSQL.
- **Styling**: Vanilla CSS for flexibility and high-performance rendering.
- **Auth**: NextAuth.js.

### 4.2 Database Schema (Prisma Models)
The system uses a relational schema designed for flexibility and data integrity:

#### User Table
- `id`: Unique String (UUID).
- `username`: String.
- `phoneNumber`: String (Unique index).
- `passwordHash`: String (Encrypted).
- `role`: String (Default: "CUSTOMER").

#### Brand Table
- `id`: Unique String (UUID).
- `name`: String (e.g., Apple, Motorola, Samsung).

#### Model Table
- `id`: Unique String (UUID).
- `name`: String (e.g., iPhone 13, Moto G85).
- `brandId`: Foreign Key to Brand.

#### RepairService Table
- `id`: Unique String (UUID).
- `type`: String (e.g., Screen Repair).
- `price`: Float (Customer-facing price).
- `partPrice`: Float (Internal cost for profit calculation).

#### Booking Table
- `id`: Unique String (UUID).
- `customerId`: Foreign Key to User.
- `totalAmount`: Float.
- `paymentStatus`: String (PENDING, VERIFIED, REJECTED).
- `repairStatus`: String (PENDING, REPAIRING, REPAIRED).
- `paymentScreenshotUrl`: String (URL to hosted image).

---

### 4.3 API Endpoint Documentation

#### **Auth Endpoints**
-   **POST `/api/auth/register`**
    -   *Description*: Creates a new user account.
    -   *Payload*: `{ username, phoneNumber, password }`
    -   *Success Response*: `201 Created` with user ID.
    -   *Error Response*: `409 Conflict` if phone number exists.

#### **Admin Catalog Endpoints**
-   **POST `/api/admin/repairs`**
    -   *Description*: Adds a new repair service/brand/model.
    -   *Payload*: `{ brandName, modelName, type, price, ... }`
    -   *Authentication*: Admin Session Required.
    -   *How*: Checks if brand exists, creates it if not, then creates model and service.

#### **Booking Endpoints**
-   **POST `/api/checkout`**
    -   *Description*: Finalizes a repair booking.
    -   *Payload*: `{ modelId, services[], paymentMethod, contactAddress, ... }`
    -   *How*: Cross-references service IDs to calculate total price server-side to prevent tampering.

#### **Data Management Endpoints**
-   **GET `/api/seed`**
    -   *Description*: Initializes the database with default brands and a super-admin.
    -   *Why*: To ensure a clean starting state on new deployments.

---

## 5. Deployment & Infrastructure (Why, How, and Where)

### 5.1 Hosting: Vercel (The "Where")
- **Why**: Vercel provides the best serverless performance for Next.js applications, offering edge caching and automatic CI/CD.
- **How**:
  - Connected via the **Disconnected1377/Phone_Repair** GitHub repository.
  - Automatic builds triggered on every `git push`.
  - Serverless functions handle the API routes and database queries.

### 5.2 Database: Neon (The "How")
- **Why**: SQLite (local) is not suitable for Vercel's ephemeral file system. Neon provides a serverless PostgreSQL instance that scales to zero when not in use, making it ideal for free hosting.
- **How**:
  - The project uses a **Connection String** with `sslmode=require`.
  - Prisma migrations are executed via `npx prisma migrate dev` to keep the cloud schema in sync with the code.

### 5.3 Infrastructure Security
- **Next.js Middleware**: Protects admin routes from unauthorized access.
- **Secure Cookies**: NextAuth sessions are stored in `HttpOnly` cookies to prevent XSS attacks.
- **SSL**: Compulsory SSL (HTTPS) provided by Vercel for all deployments.

---

## 6. Project Walkthrough: Build and Verification
In the final phase of development, the following verification steps were taken:
1.  **Migration Verification**: The database was migrated from local SQLite to Neon PostgreSQL using `prisma migrate`.
2.  **TypeScript Safety**: All components were strictly typed to prevent runtime errors.
3.  **Build Check**: `npm run build` was executed successfully on Vercel, confirming that the "failed to collect page data" errors were resolved by adding the `postinstall` script.
4.  **Seeding**: The `/api/seed` route was used to initialize the production environment.

---

## 7. Future Roadmap
- **Real-time Notifications**: Integration with WhatsApp or SMS APIs to notify customers of status changes.
- **Warranty Management**: Tracking repair dates and generating warranty certificates (PDF).
- **Inventory Tracking**: Subtracting parts from a digital inventory when a repair is marked as "Repaired".

---
**End of Documentation**
