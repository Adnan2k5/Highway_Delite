# HighwayDelight

## Fullstack Experience Booking Platform

A comprehensive fullstack web application built with Node.js/Express backend and React/TypeScript/Vite frontend for managing adventure experiences and bookings with slot-based availability system and promotional code features.

## 🏗️ High-Level Architecture

### System Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│  (Node.js)      │◄──►│   MongoDB       │
│                 │    │                 │    │                 │
│ • Vite          │    │ • Express.js    │    │ • Mongoose ODM  │
│ • TypeScript    │    │ • CORS          │    │ • Indexes       │
│ • TailwindCSS   │    │ • Body Parser   │    │                 │
│ • React Router  │    │ • RESTful API   │    │                 │
│ • React Hook    │    │ • Dotenv        │    │                 │
│   Form          │    │                 │    │                 │
│ • Axios         │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Core Features

### 1. Experience Management System

- **Experience Creation**: Create and manage adventure experiences with multiple dates and time slots
- **Location Management**: Geographic location assignment for each experience
- **Media Support**: Image URL storage for experience thumbnails
- **Pricing System**: Flexible pricing per experience

### 2. Slot-Based Booking System

- **Time Slot Management**: Configurable time slots for each experience
- **Availability Tracking**: Real-time slot availability with total and available slot counts
- **Date-based Booking**: Multiple dates support with individual slot management
- **Capacity Control**: Maximum participants per slot management

### 3. Customer Booking Management

- **Booking Creation**: Customer information collection (name, email, phone)
- **Group Bookings**: Support for multiple people per booking
- **Booking Status**: Status tracking (confirmed, cancelled, pending)
- **Price Calculation**: Automatic total price calculation based on participants

### 4. Promotional Code System

- **Percentage Discounts**: SAVE10 - 10% off total amount
- **Fixed Amount Discounts**: FLAT100 - ₹100 flat discount
- **Validation System**: Real-time promo code validation
- **Flexible Discount Types**: Support for both percentage and fixed discounts

### 5. Admin Management

- **Experience Administration**: Create and manage experiences through admin panel
- **Booking Overview**: View and manage all bookings
- **Analytics Dashboard**: Basic booking and experience analytics

## 🛠️ Technology Stack

### Frontend (Client)

```typescript
// Core Technologies
- React 19.1.1 with Hooks and Context
- TypeScript for type safety
- Vite for fast development and building
- TailwindCSS for styling
- React Router Dom for navigation

// Key Libraries
- React Hook Form for form handling
- Axios for API communication
- ESLint for code linting
```

### Backend (Server)

```javascript
// Core Technologies
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- ES6 Modules (type: "module")

// Key Libraries
- CORS for cross-origin requests
- Body-parser for request parsing
- Dotenv for environment configuration
```

### Database

```javascript
// MongoDB Collections
- experiences: Adventure experience data
- bookings: Customer booking records

// Key Features
- Mongoose schema validation
- Indexed queries for performance
- Reference relationships between collections
```

## 🗄️ Database Schema

### Experience Collection

