# Complete Restaurant Management Dashboard

## Product, Functional, UI/UX & Demo Specification

This document defines the complete dashboard experience for the MhStudio restaurant management platform demo.

The dashboard must feel like a **real restaurant operating system**, not a collection of disconnected admin pages.

The key product concept is:

```text
Customer Channels
    ↓
Website / Mobile App / QR / WhatsApp / Phone / POS
    ↓
Central Order Management
    ↓
POS / KDS / Delivery / Tables
    ↓
Customer CRM / Analytics / Marketing
```

The system should clearly distinguish:

### Order Type

* Dine-in
* Takeaway
* Delivery

### Order Source

* Website
* Mobile App
* POS
* QR
* WhatsApp
* Phone
* Marketplace

Every order should belong to an order type and an order source.

Example:

```text
Type: Delivery
Source: Website
```

or:

```text
Type: Dine-in
Source: QR
Table: T-12
```

or:

```text
Type: Delivery
Source: POS
```

This distinction must be reflected throughout Orders, POS, KDS, Delivery and Analytics.

---

# 1. Dashboard (`view-dashboard`)

## Purpose

The main dashboard is the restaurant owner's control center.

It should answer:

* How is the restaurant performing today?
* How many orders are active?
* Where are orders coming from?
* What needs attention?
* What products are selling?
* How are branches performing?
* Are there delivery or inventory problems?
* What insights should the owner act on?

## Header

Show:

> **Overview**

Supporting text:

> **Welcome back! Here's what's happening at Urban Flame today.**

Header controls:

* Branch selector
* Date range
* Global search
* Notification bell
* Demo Workspace badge
* User profile

---

## AI Insight Card

A prominent but compact insight card.

Example:

> **AI Insight**
>
> Friday evening demand is projected to be 23% higher than your weekly average. Consider increasing kitchen staffing between 7 PM and 10 PM.

Provide:

* Insight type
* Short explanation
* Recommendation
* View Analytics action

Use realistic simulated insights in demo mode.

---

## KPI Grid

Use 4–6 primary cards.

### Today's Revenue

* Revenue
* Comparison vs previous day
* Trend

### Today's Orders

* Total
* Comparison
* Trend

### Average Order Value

* AOV
* Comparison
* Trend

### Pending Orders

* Current count
* Urgency indicator

### Active Deliveries

* Current delivery count

### New Customers

* Customers acquired today

Avoid excessive KPI cards.

The main overview should remain scannable.

---

## Sales Overview

Large chart.

Filters:

* Today
* Last 7 Days
* Last 30 Days
* Last 3 Months
* Custom Range

Display:

* Revenue
* Orders

Allow toggling between metrics.

---

## Sales by Channel

Show order source distribution:

* Website
* Mobile App
* POS
* QR
* WhatsApp
* Phone
* Marketplace

Example:

```text
Website       42%
POS           26%
WhatsApp      14%
QR             9%
Mobile App     6%
Other          3%
```

---

## Order Type Snapshot

Show:

```text
Dine-in       31
Takeaway      18
Delivery      35
```

This should be separate from channel analytics.

---

## Live Order Snapshot

Show:

```text
New
Preparing
Ready
Out for Delivery
Completed
Cancelled
```

Each count should be clickable and navigate to Orders with the relevant filter applied.

---

## Alerts & Action Center

Show important issues:

* New unconfirmed orders
* Delayed deliveries
* Low-stock ingredients
* Pending reservations
* Unassigned riders
* Unusual sales drops
* Expiring promotions

Example:

> **3 delivery orders waiting for rider assignment**

> **Chicken Breast is below reorder level**

> **2 reservations require confirmation**

---

## Recent Orders

Table:

* Order ID
* Type
* Source
* Customer
* Table / Area
* Total
* Status
* Time
* Action

Example:

```text
#10582
Delivery
Website
Ahmed Khan

Rs. 2,350
Preparing
```

---

## Best-Selling Products

Show:

* Product
* Orders
* Revenue
* Trend

Add:

> **View Full Analytics**

---

## Top Branches

For multi-branch demos show:

* Branch
* Revenue
* Orders
* Growth

---

# 2. Orders (`view-orders`)

## Purpose

This is the **central order management system**.

Every order from every relevant channel should appear here.

The owner should be able to manage:

* Dine-in
* Takeaway
* Delivery
* Website orders
* App orders
* POS orders
* QR orders
* WhatsApp orders
* Phone orders
* Marketplace orders

---

## Header

> **Orders Management**

Supporting text:

> **View, manage, and track every restaurant order from one place.**

Actions:

* New Order
* Export
* Refresh

---

## Primary Order Type Tabs

```text
All Orders
Dine-in
Takeaway
Delivery
```

These are the primary fulfillment types.

---

## Secondary Source Filters

```text
All Sources
Website
Mobile App
POS
QR
WhatsApp
Phone
Marketplace
```

---

## Status Filters

```text
All
New
Confirmed
Preparing
Ready
Assigned
Out for Delivery
Completed
Cancelled
Refunded
```

