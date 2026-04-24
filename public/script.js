const API_URL = "https://expense-tracker-5lur.onrender.com";
const token = localStorage.getItem('token');
let expenseChart;

// 1. Session Protection
if (!token) window.location.href = 'login.html';

// 2. Main Data Fetching and Display Logic
async function fetchExpenses() {
    try {
        const res = await fetch(`${API_URL}/expenses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Failed to fetch data");
        
        const data = await res.json();
        
        // Split data: Spent items for History, Pending for Summary
        const spentItems = data.filter(i => i.status === 'Spent');
        const pendingItems = data.filter(i => i.status === 'Pending');

        // Update Total Balance (Spent only)
        const total = spentItems.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        document.getElementById('total-balance').innerText = `₹${total.toLocaleString('en-IN')}`;

        // FIX: Segment chart by Transaction Name to get multiple colors back
        const chartLabels = spentItems.map(item => item.description);
        const chartData = spentItems.map(item => parseFloat(item.amount));
        updateChart(chartLabels, chartData);

        // Render Recent History (Spent Only) with Delete Buttons
        document.getElementById('expense-list').innerHTML = spentItems.map(exp => `
            <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e0f2fe;">
                <span>${exp.description}</span> 
                <div style="display: flex; align-items: center; gap: 15px;">
                    <strong style="color: #333;">₹${parseFloat(exp.amount)}</strong>
                    <i class="fas fa-trash" onclick="deleteExpense(${exp.id})" 
                       style="color: #ef4444; cursor: pointer; font-size: 14px;" title="Delete"></i>
                </div>
            </li>
        `).join('') || '<p style="text-align:center;font-size:12px;color:#999;padding:20px;">No history logs</p>';

        // Render Pending Summary (Pending Only) with Delete Buttons
        document.getElementById('pending-list').innerHTML = pendingItems.map(exp => `
            <div class="pending-item" style="border-left: 4px solid #0284c7; background: #f0f9ff; display: flex; justify-content: space-between; padding: 12px; margin-bottom: 10px; border-radius: 8px;">
                <span>${exp.description}</span>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span class="due" style="color:#0284c7; font-weight: 800;">₹${parseFloat(exp.amount)}</span>
                    <i class="fas fa-trash" onclick="deleteExpense(${exp.id})" 
                       style="color: #ef4444; cursor: pointer; font-size: 14px;" title="Delete"></i>
                </div>
            </div>
        `).join('') || '<p style="text-align:center;font-size:12px;color:#999;padding:20px;">No pending items</p>';

    } catch (err) {
        console.error("Dashboard Sync Error:", err);
    }
}

// 3. Charting Logic (Multi-Blue Variants)
function updateChart(labels, data) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    if (expenseChart) expenseChart.destroy();
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: { 
            plugins: { legend: { display: false } }, 
            cutout: '75%',
            responsive: true,
            animation: { animateRotate: true }
        }
    });
}

// 4. Adding New Entries
document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const description = document.getElementById('desc').value;
    const amount = document.getElementById('amount').value;
    const category = "General"; // Defaulted as you requested no category selection
    const status = document.querySelector('input[name="status"]:checked').value;

    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ description, amount, category, status })
        });

        if (response.ok) {
            e.target.reset();
            fetchExpenses(); 
        } else {
            alert("Error adding entry. Your session may have expired.");
        }
    } catch (error) {
        console.error("Server Connection Error:", error);
    }
});

// 5. Deleting Entries (Full CRUD Support)
async function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this log?")) return;

    try {
        const res = await fetch(`${API_URL}/expenses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            await fetchExpenses(); // Refresh UI after successful delete
        } else {
            const errData = await res.json();
            alert("Delete failed: " + (errData.error || "Server error"));
        }
    } catch (err) {
        alert("Check your internet connection or server status.");
    }
}

// 6. Auth and Logout
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// 7. Initialization (User Info Display)
const userEmail = localStorage.getItem('userEmail');
if (userEmail) {
    const username = userEmail.split('@')[0];
    const displayElement = document.getElementById('display-email');
    if (displayElement) displayElement.innerText = username;
}

fetchExpenses();