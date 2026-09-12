// Centralized Demo Data State for crust Dashboard
// Simulating a realistic restaurant: "Urban Flame Kitchen"

const Store = {
    state: {
        restaurant: {
            name: "Urban Flame Kitchen",
            currency: "Rs.",
            taxRate: 0.16, // 16% GST
        },
        branches: [
            { id: "b1", name: "Hospital Road Central Park, Lahore", status: "Open", todayRevenue: 124500 },
            { id: "b2", name: "8A Commercial, Pak Arab, Lahore", status: "Open", todayRevenue: 87200 }
        ],
        categories: [
            { id: "c1", name: "Combos" },
            { id: "c2", name: "Burgers" },
            { id: "c3", name: "Pizzas" },
            { id: "c4", name: "Rolls" },
            { id: "c5", name: "Fries" },
            { id: "c6", name: "Drinks" },
            { id: "c7", name: "Extras" },
            { id: "c8", name: "Desserts" }
        ],
        products: [
            // Combos
            { id: "p1", name: "Combo 1", desc: "1x Classic Beef Burger, 1x Crispy Chicken Burger, 4x Fried Chicken Pieces, 1x Fries, 1x NEXT Cola, 1x Cheese Dip", price: 1499, categoryId: "c1", status: "Available", image: "../assets/images/combo-1.avif" },
            { id: "p2", name: "Combo 2", desc: "1x Chicken Pizza, 8x Chicken Wings, 1x 7UP, 2x Dips", price: 1799, categoryId: "c1", status: "Available", image: "../assets/images/combo-2.avif" },
            { id: "p3", name: "Combo 3", desc: "1x Cheeseburger, 6x Chicken Nuggets, 1x Fries, 1x Cheese Dip, 1x Small NEXT Cola", price: 1299, categoryId: "c1", status: "Available", image: "../assets/images/combo-3.avif" },
            { id: "p4", name: "Combo 4", desc: "2x Chicken Pizzas, 6x Chicken Wings, 1x Pepsi, 2x Dips", price: 2299, categoryId: "c1", status: "Available", image: "../assets/images/combo-4.avif" },
            { id: "o1", name: "Crispy Combo", desc: "2x Crispy Chicken Burgers, 2x Fried Chicken Pieces, 1x Large Fries, 2x Drinks", price: 1200, categoryId: "c1", status: "Available", image: "../assets/images/Deals/crispy-combo.avif" },
            { id: "o2", name: "Family Feast Combo", desc: "4x Burgers of Choice, 8x Hot Wings, 1x Family Fries, 1x 1.5L Drink", price: 2400, categoryId: "c1", status: "Available", image: "../assets/images/Deals/family-feast-combo.avif" },
            { id: "o3", name: "Mega Feast Combo", desc: "2x Large Pizzas, 2x Burgers, 10x Hot Wings, 2x Family Fries, 2x 1.5L Drinks", price: 3600, categoryId: "c1", status: "Available", image: "../assets/images/Deals/mega-feast-combo.avif" },
            { id: "o4", name: "Ultimate Duo Combo", desc: "2x Signature Smash Burgers, 2x Loaded Fries, 2x Drinks", price: 1600, categoryId: "c1", status: "Available", image: "../assets/images/Deals/ultimate-duo-combo.avif" },
            // Burgers
            { id: "p5", name: "Classic Beef Burger", desc: "Juicy beef patty with fresh greens.", price: 600, categoryId: "c2", status: "Available", image: "../assets/images/burger-1.avif" },
            { id: "p6", name: "Double Beef Smash", desc: "Double smashed patties, double cheese.", price: 850, categoryId: "c2", status: "Available", image: "../assets/images/burger-2.avif" },
            { id: "p7", name: "Spicy Jalapeno Chicken", desc: "Spicy chicken patty with jalapenos.", price: 750, categoryId: "c2", status: "Available", image: "../assets/images/burger-3.avif" },
            { id: "p8", name: "Smash Burger", desc: "Thin smashed beef patty with pickles & sauce.", price: 700, categoryId: "c2", status: "Available", image: "../assets/images/burger-4.avif" },
            { id: "p9", name: "BBQ Burger", desc: "Smoky BBQ sauce with caramelized onions.", price: 800, categoryId: "c2", status: "Available", image: "../assets/images/burger-5.avif" },
            { id: "p12", name: "Mushroom & Cheese Burger", desc: "Sautéed mushrooms with melted cheese.", price: 850, categoryId: "c2", status: "Available", image: "../assets/images/burger-6.avif" },
            { id: "p13", name: "Tower Burger", desc: "Triple-stacked patties with all the toppings.", price: 950, categoryId: "c2", status: "Available", image: "../assets/images/burger-7.avif" },
            // Pizzas
            { id: "p14", name: "Chicken Pizza", desc: "Grilled chicken with golden cheese topping.", price: 1400, categoryId: "c3", status: "Available", image: "../assets/images/chicken-pizza.avif" },
            { id: "p15", name: "Crown crust Pizza", desc: "Signature crown crust loaded with cheese.", price: 1600, categoryId: "c3", status: "Available", image: "../assets/images/crown-crust-pizza.avif" },
            { id: "p16", name: "Mughlai Pizza", desc: "Rich Mughlai spices with tender chicken.", price: 1500, categoryId: "c3", status: "Available", image: "../assets/images/mughali-pizza.avif" },
            { id: "p17", name: "Special Pizza", desc: "Our chef's special with premium toppings.", price: 1700, categoryId: "c3", status: "Available", image: "../assets/images/special-pizza.avif" },
            { id: "p18", name: "Tandoori Pizza", desc: "Classic tandoori flavours on a crispy base.", price: 1450, categoryId: "c3", status: "Available", image: "../assets/images/tandoori-pizza.avif" },
            { id: "p19", name: "Thin crust Pizza", desc: "Ultra-thin, crispy base with fresh toppings.", price: 1300, categoryId: "c3", status: "Available", image: "../assets/images/thin-crust-pizza.avif" },
            { id: "p20", name: "Chicken Fajita Pizza", desc: "Spiced fajita chicken with fresh veggies.", price: 1350, categoryId: "c3", status: "Available", image: "../assets/images/pizza-1.avif" },
            { id: "p21", name: "Tikka Sensation Pizza", desc: "Spicy chicken tikka chunks on a rich base.", price: 1450, categoryId: "c3", status: "Available", image: "../assets/images/pizza-2.avif" },
            { id: "p22", name: "Pepperoni Classic Pizza", desc: "Loaded with premium pepperoni slices.", price: 1600, categoryId: "c3", status: "Available", image: "../assets/images/pizza-3.avif" },
            { id: "p23", name: "Cheese Lovers Pizza", desc: "Blend of 100% real mozzarella cheese.", price: 1300, categoryId: "c3", status: "Available", image: "../assets/images/pizza-4.avif" },
            // Rolls
            { id: "p24", name: "Chicken Roll", desc: "Crispy chicken wrapped in a soft roll.", price: 350, categoryId: "c4", status: "Available", image: "../assets/images/roll-1.avif" },
            { id: "p25", name: "Special Roll", desc: "Loaded special roll with sauce & veggies.", price: 450, categoryId: "c4", status: "Available", image: "../assets/images/roll-2.avif" },
            // Fries
            { id: "p26", name: "Cheese Fries", desc: "Golden fries topped with melted cheese.", price: 350, categoryId: "c5", status: "Available", image: "../assets/images/cheese-fries.avif" },
            { id: "p27", name: "Plain Fries", desc: "Classic crispy salted fries.", price: 200, categoryId: "c5", status: "Available", image: "../assets/images/plain-fries.avif" },
            { id: "p28", name: "Smoky Fries", desc: "Fries with smoky BBQ seasoning.", price: 280, categoryId: "c5", status: "Available", image: "../assets/images/smoky-fries.avif" },
            { id: "p29", name: "Frizza Fries", desc: "Loaded fries with pizza-style toppings.", price: 400, categoryId: "c5", status: "Available", image: "../assets/images/frizza-fries.avif" },
            // Drinks
            { id: "p30", name: "Mountain Dew", desc: "Refreshing soda.", price: 150, categoryId: "c6", status: "Available", image: "../assets/images/mountain-dew.avif" },
            { id: "p31", name: "Pepsi", desc: "Classic cola.", price: 150, categoryId: "c6", status: "Available", image: "../assets/images/pepsi.avif" },
            { id: "p32", name: "Coca-Cola", desc: "Chilled classic Coca-Cola.", price: 120, categoryId: "c6", status: "Available", image: "../assets/images/coca-cola.avif" },
            { id: "p33", name: "Sprite", desc: "Cool & refreshing lemon-lime soda.", price: 120, categoryId: "c6", status: "Available", image: "../assets/images/sprite.avif" },
            { id: "p34", name: "Mineral Water", desc: "Pure chilled Dasani mineral water.", price: 80, categoryId: "c6", status: "Available", image: "../assets/images/mineral-water.avif" },
            // Extras
            { id: "p35", name: "Garlic Mayo Dip", desc: "Delicious garlic mayo dip.", price: 80, categoryId: "c7", status: "Available", image: "../assets/images/garlic-mayo-dip.avif" },
            { id: "p36", name: "Coleslaw", desc: "Fresh side coleslaw.", price: 120, categoryId: "c7", status: "Available", image: "../assets/images/coleslaw.avif" },
            { id: "p37", name: "Ranch Sauce", desc: "Creamy ranch sauce.", price: 80, categoryId: "c7", status: "Available", image: "../assets/images/ranch-sauce.avif" },
            { id: "p38", name: "Siriracha Sauce", desc: "Spicy siriracha sauce.", price: 80, categoryId: "c7", status: "Available", image: "../assets/images/siriracha-sauce.avif" }
        ],
        orders: (function() {
            const now = new Date();
            const getTimeAgo = (mins) => new Date(now.getTime() - mins * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return [
                { id: "10482", customer: "Ahmed Khan", type: "Delivery", source: "Website", branchId: "b1", total: 2350, payment: "Paid", status: "Preparing", kitchenStatus: "Preparing", time: getTimeAgo(25), notes: "Extra spicy, no mayo please.", items: [
                    { id: "p11", name: "Tower Burger", qty: 2, variant: "Large, Extra Cheese" },
                    { id: "p26", name: "Cheese Fries", qty: 1, variant: "Regular" },
                    { id: "p30", name: "Mountain Dew", qty: 2, variant: "" }
                ]},
                { id: "10483", customer: "Sara Ali", type: "Takeaway", source: "POS", branchId: "b2", total: 1200, payment: "Pending", status: "New", kitchenStatus: "New", time: getTimeAgo(12), notes: "", items: [
                    { id: "p5", name: "Classic Beef Burger", qty: 1, variant: "Medium" },
                    { id: "p24", name: "Chicken Roll", qty: 2, variant: "Garlic Mayo" }
                ]},
                { id: "10484", customer: "Table T3", type: "Dine-in", source: "POS", branchId: "b1", total: 3450, payment: "Paid", status: "Ready", kitchenStatus: "Ready", time: getTimeAgo(8), notes: "Serve drinks first", items: [
                    { id: "p3", name: "Combo 3", qty: 1, variant: "Spicy" },
                    { id: "p14", name: "Chicken Pizza", qty: 1, variant: "Large, Thick Crust" }
                ]},
                { id: "10485", customer: "Usman Tariq", type: "Delivery", source: "WhatsApp", branchId: "b1", total: 1400, payment: "Unpaid", status: "New", kitchenStatus: "New", time: getTimeAgo(3), notes: "Call upon arrival", items: [
                    { id: "p15", name: "Crown crust Pizza", qty: 1, variant: "Medium, Extra Cheese" }
                ]}
            ];
        })(),
        customers: [
            { id: "u1", name: "Ahmed Khan", phone: "+92 03001013556", orders: 24, lifetimeSpend: 48500, lastOrder: "2 days ago" },
            { id: "u2", name: "Sara Ali", phone: "0333-9876543", orders: 3, lifetimeSpend: 4200, lastOrder: "Today" }
        ],
        riders: [
            { id: "r1", name: "Ali Raza", status: "Online", activeDeliveries: 3, completedToday: 28 },
            { id: "r2", name: "Kamran", status: "Offline", activeDeliveries: 0, completedToday: 15 }
        ],
        inventory: [
            { id: "i1", name: "Chicken Breast", sku: "ING-CHK", qty: 45, unit: "kg", cost: 850, minQty: 20 },
            { id: "i2", name: "Burger Buns", sku: "ING-BUN", qty: 120, unit: "pcs", cost: 40, minQty: 50 },
            { id: "i3", name: "Cheddar Cheese", sku: "ING-CHS", qty: 8, unit: "kg", cost: 1800, minQty: 10 },
            { id: "i4", name: "Cooking Oil", sku: "ING-OIL", qty: 25, unit: "L", cost: 480, minQty: 15 }
        ],
        recipes: [
            { productId: "p1", name: "Tower Burger", ingredients: ["1x Burger Bun", "150g Chicken Breast", "20g Cheddar Cheese", "Sauce"], cost: 203.50, price: 649 },
            { productId: "p2", name: "Chicken Karahi", ingredients: ["500g Chicken Breast", "50ml Cooking Oil", "Spices", "Tomatoes"], cost: 680.00, price: 1699 },
            { productId: "p14", name: "Chicken Pizza", ingredients: ["1x Pizza Dough", "200g Chicken", "100g Cheese", "Pizza Sauce"], cost: 450.00, price: 1400 },
            { productId: "p26", name: "Cheese Fries", ingredients: ["250g Potatoes", "50g Melted Cheese", "Spices"], cost: 120.00, price: 350 },
            { productId: "p30", name: "Mountain Dew", ingredients: ["1x 330ml Can"], cost: 65.00, price: 150 }
        ],
        suppliers: [
            { id: "s1", name: "National Poultry Farms", contact: "+92 03001013556", categories: "Meat, Chicken", balance: 45000, lastDelivery: "Yesterday", recentPOs: "#PO-1042", status: "Active" },
            { id: "s2", name: "Dawn Bread Co.", contact: "0333-4445556", categories: "Bakery", balance: 0, lastDelivery: "Today", recentPOs: "#PO-1043", status: "Active" },
            { id: "s3", name: "Metro Cash & Carry", contact: "0321-7778889", categories: "Dairy, Oil, Groceries", balance: 12500, lastDelivery: "3 days ago", recentPOs: "#PO-1039", status: "Active" },
            { id: "s4", name: "Fresh Veggies Ltd.", contact: "0345-1234567", categories: "Produce, Vegetables", balance: 5000, lastDelivery: "Today", recentPOs: "#PO-1044", status: "Active" }
        ],
        waste: [
            { id: "w1", date: "Today", item: "Burger Buns", qty: "4 pcs", reason: "Expired / Stale", value: 160, loggedBy: "Manager", status: "Reviewed" },
            { id: "w2", date: "Yesterday", item: "Chicken Breast", qty: "0.5 kg", reason: "Spoiled / Temp Issue", value: 425, loggedBy: "Chef", status: "Pending" },
            { id: "w3", date: "2 days ago", item: "Tomatoes", qty: "1.2 kg", reason: "Quality Reject", value: 180, loggedBy: "Receiver", status: "Reviewed" },
            { id: "w4", date: "Today", item: "French Fries", qty: "300 g", reason: "Overcooked", value: 90, loggedBy: "Line Cook", status: "Pending" }
        ],
        reservations: [
            { id: "res1", customer: "Dr. Farooq", datetime: "Today, 8:00 PM", guests: 4, tableId: "T4", status: "Confirmed" },
            { id: "res2", customer: "Zainab Malik", datetime: "Today, 9:30 PM", guests: 2, tableId: "T2", status: "Pending" }
        ],
        tables: [
            { id: "T1", status: "Available", capacity: 2 },
            { id: "T2", status: "Available", capacity: 2 },
            { id: "T3", status: "Occupied", capacity: 4, customer: "Walk-in", amount: "Rs. 2400" },
            { id: "T4", status: "Reserved", capacity: 4, customer: "Dr. Farooq", time: "8:00 PM" },
            { id: "T5", status: "Available", capacity: 6 },
            { id: "T6", status: "Occupied", capacity: 8, customer: "Ahmed Khan", amount: "Rs. 5600" }
        ],
        crm: [
            { id: "c1", name: "Ahmed Khan", phone: "+92 03001013556", orders: 45, lifetimeSpend: 62500, segment: "VIP", lastOrder: "2 days ago", tier: "Gold", points: 2450 },
            { id: "c2", name: "Sarah Ali", phone: "0321-9876543", orders: 2, lifetimeSpend: 2100, segment: "New", lastOrder: "Today", tier: "Bronze", points: 120 },
            { id: "c3", name: "Usman Tariq", phone: "0333-5556667", orders: 18, lifetimeSpend: 15400, segment: "At-Risk", lastOrder: "45 days ago", tier: "Silver", points: 800 }
        ],
        reviews: [
            { id: "r1", rating: 5, customer: "Ahmed Khan", comment: "Best Tower Burger in town! Always fresh.", orderItem: "Tower Burger", date: "Today", status: "Published" },
            { id: "r2", rating: 3, customer: "Usman Tariq", comment: "Delivery was 20 mins late.", orderItem: "Delivery Order", date: "Yesterday", status: "Pending" },
            { id: "r3", rating: 4, customer: "Sara Ali", comment: "Pizza was great but slightly cold.", orderItem: "Chicken Pizza", date: "2 days ago", status: "Published" },
            { id: "r4", rating: 5, customer: "Zainab Malik", comment: "The Smash Burger is to die for!", orderItem: "Smash Burger", date: "3 days ago", status: "Published" },
            { id: "r5", rating: 1, customer: "Ali Raza", comment: "Missing extra sauce I paid for.", orderItem: "Combo 2", date: "Today", status: "Pending" }
        ],
        campaigns: [
            { id: "cmp1", name: "Weekend BOGO Burger", channel: "WhatsApp", status: "Active", conversions: 124, revenue: 86500 },
            { id: "cmp2", name: "Re-engagement SMS (At-Risk)", channel: "SMS", status: "Active", conversions: 45, revenue: 31200 },
            { id: "cmp3", name: "New Menu Launch", channel: "Email", status: "Completed", conversions: 89, revenue: 54000 }
        ],
        staff: [
            { id: "e1", name: "Faizan Ali", role: "Manager", shift: "09:00 - 18:00", status: "Present" },
            { id: "e2", name: "Bilal Qureshi", role: "Head Chef", shift: "14:00 - 23:00", status: "Present" },
            { id: "e3", name: "Ayesha Noor", role: "Cashier", shift: "09:00 - 18:00", status: "Late" },
            { id: "e4", name: "Zahid", role: "Line Cook", shift: "18:00 - 02:00", status: "Scheduled" }
        ],
        finance: [
            { category: "Gross Revenue", amount: 4520000, percent: 100 },
            { category: "Discounts & Promos", amount: -250000, percent: -5.5 },
            { category: "Net Sales", amount: 4270000, percent: 94.5 },
            { category: "Cost of Goods Sold (COGS)", amount: -1450000, percent: -32.0 },
            { category: "Gross Profit", amount: 2820000, percent: 62.4 },
            { category: "Labor & Payroll", amount: -820000, percent: -18.1 },
            { category: "Overhead & Rent", amount: -650000, percent: -14.3 },
            { category: "Marketing & Ads", amount: -150000, percent: -3.3 },
            { category: "Taxes & Fees", amount: -350000, percent: -7.7 },
            { category: "Net Profit", amount: 850000, percent: 18.8 }
        ],
        currentBranch: "Hospital Road Central Park, Lahore",
        dateRange: "Today"
    },

    listeners: [],

    subscribe(listener) {
        this.listeners.push(listener);
    },

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    },

    // Example action
    updateOrderStatus(orderId, newStatus) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            this.notify();
        }
    },
    
    updateKitchenStatus(orderId, newKitchenStatus) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order) {
            order.kitchenStatus = newKitchenStatus;
            if (newKitchenStatus === 'Preparing') order.status = 'Preparing';
            if (newKitchenStatus === 'Ready') order.status = 'Ready';
            this.notify();
        }
    },
    
    setBranch(branchName) {
        this.state.currentBranch = branchName;
        this.notify();
    }
};

window.Store = Store;