The exact available statuses should adapt to the order type.

---

## Order Statistics

Show:

* Total Orders
* New Orders
* Preparing
* Ready
* Out for Delivery
* Completed
* Cancelled
* Revenue

Use neutral, semantic styling rather than making every card heavily colored.

---

## Search

Search by:

* Order ID
* Customer name
* Phone
* Address
* Table number

---

## Orders Table / Cards

Desktop table columns:

* Order ID
* Type
* Source
* Customer
* Table / Address
* Items
* Total
* Payment
* Status
* Time
* Actions

Mobile should use order cards.

---

# Order Detail

Selecting an order should open a detail drawer or dedicated page.

Display:

## Order Header

```text
#10582
Delivery
Website
```

## Customer

* Name
* Phone
* Email

## Fulfillment

For Dine-in:

* Branch
* Table
* Guests
* Waiter

For Takeaway:

* Branch
* Pickup time

For Delivery:

* Branch
* Address
* Delivery zone
* Rider
* ETA

## Items

Each item:

* Image
* Product
* Quantity
* Modifiers
* Notes
* Price

## Pricing

```text
Subtotal
Discount
Delivery Fee
Tax
Total
```

## Payment

* Method
* Status
* Transaction reference

## Timeline

Example:

```text
10:32  Order placed
10:33  Confirmed
10:37  Preparing
10:52  Ready
10:54  Rider assigned
11:13  Delivered
```

## Actions

Contextual actions:

* Accept
* Start Preparing
* Mark Ready
* Assign Rider
* Mark Delivered
* Cancel
* Refund
* Print
* Reorder

---

# Order Type: Dine-In

Dine-in orders must support two methods.

## Method A — Staff / Waiter Created Order

```text
POS
↓
Dine-in
↓
Select Table
↓
Add Items
↓
Send KOT
↓
Kitchen
↓
Preparing
↓
Ready
↓
Served
↓
Bill
↓
Payment
↓
Completed
```

The order must contain:

* Branch
* Table number
* Guests
* Waiter
* Items
* Notes
* Payment

The table remains linked to the open order until the bill is completed.

---

# Dine-In Method B — Customer QR Ordering

Each physical table can have a unique QR code.

Example:

```text
Table 12
↓
Scan QR
↓
restaurant.com/menu?table=12
```

The system should automatically identify:

* Branch
* Table
* Dine-in order type

The customer should not manually enter the table number.

Customer flow:

```text
Scan QR
↓
Menu
↓
Product
↓
Cart
↓
Checkout
↓
Dine-in
↓
Table 12
↓
Place Order
```

The order then enters the same central system.

Example:

```text
#10583
Dine-in
QR
Table 12
NEW
```

---

# Dine-In Table Association

Each dine-in order should retain its table relationship.

Show:

```text
Table 12
Open Order #10583
4 Guests
Rs. 2,840
```

Allow adding items to the existing open order.

Example:

```text
Initial Order
2 × Burger
1 × Fries

Additional Order
1 × Pizza
2 × Drinks
```

---

# Order Type: Takeaway

Workflow:

```text
Website / Mobile App / POS / WhatsApp / Phone
↓
Takeaway
↓
Customer
↓
Pickup Time
↓
Order
↓
Kitchen
↓
Preparing
↓
Ready
↓
Picked Up
↓
Completed
```

Takeaway orders should not require a table.

Required fields:

* Customer
* Phone
* Pickup time
* Items
* Payment

---

# Order Type: Delivery

Delivery workflow:

```text
Website / App / POS / WhatsApp / Phone / Marketplace
↓
Delivery
↓
Customer
↓
Address
↓
Delivery Zone
↓
Delivery Fee
↓
Order
↓
Kitchen
↓
Ready
↓
Delivery Assignment
↓
Rider / Delivery Partner
↓
Out for Delivery
↓
Delivered
```

Delivery-specific data:

* Customer
* Phone
* Address
* Landmark
* Zone
* Delivery fee
* Instructions
* Rider
* ETA
* Payment

---

# Online Order Flow

For website/app orders:

```text
Customer
↓
Menu
↓
Cart
↓
Checkout
↓
Payment
↓
Order Created
↓
Central Orders
↓
Kitchen
```

Order source should be recorded automatically:

```text
Source: Website
```

---

# POS-Created Order Flow

Staff can create all three order types.

```text
New Order

[Dine-in]
[Takeaway]
[Delivery]
```

The POS creates the same centralized order object as the website.

---

# Phone Order Flow

If a customer calls:

```text
Customer calls
↓
Staff opens POS
↓
Delivery / Takeaway
↓
Customer details
↓
Items
↓
Order created
↓
Kitchen
```

The source should be:

```text
Source: Phone
```

---

# WhatsApp Order Flow

For basic WhatsApp ordering:

```text
Website
↓
Cart
↓
Order Summary
↓
Open WhatsApp
↓
Pre-filled Order Message
↓
Customer Sends
```

The generated message should contain:

