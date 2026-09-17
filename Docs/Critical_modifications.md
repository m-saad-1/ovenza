### Orders & Progress Synchronization

1. **Order Sorting & Cancellation**

   * In the Admin Panel **Orders** tab, always show the **newest orders at the top**.
   * When an order is cancelled, move it to the **Cancelled Orders** section/list.
   * Sort Cancelled Orders with the **most recently cancelled order at the top**.
   * Ensure sorting updates automatically whenever a new order is created, cancelled, or its status changes.

2. **Actual Order Progress**

   * Fix the customer-side **Orders page** so it always displays the order's **actual current progress**.
   * Do not show hardcoded/default progress, cancellation, refund, or placeholder statuses.
   * The displayed progress must come directly from the order's current status.
   * Ensure the progress pipeline/line, completed steps, active step, timestamps, and status text all correspond to the actual order state.

3. **Order Details Modal**

   * Remove all **emojis from the timeline/progress section**.
   * Display the **time/timestamp at the beginning of each progress status**, before the progress text.
   * Remove default/static text such as **Cancel, Refund, or other actions/statuses** when they do not apply to the actual order.
   * Show only the **actual progress history and applicable actions** for that specific order.
   * Ensure the timeline accurately reflects the order's real status progression.

4. **Modal Layering / Z-Index**

   * Fix the **Split Bill modal** so it opens correctly in the foreground.
   * Audit all other Dashboard modals for the same issue.
   * Every modal must appear **above the correct page content, sidebar, cards, dropdowns, and other UI layers**.
   * Ensure modal overlays and z-index values are consistent.
   * Prevent one modal or page element from incorrectly appearing above another modal.
   * Apply a proper global modal layering system instead of fixing only Split Bill with a one-off z-index.

5. **Dashboard ↔ Customer Order Synchronization**

   * When an admin updates an order's progress/status in the Dashboard, **synchronously update the same order on the customer's Orders page**.
   * Both sides must use the same underlying order state.
   * Changes should be reflected without requiring a manual page refresh whenever the application's architecture supports real-time state updates.
   * Keep the following synchronized:

     * Current status
     * Progress pipeline
     * Completed steps
     * Active step
     * Status text
     * Timestamps
     * Cancellation state
     * Delivery/Pickup information

### Required Order Flow

Ensure the actual order lifecycle is reflected consistently on both sides:

**Accepted → Sent for Preparing → Preparing → Ready → Dispatched → Out for Delivery → Delivered**

If an order is cancelled, show **Cancelled** based on the actual cancellation event rather than displaying it as a default action/status.

### Final Verification

Test one newly placed order from start to finish:

**Customer places order → Admin accepts → Send for Preparing → KDS prepares → Ready → Dispatch → Out for Delivery → Delivered**

At every step, verify that the **Admin Panel and Customer Orders page show the same current status, progress, timestamps, and order details**.
