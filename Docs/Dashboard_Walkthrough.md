# Dashboard Content & UI/UX Walkthrough

This document outlines the exact visual contents, user interface components, and features available in every module of the dashboard. It serves as a comprehensive inventory of the frontend elements.

---

## 1. Dashboard (`view-dashboard`)
**Header:** "Overview" - "Welcome back! Here's what's happening at crust today."
*   **AI Insight Card:** Displays an alert with a smart recommendation (e.g., "Friday evening orders are projected to be 23% higher...").
*   **KPI Grid (4 Cards):**
    *   Today's Revenue (with percentage trend vs yesterday)
    *   Today's Orders (with percentage trend vs yesterday)
    *   Avg Order Value (with percentage trend vs yesterday)
    *   Pending Orders (with percentage trend vs yesterday)
*   **Charts Grid:**
    *   **Sales Overview (Line/Bar Chart):** Includes a dropdown filter (Today, Last 7 Days, Last 30 Days).
    *   **Sales by Channel (Doughnut Chart)**
*   **Order Snapshot:**
    *   Grid of numbers showing: New Orders, Preparing, Ready, Out for Delivery, Completed, Cancelled.
    *   "Go to Orders" button.
*   **Tables:**
    *   **Recent Orders:** Table showing Order ID, Customer, Type, Total, Status, Action. Includes a "View All" button.
    *   **Best-Selling Products:** Table showing Product, Orders, Revenue (e.g., Tower Burger, Large Pizza, Loaded Fries, Chicken Karahi). Includes a "View Full Analytics" link.

## 2. Orders (`view-orders`)
**Header:** "Orders Management" - "View, filter, and manage all incoming orders across branches."
*   **Order Stats Grid (8 Colored Cards):** Total Orders, New Orders, Preparing (Kitchen), Ready (For Pickup), Delivery (On the way), Completed (Delivered), Cancelled (Issues), Revenue (Total Value).
*   **Filter Bar:**
    *   Search input (Search by Order ID or Name)
    *   Status Dropdown (All Statuses, New, Preparing, Ready, Out for Delivery, Completed, Cancelled)
    *   Type Dropdown (All Types, Delivery, Takeaway, Dine-in)
*   **Orders Grid:** A masonry-style grid of order cards showing customer name, time, items list, order total, and contextual action buttons based on the current status (e.g., "Accept Order", "Mark Ready", "Dispatch").

## 3. POS (`view-pos`)
**Layout:** Split-screen POS interface.
*   **Left Side (Product Catalog):**
    *   Horizontal scrollable category pills (All, Combos, Burgers, Pizzas, Rolls, Fries, Drinks, Extras).
    *   Grid of product cards displaying an image, name, and price. Clicking a card adds it to the cart.
*   **Right Side (Cart Drawer):**
    *   **Header:** "Current Order" with a "Clear" button.
    *   **Order Type Toggle:** Buttons for Dine-in, Takeaway, Delivery.
    *   **Dynamic Form:** If "Dine-in" is selected, shows a Table Number input. If "Delivery", shows Customer Name, Phone, and Address inputs.
    *   **Cart Items:** List of selected products with "+" and "-" quantity adjustments.
    *   **Footer:** Subtotal, Tax (16%), Total calculation, and a large "Send to Kitchen" primary action button.

## 4. Kitchen / KDS (`view-kds`)
**Header:** "Kitchen Display System" with an "Auto-refreshing" badge and a "Full View" toggle button (which hides the sidebar and header for a fullscreen kiosk mode).
*   **Kanban Board (3 Columns):**
    *   New
    *   Preparing
    *   Ready
*   **Order Tickets:**
    *   Displays Order ID, Order Type badge (e.g., Delivery, Dine-in), Time, Customer Name.
    *   List of items with quantity, item name, and variants. Displays the specific product image to the left of the item name.
    *   Highlights special instructions in a yellow warning box.
    *   Status action button at the bottom (e.g., "Start Preparing", "Mark Ready", "Clear").