* Order ID
* Customer
* Order type
* Items
* Total
* Address where relevant

Do not represent simple WhatsApp links as full WhatsApp Business API automation.

---

# 3. POS (`view-pos`)

## Purpose

The POS is the staff-facing order creation and billing interface.

It must support:

* Dine-in
* Takeaway
* Delivery

---

## Main Layout

Desktop:

```text
┌─────────────────────────────────────────────┐
│ POS Header                                  │
├─────────────┬─────────────────┬─────────────┤
│ Categories  │ Products         │ Current     │
│             │                 │ Order       │
│             │                 │             │
│             │                 │             │
└─────────────┴─────────────────┴─────────────┘
```

---

## Order Type Selector

Prominent selector:

```text
Dine-in | Takeaway | Delivery
```

Selecting an order type dynamically changes the required fields.

---

## Dine-In Form

Show:

* Branch
* Table
* Guests
* Waiter

Table selector should visually show:

* Available
* Occupied
* Reserved
* Cleaning

---

## Takeaway Form

Show:

* Customer
* Phone
* Pickup time

---

## Delivery Form

Show:

* Customer
* Phone
* Address
* Area
* Delivery zone
* Delivery fee
* Delivery instructions

---

## Product Catalog

Categories:

* All
* Combos
* Burgers
* Pizza
* Rolls
* Fries
* Drinks
* Extras
* Desserts

Product cards:

* Image
* Name
* Price
* Availability

Clicking a product adds it to the order.

---

## Product Modifiers

Example:

```text
Size
Regular
Large + Rs.100

Sauce
Garlic
BBQ
Chipotle

Extras
Cheese + Rs.100
Jalapeño + Rs.80
```

The selected modifiers appear in the cart.

---

## Current Order

Show:

* Product
* Quantity
* Modifiers
* Notes
* Price

Quantity controls:

`+` / `−`

---

## Pricing

Show:

* Subtotal
* Discount
* Tax
* Delivery fee where applicable
* Total

---

## POS Actions

* Hold Order
* Save
* Print KOT
* Send to Kitchen
* Print Bill
* Checkout
* Clear

Do not make every button equally prominent.

Primary action should change based on workflow.

---

# 4. Kitchen / KDS (`view-kds`)

## Purpose

The Kitchen Display System receives orders from:

* POS
* Website
* App
* QR
* WhatsApp workflow
* Other integrated channels

The kitchen should not care how the order originated.

It needs:

* Order type
* Destination
* Items
* Quantity
* Modifiers
* Notes
* Time

---

## Header

> **Kitchen Display System**

Subtext:

> **Monitor and manage food preparation in real time.**

Controls:

* Auto-refresh
* Sound
* Full View
* Branch
* Station filter

---

## KDS Board

Four operational columns:

```text
NEW
PREPARING
READY
COMPLETED
```

---

## Order Ticket

Example:

```text
#10583

DINE-IN
TABLE 12

2 × Chicken Burger
1 × Loaded Fries

No Mayo

12 min

[Start Preparing]
```

Delivery:

```text
#10584

DELIVERY


3 × Chicken Burger
1 × Fries

15 min

[Start Preparing]
```

Takeaway:

```text
#10585

TAKEAWAY

Pickup 8:30 PM

1 × Large Pizza
2 × Coke
```

---

## Ticket Details

Display:

* Order ID
* Order type
* Table/pickup/delivery
* Customer where relevant
* Time elapsed
* Product image where useful
* Item quantity
* Modifiers
* Special instructions

---

## KDS Actions

* Accept
* Start Preparing
* Mark Ready
* Clear / Complete

Delayed tickets should become visually more prominent.

---

## KDS Workflow

```text
NEW
↓
PREPARING
↓
READY
↓
Fulfillment
```

For dine-in:

```text
READY
↓
SERVE
```

For takeaway:

```text
READY
↓
PICKUP
```

For delivery:

```text
READY
↓
RIDER ASSIGNMENT
```

---

# 5. Menu (`view-menu`)

## Purpose

Manage all menu products and ordering configuration.

---

## Header

> **Menu Management**

Subtext:

> **Manage products, categories, modifiers, prices, and availability.**

Actions:

* Add Product
* Add Category
* Import Menu

---

## Filters

* Search
* Category
* Branch
* Availability
* Status

---

## Product Table

Columns:

* Product
* Category
* Price
* Availability
* Branch
* Status
* Actions

---

## Product Management

Each product includes:

* Name
* Description
* Image
* Price
* Discount price
* Category
* SKU
* Preparation time
* Tax
* Availability
* Featured
* Bestseller
* Branch availability

---

## Modifiers

Support:

* Sizes
* Add-ons
* Sauces
* Extras

Each modifier can have:

* Name
* Price
* Availability

---

## Availability

Allow:

* Available
* Temporarily unavailable
* Out of stock

Also support:

* Branch-specific availability
* Time-based availability

Example:

```text
Breakfast
7 AM – 12 PM
```

---

# 6. Website & Content (`view-content`)

