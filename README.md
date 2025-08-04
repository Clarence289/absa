# Week 5 WebSocket Banking Application

A real-time banking application built with WebSockets that allows users to view account balances and perform transactions with live updates.

## Features

- **Real-time Updates**: All connected clients see balance changes instantly
- **WebSocket Communication**: Replaces traditional AJAX with WebSocket for real-time bidirectional communication
- **Transaction Support**: Withdraw and deposit functionality
- **Connection Status**: Visual indicator showing WebSocket connection status
- **Auto-reconnect**: Automatically attempts to reconnect if connection is lost
- **Responsive Design**: Bootstrap-based UI that works on all devices

## Prerequisites

- Node.js (version 12 or higher)
- npm (Node Package Manager)

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Open the Application**
   Open your browser and navigate to: `http://localhost:8080`

## Usage

### Viewing Accounts
- The application automatically loads and displays all bank accounts
- Account information includes: Account Number, Type, and Current Balance
- Total balance is shown at the bottom of the table

### Making Transactions

**Withdrawals:**
- Click the "Withdraw" button next to any account with a positive balance
- Enter the amount you wish to withdraw
- The balance updates immediately across all connected clients

**Deposits:**
- Click the "Deposit" button next to any account
- Enter the amount you wish to deposit
- The balance updates immediately across all connected clients

### Real-time Features
- Open multiple browser windows/tabs to see real-time updates
- When one user makes a transaction, all other connected users see the change instantly
- Connection status is displayed in the top-right corner of the application

## Technical Implementation

### WebSocket Server (server.js)
- Built with Node.js and the `ws` WebSocket library
- Handles multiple concurrent client connections
- Broadcasts account updates to all connected clients
- Serves static files (HTML, CSS, JS)
- Maintains in-memory account data

### Client-side (js/index.js)
- Establishes WebSocket connection to server
- Handles real-time message processing
- Updates UI automatically when data changes
- Implements auto-reconnection on connection loss

### Message Types
- `GET_ACCOUNTS`: Request current account data
- `ACCOUNTS_DATA`: Initial account data response
- `ACCOUNTS_UPDATED`: Real-time account updates
- `WITHDRAW`: Withdraw money from account
- `DEPOSIT`: Deposit money to account

## Architecture

```
Client (Browser) ←→ WebSocket ←→ Server (Node.js)
     ↓                              ↓
   HTML/CSS/JS                  Account Data
     ↓                              ↓
   Bootstrap UI              Real-time Broadcasting
```

## Sample Accounts

The application comes with pre-loaded sample accounts:
- ACC001 (Savings): ZAR 5,000.00
- ACC002 (Checking): ZAR 2,500.50  
- ACC003 (Credit): -ZAR 150.75
- ACC004 (Savings): ZAR 10,000.00

## Development Notes

This project demonstrates the transition from traditional AJAX-based communication to modern WebSocket implementation for real-time applications. The WebSocket protocol allows for:

- Bidirectional communication
- Lower latency than HTTP polling
- Real-time data synchronization
- Efficient resource usage
- Better user experience

## Troubleshooting

**Connection Issues:**
- Ensure the server is running on port 8080
- Check that no firewall is blocking the connection
- Verify WebSocket support in your browser

**Server Won't Start:**
- Make sure Node.js is installed
- Run `npm install` to install dependencies
- Check if port 8080 is already in use
