// Inventory & Supply Chain Logic

document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabs = document.querySelectorAll('.inner-tab');
    const contents = document.querySelectorAll('.inv-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Subscriptions
    window.Store.subscribe((state) => {
        if(document.getElementById('view-inventory').classList.contains('active')){
            renderInventory(state);
        }
    });

    document.querySelectorAll('.nav-item[data-target="view-inventory"]').forEach(btn => {
        btn.addEventListener('click', () => {
            renderInventory(window.Store.state);
        });
    });
});

function renderInventory(state) {
    renderStock(state);
    renderRecipes(state);
    renderSuppliers(state);
    renderWaste(state);
}

function renderStock(state) {
    const tbody = document.getElementById('inv-stock-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.inventory.forEach(item => {
        let statusClass = 'badge-success';
        let statusText = 'In Stock';
        
        if (item.qty <= item.minQty) {
            statusClass = 'badge-warning';
            statusText = 'Low Stock';
        }
        if (item.qty === 0) {
            statusClass = 'badge-danger';
            statusText = 'Out of Stock';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 500;">${item.name}</td>
            <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${item.sku}</td>
            <td style="font-weight: 600;">${item.qty} ${item.unit}</td>
            <td>Rs. ${item.cost} / ${item.unit}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Adjust</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderRecipes(state) {
    const tbody = document.getElementById('inv-recipe-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.recipes.forEach(recipe => {
        const tr = document.createElement('tr');
        
        const fcPercent = ((recipe.cost / recipe.price) * 100).toFixed(1);
        let fcClass = fcPercent > 35 ? 'color: var(--clr-danger);' : 'color: var(--clr-success);';

        tr.innerHTML = `
            <td style="font-weight: 600;">${recipe.name}</td>
            <td style="font-size: 0.85rem; color: var(--clr-text-secondary);">
                ${recipe.ingredients.join('<br>')}
            </td>
            <td>Rs. ${recipe.cost.toLocaleString()}</td>
            <td>Rs. ${recipe.price.toLocaleString()}</td>
            <td style="font-weight: 700; ${fcClass}">${fcPercent}%</td>
            <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Edit Recipe</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderSuppliers(state) {
    const tbody = document.getElementById('inv-supplier-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.suppliers.forEach(supplier => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600;">${supplier.name}</td>
            <td>${supplier.contact}</td>
            <td style="font-size: 0.85rem;">${supplier.categories}</td>
            <td style="color: ${supplier.balance > 0 ? 'var(--clr-danger)' : 'var(--clr-success)'}; font-weight: 600;">
                Rs. ${supplier.balance.toLocaleString()}
            </td>
            <td style="font-size: 0.85rem; color: var(--clr-text-secondary);">${supplier.lastDelivery}</td>
            <td style="font-size: 0.85rem; font-weight: 500;">${supplier.recentPOs}</td>
            <td><span class="badge ${supplier.status === 'Active' ? 'badge-success' : 'badge-danger'}">${supplier.status}</span></td>
            <td><button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">View POs</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderWaste(state) {
    const tbody = document.getElementById('inv-waste-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.waste.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-size: 0.85rem;">${log.date}</td>
            <td style="font-weight: 500;">${log.item}</td>
            <td>${log.qty}</td>
            <td style="color: var(--clr-text-secondary); font-size: 0.85rem;">${log.reason}</td>
            <td style="color: var(--clr-danger); font-weight: 600;">Rs. ${log.value}</td>
            <td style="font-size: 0.85rem;">${log.loggedBy}</td>
            <td><span class="badge ${log.status === 'Reviewed' ? 'badge-success' : 'badge-warning'}">${log.status}</span></td>
            <td><button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Details</button></td>
        `;
        tbody.appendChild(tr);
    });
}