Rename the current "Content & Media" module to:

> **Website & Content**

because this area controls more than images.

## Purpose

Allow the restaurant to manage its public-facing website without developer assistance for routine updates.

---

## Inner Tabs

```text
Overview
Offers
Gallery
Website Content
Contact
Opening Hours
SEO
```

---

## Website Content

Manage:

* Restaurant description
* Homepage sections
* About
* Featured dishes
* Offers
* FAQs
* Contact information
* Branch content

---

## Offers

Show:

* Existing promotional banners
* Active/inactive status
* Start/end dates

Actions:

* Add
* Edit
* Delete
* Activate/deactivate

---

## Gallery

Manage:

* Food photos
* Interior
* Team
* Events

Support:

* Multiple upload
* Reordering
* Delete
* Feature image

Images should be optimized automatically where practical.

---

## Contact Information

Per branch:

* Restaurant name
* Phone
* Email
* WhatsApp
* Address
* Google Maps
* Coordinates where applicable

---

## Opening Hours

For each day:

* Open
* Close
* Closed

Support split hours where needed.

Example:

```text
Monday
11:00 AM – 11:00 PM
```

---

## SEO

Allow basic editable fields:

* Page title
* Meta description
* Local keywords
* Social preview
* Restaurant structured data settings

---

# 7. Inventory & Supply (`view-inventory`)

## Purpose

Manage stock, ingredients, recipes, suppliers, purchasing and waste.

---

## Inner Tabs

```text
Current Stock
Recipes
Suppliers
Purchase Orders
Waste
```

---

## Current Stock

Columns:

* Ingredient
* SKU
* Current quantity
* Unit
* Unit cost
* Minimum level
* Status
* Branch
* Action

Statuses:

* Good
* Low Stock
* Out of Stock

---

## Receive Stock

Form:

* Supplier
* Ingredient
* Quantity
* Unit cost
* Batch
* Expiry
* Branch

---

## Recipes

Map menu products to ingredients.

Example:

```text
Chicken Burger

1 Bun
150g Chicken
20g Cheese
15g Sauce
10g Lettuce
5g Tomato
```

Display:

* Selling price
* Ingredient cost
* Food cost %
* Estimated margin

---

## Suppliers

Table:

* Supplier
* Contact
* Categories
* Pending balance
* Last delivery
* Recent POs
* Status

---

## Purchase Orders

Show:

* PO number
* Supplier
* Items
* Amount
* Date
* Status

Statuses:

* Draft
* Ordered
* Partially received
* Received
* Cancelled

---

## Waste

Record:

* Date
* Ingredient
* Quantity
* Reason
* Value lost
* Branch
* Logged by

Reasons:

* Spoilage
* Expired
* Damaged
* Preparation waste
* Incorrect order

---

# 8. Delivery (`view-delivery`)

## Rename

Use:

> **Delivery & Fleet**

instead of simply "Delivery Operations."

---

## Purpose

Manage:

* Delivery orders
* Riders
* Dispatch
* Delivery zones
* Live progress
* Delivery partners
* Fleet performance

---

## Delivery Models

Support conceptually:

### Own Fleet

```text
Restaurant
↓
Own Rider
↓
Rider App
↓
Customer
```

### Delivery Partner

```text
Restaurant
↓
Delivery Partner
↓
Partner Rider
↓
Customer
```

### Hybrid

Restaurant can use both.

---

## Delivery Header

Show:

* Active deliveries
* Ready for dispatch
* Available riders
* Unassigned orders
* Delayed deliveries

---

## Delivery Tabs

```text
Overview
Active Deliveries
Ready for Dispatch
Riders
Zones
Live Map
Partners
Analytics
```

---

## Active Deliveries

Table:

* Order
* Customer
* Area
* Rider
* Status
* ETA
* Payment
* Actions

---

## Ready for Dispatch

Show orders that are ready from KDS.

Actions:

> Assign Rider

---

## Rider Management

Show:

* Name
* Status
* Current jobs
* Completed jobs
* On-time percentage
* Total distance where available

Statuses:

* Online
* Offline
* Busy
* On Break

---

## Add Rider

Fields:

* Name
* Phone
* Rider ID
* Branch
* Vehicle
* Status

---

## Rider Assignment

Allow:

### Manual assignment

Manager chooses rider.

### Automatic assignment

Demo can simulate assignment based on availability/proximity.

---

## Rider Rejection

If rider rejects a task, capture a reason.

Example:

```text
Vehicle issue
Too far
Weather
Unavailable
Other
```

---

## Live Map

Show:

* Branches
* Active riders
* Delivery locations
* Routes

For demo mode, use simulated map data.

Clearly label it as demo/simulated where appropriate.

---

## Delivery Status

```text
Unassigned
↓
Assigned
↓
Accepted
↓
Picked Up
↓
Out for Delivery
↓
Delivered
```

---

## Cash Collection

For COD:

```text
Order Total
PKR 2,350

Cash Collected
PKR 2,350
```

Allow rider to mark:

