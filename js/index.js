let socket;
let accounts = [];

$(document).ready(function(){
    // Initialize WebSocket connection
    initWebSocket();
});

function initWebSocket() {
    // Connect to WebSocket server
    socket = new WebSocket('ws://localhost:8080');
    
    socket.onopen = function(event) {
        console.log('Connected to WebSocket server');
        updateConnectionStatus(true);
        // Request initial account data
        socket.send(JSON.stringify({
            type: 'GET_ACCOUNTS'
        }));
    };
    
    socket.onmessage = function(event) {
        try {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
                case 'ACCOUNTS_DATA':
                case 'ACCOUNTS_UPDATED':
                    accounts = message.data;
                    updateAccountsTable();
                    break;
                default:
                    console.log('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };
    
    socket.onclose = function(event) {
        console.log('WebSocket connection closed');
        updateConnectionStatus(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(initWebSocket, 3000);
    };
    
    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}

function updateAccountsTable() {
    let rows = "";
    let total = 0;
    
    accounts.forEach(element => {
        total += parseFloat(element.balance); 
        let bl = parseFloat(element.balance).toFixed(2);
        let currBalance = bl < 0.00 ? `-ZAR ${Math.abs(bl)}` : `ZAR ${bl}`;
        let btnColor = "btn-success";
        let disabled = "";
        
        if(bl < 0){
            btnColor = "btn-light";
            disabled = "disabled";
        }
        
        rows += `<tr> 
                <td>${element.account_number}</td>
                <td>${element.account_type}</td>
                <td>${currBalance}</td>
                <td>
                    <button class="btn ${btnColor} me-2" ${disabled} onclick="showWithdrawModal('${element.account_number}')">Withdraw</button>
                    <button class="btn btn-primary" onclick="showDepositModal('${element.account_number}')">Deposit</button>
                </td>
                </tr>`;
    });
    
    $('#accounts tbody').html(rows);
    let totalBal = total.toFixed(2) < 0.0 ? `-ZAR ${Math.abs(total.toFixed(2))}` : `ZAR ${total.toFixed(2)}`;
    $('#accounts tfoot th:nth-child(2)').html(totalBal);
}

function showWithdrawModal(accountNumber) {
    const amount = prompt(`Enter amount to withdraw from account ${accountNumber}:`);
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        withdraw(accountNumber, parseFloat(amount));
    }
}

function showDepositModal(accountNumber) {
    const amount = prompt(`Enter amount to deposit to account ${accountNumber}:`);
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        deposit(accountNumber, parseFloat(amount));
    }
}

function withdraw(accountNumber, amount) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'WITHDRAW',
            accountNumber: accountNumber,
            amount: amount
        }));
    } else {
        alert('Connection to server lost. Please refresh the page.');
    }
}

function deposit(accountNumber, amount) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'DEPOSIT',
            accountNumber: accountNumber,
            amount: amount
        }));
    } else {
        alert('Connection to server lost. Please refresh the page.');
    }
}

function updateConnectionStatus(connected) {
    const statusElement = $('#connection-status');
    if (connected) {
        statusElement.removeClass('bg-danger').addClass('bg-success').text('Connected');
    } else {
        statusElement.removeClass('bg-success').addClass('bg-danger').text('Disconnected');
    }
}