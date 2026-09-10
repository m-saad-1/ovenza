// Customer CRM, Loyalty & Marketing Logic (Phase 6)

document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic for Loyalty
    const loyTabs = document.querySelectorAll('#view-loyalty .inner-tab');
    const loyContents = document.querySelectorAll('#view-loyalty .inv-tab-content');

    loyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            loyTabs.forEach(t => t.classList.remove('active'));
            loyContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Subscriptions
    window.Store.subscribe((state) => {
        if(document.getElementById('view-customers').classList.contains('active')){
            renderCustomers(state);
        }
        if(document.getElementById('view-loyalty').classList.contains('active')){
            renderLoyalty(state);
            renderReviews(state);
        }
        if(document.getElementById('view-marketing').classList.contains('active')){
            renderMarketing(state);
        }
    });

    // Initial render on click
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target');
            if (target === 'view-customers') renderCustomers(window.Store.state);
            if (target === 'view-loyalty') {
                renderLoyalty(window.Store.state);
                renderReviews(window.Store.state);
            }
            if (target === 'view-marketing') renderMarketing(window.Store.state);
        });
    });

    // Customer Segment Filter
    const filter = document.getElementById('crm-segment-filter');
    if(filter) {
        filter.addEventListener('change', () => {
            renderCustomers(window.Store.state);
        });
    }
});

// --- CUSTOMERS (CRM) ---
function renderCustomers(state) {
    const tbody = document.getElementById('crm-customers-body');
    if (!tbody) return;

    const filterVal = document.getElementById('crm-segment-filter') ? document.getElementById('crm-segment-filter').value : 'All';
    let filtered = state.crm;
    
    if (filterVal !== 'All') {
        filtered = filtered.filter(c => c.segment === filterVal);
    }

    tbody.innerHTML = filtered.map(c => {
        let segmentClass = 'badge-info';
        if(c.segment === 'VIP') segmentClass = 'badge-success';
        if(c.segment === 'At-Risk') segmentClass = 'badge-danger';
        if(c.segment === 'New') segmentClass = 'badge-warning';

        const avgOrder = c.orders > 0 ? Math.round(c.lifetimeSpend / c.orders) : 0;

        return `
        <tr onclick="openCustomerProfile('${c.id}')" style="cursor:pointer;">
            <td style="font-weight: 500;">${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.orders}</td>
            <td>Rs. ${avgOrder.toLocaleString()}</td>
            <td style="font-weight: 600;">Rs. ${c.lifetimeSpend.toLocaleString()}</td>
            <td><span class="badge ${segmentClass}">${c.segment}</span></td>
            <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${c.lastOrder}</td>
            <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Profile</button></td>
        </tr>
    `}).join('');
}

window.openCustomerProfile = function(id) {
    const state = window.Store.state;
    const c = state.crm.find(x => x.id === id);
    if (!c) return;

    const panel = document.getElementById('customer-profile-panel');
    const content = document.getElementById('cp-content');
    if (!panel || !content) return;
    
    panel.style.display = 'block';

    const avgOrder = c.orders > 0 ? Math.round(c.lifetimeSpend / c.orders) : 0;

    content.innerHTML = `
        <div style="text-align:center; margin-bottom:1.5rem;">
            <div style="width:64px; height:64px; border-radius:50%; background:var(--clr-primary); color:white; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:700; margin:0 auto 0.5rem auto;">${c.name.charAt(0)}</div>
            <h3 style="margin:0;">${c.name}</h3>
            <p style="color:var(--clr-text-secondary); margin:0;">${c.phone}</p>
        </div>
        
        <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
            <div style="flex:1; background:var(--clr-bg-app); padding:0.75rem; border-radius:8px; text-align:center;">
                <div style="font-size:0.75rem; color:var(--clr-text-secondary);">Orders</div>
                <div style="font-weight:700; font-size:1.1rem;">${c.orders}</div>
            </div>
            <div style="flex:1; background:var(--clr-bg-app); padding:0.75rem; border-radius:8px; text-align:center;">
                <div style="font-size:0.75rem; color:var(--clr-text-secondary);">Avg Order</div>
                <div style="font-weight:700; font-size:1.1rem;">${avgOrder}</div>
            </div>
        </div>
        
        <div style="margin-bottom:1rem;">
            <div style="font-size:0.85rem; color:var(--clr-text-secondary); margin-bottom:0.25rem;">Lifetime Spend</div>
            <div style="font-weight:700; font-size:1.2rem;">Rs. ${c.lifetimeSpend.toLocaleString()}</div>
        </div>
        
        <div style="margin-bottom:1rem;">
            <div style="font-size:0.85rem; color:var(--clr-text-secondary); margin-bottom:0.25rem;">Segment</div>
            <span class="badge ${c.segment==='VIP'?'badge-success':(c.segment==='At-Risk'?'badge-danger':'badge-info')}">${c.segment}</span>
        </div>
        
        <div style="display:flex; gap:0.5rem; margin-top:2rem;">
            <button class="btn btn-primary" style="flex:1;">Send Offer</button>
            <button class="btn btn-outline" style="flex:1;">Edit</button>
        </div>
    `;
};

