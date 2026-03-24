# Smartphone Repair Application Implementation Plan
This plan details the implementation steps for building the smartphone repair web application, including database architecture, Next.js frontend setup with vanilla CSS, and the authentication/booking flows.

## User Review Required
IMPORTANT

The database schema below uses Prisma Client. I will use a local SQLite database for development, which keeps setup simple.
Real OTP implementation typically requires a paid service (like Twilio or MSG91). I will implement a "mock OTP" verification for testing purposes, but everything else will be fully functional.

## Proposed Changes
### Setup and Architecture
I will initialize a new full-stack Next.js project to handle both the backend APIs and frontend UI. We'll use standard CSS modules or global CSS to achieve the premium, dynamic design without relying on Tailwind.

## Components
1. **User Authentication**: Handles user registration, login, and authentication.
2. **Device Management**: Allows users to add, view, and manage devices.
3. **Repair Tracking**: Enables users to track repair status and costs.
4. **Admin Dashboard**: For administrators to manage users and monitor repairs.
5. **Notification System**: Email/SMS notifications for updates on repairs.

## Verification Plan
- **Unit Testing**: Each component will have unit tests to ensure functionality.
- **Integration Testing**: Testing interactions between components.
- **User Acceptance Testing (UAT)**: Feedback from users to validate the application meets their needs.
- **Performance Testing**: Stress testing to ensure the application can handle load.
- **Security Testing**: Ensuring user data is secure and free from vulnerabilities.

### schema.prisma
The core feature relies on a well-structured database:

```prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
model User {
  id            String    @id @default(uuid())
  username      String    @unique
  phoneNumber   String    @unique
  passwordHash  String
  role          String    @default("CUSTOMER") // CUSTOMER or ADMIN
  bookings      Booking[]
  createdAt     DateTime  @default(now())
}
model Brand {
  id     String  @id @default(uuid())
  name   String  @unique
  models Model[]
}
model Model {
  id         String          @id @default(uuid())
  name       String
  brandId    String
  brand      Brand           @relation(fields: [brandId], references: [id])
  services   RepairService[]
  bookings   Booking[]
}
model RepairService {
  id              String           @id @default(uuid())
  modelId         String
  model           Model            @relation(fields: [modelId], references: [id])
  type            String           // e.g., "Screen Repair", "Battery"
  description     String
  price           Float
  partPrice       Float            // Base cost for the part
  bookingServices BookingService[]
}
model Booking {
  id                   String           @id @default(uuid())
  customerId           String
  customer             User             @relation(fields: [customerId], references: [id])
  modelId              String
  model                Model            @relation(fields: [modelId], references: [id])
  totalAmount          Float
  paymentMethod        String           // "OFFLINE" or "ONLINE"
  paymentScreenshotUrl String?          // For Online QR payments
  paymentStatus        String           @default("PENDING") // PENDING, VERIFIED, REJECTED
  bookingStatus        String           @default("PENDING") // PENDING, APPROVED, DISAPPROVED
  repairStatus         String           @default("PENDING") // PENDING, REPAIRING, REPAIRED, UNREPAIRED
  contactAddress       String           // The delivery/shop address
  deliveryMethod       String           // "DROP_OFF" or "PARCEL"
  services             BookingService[]
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt
}
model BookingService {
  id              String        @id @default(uuid())
  bookingId       String
  booking         Booking       @relation(fields: [bookingId], references: [id])
  repairServiceId String
  repairService   RepairService @relation(fields: [repairServiceId], references: [id])
  priceApplied    Float
} 