> Payment Collected

---

## Delivery Zones

Manage:

* Radius/area
* Delivery fee
* Minimum order
* Free delivery threshold
* Estimated time
* Branch

Example:

```text
0–3 km    Rs.100
3–6 km    Rs.180
6–10 km   Rs.250
```

---

## Delivery Partners

Allow restaurant to see connected/available partner services.

Statuses:

* Connected
* Available
* Not Connected
* Coming Soon

Do not claim a live integration unless actually implemented.

---

## Delivery Analytics

Show:

* Average delivery time
* On-time rate
* Failed deliveries
* Rejections
* Rider performance
* Branch performance

---

# 9. Reservations & Tables (`view-reservations`)

## Purpose

Manage bookings and restaurant table occupancy.

---

## Inner Tabs

```text
Reservations
Tables
Floor Plan
```

---

## Reservations

Table:

* Customer
* Phone
* Date
* Time
* Guests
* Table
* Branch
* Status

Statuses:

* Pending
* Confirmed
* Seated
* Completed
* Cancelled
* No-show

---

## New Booking

Fields:

* Customer
* Phone
* Date
* Time
* Guests
* Branch
* Table
* Occasion
* Notes

---

# Table Management

Show visual floor plan.

Table states:

```text
Available
Occupied
Reserved
Cleaning
Blocked
```

Each table should display:

* Number
* Capacity
* Guests
* Current order
* Total
* Waiter
* Time occupied

---

## Table Detail

Example:

```text
TABLE 12

Capacity
4

Guests
4

Status
Occupied

Order
#10583

Total
PKR 2,840

Waiter
Hamza
```

Actions:

* Add Items
* View Order
* Transfer Table
* Split Bill
* Print Bill
* Close Table

---

# Table Lifecycle

```text
Available
↓
Occupied
↓
Order in Progress
↓
Payment
↓
Cleaning
↓
Available
```

---

# 10. Branches (`view-branches`)

## Purpose

Manage multiple restaurant locations.

---

## Header

> **Multi-Branch Management**

Subtext:

> **Monitor locations, operations, menus, and performance from one place.**

---

## Branch Cards

Each card:

* Branch name
* Address
* Open/Closed
* Revenue
* Orders
* Staff
* Delivery activity

---

## Branch Detail

Tabs:

```text
Overview
Orders
Menu
Staff
Inventory
Delivery
Analytics
Settings
```

---

## Branch Settings

Manage:

* Address
* Phone
* Opening hours
* Delivery zones
* Menu
* Tax settings
* Branch-specific offers

Growth package:

> Up to 5 branches

Custom package:

> Multi-branch / unlimited scope based on agreement

---

# 11. Customers (`view-customers`)

## Purpose

Central CRM for customer profiles and behavior.

---

## KPI Cards

* Total Customers
* New Customers
* Returning Customers
* VIP Customers
* At-Risk Customers
* Average Lifetime Value

Do not display all KPIs simultaneously on mobile.

---

## Filters

* Search
* Segment
* Branch
* Order count
* Spend
* Last order
* Source

---

## Customer Table

Columns:

* Customer
* Contact
* Orders
* Lifetime spend
* Average order
* Segment
* Last order

---

## Customer Profile

Example:

```text
Ahmed Khan

24 Orders
PKR 48,500 Lifetime Spend
PKR 2,021 AOV

Last Order
2 days ago
```

Tabs:

```text
Overview
Orders
Preferences
Loyalty
Feedback
```

Show:

* Phone
* Email
* Addresses
* Favorite products
* Preferred branch
* First order
* Last order
* Spending
* Loyalty points

---

## Segments

Provide:

* New
* Returning
* VIP
* High Spenders
* Frequent
* Inactive
* At-Risk

---

# 12. Loyalty & Reviews (`view-loyalty`)

## Inner Tabs

```text
Loyalty
Rewards
Reviews
```

---

## Loyalty Dashboard

KPIs:

* Active Members
* Points Issued
* Rewards Redeemed

---

## Loyalty Members

Table:

* Customer
* Tier
* Points
* Redeemed
* Last activity

---

## Loyalty Tiers

Example:

```text
Silver
Gold
Platinum
```

---

## Rewards

Manage:

* Reward name
* Points required
* Availability
* Expiry
* Redemption count

---

# Reviews

Show:

* Average rating
* Rating distribution
* Recent reviews
* Product feedback
* Customer
* Date
* Order

Actions:

* View
* Respond
* Mark resolved

---

# 13. Marketing (`view-marketing`)

## Purpose

Create promotions and measure customer engagement.

---

## Header

> **Promotions & Marketing**

Subtext:

> **Create offers, target customers, and measure campaign performance.**

---

## Main Tabs

```text
Campaigns
Promotions
Coupons
Segments
```

---

## Campaign Table

Columns:

* Campaign
* Channel
* Audience
* Status
* Orders
* Revenue
* Conversion
* ROI

---

## Promotion Types

Support:

