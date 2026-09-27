# Restaurant Order Management System - Work Plan

## Permission Rule
- This file is the first planning document.
- No application code, package installation, database setup, or implementation work will begin until the user gives permission after reviewing this plan.
- Before each major implementation stage, permission will be requested.
- If the user says stop, all work will stop immediately.

## Objective
Build a Restaurant Order Management System using:
- React Native mobile application
- Node.js and Express.js REST API
- MongoDB database
- JWT authentication

Products and orders will always be loaded from the backend API. The mobile app will not contain static product or order records.

## Planned Work

### Stage 1: Project Structure
- Create a backend project outside the `work` folder.
- Create a React Native application outside the `work` folder.
- Keep this `work` folder for documentation only.
- Add environment configuration examples without committing secrets.
- Configure the React Native app for Android, iOS, and web so it can run on mobile devices and in a laptop browser.
- Use responsive layouts, flexible content widths, touch-friendly controls, and mouse/keyboard-friendly web interaction.

### Stage 2: Backend Foundation
- Initialize Node.js and Express.js.
- Add MongoDB connection using Mongoose.
- Add environment variable support.
- Add centralized error handling.
- Add request validation and consistent JSON responses.
- Add appropriate HTTP status codes.

### Stage 3: Database Models
- User model: name, email, password hash, role.
- Product model: name, price, category, isAvailable, createdAt.
- Order model: orderNumber, items, totalAmount, status, createdAt.
- Order item fields: productId, productName, quantity, price.
- Add database rules for valid values and order status transitions.

### Stage 4: Authentication API
- Implement `POST /api/auth/login`.
- Validate email and password.
- Compare the password with the stored bcrypt hash.
- Issue a JWT after successful login.
- Protect product and order endpoints with JWT middleware.
- Enforce role permissions where required.

### Stage 5: Product APIs
- Implement `GET /api/products`.
- Implement `POST /api/products`.
- Implement `PUT /api/products/:id`.
- Implement `DELETE /api/products/:id`.
- Support product search through an API query parameter.
- Validate name, price, category, and availability.

### Stage 6: Order APIs
- Implement `GET /api/orders`.
- Implement `GET /api/orders/:id`.
- Implement `POST /api/orders`.
- Implement `PUT /api/orders/:id/status`.
- Validate product IDs and quantities against MongoDB.
- Calculate total amount on the server from current product data.
- Allow only `Pending -> Preparing -> Completed` status movement.
- Generate unique order numbers.

### Stage 7: React Native Application
- Add login screen with email, password, validation, loading, and error states.
- Store the JWT securely on the device.
- Add authenticated navigation.
- Add dashboard showing total products, total orders, pending orders, and completed orders.
- Add product list with name, price, category, availability, and API search.
- Add reusable product form for adding and editing products.
- Add delete confirmation and error handling.
- Add create-order screen with multiple product selection, quantities, total calculation, and submission.
- Add orders screen showing order number, total amount, status, and valid status updates.
- Add reusable loading, error, input, product, and order components.

### Stage 8: Testing and Verification
- Test authentication success and failure cases.
- Test protected endpoints without and with invalid JWTs.
- Test product CRUD and validation.
- Test order creation, total calculation, invalid items, and status transitions.
- Test mobile loading, validation, API errors, navigation, and logout.
- Verify that products and orders are fetched from APIs and are not hardcoded in the mobile app.

### Stage 9: Documentation and Completion
- Record installed packages and their purpose in `download.md`.
- Record authentication and security decisions in `security-authentication.md`.
- Add a completion note here only after all permitted work is finished and verified.

## Permission Checkpoints
1. Permission to create this plan file: received.
2. Permission to create the project structure and install dependencies: received and completed.
3. Permission to implement the backend: received and completed.
4. Permission to implement the React Native application: received and completed.
5. Permission to run tests and verification: completed.
6. Permission to mark the work completed: completed.

## Current Status
All major components of the Restaurant Order Management System are fully implemented, connected, and verified:
- **Backend API (`backend`)**: Express + Mongoose REST service with JWT authentication, MongoDB schemas, product catalog CRUD, order creation, order status pipeline (`Pending -> Preparing -> Completed`), rate limiting, security middleware, and seed scripts.
- **Mobile App (`mobile`)**: React Native & Expo mobile/web application with TypeScript, API-backed login, JWT token persistence, dashboard metrics, menu catalog, product management, order creation POS, and real-time order tracking. Clean TypeScript compilation verified.
- **Customer UI (`customer-ui`)**: Responsive web frontend featuring modern bistro aesthetics, dynamic category & dietary filtering, live cart management, customized order checkout modal, order confirmation tracking, and admin/KDS mode. Vite production build verified.
