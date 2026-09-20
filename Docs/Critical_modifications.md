### Dashboard Modifications

1. **Orders Modal — Simple Dashboard**

   * Use the **same advanced order-details modal design** in Simple Dashboard mode.
   * Keep the advanced modal's layout, information, styling, and details.
   * However, Simple Dashboard should only expose these actions:

     * **Accept**
     * **Preparing**
     * **Dispatched**
     * **Delivered**
     * **Cancel**
   * Do not expose advanced actions that are unnecessary for the Simple Dashboard.

   **Action Layout:**

   * Place **Print Bill**, **Split Bill**, and other utility buttons in **one row above** the main action row.
   * Place the **main action button and Cancel button in one row** below the utility buttons.
   * Ensure the layout is clean and responsive.

   **Cancel Order:**

   * Clicking Cancel must first open a **confirmation message/modal**.
   * Do not cancel the order immediately.
   * Only cancel after the user confirms.

   **Order Status:**

   * Color-code the **Order Status** text/badge based on the current status.
   * Use consistent status colors across the modal and Orders page.

   **Dispatch:**

   * Clicking **Dispatched** should open a detailed dispatch modal.
   * Allow the restaurant to:

     * Assign their own rider.
     * Select an available/nearby rider.
     * View relevant rider information.
     * Confirm the rider assignment before dispatching.
   * After confirmation, update the order to **Dispatched** and synchronize the delivery information.

2. **Simple Dashboard — Stuck/Locked Issue**

   * Fix the issue where the Simple Dashboard sometimes becomes **stuck, frozen, or locked** and stops responding.
   * Investigate the actual root cause rather than adding a reload workaround.
   * Check tab switching, modal state, loading states, overlays, scroll locking, authentication/state persistence, and event handlers.
   * Ensure users can always navigate between tabs and interact with buttons after opening/closing modals.
   * Do not introduce this issue into Advanced Dashboard mode.

3. **Analytics — Dark Mode Graph Lines**

   * In Dark Mode, the straight horizontal/grid lines in **all line graphs/charts** are currently too bright/white.
   * Make these lines softer and slightly off-white/dim so they integrate with the dark theme.
   * Keep the actual graph data, labels, and readability unchanged.
   * Apply this consistently across all Analytics graphs.

4. **Scroll to Top When Switching Tabs**

   * Whenever the user switches between Dashboard tabs/pages, automatically start the newly selected page at the **top**.
   * Reset the scroll position when navigating to a different dashboard tab.
   * Do not retain the previous tab's scroll position.
   * Apply this to both Simple and Advanced Dashboard modes.

5. **Delivery Tab — Functional Statistics**

   * Fix the Delivery tab statistics that currently display `0`.
   * Connect the statistics to the actual delivery/order data.
   * Show accurate values for relevant metrics such as:

     * Pending
     * Ready for Dispatch
     * Assigned
     * Out for Delivery
     * Delivered
     * Cancelled
   * Ensure the numbers update when delivery/order statuses change.
   * Keep Simple and Advanced Dashboard data synchronized.

6. **Orders Header Actions**

   * Move the **Export**, **Refresh**, and **New Order** buttons to the **right side of the Orders heading**.
   * Keep them aligned horizontally with the Order Management heading.
   * Maintain proper spacing and responsive behavior.
   * Do not change their existing functionality.

### Final Verification

Test both **Simple and Advanced Dashboard** modes.

Verify:

**Orders → Open Modal → Accept → Preparing → Dispatch/Rider Assignment → Delivered**

Also verify cancellation confirmation, delivery statistics, tab scroll reset, graph styling, header action alignment, and that the Simple Dashboard never becomes stuck or unresponsive.