* Percentage discount
* Fixed discount
* BOGO
* Combo
* First order
* Minimum order
* Branch-specific
* Time-based

---

## Campaign Builder

Fields:

* Campaign name
* Audience
* Offer
* Channel
* Start date
* End date
* Branch
* Minimum order

---

# 14. Analytics (`view-analytics`)

## Purpose

Provide deeper business intelligence.

---

## Filters

* Date range
* Branch
* Order type
* Order source
* Category
* Product
* Payment method

---

## Revenue KPIs

* Total Revenue
* Net Sales
* Orders
* AOV
* Discounts
* Delivery Fees

---

## Customer KPIs

* Total Customers
* New Customers
* Returning Customers
* Retention
* Average Lifetime Value

---

## Operational KPIs

* Average Preparation Time
* Average Delivery Time
* Cancellation Rate
* On-Time Delivery
* Table Utilization

---

## Product KPIs

* Best Seller
* Worst Seller
* Revenue Leader
* Highest Margin
* Most Ordered

---

## Branch KPIs

* Top Branch
* Lowest Branch
* Revenue by Branch
* Orders by Branch

---

## Charts

Include:

* Revenue & Sales Trends
* Orders Over Time
* Sales by Category
* Orders by Type
* Orders by Source
* Top-Selling Products
* Revenue by Branch
* Customer Growth
* Customer Retention
* Reservation Trends
* Delivery Trends
* Inventory Trends
* Waste Trends
* Payment Method Breakdown
* Reviews & Ratings
* Promotion Performance

---

# 15. AI Business Insights

Include a dedicated insight layer within Analytics.

Example:

> Delivery cancellations are 32% higher this week.

> Burger demand increased 18% during evening hours.

> 12 high-value customers have not ordered in 30 days.

> Branch B revenue is 14% below its four-week average.

Each insight may include:

* Observation
* Business impact
* Recommendation

---

# 16. Reports (`view-reports`)

## Purpose

Generate operational and management reports.

---

## Report Categories

### Sales

* Daily Sales
* Monthly Sales
* Product Sales
* Category Sales
* Branch Sales

### Operations

* Orders
* Delivery
* Kitchen
* Tables
* Reservations

### Customers

* Customer Activity
* Customer Spend
* Retention

### Inventory

* Stock
* Purchases
* Waste
* Food Cost

### Finance

* Revenue
* Expenses
* Payments
* Profitability

---

## Report Generator

Controls:

* Report type
* Branch
* Date range
* Filters

Action:

> Generate Report

When generated:

* Preview
* Export CSV
* Export PDF

---

# 17. HR & Staff (`view-hr`)

## Purpose

Manage restaurant employees and access.

---

## KPI Cards

* Staff on Shift
* Upcoming Shifts
* Attendance Issues

Avoid showing payroll as fully implemented unless the platform actually supports payroll.

---

## Staff Table

Columns:

* Name
* Role
* Branch
* Shift
* Status
* Attendance

---

## Roles

* Owner
* Admin
* Manager
* Cashier
* Waiter
* Kitchen
* Rider
* Marketing

---

## Permissions

Permissions should control access to:

* Orders
* POS
* KDS
* Menu
* Inventory
* Customers
* Delivery
* Analytics
* Reports
* Settings

---

# 18. Finance (`view-finance`)

## Purpose

Provide a simplified business-finance view.

---

## KPI Cards

* Gross Revenue
* Net Sales
* Estimated COGS
* Estimated Gross Profit

---

## P&L

Rows:

* Revenue
* Discounts
* Refunds
* COGS
* Delivery
* Labor
* Operating Expenses
* Net Profit

Clearly label demo estimates where figures are simulated.

---

# 19. Website / Digital Setup (`view-website`)

If a dedicated Website section is included in the dashboard, use it for configuration rather than duplicating Content & Media.

It can contain:

```text
Website Overview
Pages
Navigation
Homepage
SEO
Domain
Preview
```

---

## Website Preview

Show:

> **Preview Website**

Include:

* Desktop preview
* Tablet preview
* Mobile preview

---

## Website Pages

Manage:

* Home
* Menu
* Offers
* About
* Gallery
* Reservation
* Contact

---

# 20. QR Menu (`view-qr`)

## Purpose

Manage table and restaurant QR experiences.

---

## QR Dashboard

Show:

* Total QR scans
* Unique visitors
* Menu views
* Orders generated
* Conversion

---

## QR Types

### Table QR

Specific to:

* Branch
* Table

Example:

```text
Branch: F-7
Table: 12
```

### General Menu QR

Restaurant-wide menu.

---

## Actions

* Generate
* Preview
* Download
* Assign
* Replace

---

# 21. Integrations (`view-integrations`)

## Categories

### Payments

* JazzCash
* Easypaisa
* Cards

### Communication

* WhatsApp
* SMS
* Email

### Business

* Google Maps
* Google Business
* Analytics

### Restaurant Technology

* POS
* KDS
* Kitchen printers
* Delivery services

### Custom

* APIs
* Webhooks
* Custom integrations

