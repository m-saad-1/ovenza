// Orders Management & Drawer Logic
window._orderTypeFilter = 'All';

window.filterOrdersByType = function(type, btn) {
    document.querySelectorAll('#order-type-tabs .inner-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    window._orderTypeFilter = type;
    renderFullOrdersTable();
};

document.addEventListener('DOMContentLoaded', () => {
    window.Store.subscribe((state) => {
        if(document.getElementById('view-orders').classList.contains('active')){
            renderFullOrdersTable();
        }
    });

    // Initial load
    renderFullOrdersTable();
});

// Expose globally for HTML onclicks
window.renderFullOrdersTable = function() {
    const tbody = document.getElementById('full-orders-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const state = window.Store.state;
    
    const statusFilter = document.getElementById('filter-status')?.value || 'All';
    const typeFilter = document.getElementById('filter-type')?.value || 'All';
    const sourceFilter = document.getElementById('filter-source')?.value || 'All';
    const searchFilter = document.getElementById('filter-search')?.value.toLowerCase() || '';

    // Update Stats
    const totalEl = document.getElementById('stat-total');
    const newEl = document.getElementById('stat-new');
    const prepEl = document.getElementById('stat-preparing');
    const readyEl = document.getElementById('stat-ready');
    const delivEl = document.getElementById('stat-delivery');
    const compEl = document.getElementById('stat-completed');
    const cancEl = document.getElementById('stat-cancelled');
    const revEl = document.getElementById('stat-revenue');
    
    if (totalEl) {
        totalEl.textContent = state.orders.length;
        if(newEl) newEl.textContent = state.orders.filter(o => o.status === 'New').length;
        if(prepEl) prepEl.textContent = state.orders.filter(o => o.status === 'Preparing' || o.kitchenStatus === 'Preparing').length;
        if(readyEl) readyEl.textContent = state.orders.filter(o => o.status === 'Ready' || o.kitchenStatus === 'Ready').length;
        if(delivEl) delivEl.textContent = state.orders.filter(o => o.status === 'Out for Delivery').length;
        if(compEl) compEl.textContent = state.orders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;
        if(cancEl) cancEl.textContent = state.orders.filter(o => o.status === 'Cancelled').length;
        
        if(revEl) {
            const revenue = state.orders
                .filter(o => o.status !== 'Cancelled')
                .reduce((sum, o) => sum + (o.total || 0), 0);
            revEl.textContent = state.restaurant.currency + ' ' + revenue.toLocaleString();
        }
    }

    let filtered = state.orders;
    if (statusFilter !== 'All') filtered = filtered.filter(o => o.status === statusFilter);
    if (typeFilter !== 'All') filtered = filtered.filter(o => o.type === typeFilter);
    if (sourceFilter !== 'All') filtered = filtered.filter(o => o.source === sourceFilter);
    if (window._orderTypeFilter === 'Cancelled') {
        filtered = filtered.filter(o => o.status === 'Cancelled');
    } else {
        filtered = filtered.filter(o => o.status !== 'Cancelled');
        if (window._orderTypeFilter !== 'All') filtered = filtered.filter(o => o.type === window._orderTypeFilter);
    }
    if (searchFilter) {
        filtered = filtered.filter(o => 
            o.id.toLowerCase().includes(searchFilter) || 
            o.customer.toLowerCase().includes(searchFilter)
        );
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--clr-text-muted);">No orders found matching your criteria.</td></tr>';
        return;
    }

    filtered.slice().reverse().forEach(order => {
        const card = document.createElement('div');
        card.className = 'card order-card';
        let statusClass = 'badge-info';
        if (order.status === 'Completed' || order.status === 'Delivered') statusClass = 'badge-success';
        if (order.status === 'Cancelled') statusClass = 'badge-danger';
        if (order.status === 'Preparing') statusClass = 'badge-warning';
        
        let paymentStatus = order.paymentStatus || order.payment || 'Pending';
        let paymentBadge = paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning';

        let itemCount = 0;
        let itemsStr = 'No items';
        if (order.items && order.items.length > 0) {
            itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
            itemsStr = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');
            if (itemsStr.length > 50) itemsStr = itemsStr.substring(0, 47) + '...';
        } else {
            itemsStr = "Demo Order Items";
            itemCount = 1;
        }

        let orderDate = Date.now();
        if (order.time && typeof order.time === 'string') {
            let parts = order.time.match(/(\d+):(\d+)\s+(AM|PM)/i);
            if (parts) {
                let hours = parseInt(parts[1], 10);
                let minutes = parseInt(parts[2], 10);
                let modifier = parts[3].toUpperCase();
                if (hours === 12) hours = 0;
                if (modifier === 'PM') hours += 12;
                let d = new Date();
                d.setHours(hours, minutes, 0, 0);
                if (d.getTime() > Date.now() + 60000) {
                    d.setDate(d.getDate() - 1); // roll back one day if time is in the future
                }
                orderDate = d.getTime();
            }
        }
        const elapsed = Math.floor((Date.now() - orderDate) / 60000) || 1;
        const urgencyStyle = elapsed >= 10 && order.status !== 'Completed' && order.status !== 'Delivered' && order.status !== 'Cancelled' ? 'border-color: var(--clr-danger); background: rgba(239,68,68,0.04);' : elapsed >= 5 && order.status !== 'Completed' && order.status !== 'Delivered' && order.status !== 'Cancelled' ? 'border-color: var(--clr-warning); background: rgba(245,158,11,0.04);' : '';
        
        card.setAttribute('style', `display: flex; flex-direction: column; gap: 1rem; ${urgencyStyle}`);

        
        let actionBtn = '<button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" onclick="openOrderDetailModal(\'' + order.id + '\')">View Details</button>';
        
        if (document.body.classList.contains('simple-mode')) {
            if (order.status === 'New') {
                actionBtn = '<button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" onclick="event.stopPropagation(); window.Store.updateOrderStatus(\'' + order.id + '\', \'Preparing\')">Accept - Preparing</button>';
            } else if (order.status === 'Preparing') {
                actionBtn = '<button class="btn btn-warning" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" onclick="event.stopPropagation(); window.Store.updateOrderStatus(\'' + order.id + '\', \'Out for Delivery\')">Dispatched</button>';
            } else if (order.status === 'Out for Delivery') {
                actionBtn = '<button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" onclick="event.stopPropagation(); window.Store.updateOrderStatus(\'' + order.id + '\', \'Delivered\')">Delivered</button>';
            }
            // Customer history by default in modal is handled in the modal logic.
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="margin: 0; font-size: 1.1rem;">#${order.id}</h3>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                        <p style="margin: 0; font-size: 0.8rem; color: var(--clr-text-secondary);">${order.time}</p>
                        ${!['Completed', 'Delivered', 'Cancelled'].includes(order.status) ? `<span style="font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.4rem; border-radius: 4px; color: ${elapsed >= 10 ? 'var(--clr-danger)' : elapsed >= 5 ? 'var(--clr-warning)' : 'var(--clr-text-primary)'}; ${elapsed >= 10 ? 'background: var(--clr-danger-bg);' : elapsed >= 5 ? 'background: rgba(245,158,11,0.1);' : ''}">${elapsed} min ago</span>` : ''}
                    </div>
                </div>
                <span class="badge ${statusClass}">${order.status}</span>
            </div>
            
            <div style="border-bottom: 1px solid var(--clr-border); padding-bottom: 0.75rem;">
                <p style="margin: 0 0 0.25rem 0; font-weight: 600;">${order.customer}</p>
                <div style="display: flex; gap: 0.5rem; font-size: 0.8rem;">
                    <span class="badge" style="background: rgba(233,41,14,0.1); color: var(--clr-primary);">${order.type}</span>
                    <span class="badge ${paymentBadge}">${paymentStatus}</span>
                </div>
            </div>
            
            <div style="flex: 1;">
                <p style="margin: 0 0 0.25rem 0; font-size: 0.85rem; color: var(--clr-text-secondary);">Items (${itemCount})</p>
                <p style="margin: 0; font-size: 0.9rem; line-height: 1.4;">${itemsStr}</p>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--clr-border); padding-top: 1rem; margin-top: auto;">
                <span style="font-weight: 700; font-size: 1.1rem;">${state.restaurant.currency} ${order.total.toLocaleString()}</span>
                ${actionBtn}
            </div>
        `;
        tbody.appendChild(card);
    });
};

window.openOrderDrawer = function(orderId) {
    const state = window.Store.state;
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('drawer-title').textContent = `Order #${order.id}`;
    
    const content = `
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                <p style="margin: 0; color: var(--clr-text-secondary); font-size: 0.85rem;">Customer</p>
                <p style="margin: 0; font-weight: 600; font-size: 1.1rem;">${order.customer}</p>
            </div>
            <div>
                <span class="badge" style="background: rgba(233,41,14,0.1); color: var(--clr-primary); font-size: 0.8rem;">Source: ${order.source || 'N/A'}</span>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--clr-border);">
            <div>
                <p style="margin: 0; color: var(--clr-text-secondary); font-size: 0.8rem;">Type</p>
                <p style="margin: 0; font-weight: 500; font-size: 0.95rem;">${order.type}</p>
            </div>
            <div>
                <p style="margin: 0; color: var(--clr-text-secondary); font-size: 0.8rem;">Time</p>
                <p style="margin: 0; font-weight: 500; font-size: 0.95rem;">${order.time}</p>
            </div>
            <div>
                <p style="margin: 0; color: var(--clr-text-secondary); font-size: 0.8rem;">Order Status</p>
                <p style="margin: 0; font-weight: 500; font-size: 0.95rem;">${order.status}</p>
            </div>
            <div>
                <p style="margin: 0; color: var(--clr-text-secondary); font-size: 0.8rem;">Payment</p>
                <p style="margin: 0; font-weight: 500; font-size: 0.95rem;">${order.paymentStatus || order.payment || 'Pending'}</p>
            </div>
            <div>
                <p style="margin: 0; color: var(--clr-text-secondary); font-size: 0.8rem;">Kitchen</p>
                <p style="margin: 0; font-weight: 500; font-size: 0.95rem;">${order.kitchenStatus || 'Pending'}</p>
            </div>
            <div>
                <p style="margin: 0; color: var(--clr-text-secondary); font-size: 0.8rem;">Delivery</p>
                <p style="margin: 0; font-weight: 500; font-size: 0.95rem;">${order.deliveryStatus || 'N/A'}</p>
            </div>
        </div>
        
        ${order.type === 'Delivery' ? `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--clr-bg-app); border-radius: 8px;">
            <p style="margin: 0 0 0.5rem 0; color: var(--clr-text-secondary); font-size: 0.85rem; font-weight: 600;">Delivery Details</p>
            <p style="margin: 0; font-size: 0.9rem;">${order.customer?.address || order.address || 'No Address Provided'} (${order.customer?.city || order.zone || ''})</p>
        </div>` : ''}
        
        ${order.type === 'Pickup' ? `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--clr-bg-app); border-radius: 8px;">
            <p style="margin: 0 0 0.5rem 0; color: var(--clr-text-secondary); font-size: 0.85rem; font-weight: 600;">Pickup Details</p>
            <p style="margin: 0 0 0.3rem 0; font-size: 0.9rem;">Pickup At: ${order.customer?.city || order.city || 'Selected Outlet'}</p>
            <p style="margin: 0; font-size: 0.85rem; color: var(--clr-primary); font-weight: 600;">Time: ${order.pickupTime ? (order.pickupTime === 'ASAP' ? 'ASAP (~20 mins)' : 'Scheduled for ' + (function(t){if(!t.includes(':'))return t;const[h,m]=t.split(':');const hi=parseInt(h);return (hi%12||12)+':'+m+' '+(hi>=12?'PM':'AM')})(order.pickupTime)) : 'ASAP (~20 mins)'}</p>
        </div>` : ''}
        
        ${order.type === 'Dine-in' && order.tableId ? `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--clr-bg-app); border-radius: 8px;">
            <p style="margin: 0 0 0.5rem 0; color: var(--clr-text-secondary); font-size: 0.85rem; font-weight: 600;">Table Details</p>
            <p style="margin: 0; font-size: 0.9rem;">Table: ${order.tableId} | Guests: ${order.guests || 'N/A'}</p>
        </div>` : ''}
        
        ${order.type === 'Takeaway' && order.pickupTime ? `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--clr-bg-app); border-radius: 8px;">
            <p style="margin: 0 0 0.5rem 0; color: var(--clr-text-secondary); font-size: 0.85rem; font-weight: 600;">Takeaway Details</p>
            <p style="margin: 0; font-size: 0.9rem;">Pickup Time: ${order.pickupTime}</p>
        </div>` : ''}

        <h4 style="margin-bottom: 1rem;">Order Items</h4>
        <div style="margin-bottom: 1.5rem;">
            ${(order.items || [{name: 'Demo Item', qty: 1, price: order.total}]).map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${item.qty}x ${item.name}</span>
                    <span style="font-weight: 500;">${state.restaurant.currency} ${item.price}</span>
                </div>
            `).join('')}
        </div>
        
        <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 700; border-top: 1px solid var(--clr-border); padding-top: 1rem;">
            <span>Total</span>
            <span>${state.restaurant.currency} ${order.total.toLocaleString()}</span>
        </div>
    `;

    document.getElementById('drawer-content').innerHTML = content;

    // Actions based on status
    let actions = '';
    if (order.status === 'New') {
        actions = `<button class="btn btn-warning" style="flex:1;" onclick="updateOrderStatus('${order.id}', 'Preparing')">Send to Kitchen</button>`;
    } else if (order.status === 'Preparing') {
        actions = `<button class="btn btn-success" style="flex:1;" onclick="updateOrderStatus('${order.id}', 'Ready')">Mark Ready</button>`;
    } else if (order.status === 'Ready') {
        if(order.type === 'Delivery') {
             actions = `<button class="btn btn-info" style="flex:1;" onclick="updateOrderStatus('${order.id}', 'Out for Delivery')">Dispatch</button>`;
        } else {
             actions = `<button class="btn btn-success" style="flex:1;" onclick="updateOrderStatus('${order.id}', 'Completed')">Complete Order</button>`;
        }
    } else if (order.status === 'Out for Delivery') {
        actions = `<button class="btn btn-success" style="flex:1;" onclick="updateOrderStatus('${order.id}', 'Completed')">Complete Order</button>`;
    } else {
         actions = `<button class="btn btn-outline" style="flex:1;" onclick="closeDrawer()">Close</button>`;
    }

    document.getElementById('drawer-actions').innerHTML = actions;

    document.getElementById('drawer-overlay').classList.add('active');
    document.getElementById('order-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.updateOrderStatus = function(id, status) {
    window.Store.updateOrderStatus(id, status);
    closeDrawer();
    showToast(`Order #${id} marked as ${status}`, 'success');
};