```javascript
{
  _id: ObjectId,
  title: String (required),
  location: String (required),
  description: String (required),
  dates: [Date] (required),
  slots: [String] (required),
  slotAvailability: [{
    date: Date (required),
    timeSlots: [{
      slot: String (required),
      totalSlots: Number (required, min: 0),
      availableSlots: Number (required, min: 0)
    }]
  }],
  price: Number (required),
  imageUrl: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection

```javascript
{
  _id: ObjectId,
  experienceId: ObjectId (ref: "Experience", required),
  customerName: String (required),
  customerEmail: String (required),
  customerPhone: String (required),
  bookingDate: Date (required),
  timeSlot: String (required),
  numberOfPeople: Number (required, min: 1),
  totalPrice: Number (required),
  status: String (enum: ["confirmed", "cancelled", "pending"], default: "confirmed"),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
Index: { experienceId: 1, bookingDate: 1, timeSlot: 1 }
```

## 📱 API Structure

### Experience Endpoints

```javascript
GET    /api/experiences        // List all experiences
GET    /api/experiences/:id    // Get specific experience
POST   /api/experiences        // Create new experience
PUT    /api/experiences/:id    // Update experience
DELETE /api/experiences/:id    // Delete experience
```

### Booking Endpoints

```javascript
POST   /api/bookings          // Create new booking
GET    /api/bookings          // Get all bookings
GET    /api/bookings/:id      // Get specific booking
PUT    /api/bookings/:id      // Update booking status
```

### Promotional Code Endpoints

```javascript
POST / api / promo / validate; // Validate promo code
GET / api / promo / list; // Get available promo codes
```

## 🔄 Booking Flow

### Booking Process

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browse        │───►│   Select        │───►│   Customer      │
│   Experiences   │    │   Date & Slot   │    │   Information   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │ Check Slot      │              │
         │              │ Availability    │              │
         │              └─────────────────┘              │
         │                                                ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         └─────────────►│   Booking       │◄───│   Apply Promo   │
                        │   Confirmed     │    │   Code          │
                        └─────────────────┘    └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (v5+)
- npm or yarn package manager

### Environment Variables

#### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/highway-delight
PORT=8000
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

### Installation & Setup

#### Backend Setup

```bash
cd Backend
npm install
npm start
```

#### Frontend Setup

```bash
cd Client
npm install
npm run dev
```

### Database Initialization

The application automatically connects to MongoDB on startup. Ensure MongoDB is running and accessible via the MONGO_URI.

## 📁 Project Structure

```
HighwayDelight/
├── README.md
├── Backend/
│   ├── package.json
│   ├── server.js                 # Main server file
│   ├── config/
│   │   └── connectDB.js         # Database connection
│   ├── models/
│   │   ├── booking.model.js     # Booking schema
│   │   └── experience.model.js  # Experience schema
│   └── routes/
│       ├── bookings.routes.js   # Booking API routes
│       ├── exprecience.routes.js# Experience API routes
│       └── promo.routes.js      # Promotional code routes
└── Client/
    ├── package.json
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    └── src/
        ├── App.tsx              # Main App component
        ├── main.tsx             # Entry point
        ├── App.css
        ├── index.css
        ├── api/                 # API service layer
        │   ├── bookingService.ts
        │   ├── client.ts        # HTTP client
        │   ├── experienceService.ts
        │   ├── index.ts
        │   ├── promoService.ts
        │   └── types.ts         # TypeScript interfaces
        ├── Components/
        │   ├── Card.tsx         # Experience card component
        │   └── Navbar.tsx       # Navigation component
        └── Pages/
            ├── Admin/
            │   └── index.tsx    # Admin dashboard
            ├── BookingConfirmed/
            │   └── index.tsx    # Booking confirmation
            ├── Checkout/
            │   └── index.tsx    # Checkout process
            ├── Details/
            │   └── index.tsx    # Experience details
            └── Home/
                └── index.tsx    # Home page with experience list
```

## 🎯 Key Features Breakdown

### Experience Management

- Dynamic slot availability calculation
- Multi-date experience support
- Real-time availability updates
- Image and description management

### Booking System

- Customer information collection
- Group booking support (multiple participants)
- Automatic price calculation
- Booking status management

### Promotional System

- Real-time code validation
- Multiple discount types (percentage/fixed)
- Minimum amount validation
- Error handling for invalid codes

### Admin Features

- Experience creation and management
- Booking overview and management
- Basic analytics and reporting

## 🔧 Development

### Adding New Features

1. **Backend**: Add new routes in `routes/` directory
2. **Models**: Create/modify schemas in `models/` directory
3. **Frontend**: Add new components in `Components/` or pages in `Pages/`
4. **API**: Add service functions in `src/api/` directory

### Code Standards

- TypeScript for frontend type safety
- ESLint for code linting
- Mongoose for database schema validation
- Express.js routing patterns

## 🚦 Current Status

The application is a functional booking platform with:

- ✅ Experience browsing and details
- ✅ Slot-based booking system
- ✅ Customer information collection
- ✅ Promotional code system
- ✅ Admin management panel
- ✅ Responsive design with TailwindCSS

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