Every integration should clearly show:

```text
Connected
Available
Not Connected
Coming Soon
```

Never visually claim a live connection when it is only a demo.

---

# 22. Settings (`view-settings`)

Organize settings into sections.

## Restaurant

* Name
* Logo
* Currency
* Tax
* Contact

## Branches

* Branch configuration
* Hours
* Delivery zones

## Orders

* Order timing
* Auto-confirmation
* Preparation settings

## Notifications

* Email
* WhatsApp
* SMS
* In-app

## Users & Permissions

* Users
* Roles
* Access

## Appearance

* Theme
* Branding
* Dashboard preferences

## Security

* Password
* Sessions
* 2FA
* Audit logs

---

# 23. Global Header

The global header should contain:

* Mobile sidebar toggle
* Global search
* Demo Workspace badge
* Branch selector
* Notifications
* Profile

---

# 24. Branch Selector

Selecting a branch should update the relevant dashboard views.

Options:

```text
All Branches
F-7
Bahria
University Road
```

For sensitive branch switching, use a PIN only if genuinely required by the product design.

Do not make branch switching unnecessarily frustrating in a demo.

---

# 25. Global Notifications

Notification dropdown should contain examples:

```text
New online order
Table reservation
Low stock
Delivery delayed
Rider assigned
Promotion ending
```

Each notification should link to the appropriate module.

---

# 26. Global Search

Allow searching across:

* Orders
* Customers
* Products
* Reservations
* Branches

Example:

Searching:

> Ahmed Khan

could return:

```text
Customer
Ahmed Khan

Orders
#10582
#10541
#10492
```

---

# 27. Toast Notifications

Use concise animated notifications.

Examples:

> New online order received.

> Order #10582 sent to kitchen.

> Rider assigned successfully.

> Product availability updated.

> Table 12 order updated.

Keep them subtle.

---

# 28. Demo Mode

The entire dashboard is a demonstration.

Use realistic data but clearly distinguish simulated functionality where necessary.

Examples:

> Demo Workspace

> Demo Data

> Simulated Live Tracking

Do not falsely claim live external integrations.

---

# 29. Connected Demo State

This is one of the most important requirements.

The modules must feel connected.

Example:

```text
Customer Website
↓
Create Delivery Order
↓
Orders
↓
KDS
↓
Preparing
↓
Ready
↓
Delivery
↓
Assign Rider
↓
Delivered
↓
Customer History
↓
Analytics
```

Dine-in:

```text
POS
↓
Dine-in
↓
Table 12
↓
Order
↓
KDS
↓
Ready
↓
Served
↓
Bill
↓
Payment
↓
Table Available
```

QR:

```text
Table QR
↓
Menu
↓
Dine-in Order
↓
Central Orders
↓
KDS
↓
Table 12
```

The same demo data/state should be shared between these experiences.

---

# 30. UI/UX Design Direction

The dashboard must be:

* Premium
* Modern
* Clean
* Professional
* Operational
* Data-driven
* Readable
* Fast

Avoid:

* Generic admin-template appearance
* Excessive gradients
* Excessive glassmorphism
* Heavy shadows
* Giant cards
* Excessive rounded containers
* Unnecessary decoration

---

# 31. Information Hierarchy

Every screen must answer:

1. What am I looking at?
2. What matters?
3. What action can I take?

Prioritize information instead of filling empty space.

---

# 32. Desktop Layout

Use:

* Persistent sidebar
* Header
* Multi-column layouts
* Data tables
* Side-by-side panels
* Charts
* Drawers

Desktop should prioritize productivity.

---

# 33. Tablet Layout

Adapt:

* Sidebar
* KPI grids
* Charts
* Tables
* Drawers

Avoid cramped layouts.

---

# 34. Mobile Layout

The dashboard must be intentionally redesigned for mobile.

Do not simply scale down the desktop interface.

Core mobile navigation:

```text
Home
Orders
POS
Menu
More
```

Secondary modules should be placed under More.

---

# 35. Mobile Order Cards

Instead of desktop tables, show:

```text
#10582

DELIVERY
Ahmed Khan

2 × Chicken Burger
1 × Fries

PKR 1,847

Preparing

[View]
```

---

# 36. Mobile POS

Prioritize:

```text
Order Type
↓
Categories
↓
Products
↓
Cart
↓
Checkout
```

Cart can become a bottom drawer/full-screen panel.

---

# 37. Mobile KDS

Use large cards with large touch targets.

Actions should be easy to tap:

* Start
* Ready
* Complete

---

# 38. Accessibility

Maintain:

* Keyboard navigation
* Focus states
* Semantic HTML
* Proper labels
* Good contrast
* Accessible buttons
* Non-color-only status indicators

---

# 39. Typography

Use highly readable modern typography.

Maintain consistent hierarchy:

```text
Page Title
Section Title
Card Title
Primary Metric
Body
Secondary
Metadata
```

Avoid extremely small text.

---

# 40. Status System

Use a consistent semantic system.

```text
Success
Warning
Danger
Info
Neutral
```