// --- LOYALTY ---
function renderLoyalty(state) {
    const tbody = document.getElementById('loyalty-members-body');
    if (!tbody) return;

    // Filter to only those with points
    const members = state.crm.filter(c => c.points > 0).sort((a,b) => b.points - a.points);

    tbody.innerHTML = members.map(m => {
        let tierColor = 'var(--clr-text-primary)';
        if(m.tier === 'Gold') tierColor = '#D4AF37';
        if(m.tier === 'Silver') tierColor = '#C0C0C0';
        if(m.tier === 'Bronze') tierColor = '#CD7F32';

        return `
        <tr>
            <td style="font-weight: 500;">${m.name}</td>
            <td style="font-weight: 700; color: ${tierColor};">${m.tier}</td>
            <td style="font-weight: 600;">${m.points.toLocaleString()}</td>
            <td>Rs. ${(m.points * 0.5).toLocaleString()}</td> <!-- Simulating value -->
        </tr>
    `}).join('');
}

// --- REVIEWS ---
function renderReviews(state) {
    const tbody = document.getElementById('loyalty-reviews-body');
    if (!tbody) return;

    tbody.innerHTML = state.reviews.map(r => `
        <tr>
            <td style="font-weight: 600;">${r.rating} <span style="color: var(--clr-warning);">★</span></td>
            <td style="font-weight: 500;">${r.customer}</td>
            <td style="font-size: 0.9rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${r.comment}">"${r.comment}"</td>
            <td><span class="badge badge-info">${r.orderItem}</span></td>
            <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${r.date}</td>
            <td><span class="badge ${r.status === 'Published' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Reply</button>
                    ${r.status === 'Pending' ? `<button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="publishReview('${r.id}')">Publish</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// --- MARKETING ---
function renderMarketing(state) {
    const tbody = document.getElementById('marketing-campaigns-body');
    if (!tbody) return;

    tbody.innerHTML = state.campaigns.map(c => {
        let roi = ((c.revenue - 5000) / 5000 * 100).toFixed(0); // Dummy calc
        let roiColor = roi > 100 ? 'var(--clr-success)' : 'var(--clr-warning)';
        
        return `
        <tr>
            <td style="font-weight: 600;">${c.name}</td>
            <td>${c.channel}</td>
            <td>All Customers</td>
            <td><span class="badge ${c.status === 'Active' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
            <td>${c.conversions}</td>
            <td style="font-weight: 700;">Rs. ${c.revenue.toLocaleString()}</td>
            <td style="font-weight: 700; color: ${roiColor};">${roi}%</td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Pause</button>
            </td>
        </tr>
    `}).join('');
}

// --- CAMPAIGN SIMULATION ---
window.openCampaignModal = function() {
    openGenericModal('campaign');
};

window.publishReview = function(id) {
    const state = window.Store.state;
    const review = state.reviews.find(r => r.id === id);
    if (review) {
        review.status = 'Published';
        window.Store.notify();
        showToast("Review published successfully.", "success");
    }
};
