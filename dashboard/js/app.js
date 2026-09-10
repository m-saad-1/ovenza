(function(){document.addEventListener('load',function(e){if(e.target.tagName==='IMG'){e.target.classList.add('is-loaded');}},true);document.addEventListener('error',function(e){if(e.target.tagName==='IMG'){e.target.classList.add('is-loaded');}},true);document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('img').forEach(function(img){if(img.complete)img.classList.add('is-loaded');});});})();
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard Initialized');
    
    // Subscribe to state changes
    window.Store.subscribe((state) => {
        renderHeader(state);
        updateSidebarBadges(state);
    });

    // Initial render
    window.Store.notify();

    // Periodically re-render to update elapsed timers (KDS & Orders)
    setInterval(() => {
        window.Store.notify();
    }, 60000);

    // Desktop Preference Modal Logic
    if (window.innerWidth <= 1024 && !sessionStorage.getItem('desktop_pref_shown')) {
        const prefModal = document.getElementById('desktop-pref-modal');
        if (prefModal) {
            prefModal.style.display = 'flex';
            sessionStorage.setItem('desktop_pref_shown', 'true');
        }
    }

    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('app-sidebar');
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    if (collapseBtn && sidebar) {
        // Load persisted state
        if (localStorage.getItem('sidebar_collapsed') === 'true') {
            sidebar.classList.add('collapsed');
        }
        collapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // View Switching Logic
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            views.forEach(view => view.classList.remove('active'));
            
            // Add active class to clicked
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
                
                // Explicitly open first tab by default for modules with inner tabs
                const firstTab = targetView.querySelector('.inner-tab');
                if (firstTab) {
                    firstTab.click();
                }
            }
            
            // Close mobile sidebar if open
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Inner Tabs Logic (Universal)
    document.querySelectorAll('.inner-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            
            // Find parent view to scope the active class toggling
            const parentView = tab.closest('.view-section');
            if (parentView && targetContent) {
                // Remove active from sibling tabs in same view
                parentView.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
                parentView.querySelectorAll('.inv-tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active to clicked tab and corresponding content
                tab.classList.add('active');
                targetContent.classList.add('active');
            }
        });
    });
});

function renderHeader(state) {
    const branchSelector = document.getElementById('header-branch-selector');
    if (branchSelector) {
        // Only update if not already focused/active to prevent interrupting user
        if (document.activeElement !== branchSelector) {
            branchSelector.innerHTML = state.branches.map(function(b) {
                return '<option value="' + b.name + '"' + (state.currentBranch === b.name ? ' selected' : '') + '>' + b.name + '</option>';
            }).join('');
            
            branchSelector.onchange = (e) => {
                // Reset selector visually
                e.target.value = state.currentBranch;
                // Require authentication by opening the modal
                if (typeof openBranchSwitchModal === 'function') {
                    openBranchSwitchModal();
                }
            };
        }
    }

    // Update Notifications Badge
    const notifBadge = document.getElementById('notif-badge');
    if (notifBadge && state.orders) {
        const unreadCount = state.orders.filter(o => o.kitchenStatus === 'New' || o.status === 'New').length;
        if (unreadCount > 0) {
            notifBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            notifBadge.style.display = 'flex';
        } else {
            notifBadge.style.display = 'none';
        }
    }
}

// --- GENERIC MODAL LOGIC (Phase 3) ---
let currentModalContext = null;

