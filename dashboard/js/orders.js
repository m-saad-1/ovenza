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
    if (window._orderTypeFilter !== 'All') filtered = filtered.filter(o => o.type === window._orderTypeFilter);
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
        if (order.time) {
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
                <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" onclick="openOrderDetailModal('${order.id}')">View Details</button>
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
        
        ${order.type === 'Delivery' && order.address ? `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--clr-bg-app); border-radius: 8px;">
            <p style="margin: 0 0 0.5rem 0; color: var(--clr-text-secondary); font-size: 0.85rem; font-weight: 600;">Delivery Details</p>
            <p style="margin: 0; font-size: 0.9rem;">${order.address} (${order.zone})</p>
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
    
    let subtotal = 0;
    const itemsHtml = (order.items || []).map(item => {
        const product = state.products.find(p => p.id === item.id) || { price: 0, image: '../assets/images/placeholder.avif' };
        const price = item.price || product.price;
        const qty = item.qty || item.quantity || 1;
        const total = price * qty;
        subtotal += total;
        return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0; border-bottom:1px solid var(--clr-border);">
            <div style="display:flex; gap:1rem; align-items:center;">
                <img src="${product.image}" alt="${item.name}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; background:var(--clr-border);">
                <div>
                    <div style="font-weight:600; font-size:0.95rem;">${item.name}</div>
                    ${item.variant ? '<div style="font-size:0.8rem; color:var(--clr-text-secondary); margin-top:0.15rem;">'+item.variant+'</div>' : ''}
                    <div style="font-size:0.8rem; color:var(--clr-text-muted); margin-top:0.15rem;">${qty}x @ Rs. ${price.toLocaleString()}</div>
                </div>
            </div>
            <div style="font-weight:600; font-size:0.95rem;">Rs. ${total.toLocaleString()}</div>
        </div>
        `;
    }).join('');
    
    // Fallback if total wasn't calculated correctly from items
    if (subtotal === 0 && order.total) subtotal = order.total;
    const tax = Math.round(subtotal * 0.16 / 1.16);
    const deliveryFee = order.type === 'Delivery' ? 150 : 0;
    const grandTotal = subtotal + deliveryFee;
    
    document.getElementById('order-detail-body').innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
            <div class="card" style="padding:1rem;">
                <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.5rem;">Customer</div>
                <div style="font-weight:600;">${order.customer || 'Walk-in'}</div>
                <div style="font-size:0.85rem; color:var(--clr-text-secondary);">${order.customer !== 'Walk-in' ? '+92 335 4477774' : ''}</div>
            </div>
            <div class="card" style="padding:1rem;">
                <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.5rem;">Fulfillment</div>
                <div style="font-weight:600;">${order.type}</div>
                <div style="font-size:0.85rem; color:var(--clr-text-secondary);">${order.type === 'Dine-in' ? ('Table ' + (order.table || order.tableId || 'T-01')) : order.type === 'Delivery' ? (order.address || 'G-13/4, Islamabad, Pakistan 011') : 'Ready for pickup'}</div>
            </div>
        </div>
        <div style="margin-bottom:1.5rem;">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.75rem;">Items</div>
            ${itemsHtml || '<p style="color:var(--clr-text-muted);">No items</p>'}
        </div>
        <div style="background:var(--clr-bg-app); border-radius:8px; padding:1rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem;"><span style="color:var(--clr-text-secondary);">Subtotal (incl. tax)</span><span>Rs. ${subtotal.toLocaleString()}</span></div>
            ${deliveryFee ? '<div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem;"><span style="color:var(--clr-text-secondary);">Delivery Fee</span><span>Rs. '+deliveryFee+'</span></div>' : ''}
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; font-size:0.9rem;"><span style="color:var(--clr-text-secondary);">Tax (16%) included</span><span>Rs. ${tax.toLocaleString()}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1.05rem; border-top:1px solid var(--clr-border); padding-top:0.75rem;"><span>Total</span><span style="color:var(--clr-primary);">Rs. ${grandTotal.toLocaleString()}</span></div>
        </div>
        <div style="margin-top:1.25rem; padding:0.75rem; background:var(--clr-bg-app); border-radius:8px;">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.5rem;">Order Timeline</div>
            <div style="font-size:0.85rem; color:var(--clr-text-secondary); line-height:1.8;">
                <div>✓ Order placed — ${order.time}</div>
                ${!['New'].includes(order.status) ? '<div>✓ Accepted</div>' : ''}
                ${!['New','Accepted'].includes(order.status) ? '<div>✓ Sent for Preparing</div>' : ''}
                ${['Ready','Dispatched','Out for Delivery','Completed','Delivered'].includes(order.status) ? '<div>✓ Ready</div>' : ''}
                ${['Dispatched','Out for Delivery','Completed','Delivered'].includes(order.status) ? '<div>✓ Dispatched</div>' : ''}
                ${['Completed','Delivered'].includes(order.status) ? '<div>✓ Completed</div>' : ''}
            </div>
        </div>
    `;
    
    // Build action buttons according to strict workflow
    const actions = [];
    if (order.status === 'New') {
        actions.push(`<button class="btn btn-primary" onclick="window.Store.updateOrderStatus('${order.id}','Accepted'); closeOrderDetailModal(); showNotification('Order Accepted','Order #${order.id} has been accepted','success')">Accept</button>`);
    } else if (order.status === 'Accepted') {
        actions.push(`<button class="btn btn-warning" onclick="window.Store.updateKitchenStatus('${order.id}','New'); window.Store.updateOrderStatus('${order.id}','Sent for Preparing'); closeOrderDetailModal(); showNotification('Sent to Kitchen','Order #${order.id} is sent for preparing','success')">Send for Preparing</button>`);
    } else if (order.status === 'Sent for Preparing' || order.status === 'Preparing') {
        // Kitchen is handling it. Only show print bill or cancel.
    } else if (order.status === 'Ready') {
        if (order.type === 'Delivery') {
             actions.push(`<button class="btn btn-info" onclick="closeOrderDetailModal(); openDispatchModal('${order.id}')">Dispatch</button>`);
        } else {
             actions.push(`<button class="btn btn-success" onclick="window.Store.updateOrderStatus('${order.id}', 'Completed'); closeOrderDetailModal();">Complete Order</button>`);
        }
    } else if (order.status === 'Dispatched' || order.status === 'Out for Delivery') {
        actions.push(`<button class="btn btn-success" onclick="window.Store.updateOrderStatus('${order.id}', 'Completed'); closeOrderDetailModal();">Mark Delivered / Complete</button>`);
    }
    
    actions.push(`<button class="btn btn-outline" onclick="showToast('Printing bill...','info')">Print Bill</button>`);
    if (!['Completed','Delivered','Cancelled'].includes(order.status)) {
        actions.push(`<button class="btn btn-outline" style="color:var(--clr-danger); border-color:var(--clr-danger);" onclick="window.Store.updateOrderStatus('${order.id}','Cancelled'); closeOrderDetailModal();">Cancel Order</button>`);
    }
    
    document.getElementById('order-detail-actions').innerHTML = actions.join('');
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
    const riderOptions = riders.map(r => `<option value="${r.id}">${r.name} (${r.activeDeliveries} active)</option>`).join('');
    
    document.getElementById('dispatch-body').innerHTML = `
        <div style="margin-bottom:1.5rem; padding:1rem; background:var(--clr-bg-app); border-radius:8px;">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--clr-text-secondary); margin-bottom:0.5rem;">Delivery Address</div>
            <div style="font-weight:600;">${order.customer}</div>
            <div style="font-size:0.9rem;">${order.address || 'Address not provided'}</div>
            ${order.zone ? '<div style="font-size:0.8rem; color:var(--clr-text-secondary); margin-top:0.25rem;">Zone: '+order.zone+'</div>' : ''}
            ${order.notes ? '<div style="font-size:0.8rem; color:var(--clr-warning); margin-top:0.5rem;">Note: '+order.notes+'</div>' : ''}
        </div>
        
        <div style="margin-bottom:1rem;">
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.5rem;">Assign Rider</label>
            <select id="dispatch-rider-select" style="width:100%; padding:0.6rem; border:1px solid var(--clr-border); border-radius:4px;">
                <option value="">-- Select Rider --</option>
                ${riderOptions}
            </select>
        </div>
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
    
    window.Store.updateOrderStatus(orderId, 'Dispatched');
    closeDispatchModal();
    showNotification('Order Dispatched', 'Order #' + orderId + ' has been assigned to ' + riderSelect.options[riderSelect.selectedIndex].text.split(' (')[0], 'success');
};
