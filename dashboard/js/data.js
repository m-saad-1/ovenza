// Centralized demo data state for the meldough dashboard.
// Demo data for the meldough restaurant dashboard.

const Store = {
    state: {
        ...window.crustDemoData,
        currentBranch: "Sialkot Cantt",
        dateRange: "Today"
    },

    listeners: [],

    subscribe(listener) {
        this.listeners.push(listener);
    },

    notify() {
        this.saveAdminOrders();
        this.listeners.forEach(listener => listener(this.state));
    },
    
    saveAdminOrders() {
        try {
            localStorage.setItem("crust_admin_orders", JSON.stringify(this.state.orders));
        } catch (e) {
            console.error("Error saving admin orders", e);
        }
    },

    _statusOrder: ["New", "Accepted", "Sent for Preparing", "Preparing", "Ready", "Dispatched", "Out for Delivery", "Completed", "Delivered"],

    getValidNextStatuses(order) {
        if (!order) return [];
        const aliases = { Pending: 'New', Confirmed: 'Accepted', Assigned: 'Dispatched' };
        const status = aliases[order.status] || order.status;
        const isDelivery = order.type === 'Delivery';
        const transitions = {
            'New': ['Accepted'],
            'Accepted': ['Sent for Preparing'],
            'Sent for Preparing': ['Preparing'],
            'Preparing': ['Ready'],
            'Ready': [isDelivery ? 'Dispatched' : 'Completed'],
            'Dispatched': ['Out for Delivery'],
            'Out for Delivery': ['Delivered']
        };
        return transitions[status] || [];
    },

    canTransition(order, newStatus) {
        if (!order) return false;
        if (newStatus === 'Cancelled') return !['Completed', 'Delivered', 'Cancelled', 'Refunded'].includes(order.status);
        if (newStatus === 'Refunded') return ['Completed', 'Delivered'].includes(order.status);
        return this.getValidNextStatuses(order).includes(newStatus);
    },

    /**
     * Updates the admin-facing order status.
     * Note: This status is separate from kitchenStatus, but they are partially synced.
     * @param {string} orderId - The ID of the order to update
     * @param {string} newStatus - The new status (e.g., 'New', 'Preparing', 'Ready', 'Completed', 'Cancelled')
     */
    updateOrderStatus(orderId, newStatus) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (!order) return;

        if (!this.canTransition(order, newStatus)) {
            console.warn(`Blocked invalid status transition: ${order.status} → ${newStatus}`);
            return;
        }

        order.status = newStatus;
        order.kitchenStatus = this.getKitchenStatus(order);
        if (order.type === 'Delivery') {
            if (newStatus === 'Dispatched') order.deliveryStatus = 'Assigned';
            if (newStatus === 'Out for Delivery') order.deliveryStatus = 'Out for Delivery';
            if (newStatus === 'Delivered') order.deliveryStatus = 'Delivered';
            if (newStatus === 'Cancelled') order.deliveryStatus = 'Cancelled';
        }

        // Record per-step timestamp
        if (!order.statusTimestamps) order.statusTimestamps = {};
        order.statusTimestamps[newStatus] = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        if (order._isLocal) {
            try {
                let localOrders = JSON.parse(localStorage.getItem("hdm_orders")) || [];
                const localOrder = localOrders.find(o => o.id.toString() === orderId.toString());
                if (localOrder) {
                    localOrder.status = newStatus;
                    localOrder.kitchenStatus = order.kitchenStatus;
                    localOrder.deliveryStatus = order.deliveryStatus;
                    if (!localOrder.statusTimestamps) localOrder.statusTimestamps = {};
                    localOrder.statusTimestamps[newStatus] = order.statusTimestamps[newStatus];
                    localStorage.setItem("hdm_orders", JSON.stringify(localOrders));
                }
            } catch(e) {}
        }
        this.notify();
    },
    
    /**
     * Derives the KDS kitchen status from the main order status.
     * @param {Object} order - The order object
     * @returns {string} The derived kitchen status ('New', 'Preparing', 'Ready', 'Completed')
     */
    getKitchenStatus(order) {
        if (!order) return 'New';
        if (['New', 'Accepted', 'Sent for Preparing'].includes(order.status)) return 'New';
        if (order.status === 'Preparing') return 'Preparing';
        if (order.status === 'Ready') return 'Ready';
        return 'Completed'; // Out for Delivery, Delivered, Completed, Cancelled
    },
    
    setBranch(branchName) {
        this.state.currentBranch = branchName;
        this.notify();
    },
    
    refreshLocalOrders() {
        try {
            const stored = localStorage.getItem("hdm_orders");
            if (stored) {
                let localOrders = JSON.parse(stored).map(o => ({
                    id: o.id.toString(),
                    customer: o.customer ? o.customer.name : "Walk-in",
                    type: (o.type ? (o.type.charAt(0).toUpperCase() + o.type.slice(1).toLowerCase()) : "Delivery"),
                    source: "Website",
                    branchId: "b1",
                    total: o.total || 0,
                    payment: (o.paymentMethod === "Cash on Delivery" || o.paymentMethod === "Cash at Pickup") ? "Unpaid" : "Paid",
                    status: o.status === "Pending" ? "New" : o.status,
                    kitchenStatus: o.status === "Pending" ? "New" : o.status,
                    timestamp: o.timestamp || Date.now(),
                    time: o.timestamp ? new Date(o.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : (o.date ? o.date.split(" ").slice(1).join(" ") : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })),
                    notes: o.customer ? o.customer.notes : "",
                    address: o.customer ? o.customer.address : "",
                    city: o.customer ? o.customer.city : "",
                    paymentMethod: o.paymentMethod || "",
                    pickupTime: o.pickupTime || null,
                    items: (o.items || []).map(i => ({
                        id: i.id || "p0",
                        name: i.title || i.name,
                        qty: i.qty || 1,
                        price: (i.basePrice || 0) + (i.addonsTotal || 0),
                        unitPrice: (i.basePrice || i.price || 0) + (i.addonsTotal || 0),
                        addonsTotal: i.addonsTotal || 0,
                        variant: [i.size, ...(i.extras || [])].filter(Boolean).join(', ') || "",
                        image: i.image ? (i.image.startsWith('./assets/') ? '../' + i.image.slice(2) : i.image) : ''
                    })),
                    statusTimestamps: o.statusTimestamps || {},
                    _isLocal: true
                }));
                
                let changed = false;
                const existingIds = new Set(this.state.orders.map(o => o.id));
                
                localOrders.forEach(lo => {
                    if (!existingIds.has(lo.id)) {
                        // New order — add it
                        this.state.orders.unshift(lo);
                        changed = true;
                    } else {
                        // Existing order — update status if it changed in hdm_orders
                        const existing = this.state.orders.find(o => o.id === lo.id);
                        if (existing && existing.status !== lo.status) {
                            existing.status = lo.status;
                            existing.kitchenStatus = lo.kitchenStatus;
                            existing.statusTimestamps = lo.statusTimestamps;
                            changed = true;
                        }
                    }
                });
                
                if (changed) {
                    this.notify();
                }
            }
        } catch (e) {
            console.error("Error refreshing hdm_orders", e);
        }
    }
};

window.Store = Store;

/**
 * Utility to filter orders by the currently selected branch.
 * @param {Object} state - The Store.state object
 * @returns {Array} Filtered list of orders
 */
window.getBranchFilteredOrders = function(state) {
    let targetOrders = state.orders;
    if (state.currentBranch && state.currentBranch !== "All Branches") {
        const branch = state.branches.find(b => b.name === state.currentBranch);
        if (branch) {
            targetOrders = state.orders.filter(o => o.branchId === branch.id);
        }
    }
    return targetOrders;
};

window.addEventListener('storage', function(e) {
    if (e.key === 'hdm_orders') {
        window.Store.refreshLocalOrders();
    }
});