## 5. Menu (`view-menu`)
**Header:** "Menu Management" - "Manage products, categories, modifiers, and availability."
*   **Action Button:** "+ Add Product" (Opens the Product Modal).
*   **Filters Bar:** Search input, Category dropdown, Branch dropdown.
*   **Data Table:** Columns for Product Name, Category, Price, Availability (Time/Branch), Status, and Actions (Edit/Delete).
*   **Product Modal:** Includes inputs for Product Name, Description, Price, Original Price, Discounted Price, Discount (%), Stock Qty, Image Upload, Sizes, Modifiers, Category Dropdown, Status Dropdown (Available, Low Stock, Out of Stock), and Deal End Date.

## 6. Content & Media (`view-content`)
**Header:** "Content & Media Management" - "Manage website content, offers, gallery, and business information."
*   **Inner Tabs:**
    *   **Offer Banners:** Includes an "Add Image" file upload button and a grid of uploaded promotional banner images.
    *   **Gallery:** Includes an "Add Photo" multiple file upload button and a grid of restaurant gallery images.
    *   **Contact Info:** Displays the active branch banner with a "Switch Branch" button. Form fields for Restaurant Name, Phone Number, Email Address, WhatsApp Number, Full Address/Location textarea, and Google Maps Embed URL. Includes "Reset" and "Save Changes" buttons.
    *   **Opening Hours:** A list of days of the week with inputs to set opening and closing times.

## 7. Inventory & Supply (`view-inventory`)
**Header:** "Inventory & Supply Chain" - "Track stock, manage suppliers, recipes, and record waste."
*   **Inner Tabs:**
    *   **Current Stock:** Features an "+ Receive Stock" button. Table columns for Ingredient, SKU, Current Qty, Unit Cost, Status, Action. Highlights low-stock items in red.
    *   **Recipe Mapping:** Table mapping Menu Items to Ingredients, calculating Theoretical Cost, Selling Price, and Food Cost %.
    *   **Suppliers & POs:** Features a "+ New Supplier" button. Table displaying Supplier Name, Contact, Categories Supplied, Pending Balance, Last Delivery, Recent POs, Status.
    *   **Waste Management:** Features a "+ Record Waste" button. Table displaying Date, Item, Quantity, Reason, Value Lost, Logged By.

## 8. Delivery (`view-delivery`)
**Header:** "Delivery Operations" - "Manage riders, active deliveries, and geographical zones."
*   **Live Delivery Map:** A visual placeholder map for live rider tracking.
*   **Tables:**
    *   **Active Fleet (Riders):** Shows Rider name, Status (Online/Offline), Active Jobs, Completed deliveries. Includes an "+ Add Rider" button.
    *   **Pending Dispatch:** Lists unassigned orders with a dropdown to assign them to an available rider.

## 9. Reservations (`view-reservations`)
**Header:** "Reservations & Floor Plan" - "Manage table bookings and view real-time restaurant occupancy."
*   **Inner Tabs:**
    *   **Reservations List:** Features a "+ New Booking" button. Table columns for Customer, Date & Time, Guests, Table, Status.
    *   **Table Management (Floor Plan):** Displays a legend (Available, Occupied, Reserved) and a visual map of physical tables.

## 10. Branches (`view-branches`)
**Header:** "Multi-Branch Management" - "Overview of all active restaurant locations."
*   **Action Button:** "+ Add Branch"
*   **Branch Cards:** A grid of cards displaying the branch name, address, operational status (Open/Closed), and today's total revenue.

## 11. Customers (`view-customers`)
**Header:** "Customer CRM" - "Manage customer profiles and view segmentation."
*   **KPI Cards (4):** Total Customers, VIP Segments, At-Risk Customers, Avg Lifetime Value.
*   **Filters Bar:** Search input, Segment dropdown (VIPs, First-Time, At-Risk).
*   **Data Table:** Columns for Customer Name, Contact, Orders count, Lifetime Spend, Segment, Last Order date.