window.closeDrawer = function() {
    document.getElementById('drawer-overlay').classList.remove('active');
    document.getElementById('order-drawer').classList.remove('open');
    document.body.style.overflow = '';
};

window.openOrderDetailModal = function(orderId) {
    const state = window.Store.state;
    const order = state.orders.find(o => o.id === parseInt(orderId) || o.id === orderId);
    if (!order) return;
    document.getElementById('order-detail-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    document.getElementById('order-detail-title').textContent = 'Order #' + order.id;
    
    const typeColor = order.type === 'Delivery' ? 'var(--clr-primary)' : order.type === 'Dine-in' ? '#8b5cf6' : 'var(--clr-warning)';
    const statusColor = order.status === 'Completed' ? 'var(--clr-success)' : order.status === 'Cancelled' ? 'var(--clr-danger)' : ['Preparing','Sent'].includes(order.status) ? 'var(--clr-warning)' : 'var(--clr-info)';
    document.getElementById('order-detail-badges').innerHTML = `
        <span class="badge" style="background:${typeColor}20; color:${typeColor}; padding:0.2rem 0.6rem;">${order.type}</span>
        <span class="badge" style="background:var(--clr-bg-app); color:var(--clr-text-secondary); padding:0.2rem 0.6rem;">${order.source || 'POS'}</span>
        <span class="badge" style="background:${statusColor}20; color:${statusColor}; padding:0.2rem 0.6rem;">${order.status}</span>
    `;
    
    // CRM Lookup
    const crmCustomer = state.crm ? state.crm.find(c => c.name === order.customer || c.phone === order.phone) : null;
    
    let subtotal = 0;
    const itemsHtml = (order.items || []).map(item => {
        const product = state.products.find(p => p.id === item.id) || {};
        const price = item.price || product.price || 0;
        const qty = item.qty || item.quantity || 1;
        const itemTotal = price * qty;
        subtotal += itemTotal;
        const imgSrc = item.image || product.image || '../assets/images/placeholder.avif';
        return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0; border-bottom:1px solid var(--clr-border);">
            <div style="display:flex; gap:1rem; align-items:center;">
                <img src="${imgSrc}" alt="${item.name}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; background:var(--clr-border);">
                <div>
                    <div style="font-weight:600; font-size:0.95rem;">${item.name}</div>
                    ${item.variant ? `<div style="font-size:0.8rem; color:var(--clr-text-secondary); margin-top:0.15rem;">${item.variant}</div>` : ''}
                    <div style="font-size:0.8rem; color:var(--clr-text-muted); margin-top:0.15rem;">${qty}x @ Rs. ${price.toLocaleString()}</div>
                </div>
            </div>
            <div style="font-weight:600; font-size:0.95rem;">Rs. ${itemTotal.toLocaleString()}</div>
        </div>
        `;
    }).join('');
    
    if (subtotal === 0 && order.total) subtotal = order.total;
    const taxRate = 0.16;
    const taxIncluded = Math.round(subtotal * taxRate / (1 + taxRate));
    const discount = order.discount || 0;
    const deliveryFee = order._isLocal ? (order.deliveryFee || 0) : (order.type === 'Delivery' ? 150 : 0);
    const serviceCharge = order.serviceCharge || 0;
    const grandTotal = order._isLocal ? order.total : (subtotal + deliveryFee);
    
    // Payment method badge
    const payMethod = order.paymentMethod || order.payment || 'N/A';
    const payStatus = order.paymentStatus || order.payment || 'Pending';
    const payBadge = (payStatus === 'Paid' || payStatus === 'Completed') ? 'badge-success' : payStatus === 'Refunded' ? 'badge-info' : 'badge-warning';
    
    document.getElementById('order-detail-body').innerHTML = `
        <!-- Customer + CRM Row -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
            <div class="card" style="padding:1rem;">
                <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.5rem;">Customer</div>
                <div style="font-weight:600;">${order.customer || 'Walk-in'}</div>
                <div style="font-size:0.85rem; color:var(--clr-text-secondary);">${order.phone || ''}</div>
                ${order.email ? `<div style="font-size:0.8rem; color:var(--clr-text-secondary);">${order.email}</div>` : ''}
                ${crmCustomer ? `
                <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid var(--clr-border);">
                    <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.4rem;">Customer History</div>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        <div style="background:var(--clr-bg-app); border-radius:6px; padding:0.3rem 0.6rem; text-align:center;">
                            <div style="font-size:0.7rem; color:var(--clr-text-secondary);">Total Orders</div>
                            <div style="font-weight:700; font-size:0.9rem;">${crmCustomer.orders}</div>
                        </div>
                        <div style="background:var(--clr-bg-app); border-radius:6px; padding:0.3rem 0.6rem; text-align:center;">
                            <div style="font-size:0.7rem; color:var(--clr-text-secondary);">Lifetime Spend</div>
                            <div style="font-weight:700; font-size:0.9rem;">Rs. ${crmCustomer.lifetimeSpend.toLocaleString()}</div>
                        </div>
                        <div style="background:var(--clr-bg-app); border-radius:6px; padding:0.3rem 0.6rem; text-align:center;">
                            <div style="font-size:0.7rem; color:var(--clr-text-secondary);">Points</div>
                            <div style="font-weight:700; font-size:0.9rem; color:var(--clr-warning);">★ ${crmCustomer.points || 0}</div>
                        </div>
                    </div>
                    <div style="margin-top:0.4rem; font-size:0.78rem; color:var(--clr-text-muted);">Segment: <strong>${crmCustomer.segment}</strong> · ${crmCustomer.tier} Tier · Last: ${crmCustomer.lastOrder}</div>
                </div>` : ''}
            </div>
            <div class="card" style="padding:1rem;">
                <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.5rem;">Fulfillment</div>
                <div style="font-weight:600;">${order.type}</div>
                <div style="font-size:0.85rem; color:var(--clr-text-secondary);">
                    ${order.type === 'Dine-in' ? `Table ${order.table || order.tableId || 'T-01'} · ${order.guests || 'N/A'} Guests` : 
                      order.type === 'Pickup' ? ('Pickup At: ' + (order.customer?.city || order.city || 'Selected Outlet')) : 
                      (order.customer?.address || order.address || 'Address not provided')}
                </div>
                ${order.zone ? `<div style="font-size:0.8rem; color:var(--clr-text-secondary); margin-top:0.25rem;">Zone: ${order.zone}</div>` : ''}
                ${order.rider ? `<div style="font-size:0.8rem; color:var(--clr-info); margin-top:0.25rem;">🏍 Rider: ${order.rider}</div>` : ''}
                <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid var(--clr-border);">
                    <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.4rem;">Payment</div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span class="badge ${payBadge}">${payStatus}</span>
                        <span style="font-size:0.85rem; color:var(--clr-text-secondary);">${payMethod !== payStatus ? payMethod : ''}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Items -->
        <div style="margin-bottom:1.5rem;">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.75rem;">Items (${(order.items || []).length})</div>
            ${itemsHtml || '<p style="color:var(--clr-text-muted);">No items</p>'}
        </div>
        
        <!-- Pricing Breakdown -->
        <div style="background:var(--clr-bg-app); border-radius:8px; padding:1rem; margin-bottom:1.5rem;">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.75rem;">Pricing Breakdown</div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.9rem;"><span style="color:var(--clr-text-secondary);">Subtotal</span><span>Rs. ${subtotal.toLocaleString()}</span></div>
            ${discount > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.9rem;"><span style="color:var(--clr-text-secondary);">Discount</span><span style="color:var(--clr-success);">-Rs. ${discount.toLocaleString()}</span></div>` : ''}
            <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.9rem;"><span style="color:var(--clr-text-secondary);">Tax (16% incl.)</span><span>Rs. ${taxIncluded.toLocaleString()}</span></div>
            ${deliveryFee > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.9rem;"><span style="color:var(--clr-text-secondary);">Delivery Fee</span><span>Rs. ${deliveryFee.toLocaleString()}</span></div>` : ''}
            ${serviceCharge > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.9rem;"><span style="color:var(--clr-text-secondary);">Service Charge</span><span>Rs. ${serviceCharge.toLocaleString()}</span></div>` : ''}
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1.05rem; border-top:1px solid var(--clr-border); padding-top:0.75rem; margin-top:0.5rem;"><span>Total</span><span style="color:var(--clr-primary);">Rs. ${grandTotal.toLocaleString()}</span></div>
        </div>
        
        <!-- Order Timeline -->
        <div style="padding:0.75rem; background:var(--clr-bg-app); border-radius:8px;">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.75rem;">Order Timeline</div>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
                ${buildOrderTimeline(order)}
            </div>
        </div>
        ${order.notes ? `<div style="margin-top:1rem; padding:0.75rem; background:rgba(245,158,11,0.08); border-radius:8px; border-left:3px solid var(--clr-warning);"><span style="font-size:0.85rem; font-weight:600;">📌 Note: </span><span style="font-size:0.85rem;">${order.notes}</span></div>` : ''}
    `;
    
    // Build action buttons
    const actions = [];
    if (order.status === 'New') {
        actions.push(`<button class="btn btn-primary" onclick="window.Store.updateOrderStatus('${order.id}','Accepted'); closeOrderDetailModal(); showNotification('Order Accepted','Order #${order.id} has been accepted','success')">Accept</button>`);
    } else if (order.status === 'Accepted') {
        actions.push(`<button class="btn btn-warning" onclick="window.Store.updateKitchenStatus('${order.id}','New'); window.Store.updateOrderStatus('${order.id}','Sent for Preparing'); closeOrderDetailModal(); showNotification('Sent to Kitchen','Order #${order.id} is sent for preparing','success')">Send for Preparing</button>`);
    } else if (order.status === 'Ready') {
        if (order.type === 'Delivery') {
             actions.push(`<button class="btn btn-info" onclick="closeOrderDetailModal(); openDispatchModal('${order.id}')">Dispatch</button>`);
        } else {
             actions.push(`<button class="btn btn-success" onclick="window.Store.updateOrderStatus('${order.id}', 'Completed'); closeOrderDetailModal();">Complete Order</button>`);
        }
    } else if (order.status === 'Out for Delivery') {
        actions.push(`<button class="btn btn-success" onclick="window.Store.updateOrderStatus('${order.id}', 'Completed'); closeOrderDetailModal();">Mark Delivered / Complete</button>`);
    }
    
    actions.push(`<button class="btn btn-outline" onclick="showToast('Printing bill...','info')">🖨 Print Bill</button>`);
    if (order.type !== 'Delivery') {
        actions.push(`<button class="btn btn-outline" onclick="openSplitBillModal('${order.id}')">⚡ Split Bill</button>`);
    }
    if (['Completed','Delivered'].includes(order.status)) {
        actions.push(`<button class="btn btn-outline" style="color:var(--clr-info); border-color:var(--clr-info);" onclick="openRefundModal('${order.id}')">↩ Refund</button>`);
    }
    if (!['Completed','Delivered','Cancelled'].includes(order.status)) {
        actions.push(`<button class="btn btn-outline" style="color:var(--clr-danger); border-color:var(--clr-danger);" onclick="window.Store.updateOrderStatus('${order.id}','Cancelled'); closeOrderDetailModal();">Cancel Order</button>`);
    }
    
    document.getElementById('order-detail-actions').innerHTML = actions.join('');
};

// Build timeline HTML helper
function buildOrderTimeline(order) {
    const steps = [
        { key: 'New', label: 'Order Received' },
        { key: 'Accepted', label: 'Confirmed' },
        { key: 'Sent for Preparing', label: 'Sent to Kitchen' },
        { key: 'Preparing', label: 'Preparing' },
        { key: 'Ready', label: 'Ready' },
        { key: 'Out for Delivery', label: 'Out for Delivery' },
        { key: 'Completed', label: 'Delivered / Completed' },
        { key: 'Cancelled', label: 'Cancelled' },
        { key: 'Refunded', label: 'Refunded' }
    ];
    
    const statusOrder = ['New','Accepted','Sent for Preparing','Preparing','Ready','Out for Delivery','Completed','Delivered'];
    const currentIdx = statusOrder.indexOf(order.status);
    
    return steps.map((step) => {
        const ts = order.statusTimestamps && order.statusTimestamps[step.key];
        const isFirst = step.key === 'New';
        const isDone = ts || isFirst || statusOrder.indexOf(step.key) <= currentIdx;
        const isCancelled = step.key === 'Cancelled' && order.status === 'Cancelled';
        const isRefunded = step.key === 'Refunded' && order.status === 'Refunded';
        
        if (!isDone && !isCancelled && !isRefunded) return '';
        if (order.status !== 'Cancelled' && step.key === 'Cancelled') return '';
        if (order.status !== 'Refunded' && step.key === 'Refunded') return '';
        
        const time = ts || (isFirst ? order.time : '');
        const color = isCancelled ? 'var(--clr-danger)' : isRefunded ? 'var(--clr-info)' : 'var(--clr-success)';
        
        return `
        <div style="display:flex; align-items:center; gap:0.75rem; font-size:0.85rem;">
            ${time ? `<div style="font-weight:600; color:var(--clr-text-secondary); min-width:60px;">${time}</div>` : '<div style="min-width:60px;"></div>'}
            <div style="width:8px; height:8px; border-radius:50%; background:${color}; flex-shrink:0;"></div>
            <div style="flex:1;">
                <div style="font-weight:600; color:var(--clr-text-primary);">${step.label}</div>
            </div>
        </div>`;
    }).join('');
}

// Split Bill Modal
window.openSplitBillModal = function(orderId) {
    const state = window.Store.state;
    const order = state.orders.find(o => o.id === orderId || o.id === parseInt(orderId));
    if (!order) return;
    
    const totalAmount = order.total || 0;
    
    // Inject into generic modal
    document.getElementById('generic-modal-title').textContent = `Split Bill — Order #${order.id}`;
    document.getElementById('generic-modal-body').innerHTML = `
        <p style="color:var(--clr-text-secondary); margin-bottom:1rem;">Total: <strong>Rs. ${totalAmount.toLocaleString()}</strong></p>
        <div>
            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.5rem;">Split by number of people</label>
            <input type="number" id="split-count" min="2" max="20" value="2" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:6px; background:var(--clr-bg-app); color:var(--clr-text-primary);" oninput="updateSplitPreview(${totalAmount})">
        </div>
        <div id="split-preview" style="margin-top:1rem; padding:1rem; background:var(--clr-bg-app); border-radius:8px; text-align:center; font-size:1.1rem; font-weight:700; color:var(--clr-primary);">
            Rs. ${Math.round(totalAmount / 2).toLocaleString()} per person
        </div>
    `;
    document.getElementById('generic-modal-save').textContent = 'Print Split Bills';
    document.getElementById('generic-modal-save').onclick = () => { showToast('Split bills printed!', 'success'); closeGenericModal(); };
    document.getElementById('generic-modal-overlay').style.display = 'flex';
};

window.updateSplitPreview = function(total) {
    const count = parseInt(document.getElementById('split-count').value) || 2;
    document.getElementById('split-preview').textContent = `Rs. ${Math.round(total / count).toLocaleString()} per person`;
};

// Refund Modal
window.openRefundModal = function(orderId) {
    const state = window.Store.state;
    const order = state.orders.find(o => o.id === orderId || o.id === parseInt(orderId));
    if (!order) return;
    
    document.getElementById('generic-modal-title').textContent = `Process Refund — Order #${order.id}`;
    document.getElementById('generic-modal-body').innerHTML = `
        <div>
            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.5rem;">Refund Amount</label>
            <input type="number" id="refund-amount" value="${order.total}" max="${order.total}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:6px; background:var(--clr-bg-app); color:var(--clr-text-primary);">
        </div>
        <div>
            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.5rem;">Reason</label>
            <select id="refund-reason" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:6px; background:var(--clr-bg-app); color:var(--clr-text-primary);">
                <option>Customer complaint</option>
                <option>Wrong order delivered</option>
                <option>Order never arrived</option>
                <option>Food quality issue</option>
                <option>Duplicate charge</option>
                <option>Other</option>
            </select>
        </div>
        <div>
            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.5rem;">Refund Method</label>
            <select id="refund-method" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:6px; background:var(--clr-bg-app); color:var(--clr-text-primary);">
                <option>Original payment method</option>
                <option>Cash</option>
                <option>Loyalty Points</option>
                <option>Store Credit</option>
            </select>
        </div>
    `;
    document.getElementById('generic-modal-save').textContent = 'Process Refund';
    document.getElementById('generic-modal-save').onclick = () => {
        const reason = document.getElementById('refund-reason').value;
        window.Store.updateOrderStatus(orderId, 'Refunded');
        showToast(`Refund processed for Order #${orderId} — ${reason}`, 'success');
        closeGenericModal();
    };
    document.getElementById('generic-modal-overlay').style.display = 'flex';
};

window.closeOrderDetailModal = function() {
    document.getElementById('order-detail-modal').style.display = 'none';
    document.body.style.overflow = '';
};

window.openDispatchModal = function(orderId) {
    const state = window.Store.state;
    const order = state.orders.find(o => o.id === orderId || o.id === parseInt(orderId));
    if (!order) return;
    
    document.getElementById('dispatch-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    document.getElementById('dispatch-title').textContent = 'Dispatch Order #' + order.id;
    
    const riders = state.riders.filter(r => r.status === 'Online');
    const riderOptions = riders.map(r => `<option value="${r.name}">${r.name} (${r.activeDeliveries} active)</option>`).join('');
    
    const isUnpaid = order.payment === 'Unpaid' || order.paymentStatus === 'Unpaid' || order.paymentMethod === 'Cash on Delivery' || order.paymentMethod === 'Cash at Pickup';
    
    document.getElementById('dispatch-body').innerHTML = `
        <div style="display:flex; gap:1rem; margin-bottom:1.5rem;">
            <!-- Map Placeholder -->
            <div style="flex:1; background:var(--clr-bg-app); border-radius:8px; display:flex; flex-direction:column; overflow:hidden;">
                <div style="flex:1; background:#e5e7eb; display:flex; align-items:center; justify-content:center; position:relative; min-height:120px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" style="position:absolute; top:20px; left:30px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" stroke-width="2" style="position:absolute; bottom:30px; right:40px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <div style="font-weight:600; color:#6b7280; font-size:0.85rem;">Google Maps Route (ETA: 15 mins)</div>
                </div>
            </div>
            
            <div style="flex:1; padding:1rem; background:var(--clr-bg-app); border-radius:8px; display:flex; flex-direction:column; justify-content:center;">
                <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.5rem;">Delivery Address</div>
                <div style="font-weight:600;">${order.customer}</div>
                <div style="font-size:0.9rem;">${order.address || 'Address not provided'}</div>
                ${order.zone ? '<div style="font-size:0.8rem; color:var(--clr-text-secondary); margin-top:0.25rem;">Zone: '+order.zone+'</div>' : ''}
                ${order.notes ? '<div style="font-size:0.8rem; color:var(--clr-warning); margin-top:0.5rem;">Note: '+order.notes+'</div>' : ''}
            </div>
        </div>
        
        <div style="margin-bottom:1rem;">
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.5rem;">Assign Rider</label>
            <select id="dispatch-rider-select" style="width:100%; padding:0.6rem; border:1px solid var(--clr-border); border-radius:4px;">
                <option value="">-- Select Rider --</option>
                ${riderOptions}
            </select>
        </div>
        
        ${isUnpaid ? `
        <div style="margin-bottom:1rem; padding:0.75rem; background:var(--clr-danger-bg); border-left:3px solid var(--clr-danger); border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong style="color:var(--clr-danger); font-size:0.85rem; display:block;">${order.paymentMethod === 'Cash at Pickup' ? 'Cash at Pickup' : 'Cash on Delivery'}</strong>
                <span style="font-size:0.75rem; color:var(--clr-text-primary);">${order.paymentMethod === 'Cash at Pickup' ? 'Staff must collect cash.' : 'Rider must collect cash.'}</span>
            </div>
            <strong style="font-size:1.1rem; color:var(--clr-danger);">Rs. ${(order.total || 0).toLocaleString()}</strong>
        </div>` : `
        <div style="margin-bottom:1rem; padding:0.75rem; background:var(--clr-success-bg); border-left:3px solid var(--clr-success); border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong style="color:var(--clr-success); font-size:0.85rem; display:block;">Pre-paid Order</strong>
                <span style="font-size:0.75rem; color:var(--clr-text-primary);">Do not collect cash.</span>
            </div>
        </div>
        `}
    `;
    
    document.getElementById('dispatch-actions').innerHTML = `
        <button class="btn btn-outline" style="flex:1;" onclick="closeDispatchModal()">Cancel</button>
        <button class="btn btn-primary" style="flex:1;" onclick="confirmDispatch('${order.id}')">Confirm Dispatch</button>
    `;
};

window.closeDispatchModal = function() {
    document.getElementById('dispatch-modal').style.display = 'none';
    document.body.style.overflow = '';
};

window.confirmDispatch = function(orderId) {
    const riderSelect = document.getElementById('dispatch-rider-select');
    if(!riderSelect.value) {
        showToast('Please select a rider', 'warning');
        return;
    }
    
    window.Store.updateOrderStatus(orderId, 'Out for Delivery');
    closeDispatchModal();
    showNotification('Order Dispatched', 'Order #' + orderId + ' is Out for Delivery by ' + riderSelect.options[riderSelect.selectedIndex].text.split(' (')[0], 'success');
};
