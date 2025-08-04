const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Sample account data
let accounts = [
    {
        account_number: "ACC001",
        account_type: "Savings",
        balance: 5000.00
    },
    {
        account_number: "ACC002", 
        account_type: "Checking",
        balance: 2500.50
    },
    {
        account_number: "ACC003",
        account_type: "Credit",
        balance: -150.75
    },
    {
        account_number: "ACC004",
        account_type: "Savings",
        balance: 10000.00
    }
];

// Create HTTP server for static files
const server = http.createServer((req, res) => {
    if (req.url === '/api/accounts' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(accounts));
        return;
    }

    // Serve static files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);
    
    // Send initial account data
    ws.send(JSON.stringify({
        type: 'ACCOUNTS_DATA',
        data: accounts
    }));
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'WITHDRAW':
                    handleWithdraw(data.accountNumber, data.amount);
                    break;
                case 'DEPOSIT':
                    handleDeposit(data.accountNumber, data.amount);
                    break;
                case 'GET_ACCOUNTS':
                    ws.send(JSON.stringify({
                        type: 'ACCOUNTS_DATA',
                        data: accounts
                    }));
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

function handleWithdraw(accountNumber, amount) {
    const account = accounts.find(acc => acc.account_number === accountNumber);
    if (account) {
        const withdrawAmount = parseFloat(amount);
        if (withdrawAmount > 0) {
            account.balance -= withdrawAmount;
            
            // Broadcast updated accounts to all clients
            broadcastAccounts();
            
            console.log(`Withdrawn ${withdrawAmount} from ${accountNumber}. New balance: ${account.balance}`);
        }
    }
}

function handleDeposit(accountNumber, amount) {
    const account = accounts.find(acc => acc.account_number === accountNumber);
    if (account) {
        const depositAmount = parseFloat(amount);
        if (depositAmount > 0) {
            account.balance += depositAmount;
            
            // Broadcast updated accounts to all clients
            broadcastAccounts();
            
            console.log(`Deposited ${depositAmount} to ${accountNumber}. New balance: ${account.balance}`);
        }
    }
}

function broadcastAccounts() {
    const message = JSON.stringify({
        type: 'ACCOUNTS_UPDATED',
        data: accounts
    });
    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});