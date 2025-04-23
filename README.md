# Inventory Management System (IMS)
## Dashboard
![Dashboard Screenshot1](https://github.com/user-attachments/assets/d3663071-5a94-4bed-8b23-14f6b28bd681)
![Dashboard Screenshot2](https://github.com/user-attachments/assets/1400f12e-41be-4cb6-9c2b-e1e32f84cf5c)


## Raw Material Page
![Raw Material Page](https://github.com/user-attachments/assets/e69b3135-2e5d-4422-994c-b38c99dc142a)


## Production Page
![Production Page](https://github.com/user-attachments/assets/0a91680b-00e8-4a2a-986d-12f6cacab591)


## Sales Order Page
![Sales Order Page](https://github.com/user-attachments/assets/6cc232d6-6d6c-459d-808a-a608e585728c)

## Overview
The Inventory Management System (IMS) is a comprehensive web application designed to streamline inventory operations for businesses. It provides tools for managing raw materials, production processes, and stock orders, helping businesses maintain optimal inventory levels and improve operational efficiency.

## Project Structure
The project follows a client-server architecture:

- **Client**: Frontend built with React and Vite
- **Server**: Backend built with Node.js, Express, and MongoDB

## Features

### Raw Materials Management
- Track raw material purchases from suppliers
- Record supplier information (ID, name, contact details, address)
- Monitor raw material quantities and costs
- Filter materials by date
- View inventory dashboard with current stock levels

### Production Management
- Convert raw materials into finished products
- Track production quantities and costs
- Manage production workflow

### Stock Order Management
- Track final stock inventory
- Manage customer orders
- Monitor stock levels

### User Authentication
- Secure login and registration
- Role-based access control
- JWT authentication

## Technology Stack

### Frontend
- React 19
- React Router DOM
- Redux Toolkit for state management
- Axios for API requests
- React Hook Form for form handling
- Recharts for data visualization
- Vite as build tool

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Joi for validation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

#### Clone the repository
```bash
git clone https://github.com/Arjun3782/IMS.git
cd IMS
```
```bash
# Your bash commands here
npm install
npm start
```


### Setup Server

```bash
cd Server
npm install
# Create a .env file with your MongoDB connection string and JWT secret
# Example:
# PORT=5000
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ims
# JWT_SECRET=your_jwt_secret
npm run dev
```

### Setup Client

```bash
cd Client
npm install
npm run dev
```
## API Endpoints
### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth/profile - Get user profile (requires authentication)
### Raw Materials
- GET /api/rawMaterial - Get all raw materials
- GET /api/rawMaterial/:id - Get a specific raw material
- POST /api/rawMaterial - Add a new raw material
- PUT /api/rawMaterial/:id - Update a raw material
- DELETE /api/rawMaterial/:id - Delete a raw material
### Products
- GET /api/product - Get all products
- GET /api/product/:id - Get a specific product
- POST /api/product - Add a new product
- PUT /api/product/:id - Update a product
- DELETE /api/product/:id - Delete a product
### Production
- GET /api/production - Get all production records
- POST /api/production - Add a new production record
- GET /api/production/:id - Get a specific production record
- PUT /api/production/:id - Update a production record
### Sales Orders
- GET /api/salesOrder - Get all sales orders
- GET /api/salesOrder/:id - Get a specific sales order
- POST /api/salesOrder - Create a new sales order
- PUT /api/salesOrder/:id - Update a sales order status
- DELETE /api/salesOrder/:id - Delete a sales order
### Dashboard
- GET /api/dashboard/stats - Get dashboard statistics
- GET /api/dashboard/recent-activities - Get recent activities
## Contributing
1. Fork the repository
2. Create your feature branch ( git checkout -b feature/amazing-feature )
3. Commit your changes ( git commit -m 'Add some amazing feature' )
4. Push to the branch ( git push origin feature/amazing-feature )
5. Open a Pull Request

## License
This project is licensed under the MIT License.