## 12. Loyalty & Reviews (`view-loyalty`)
**Header:** "Loyalty & Reviews" - "Track rewards program engagement and customer feedback."
*   **Inner Tabs:**
    *   **Loyalty Program:** Displays 3 KPI cards (Active Members, Points Issued, Rewards Redeemed) and a "Top Loyalty Members" table (Member, Tier, Available Points, Total Redeemed).
    *   **Customer Reviews:** Shows a summary header with the Average Rating (e.g., 4.6 stars). Table columns for Rating (stars), Customer, Comment, Order/Item, Date, Status, and Actions.

## 13. Marketing (`view-marketing`)
**Header:** "Promotions & Marketing" - "Create offers and track campaign ROI across channels."
*   **Action Button:** "+ Create Campaign"
*   **Data Table (Active Campaigns ROI):** Columns for Campaign Name, Channel, Status, Conversions, Revenue Generated.

## 14. Analytics (`view-analytics`)
**Header:** "Deep Analytics" - "Analyze trends, sales, and comprehensive business performance."
*   **Filters Bar:** Date Range, Branch, Order Type, Category, and an "Apply Filters" button.
*   **KPI Cards Row 1 (Revenue):** Total Revenue, Total Orders, Avg Order Value, Net Sales.
*   **KPI Cards Row 2 (Customers):** Total Customers, New vs Returning ratio, Reservations, Delivery Orders.
*   **KPI Cards Row 3 (Performance):** Pickup Orders, Top Item, Low-Stock alerts, Avg Rating, Loyalty signups, Top Branch.
*   **Charts Grid (Chart.js Graphs):**
    *   Revenue & Sales Trends
    *   Orders Over Time
    *   Sales by Category
    *   Orders by Type
    *   Top-Selling Menu Items
    *   Revenue by Branch
    *   Customer Growth & Retention
    *   Reservation Trends
    *   Inventory/Waste Trends
    *   Payment Method Breakdown
    *   Reviews & Rating Trends
    *   Marketing/Promotion Performance

## 15. Reports (`view-reports`)
**Header:** "Custom Reports" - "Generate and export financial, operational, and audit reports."
*   **Generator Tool:** Dropdown for Report Type (Sales Report, Tax Audit, Inventory Waste), Date picker, and "Generate Report" button.
*   **Result Panel:** Shows an "Export CSV" and "Export PDF" button when a report is ready.

## 16. HR & Staff (`view-hr`)
**Header:** "HR & Staff Management" - "Manage employee shifts, attendance, and payroll."
*   **KPI Cards (3):** Active Staff on Shift, Upcoming Shifts, Pending Payroll.
*   **Data Table (Current Roster):** Includes an "+ Add Employee" button. Columns for Name, Role, Shift, Attendance Status.

## 17. Finance & P&L (`view-finance`)
**Header:** "Financial Accounting (P&L)" - "Track revenue, COGS, labor, and overhead for profitability."
*   **KPI Cards (2):** Gross Revenue (Mtd), Net Profit (Mtd).
*   **Data Table (Profit & Loss Statement):** Columns for Category, Amount (Rs.), % of Revenue.

## 18. Settings (`view-settings`)
**Header:** "System Settings" - "Configure business details, tax rates, and appearance."
*   **Business Information Card:** Inputs for Restaurant Name, Currency, Default Tax Rate (%). Includes a "Save Changes" button.
*   **Appearance Card:** Contains a toggle switch to enable/disable Dark Mode.

---

## Global Elements & Modals
*   **Header Bar:** Contains a Mobile Sidebar toggle, Search Bar, "Demo Workspace" badge, Branch Selector dropdown, and a Notification Bell (with a dropdown showing unread alerts).
*   **Sidebar:** Grouped navigation links (Main, Operations, Customers, Growth & Analytics, Administration, System) with active state highlighting and notification dot badges (e.g., on Orders, KDS, Delivery).
*   **Animated Toast Notifications:** A system for pop-up alerts appearing at the top right of the screen (e.g., "New Online Order", "Table Reservation", "Low Stock Alert").
*   **Branch Switch Modal:** A secure popup requiring a 6-digit PIN to switch the active dashboard branch.

