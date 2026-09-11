// Administration & System Logic (Phase 7)

document.addEventListener('DOMContentLoaded', () => {
    // Subscriptions
    window.Store.subscribe((state) => {
        if(document.getElementById('view-hr').classList.contains('active')){
            renderHR(state);
        }
        if(document.getElementById('view-finance').classList.contains('active')){
            renderFinance(state);
        }
        if(document.getElementById('view-analytics').classList.contains('active')){
            renderAnalytics(state);
        }
    });

    // Initial render on click
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target');
            if (target === 'view-hr') renderHR(window.Store.state);
            if (target === 'view-finance') renderFinance(window.Store.state);
            if (target === 'view-analytics') renderAnalytics(window.Store.state);
        });
    });
});

// --- HR & STAFF ---
function renderHR(state) {
    const tbody = document.getElementById('hr-staff-body');
    if (!tbody) return;

    tbody.innerHTML = state.staff.map(s => {
        let statusClass = 'badge-info';
        if (s.status === 'Present') statusClass = 'badge-success';
        if (s.status === 'Late') statusClass = 'badge-danger';
        if (s.status === 'Scheduled') statusClass = 'badge-warning';

        return `
            <tr>
                <td style="font-weight: 500;">${s.name}</td>
                <td>${s.role}</td>
                <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${s.shift}</td>
                <td><span class="badge ${statusClass}">${s.status}</span></td>
                <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="openGenericModal('employee', '${s.id}')">Manage</button></td>
            </tr>
        `;
    }).join('');
}

// --- FINANCE & P&L ---
function renderFinance(state) {
    const tbody = document.getElementById('finance-pl-body');
    if (!tbody) return;

    tbody.innerHTML = state.finance.map(f => {
        const cat = f.category || f.overflow;
        let colorStyle = f.amount < 0 ? 'color: var(--clr-danger);' : (cat === 'Net Profit' ? 'color: var(--clr-success);' : '');
        let weightStyle = (cat === 'Gross Revenue' || cat === 'Net Sales' || cat === 'Gross Profit' || cat === 'Net Profit') ? 'font-weight: 700;' : 'font-weight: 500;';
        
        return `
            <tr>
                <td style="${weightStyle}">${cat}</td>
                <td style="${weightStyle} ${colorStyle}">Rs. ${f.amount.toLocaleString()}</td>
                <td style="color: var(--clr-text-secondary);">${f.percent}%</td>
            </tr>
        `;
    }).join('');
}

// --- DEEP ANALYTICS ---
let analyticsCharts = {};

function initAnalyticsCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { borderDash: [2, 4], color: '#E5E9EB' } },
            x: { grid: { display: false } }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } }
    };

    const brandColor = '#FB6815';
    const accentColor = '#3b82f6';
    const successColor = '#10b981';
    const warningColor = '#f59e0b';
    const dangerColor = '#ef4444';

    // 1. Revenue & Sales Trends (Line)
    analyticsCharts.revenueSales = new Chart(document.getElementById('chartRevenueSales'), {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue (Rs.)',
                data: [120000, 115000, 140000, 180000, 250000, 310000, 290000],
                borderColor: brandColor,
                backgroundColor: 'rgba(233, 41, 14, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: commonOptions
    });

    // 2. Orders Over Time (Bar)
    analyticsCharts.ordersTime = new Chart(document.getElementById('chartOrdersTime'), {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Orders',
                data: [150, 142, 180, 210, 320, 380, 350],
                backgroundColor: accentColor,
                borderRadius: 4
            }]
        },
        options: commonOptions
    });

    // 3. Sales by Category (Doughnut)
    analyticsCharts.salesCategory = new Chart(document.getElementById('chartSalesCategory'), {
        type: 'doughnut',
        data: {
            labels: ['Burgers', 'Pizza', 'Sides', 'Drinks', 'Desserts'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [brandColor, accentColor, successColor, warningColor, dangerColor]
            }]
        },
        options: pieOptions
    });

    // 4. Orders by Type (Pie)
    analyticsCharts.ordersType = new Chart(document.getElementById('chartOrdersType'), {
        type: 'pie',
        data: {
            labels: ['Dine-in', 'Delivery', 'Pickup'],
            datasets: [{
                data: [40, 45, 15],
                backgroundColor: [accentColor, brandColor, successColor]
            }]
        },
        options: pieOptions
    });

    // 5. Top-Selling Menu Items (Horizontal Bar)
    analyticsCharts.topItems = new Chart(document.getElementById('chartTopItems'), {
        type: 'bar',
        data: {
            labels: ['Tower Burger', 'Chicken Karahi', 'Cheese Fries', 'Chicken Pizza', 'Mountain Dew'],
            datasets: [{
                label: 'Units Sold',
                data: [850, 420, 380, 310, 290],
                backgroundColor: brandColor,
                borderRadius: 4
            }]
        },
        options: {
            ...commonOptions,
            indexAxis: 'y'
        }
    });

    // 6. Revenue by Branch (Doughnut)
    analyticsCharts.branchRevenue = new Chart(document.getElementById('chartBranchRevenue'), {
        type: 'doughnut',
        data: {
            labels: ['Hospital Road Central Park, Lahore', 'Hospital Road Central Park, Lahore', '8A Commercial, Pak Arab, Lahore'],
            datasets: [{
                data: [55, 30, 15],
                backgroundColor: [brandColor, accentColor, warningColor]
            }]
        },
        options: pieOptions
    });

    // 7. Customer Growth (Line)
    analyticsCharts.customerGrowth = new Chart(document.getElementById('chartCustomerGrowth'), {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'New Customers',
                data: [120, 145, 160, 190],
                borderColor: successColor,
                tension: 0.4
            }, {
                label: 'Returning',
                data: [200, 210, 240, 280],
                borderColor: brandColor,
                tension: 0.4
            }]
        },
        options: { ...commonOptions, plugins: { legend: { display: true, position: 'top' } } }
    });

    // 8. Reservation Trends (Bar)
    analyticsCharts.reservations = new Chart(document.getElementById('chartReservations'), {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Reservations',
                data: [10, 12, 15, 25, 45, 60, 50],
                backgroundColor: warningColor,
                borderRadius: 4
            }]
        },
        options: commonOptions
    });

    // 9. Inventory/Waste (Line)
    analyticsCharts.waste = new Chart(document.getElementById('chartWaste'), {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Waste Value (Rs.)',
                data: [15000, 12000, 18000, 11000],
                borderColor: dangerColor,
                tension: 0.4,
                borderDash: [5, 5]
            }]
        },
        options: commonOptions
    });

    // 10. Payment Methods (Pie)
    analyticsCharts.payments = new Chart(document.getElementById('chartPayments'), {
        type: 'pie',
        data: {
            labels: ['Cash', 'Credit Card', 'Mobile Wallet'],
            datasets: [{
                data: [35, 50, 15],
                backgroundColor: [successColor, brandColor, accentColor]
            }]
        },
        options: pieOptions
    });

    // 11. Ratings Trend (Line)
    analyticsCharts.ratings = new Chart(document.getElementById('chartRatings'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr'],
            datasets: [{
                label: 'Avg Rating',
                data: [4.2, 4.4, 4.5, 4.6],
                borderColor: warningColor,
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(245, 158, 11, 0.1)'
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: { min: 3, max: 5 }
            }
        }
    });

    // 12. Marketing ROI (Bar)
    analyticsCharts.marketing = new Chart(document.getElementById('chartMarketing'), {
        type: 'bar',
        data: {
            labels: ['Social Media', 'Email', 'SMS', 'In-Store'],
            datasets: [{
                label: 'ROI (%)',
                data: [250, 180, 120, 80],
                backgroundColor: successColor,
                borderRadius: 4
            }]
        },
        options: commonOptions
    });

    // 13. Orders by Source (Doughnut)
    analyticsCharts.ordersSource = new Chart(document.getElementById('chartOrdersSource'), {
        type: 'doughnut',
        data: {
            labels: ['POS', 'Website', 'Mobile App', 'Foodpanda', 'Careem'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [brandColor, accentColor, successColor, warningColor, dangerColor]
            }]
        },
        options: pieOptions
    });

    // 14. Delivery Trends (Line)
    analyticsCharts.deliveryTrends = new Chart(document.getElementById('chartDeliveryTrends'), {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Avg Delivery Time (mins)',
                data: [35, 32, 28, 30],
                borderColor: accentColor,
                tension: 0.4
            }, {
                label: 'Deliveries Volume',
                data: [400, 450, 420, 500],
                borderColor: brandColor,
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            ...commonOptions,
            plugins: { legend: { display: true, position: 'top' } },
            scales: {
                ...commonOptions.scales,
                y1: { type: 'linear', position: 'right', grid: { display: false } }
            }
        }
    });
}

function renderAnalytics(state) {
    if (!analyticsCharts.revenueSales) {
        initAnalyticsCharts();
    }
}

window.updateAnalyticsDashboard = function() {
    const btn = document.querySelector('.analytics-filters .btn-primary');
    const originalText = btn.innerText;
    btn.innerText = 'Updating...';
    btn.disabled = true;

    const dateFilter = document.getElementById('analytics-date-filter').value;
    
    // Simulate data recalculation based on filters
    setTimeout(() => {
        let multiplier = 1;
        if (dateFilter === 'today') multiplier = 0.05;
        if (dateFilter === 'week') multiplier = 0.25;
        if (dateFilter === 'year') multiplier = 12;

        // Update KPIs
        document.getElementById('kpi-total-revenue').innerText = 'Rs. ' + Math.floor(4520000 * multiplier).toLocaleString();
        document.getElementById('kpi-total-orders').innerText = Math.floor(4120 * multiplier).toLocaleString();
        document.getElementById('kpi-aov').innerText = 'Rs. ' + Math.floor(1097 * (1 + (Math.random() * 0.2 - 0.1))).toLocaleString();
        document.getElementById('kpi-net-sales').innerText = 'Rs. ' + Math.floor(3850000 * multiplier).toLocaleString();
        document.getElementById('kpi-customers').innerText = Math.floor(3245 * multiplier).toLocaleString();
        document.getElementById('kpi-reservations').innerText = Math.floor(142 * multiplier).toLocaleString();
        document.getElementById('kpi-delivery').innerText = Math.floor(1850 * multiplier).toLocaleString();
        document.getElementById('kpi-pickup').innerText = Math.floor(840 * multiplier).toLocaleString();
        
        // Update Chart Data (Randomize slightly to show change)
        Object.values(analyticsCharts).forEach(chart => {
            chart.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(val => {
                    const variance = val * 0.2;
                    return Math.max(0, Math.floor(val + (Math.random() * variance * 2 - variance)));
                });
            });
            chart.update();
        });

        btn.innerText = originalText;
        btn.disabled = false;
    }, 600);
};

window.generateReport = function() {
    const reportResult = document.getElementById('report-result');
    if (!reportResult) return;
    
    reportResult.style.display = 'block';
    reportResult.style.opacity = '0.5';
    setTimeout(() => {
        reportResult.style.opacity = '1';
    }, 600);
};
