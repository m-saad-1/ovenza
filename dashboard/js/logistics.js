// Delivery, Reservations, and Branches Logic (Phase 5)

document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic for Reservations
    const resTabs = document.querySelectorAll('#view-reservations .inner-tab');
    const resContents = document.querySelectorAll('#view-reservations .inv-tab-content');

    resTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            resTabs.forEach(t => t.classList.remove('active'));
            resContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Subscriptions
    window.Store.subscribe((state) => {
        if(document.getElementById('view-delivery').classList.contains('active')){
            renderDelivery(state);
        }
        if(document.getElementById('view-reservations').classList.contains('active')){
            renderReservations(state);
            renderTables(state);
        }
        if(document.getElementById('view-branches').classList.contains('active')){
            renderBranches(state);
        }
    });

    // Initial render on click
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target');
            if (target === 'view-delivery') renderDelivery(window.Store.state);
            if (target === 'view-reservations') {
                renderReservations(window.Store.state);
                renderTables(window.Store.state);
            }
            if (target === 'view-branches') renderBranches(window.Store.state);
        });
    });
});

// --- DELIVERY ---
function renderDelivery(state) {
    const ridersBody = document.getElementById('delivery-riders-body');
    const dispatchBody = document.getElementById('delivery-dispatch-body');
    if (!ridersBody || !dispatchBody) return;

    ridersBody.innerHTML = state.riders.map(r => `
        <tr>
            <td style="font-weight: 500;">${r.name}</td>
            <td><span class="badge ${r.status === 'Online' ? 'badge-success' : 'badge-danger'}">${r.status}</span></td>
            <td>${r.activeDeliveries}</td>
            <td>${r.completedToday}</td>
            <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="openGenericModal('rider', '${r.id}')">Edit</button></td>
        </tr>
    `).join('');

    const pendingDeliveries = state.orders.filter(o => o.type === 'Delivery' && o.status === 'Ready');
    
    if (pendingDeliveries.length === 0) {
        dispatchBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--clr-text-muted);">No orders pending dispatch</td></tr>';
    } else {
        dispatchBody.innerHTML = pendingDeliveries.map(o => `
            <tr>
                <td style="font-weight: 500;">#${o.id}</td>
                <td>${o.customer}</td>
                <td><button class="btn btn-primary" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="openDispatchModal('${o.id}')">Dispatch</button></td>
            </tr>
        `).join('');
    }

    // Populate Active Deliveries Tab
    const activeDeliveriesList = state.orders.filter(o => o.type === 'Delivery' && ['Dispatched', 'Out for Delivery'].includes(o.status));
    const activeBody = document.getElementById('del-active-body');
    if(activeBody) {
        activeBody.innerHTML = activeDeliveriesList.map(o => `
            <tr>
                <td style="font-weight: 500;">#${o.id}</td>
                <td>${o.customer}</td>
                <td>${o.zone || 'N/A'}</td>
                <td>Ali Raza</td>
                <td><span class="badge badge-info">${o.status}</span></td>
                <td>12 mins</td>
            </tr>
        `).join('') || '<tr><td colspan="6" style="text-align: center; color: var(--clr-text-muted);">No active deliveries on the road.</td></tr>';
    }

    // Populate Dispatch List Tab
    const dispatchListBody = document.getElementById('del-dispatch-list-body');
    if(dispatchListBody) {
        dispatchListBody.innerHTML = pendingDeliveries.map(o => `
            <tr>
                <td style="font-weight: 500;">#${o.id}</td>
                <td>${o.customer}</td>
                <td>${o.zone || 'N/A'}</td>
                <td>${o.time || '10 mins ago'}</td>
                <td><button class="btn btn-primary" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="openDispatchModal('${o.id}')">Assign Rider</button></td>
            </tr>
        `).join('') || '<tr><td colspan="5" style="text-align: center; color: var(--clr-text-muted);">No orders waiting for dispatch.</td></tr>';
    }

    // Populate Riders List Tab
    const ridersListBody = document.getElementById('del-riders-list-body');
    if(ridersListBody) {
        ridersListBody.innerHTML = state.riders.map(r => `
            <tr>
                <td style="font-weight: 500;">${r.name}</td>
                <td>${r.phone || '0300-0000000'}</td>
                <td><span class="badge ${r.status === 'Online' ? 'badge-success' : 'badge-danger'}">${r.status}</span></td>
                <td>${r.vehicle || 'Bike'}</td>
                <td>${r.activeDeliveries}</td>
                <td>${r.completedToday}</td>
                <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">View Profile</button></td>
            </tr>
        `).join('');
    }

    // Render Analytics Charts if they exist and haven't been rendered
    const zoneChartCtx = document.getElementById('zoneChart');
    if (zoneChartCtx && !window.zoneChartInstance) {
        window.zoneChartInstance = new Chart(zoneChartCtx, {
            type: 'doughnut',
            data: {
                labels: ['8A Commercial, Pak Arab, Lahore', 'Clifton Block 4', 'Hospital Road Central Park, Lahore', 'Bahria Town'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#4f46e5', '#0ea5e9', '#8b5cf6', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    }

    const timeChartCtx = document.getElementById('timeChart');
    if (timeChartCtx && !window.timeChartInstance) {
        window.timeChartInstance = new Chart(timeChartCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Avg Delivery Time (mins)',
                    data: [35, 32, 34, 30, 42, 45, 38],
                    borderColor: '#f59e0b',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(245, 158, 11, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 60 } }
            }
        });
    }
}

// --- RESERVATIONS ---
function renderReservations(state) {
    const tbody = document.getElementById('res-list-body');
    if (!tbody) return;

    tbody.innerHTML = state.reservations.map(r => {
        let badgeClass = 'badge-warning';
        if (r.status === 'Confirmed') badgeClass = 'badge-primary';
        if (r.status === 'Seated') badgeClass = 'badge-success';
        if (r.status === 'No-show') badgeClass = 'badge-danger';
        
        return `
        <tr>
            <td style="font-weight: 500;">
                ${r.customer}
                ${r.occasion ? `<div style="font-size:0.75rem; color:var(--clr-text-secondary);">${r.occasion}</div>` : ''}
                ${r.notes ? `<div style="font-size:0.75rem; color:var(--clr-warning);"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>Notes</div>` : ''}
            </td>
            <td>${r.phone || 'N/A'}</td>
            <td>${r.branch || state.restaurant.name}</td>
            <td>${r.datetime}</td>
            <td>${r.guests} pax</td>
            <td>Table ${r.tableId}</td>
            <td><span class="badge ${badgeClass}">${r.status}</span></td>
            <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Edit</button></td>
        </tr>
    `}).join('');
}

// --- TABLES ---
function renderTables(state) {
    const container = document.getElementById('floor-plan-container');
    if (!container) return;

    container.innerHTML = state.tables.map(t => {
        let statusClass = 'table-available';
        if (t.status === 'Occupied') statusClass = 'table-occupied';
        if (t.status === 'Reserved') statusClass = 'table-reserved';
        if (t.status === 'Cleaning') statusClass = 'table-cleaning';
        if (t.status === 'Blocked') statusClass = 'table-blocked';

        let extraInfo = '';
        if (t.status === 'Occupied') {
            extraInfo = `<div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem;">${t.customer}</div><div style="font-size: 0.7rem; color: var(--clr-text-secondary);">${t.amount}</div>`;
        } else if (t.status === 'Reserved') {
            extraInfo = `<div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem;">${t.customer}</div><div style="font-size: 0.7rem; color: var(--clr-text-secondary);">${t.time}</div>`;
        } else if (t.status === 'Cleaning') {
            extraInfo = `<div style="font-size: 0.75rem; font-weight: 500; margin-top: 0.25rem; color: var(--clr-info);">Cleaning...</div>`;
        } else if (t.status === 'Blocked') {
            extraInfo = `<div style="font-size: 0.75rem; font-weight: 500; margin-top: 0.25rem; color: var(--clr-text-muted);">Blocked</div>`;
        } else {
            extraInfo = `<div style="font-size: 0.75rem; font-weight: 500; margin-top: 0.25rem; color: var(--clr-text-secondary);">Empty</div>`;
        }

        return `
            <div class="restaurant-table-card ${statusClass}" onclick="openTableManager('${t.id}')">
                <div class="table-header">
                    <span class="table-id">${t.id}</span>
                    <span class="table-capacity">${t.capacity} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span>
                </div>
                <div class="table-body">
                    ${extraInfo}
                </div>
                <div class="table-actions">
                    <button class="btn btn-outline" style="width: 100%; padding: 0.2rem; font-size: 0.7rem;">Manage</button>
                </div>
            </div>
        `;
    }).join('');
}

// --- BRANCHES ---
function renderBranches(state) {
    const grid = document.getElementById('branches-grid');
    if (!grid) return;

    grid.innerHTML = state.branches.map(b => `
        <div class="card col-span-4" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h3 style="margin: 0 0 0.25rem 0;">${b.name}</h3>
                    <span class="badge ${b.status === 'Open' ? 'badge-success' : (b.status === 'Busy' ? 'badge-warning' : 'badge-danger')}">${b.status}</span>
                </div>
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="openGenericModal('branch', '${b.id}')">Manage</button>
            </div>
            
            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--clr-border); padding-top: 1rem; margin-top: auto;">
                <div>
                    <p style="margin: 0; font-size: 0.75rem; color: var(--clr-text-secondary);">Today's Revenue</p>
                    <p style="margin: 0; font-weight: 700; font-size: 1.1rem;">${state.restaurant.currency} ${b.todayRevenue.toLocaleString()}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-size: 0.75rem; color: var(--clr-text-secondary);">Orders</p>
                    <p style="margin: 0; font-weight: 600;">${Math.floor(b.todayRevenue / 800)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// --- PHASE 3: DELIVERY & TABLE OPERATIONS ---

window.dispatchOrder = function(orderId) {
    const riderSelect = document.getElementById(`rider-select-${orderId}`);
    if (!riderSelect || !riderSelect.value) {
        showToast("Please select a rider first", "error");
        return;
    }
    
    const state = window.Store.state;
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
        order.deliveryStatus = "Out for Delivery";
        order.status = "Out for Delivery";
        order.riderId = riderSelect.value;
        
        const rider = state.riders.find(r => r.id === riderSelect.value);
        if (rider) {
            rider.activeDeliveries++;
        }
        
        window.Store.notify();
        showToast(`Order #${orderId} dispatched with ${rider.name}`, "success");
    }
};

window.openTableManager = function(tableId) {
    const state = window.Store.state;
    const table = state.tables.find(t => t.id === tableId);
    if (!table) return;

    const panel = document.getElementById('table-detail-panel');
    const title = document.getElementById('td-title');
    const content = document.getElementById('td-content');
    if (!panel || !title || !content) return;

    panel.style.display = 'block';
    title.textContent = `Table ${table.id}`;

    let html = `
        <div style="margin-bottom: 1.5rem;">
            <p style="margin: 0; color: var(--clr-text-secondary); font-size: 0.85rem;">Status</p>
            <span class="badge ${table.status === 'Occupied' ? 'badge-danger' : (table.status === 'Reserved' ? 'badge-warning' : (table.status === 'Cleaning' ? 'badge-info' : 'badge-success'))}">${table.status}</span>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <p style="margin: 0; color: var(--clr-text-secondary); font-size: 0.85rem;">Capacity</p>
            <strong>${table.capacity} Guests</strong>
        </div>
    `;

    if (table.status === 'Occupied') {
        html += `
            <div style="margin-bottom: 1.5rem; background: var(--clr-bg-app); padding: 0.75rem; border-radius: 6px;">
                <p style="margin: 0 0 0.25rem 0; color: var(--clr-text-secondary); font-size: 0.85rem;">Current Bill</p>
                <strong style="font-size: 1.2rem;">${table.amount || 'Rs. 0'}</strong>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <button class="btn btn-primary" style="flex: 1; font-size: 0.8rem; padding: 0.5rem;" onclick="simulateTableAction('${tableId}', 'Add Items')">+ Add Items</button>
                <button class="btn btn-outline" style="flex: 1; font-size: 0.8rem; padding: 0.5rem;" onclick="simulateTableAction('${tableId}', 'Transfer')">Transfer Table</button>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" style="flex: 1; font-size: 0.8rem; padding: 0.5rem;" onclick="simulateTableAction('${tableId}', 'Split Bill')">Split Bill</button>
                <button class="btn btn-success" style="flex: 1; font-size: 0.8rem; padding: 0.5rem;" onclick="simulateTableAction('${tableId}', 'Checkout')">Checkout</button>
            </div>
        `;
    } else if (table.status === 'Reserved') {
        html += `
            <p>Reserved for: <strong>${table.customer}</strong> at <strong>${table.time}</strong></p>
            <button class="btn btn-primary" style="width: 100%; margin-bottom: 0.5rem;" onclick="simulateTableAction('${tableId}', 'Seat Guests')">Seat Guests</button>
            <button class="btn btn-outline" style="width: 100%;" onclick="simulateTableAction('${tableId}', 'Cancel Reservation')">Cancel Reservation</button>
        `;
    } else if (table.status === 'Cleaning') {
        html += `
            <button class="btn btn-success" style="width: 100%; margin-bottom: 0.5rem;" onclick="simulateTableAction('${tableId}', 'Mark Clean')">Mark Clean</button>
        `;
    } else if (table.status === 'Blocked') {
        html += `
            <button class="btn btn-success" style="width: 100%; margin-bottom: 0.5rem;" onclick="simulateTableAction('${tableId}', 'Unblock')">Unblock Table</button>
        `;
    } else {
        html += `
            <button class="btn btn-primary" style="width: 100%; margin-bottom: 0.5rem;" onclick="simulateTableAction('${tableId}', 'Open Table')">Open Table (Walk-in)</button>
            <button class="btn btn-outline" style="width: 100%;" onclick="simulateTableAction('${tableId}', 'Block')">Block Table</button>
        `;
    }

    content.innerHTML = html;
};

window.simulateTableAction = function(tableId, action) {
    const state = window.Store.state;
    const table = state.tables.find(t => t.id === tableId);
    if (!table) return;

    if (action === 'Checkout') {
        table.status = 'Cleaning';
        table.customer = null;
        table.amount = null;
        showToast(`Table ${tableId} checkout complete. Marking for cleaning.`, "success");
    } else if (action === 'Open Table' || action === 'Seat Guests') {
        table.status = 'Occupied';
        table.customer = "Walk-in";
        table.amount = "Rs. 0";
        showToast(`Table ${tableId} occupied.`, "success");
    } else if (action === 'Mark Clean') {
        table.status = 'Available';
        showToast(`Table ${tableId} is clean and available.`, "success");
    } else if (action === 'Block') {
        table.status = 'Blocked';
        showToast(`Table ${tableId} is blocked.`, "info");
    } else if (action === 'Unblock') {
        table.status = 'Available';
        showToast(`Table ${tableId} unblocked.`, "success");
    } else if (action === 'Cancel Reservation') {
        table.status = 'Available';
        table.customer = null;
        table.time = null;
        showToast(`Reservation cancelled for Table ${tableId}.`, "success");
    } else {
        showToast(`Simulated: ${action} for Table ${tableId}`, "info");
    }

    window.Store.notify();
    openTableManager(tableId); // Refresh panel
};
