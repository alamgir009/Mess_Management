# Mess Management System

The **Mess Management System** is a web application designed to help users manage their meals, track expenses, and update meal records seamlessly. This system provides an intuitive interface for users to add their meals, monitor their market expenses, and keep track of their daily meal consumption. Built with modern web technologies, the application ensures a smooth and efficient user experience.

---

## Features

- **User Authentication**: Secure login and registration using JWT (JSON Web Tokens) and cookies.
- **Meal Management**: Users can add, update, and track their daily meals.
- **Expense Tracking**: Easily monitor market expenses and calculate individual contributions.
- **Real-time Updates**: React Hot Toast for real-time notifications and alerts.
- **Responsive Design**: Built with Tailwind CSS for a responsive and modern UI.
- **State Management**: Redux Toolkit and React-Redux for efficient state management.
- **API Integration**: Axios for seamless communication between the front-end and back-end.

---

## Technologies Used

### Front-End
- **React + Vite**: A fast and modern front-end framework for building user interfaces.
- **Redux Toolkit**: State management library for managing global application state.
- **React-Redux**: Official React bindings for Redux.
- **React Hot Toast**: Lightweight toast notifications for real-time feedback.
- **Axios**: Promise-based HTTP client for making API requests.
- **Tailwind CSS**: Utility-first CSS framework for building responsive and customizable designs.

### Back-End
- **Express**: Fast and minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Cookie Parser**: Middleware for parsing cookies in Express.
- **Bcrypt**: Library for hashing passwords securely.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.

---

## How It Works

1. **User Authentication**:
   - Users can register and log in securely using JWT-based authentication.
   - Passwords are hashed using Bcrypt for enhanced security.

2. **Meal Management**:
   - Users can add their daily meals, including details like date, meal type, and quantity.
   - Meal records can be updated or deleted as needed.

3. **Expense Tracking**:
   - Users can add market expenses and track their contributions.
   - The system calculates individual shares based on the number of meals consumed.

4. **Real-time Notifications**:
   - React Hot Toast provides real-time feedback for actions like adding meals, updating records, or logging in.

5. **Responsive UI**:
   - The application is fully responsive, ensuring a seamless experience across devices.

---

## Installation

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB installed and running.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/mess-management-system.git
   cd mess-management-system