window.openGenericModal = function(type, editId = null) {
    const overlay = document.getElementById('generic-modal-overlay');
    const title = document.getElementById('generic-modal-title');
    const body = document.getElementById('generic-modal-body');
    const saveBtn = document.getElementById('generic-modal-save');
    
    if (!overlay || !title || !body || !saveBtn) return;
    
    currentModalContext = { type, editId };
    body.innerHTML = '';
    
    let state = window.Store.state;
    let data = null;

    if (type === 'product') {
        title.textContent = editId ? 'Edit Product' : 'Add New Product';
        if (editId) data = state.products.find(p => p.id === editId);
        
        let categoryOptions = state.categories.map(c => `<option value="${c.id}" ${data && data.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('');
        
        body.innerHTML = `
            <input type="text" id="modal-p-name" placeholder="Product Name" value="${data ? data.name : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <textarea id="modal-p-desc" placeholder="Description" rows="2" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">${data ? (data.desc || '') : ''}</textarea>
            
            <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="modal-p-price" placeholder="Price (Rs.)" value="${data ? data.price : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="number" id="modal-p-orig-price" placeholder="Original Price" value="${data && data.originalPrice ? data.originalPrice : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="modal-p-disc-price" placeholder="Discounted Price" value="${data && data.discountedPrice ? data.discountedPrice : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="number" id="modal-p-discount" placeholder="Discount (%)" value="${data && data.discount ? data.discount : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="modal-p-stock" placeholder="Stock Qty" value="${data && data.stock ? data.stock : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="file" id="modal-p-image" accept="image/*" style="width:50%; padding:0.4rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="modal-p-sizes" placeholder="Sizes (comma separated)" value="${data && data.sizes ? data.sizes : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="text" id="modal-p-modifiers" placeholder="Modifiers (comma separated)" value="${data && data.modifiers ? data.modifiers : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <select id="modal-p-cat" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    ${categoryOptions}
                </select>
                <select id="modal-p-status" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    <option value="Available" ${data && data.status === 'Available' ? 'selected' : ''}>Available</option>
                    <option value="Low Stock" ${data && data.status === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
                    <option value="Out of Stock" ${data && data.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
                </select>
            </div>
            
            <input type="datetime-local" id="modal-p-deal-end" placeholder="Deal End Date/Time" value="${data && data.dealEnd ? data.dealEnd : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;" title="Deal End Date/Time">
        `;
    }
    else if (type === 'rider') {
        title.textContent = editId ? 'Edit Rider' : 'Add New Rider';
        if (editId) data = state.riders.find(r => r.id === editId);
        
        body.innerHTML = `
            <input type="text" id="modal-r-name" placeholder="Rider Name" value="${data ? data.name : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="text" id="modal-r-phone" placeholder="Phone Number" value="${data && data.phone ? data.phone : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="email" id="modal-r-email" placeholder="Email Address" value="${data && data.email ? data.email : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="text" id="modal-r-address" placeholder="Home Address" value="${data && data.address ? data.address : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <div style="display: flex; gap: 0.5rem;">
                <select id="modal-r-vehicle" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    <option value="Bike" ${data && data.vehicle === 'Bike' ? 'selected' : ''}>Bike</option>
                    <option value="Car" ${data && data.vehicle === 'Car' ? 'selected' : ''}>Car</option>
                </select>
                <input type="text" id="modal-r-vehiclenum" placeholder="Vehicle No." value="${data && data.vehicleNum ? data.vehicleNum : ''}" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>
            <select id="modal-r-status" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <option value="Online" ${data && data.status === 'Online' ? 'selected' : ''}>Online</option>
                <option value="Offline" ${data && data.status === 'Offline' ? 'selected' : ''}>Offline</option>
            </select>
        `;
    }
    else if (type === 'branch') {
        title.textContent = editId ? 'Edit Branch' : 'Add New Branch';
        if (editId) data = state.branches.find(b => b.id === editId);
        
        body.innerHTML = `
            <input type="text" id="modal-b-name" placeholder="Branch Name" value="${data ? data.name : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <select id="modal-b-status" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <option value="Open" ${data && data.status === 'Open' ? 'selected' : ''}>Open</option>
                <option value="Busy" ${data && data.status === 'Busy' ? 'selected' : ''}>Busy</option>
                <option value="Closed" ${data && data.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
        `;
    }
    else if (type === 'employee') {
        title.textContent = editId ? 'Edit Employee' : 'Add Employee';
        if (editId) data = state.staff.find(e => e.id === editId);
        
        body.innerHTML = `
            <input type="text" id="modal-e-name" placeholder="Employee Name" value="${data ? data.name : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="text" id="modal-e-role" placeholder="Role (e.g. Cashier, Chef)" value="${data ? data.role : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <input type="text" id="modal-e-shift" placeholder="Shift (e.g. 09:00 - 18:00)" value="${data ? data.shift : ''}" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            <select id="modal-e-status" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <option value="Present" ${data && data.status === 'Present' ? 'selected' : ''}>Present</option>
                <option value="Late" ${data && data.status === 'Late' ? 'selected' : ''}>Late</option>
                <option value="Scheduled" ${data && data.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
            </select>
        `;
    }
    else if (type === 'receive-stock') {
        title.textContent = 'Receive Stock';
        let stockOptions = state.inventory.map(i => `<option value="${i.id}">${i.name} (${i.sku})</option>`).join('');
        body.innerHTML = `
            <select id="modal-stock-item" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
                ${stockOptions}
            </select>
            <input type="number" id="modal-stock-qty" placeholder="Quantity to Receive" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="number" id="modal-stock-cost" placeholder="Total Cost (Rs.)" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
        `;
    }
    else if (type === 'supplier') {
        title.textContent = 'New Supplier';
        body.innerHTML = `
            <input type="text" id="modal-sup-name" placeholder="Supplier Name" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-sup-contact" placeholder="Contact Number" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-sup-cat" placeholder="Categories Supplied" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
        `;
    }
    else if (type === 'waste') {
        title.textContent = 'Record Waste';
        body.innerHTML = `
            <input type="text" id="modal-waste-item" placeholder="Item / Ingredient Name" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-waste-qty" placeholder="Quantity (e.g. 500g)" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-waste-reason" placeholder="Reason (e.g. Expired)" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="number" id="modal-waste-value" placeholder="Estimated Value Lost (Rs.)" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
        `;
    }
    else if (type === 'booking') {
        title.textContent = 'New Booking';
        body.innerHTML = `
            <input type="text" id="modal-bk-customer" placeholder="Customer Name" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="text" id="modal-bk-phone" placeholder="Phone Number" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <input type="datetime-local" id="modal-bk-date" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="number" id="modal-bk-guests" placeholder="Guests" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <select id="modal-bk-table" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    ${state.tables.map(t => `<option value="${t.id}">${t.id} (Cap: ${t.capacity})</option>`).join('')}
                </select>
            </div>
            <select id="modal-bk-occasion" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
                <option value="">No Special Occasion</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Business Meeting">Business Meeting</option>
            </select>
            <textarea id="modal-bk-notes" placeholder="Special Requests / Notes" rows="2" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;"></textarea>
        `;
    }
    else if (type === 'campaign') {
        title.textContent = 'Create Campaign';
        body.innerHTML = `
            <input type="text" id="modal-camp-name" placeholder="Campaign Name" style="width:100%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px; margin-bottom: 0.5rem;">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <select id="modal-camp-segment" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    <option value="All">All Customers</option>
                    <option value="VIP">VIP</option>
                    <option value="At-Risk">At-Risk</option>
                    <option value="New">New</option>
                </select>
                <select id="modal-camp-channel" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                </select>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="modal-camp-budget" placeholder="Budget (Rs.)" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
                <input type="date" id="modal-camp-start" style="width:50%; padding:0.5rem; border:1px solid var(--clr-border); border-radius:4px;">
            </div>
        `;
    }
    
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeGenericModal = function() {
    document.getElementById('generic-modal-overlay').style.display = 'none';
    document.body.style.overflow = '';
};

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('generic-modal-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (!currentModalContext) return;
            const state = window.Store.state;
            const { type, editId } = currentModalContext;
            
            if (type === 'product') {
                const pName = document.getElementById('modal-p-name').value;
                const pDesc = document.getElementById('modal-p-desc').value;
                const pPrice = parseInt(document.getElementById('modal-p-price').value) || 0;
                const pOrigPrice = parseInt(document.getElementById('modal-p-orig-price').value) || null;
                const pDiscPrice = parseInt(document.getElementById('modal-p-disc-price').value) || null;
                const pDiscount = parseInt(document.getElementById('modal-p-discount').value) || null;
                const pStock = parseInt(document.getElementById('modal-p-stock').value) || null;
                const pSizes = document.getElementById('modal-p-sizes').value;
                const pModifiers = document.getElementById('modal-p-modifiers').value;
                const pDealEnd = document.getElementById('modal-p-deal-end').value;
                const pCat = document.getElementById('modal-p-cat').value;
                const pStatus = document.getElementById('modal-p-status').value;
                
                if (pName) {
                    if (editId) {
                        const product = state.products.find(p => p.id === editId);
                        if (product) {
                            product.name = pName; product.desc = pDesc; product.price = pPrice; 
                            product.originalPrice = pOrigPrice; product.discountedPrice = pDiscPrice;
                            product.discount = pDiscount; product.stock = pStock;
                            product.sizes = pSizes; product.modifiers = pModifiers;
                            product.dealEnd = pDealEnd; product.categoryId = pCat; product.status = pStatus;
                        }
                    } else {
                        state.products.push({
                            id: 'p' + Math.floor(Math.random() * 10000),
                            name: pName, desc: pDesc, price: pPrice, 
                            originalPrice: pOrigPrice, discountedPrice: pDiscPrice,
                            discount: pDiscount, stock: pStock,
                            sizes: pSizes, modifiers: pModifiers,
                            dealEnd: pDealEnd, categoryId: pCat, status: pStatus,
                            image: '../assets/images/burger-1.avif'
                        });
                    }
                }
            }
            else if (type === 'rider') {
                const rName = document.getElementById('modal-r-name').value;
                const rPhone = document.getElementById('modal-r-phone').value;
                const rEmail = document.getElementById('modal-r-email').value;
                const rAddress = document.getElementById('modal-r-address').value;
                const rVehicle = document.getElementById('modal-r-vehicle').value;
                const rVehicleNum = document.getElementById('modal-r-vehiclenum').value;
                const rStatus = document.getElementById('modal-r-status').value;
                if (rName) {
                    if (editId) {
                        const rider = state.riders.find(r => r.id === editId);
                        if (rider) { 
                            rider.name = rName; rider.phone = rPhone; rider.email = rEmail;
                            rider.address = rAddress; rider.vehicle = rVehicle; 
                            rider.vehicleNum = rVehicleNum; rider.status = rStatus; 
                        }
                    } else {
                        state.riders.push({ 
                            id: 'r' + Math.floor(Math.random()*10000), 
                            name: rName, phone: rPhone, email: rEmail, 
                            address: rAddress, vehicle: rVehicle, vehicleNum: rVehicleNum,
                            status: rStatus, activeDeliveries: 0, completedToday: 0 
                        });
                    }
                }
            }
            else if (type === 'branch') {
                const bName = document.getElementById('modal-b-name').value;
                const bStatus = document.getElementById('modal-b-status').value;
                if (bName) {
                    if (editId) {
                        const branch = state.branches.find(b => b.id === editId);
                        if (branch) { branch.name = bName; branch.status = bStatus; }
                    } else {
                        state.branches.push({ id: 'b' + Math.floor(Math.random()*10000), name: bName, status: bStatus, todayRevenue: 0 });
                    }
                }
            }
            else if (type === 'employee') {
                const eName = document.getElementById('modal-e-name').value;
                const eRole = document.getElementById('modal-e-role').value;
                const eShift = document.getElementById('modal-e-shift').value;
                const eStatus = document.getElementById('modal-e-status').value;
                if (eName) {
                    if (editId) {
                        const emp = state.staff.find(e => e.id === editId);
                        if (emp) { emp.name = eName; emp.role = eRole; emp.shift = eShift; emp.status = eStatus; }
                    } else {
                        state.staff.push({ id: 'e' + Math.floor(Math.random()*10000), name: eName, role: eRole, shift: eShift, status: eStatus });
                    }
                }
            }
            else if (type === 'receive-stock') {
                const itemId = document.getElementById('modal-stock-item').value;
                const qty = parseInt(document.getElementById('modal-stock-qty').value) || 0;
                if (itemId && qty > 0) {
                    const item = state.inventory.find(i => i.id === itemId);
                    if (item) item.qty += qty;
                }
            }
            else if (type === 'supplier') {
                const sName = document.getElementById('modal-sup-name').value;
                const sContact = document.getElementById('modal-sup-contact').value;
                const sCat = document.getElementById('modal-sup-cat').value;
                if (sName) {
                    state.suppliers.push({
                        id: 's' + Math.floor(Math.random()*10000),
                        name: sName, contact: sContact, categories: sCat, balance: 0, lastDelivery: 'Just now', recentPOs: 'N/A', status: 'Active'
                    });
                }
            }
            else if (type === 'waste') {
                const wItem = document.getElementById('modal-waste-item').value;
                const wQty = document.getElementById('modal-waste-qty').value;
                const wReason = document.getElementById('modal-waste-reason').value;
                const wValue = parseInt(document.getElementById('modal-waste-value').value) || 0;
                if (wItem) {
                    state.waste.push({
                        id: 'w' + Math.floor(Math.random()*10000),
                        date: 'Today', item: wItem, qty: wQty, reason: wReason, value: wValue, loggedBy: 'Admin', status: 'Pending'
                    });
                }
            }
            else if (type === 'booking') {
                const bkCust = document.getElementById('modal-bk-customer').value;
                const bkPhone = document.getElementById('modal-bk-phone').value;
                const bkDateRaw = document.getElementById('modal-bk-date').value;
                const bkGuests = parseInt(document.getElementById('modal-bk-guests').value) || 1;
                const bkTable = document.getElementById('modal-bk-table').value;
                const bkOccasion = document.getElementById('modal-bk-occasion').value;
                const bkNotes = document.getElementById('modal-bk-notes').value;
                
                if (bkCust && bkDateRaw) {
                    const dt = new Date(bkDateRaw);
                    const formatted = 'Today, ' + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    state.reservations.push({
                        id: 'res' + Math.floor(Math.random()*10000),
                        customer: bkCust, phone: bkPhone, datetime: formatted, guests: bkGuests, tableId: bkTable, status: 'Confirmed', occasion: bkOccasion, notes: bkNotes
                    });
                }
            }
            else if (type === 'campaign') {
                const cName = document.getElementById('modal-camp-name').value;
                const cSegment = document.getElementById('modal-camp-segment').value;
                const cChannel = document.getElementById('modal-camp-channel').value;
                
                if (cName) {
                    state.campaigns.unshift({
                        id: "cmp" + Math.floor(Math.random() * 1000),
                        name: cName + ` (${cSegment})`,
                        channel: cChannel,
                        status: "Active",
                        conversions: 0,
                        revenue: 0
                    });
                } else {
                    showToast("Please enter a campaign name.", "error");
                    return; // Prevent modal from closing if invalid
                }
            }
            
            window.Store.notify(); // re-render UI components globally
            closeGenericModal();
            showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`, 'success');
        });
    }
});

// --- GLOBAL TOAST NOTIFICATIONS ---
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
        iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        ${iconSvg}
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300); // Wait for transition
    }, 3000);
};

// ==========================================================================
// Sidebar Badges & Dots
// ==========================================================================
function updateSidebarBadges(state) {
    if (!state || !state.orders) return;

    const newOrdersCount = state.orders.filter(function(o) { return o.status === 'New'; }).length;
    const bOrders = document.getElementById('badge-orders');
    if (bOrders) {
        bOrders.textContent = newOrdersCount > 99 ? '99+' : newOrdersCount;
        bOrders.classList.toggle('hidden', newOrdersCount === 0);
    }

    const pendingRes = (state.reservations || []).filter(function(r) { return r.status === 'Pending'; }).length;
    const bRes = document.getElementById('badge-reservations');
    if (bRes) {
        bRes.textContent = pendingRes > 99 ? '99+' : pendingRes;
        bRes.classList.toggle('hidden', pendingRes === 0);
    }

    const activeDeliveries = state.orders.filter(function(o) { return o.type === 'Delivery' && (o.status === 'Out for Delivery' || o.status === 'Dispatched'); }).length;
    const bDel = document.getElementById('badge-delivery');
    if (bDel) {
        bDel.textContent = activeDeliveries > 99 ? '99+' : activeDeliveries;
        bDel.classList.toggle('hidden', activeDeliveries === 0);
    }

    const activeKitchen = state.orders.filter(function(o) { return o.kitchenStatus === 'New' || o.kitchenStatus === 'Preparing'; }).length;
    const dotKds = document.getElementById('dot-kds');
    if (dotKds) dotKds.classList.toggle('hidden', activeKitchen === 0);

    const hasLowStock = (state.inventory || []).some(function(i) { return i.status === 'Low' || i.status === 'Critical'; });
    const dotInv = document.getElementById('dot-inventory');
    if (dotInv) dotInv.classList.toggle('hidden', !hasLowStock);
}

// ==========================================================================
// About Panel Modal
// ==========================================================================
window.openAboutPanelModal = function() {
    const overlay = document.getElementById('about-panel-modal');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeAboutPanelModal = function() {
    const overlay = document.getElementById('about-panel-modal');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
};

// --- RICH TOAST NOTIFICATIONS ---
window.showNotification = function(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = `toast-notification ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (type === 'warning') {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    notif.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(notif);

    // Trigger animation
    requestAnimationFrame(() => {
        notif.classList.add('show');
    });

    // Remove after 5 seconds
    setTimeout(() => {
        notif.classList.remove('show');
        notif.classList.add('hide');
        setTimeout(() => {
            if (container.contains(notif)) {
                container.removeChild(notif);
            }
        }, 400); // Wait for transition
    }, 5000);
};

// Demo notifications sequence
window.triggerDemoNotifications = function() {
    const demos = [
        { title: "New Online Order", msg: "Order #10486 received via website (Rs. 1,850).", type: "info", delay: 1000 },
        { title: "Table Reservation", msg: "Ahmed Khan booked Table 4 for 8:00 PM.", type: "success", delay: 5000 },
        { title: "Low Stock Alert", msg: "Chicken Breast is running critically low (5kg).", type: "error", delay: 9000 },
        { title: "Rider Update", msg: "Ali Raza has completed delivery for Order #10480.", type: "success", delay: 13000 },
        { title: "New Review", msg: "★★★★★ 'Best pizza in town!' - Sara A.", type: "info", delay: 17000 },
        { title: "Payment Received", msg: "Rs. 3,450 received via Card for Order #10484.", type: "success", delay: 21000 }
    ];

    demos.forEach(demo => {
        setTimeout(() => {
            window.showNotification(demo.title, demo.msg, demo.type);
        }, demo.delay);
    });
};

// Start the demo notifications automatically after the app loads
// setTimeout(window.triggerDemoNotifications, 1500);

// ==========================================================================
// Branch Switch Modal
// ==========================================================================
const BRANCH_PINS = { 'b1': '1234', 'b2': '5678' };
let activeBranchId = 'b1';

window.openBranchSwitchModal = function() {
    const overlay = document.getElementById('branch-switch-modal');
    if (!overlay) return;
    const select = document.getElementById('bsm-branch-select');
    const state = window.Store.state;
    if (select && state.branches) {
        select.innerHTML = state.branches
            .filter(function(b) { return b.id !== activeBranchId; })
            .map(function(b) { return '<option value="' + b.id + '">' + b.name + '</option>'; })
            .join('');
        if (!select.options.length) {
            showToast('Only one branch is configured.', 'info');
            return;
        }
    }
    const pinInput = document.getElementById('bsm-pin');
    const errEl = document.getElementById('bsm-error');
    if (pinInput) pinInput.value = '';
    if (errEl) errEl.style.display = 'none';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { if (pinInput) pinInput.focus(); }, 100);
};

window.closeBranchSwitchModal = function() {
    const overlay = document.getElementById('branch-switch-modal');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
};

window.confirmBranchSwitch = function() {
    const select = document.getElementById('bsm-branch-select');
    const pinInput = document.getElementById('bsm-pin');
    const errEl = document.getElementById('bsm-error');
    if (!select || !pinInput) return;
    const selectedId = select.value;
    const enteredPin = pinInput.value.trim();
    const correctPin = BRANCH_PINS[selectedId];
    if (enteredPin === correctPin) {
        activeBranchId = selectedId;
        const branch = window.Store.state.branches.find(function(b) { return b.id === selectedId; });
        if (branch) {
            window.Store.setBranch(branch.name);
            const nameEl = document.getElementById('ct-active-branch-name');
            if (nameEl) nameEl.textContent = branch.name;
            showToast('Switched to ' + branch.name, 'success');
        }
        closeBranchSwitchModal();
    } else {
        if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Incorrect PIN. Please try again.'; }
        if (pinInput) {
            pinInput.value = '';
            pinInput.focus();
            pinInput.style.borderColor = 'var(--clr-danger)';
            setTimeout(function() { pinInput.style.borderColor = ''; }, 1500);
        }
    }
};

// ==========================================================================
// Live Header Notification Bar (Infinite Loop)
// ==========================================================================
window.runLiveNotificationBar = function() {
    const notifBar = document.getElementById('live-notification-bar');
    const notifIcon = document.getElementById('live-notif-icon');
    const notifText = document.getElementById('live-notif-text');
    if (!notifBar || !notifIcon || !notifText) return;

    const demoNotifs = [
        { icon: "🛍️", text: "New Order #10486 (Website)" },
        { icon: "📅", text: "Reservation: Table 4 at 8:00 PM" },
        { icon: "⚠️", text: "Low Stock: Chicken Breast" },
        { icon: "🛵", text: "Ali Raza delivered Order #10480" },
        { icon: "⭐", text: "New 5-star review received" },
        { icon: "💳", text: "Payment Rs. 3,450 received" }
    ];

    let currentIndex = 0;

    function showNext() {
        const notif = demoNotifs[currentIndex];
        notifIcon.textContent = notif.icon;
        notifText.textContent = notif.text;
        
        // Slide down into view
        notifBar.style.top = '10px';
        
        // Hold for a few seconds
        setTimeout(() => {
            // Slide back up
            notifBar.style.top = '-60px';
            
            // Wait before showing the next one
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % demoNotifs.length;
                showNext();
            }, 1500);
        }, 3500);
    }

    // Start loop
    setTimeout(showNext, 2000);
};

document.addEventListener('DOMContentLoaded', () => {
    window.runLiveNotificationBar();
});