Example:

```text
✓ Completed
⚠ Delayed
× Cancelled
● Preparing
```

Do not use color alone.

---

# 41. Tables

Desktop tables should support:

* Search
* Sort
* Filters
* Pagination
* Row hover
* Detail drawer

On mobile, use cards or horizontal-scroll tables only where necessary.

---

# 42. Modals & Drawers

Use:

### Modal

For focused actions.

### Drawer

For:

* Order details
* Customer details
* Quick edits

### Full Page

For:

* Analytics
* Inventory
* Settings
* Complex workflows

---

# 43. Loading States

Use skeleton loaders for:

* KPI cards
* Orders
* Tables
* Charts
* Customers

---

# 44. Empty States

Every module needs useful empty states.

Example:

> No active deliveries.

Then:

> Assign a rider when an order is ready.

---

# 45. Error & Feedback States

Provide useful messages.

Examples:

> Unable to save menu item. Please try again.

> Rider could not be assigned.

> Payment status could not be updated.

Do not show raw technical errors.

---

# 46. Performance

The dashboard must remain fast despite its large feature set.

Use:

* Route-level code splitting
* Lazy loading
* Efficient state management
* Paginated tables
* Virtualized large lists where needed
* Optimized charts
* Shared components

Do not load every dashboard module simultaneously.

---

# 47. Dashboard Route Loading

Load heavy modules only when needed.

```text
Dashboard
→ Overview

Orders
→ Orders bundle

POS
→ POS bundle

KDS
→ KDS bundle

Analytics
→ Analytics bundle

Inventory
→ Inventory bundle
```

---

# 48. Data Consistency

A single order should appear consistently across:

* Orders
* POS
* KDS
* Delivery
* Customer profile
* Analytics

A single customer should maintain consistent:

* Name
* Phone
* Orders
* Spend
* Loyalty

A single table should maintain:

* Status
* Order
* Guests
* Waiter

---

# 49. Demo Interaction Rules

Important actions should visibly update the UI.

Examples:

### Create POS order

Order appears in:

* Orders
* KDS

### KDS marks ready

Order becomes:

> Ready

and appears in:

> Ready for Dispatch

for delivery.

### Assign rider

Delivery changes:

> Unassigned → Assigned

### Mark delivered

Order becomes:

> Delivered / Completed

Customer history updates.

### Close dine-in bill

Table changes:

> Occupied → Cleaning/Available

---

# 50. Final Product Architecture

The full product should communicate:

```text
                         CUSTOMER CHANNELS

Website ───────┐
Mobile App ────┤
QR ────────────┤
WhatsApp ──────┤
Phone ─────────┤
POS ───────────┘
       │
       ▼
CENTRAL ORDER MANAGEMENT
       │
       ├───────────────┐
       │               │
       ▼               ▼
     DINE-IN        TAKEAWAY
       │               │
     Table            Pickup
       │               │
       └───────┬───────┘
               │
               ▼
             DELIVERY
               │
        Address / Rider
               │
               ▼
             KDS
               │
          Preparation
               │
      ┌────────┼─────────┐
      ▼        ▼         ▼
    TABLE     PICKUP    RIDER
      │        │         │
      └────────┼─────────┘
               ▼
           COMPLETED
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
      CRM   Analytics  Marketing
       │       │        │
       └───────┼────────┘
               ▼
          Repeat Business
```

---

# 51. Final Demo Experience

The demo should tell a complete story.

### Customer Side

```text
Discover Restaurant
↓
Website / App
↓
View Menu
↓
Choose Delivery / Takeaway / Dine-in
↓
Order
```

### Restaurant Side

```text
Order Received
↓
Central Orders
↓
POS / KDS
↓
Kitchen
↓
Fulfillment
```

### Delivery

```text
Ready
↓
Fleet
↓
Rider
↓
Customer
↓
Delivered
```

### Business Management

```text
Customer
↓
CRM
↓
Loyalty
↓
Marketing
↓
Analytics
↓
Business Insight
```

---

# 52. Final Product Goal

The dashboard must make a restaurant owner understand:

> **This is the central system for running my restaurant's digital and operational workflow.**

It should demonstrate that MhStudio can provide:

* Restaurant website
* Online ordering
* POS
* KDS
* Dine-in management
* Table management
* QR ordering
* Takeaway
* Delivery
* Fleet management
* Rider app
* Reservations
* Menu management
* Customer CRM
* Loyalty
* Promotions
* Marketing
* Inventory
* Supplier management
* Multi-branch management
* Analytics
* AI insights
* Website/content management
* Hosting
* Deployment
* Maintenance
* Integrations

The demo should not attempt to make every advanced feature production-complete.

Instead, it should make the **entire operating model believable, connected, understandable, and visually polished**.

The client should be able to click through the dashboard and understand:

> **How an order enters the restaurant, how staff processes it, how the kitchen handles it, how delivery or dine-in fulfillment works, how customer information is retained, and how the owner can use the resulting data to manage and grow the business.**
