Remove the Simple Dashboard completely. Keep only the Advanced Dashboard and remove the Dashboard Mode option from Settings.

1. Theme Toggle & Synchronization

* Fix the theme toggle; it is currently not working reliably.
* The Web and Dashboard must use the same global theme state.
* Toggling the theme from either the website or dashboard must immediately update both.
* Synchronize the Dashboard header toggle and Settings tab toggle.
* All theme toggles must remain synchronized and persist correctly.

2. Dashboard Header & Logo

* Remove the logo text from the dashboard header.
* Enlarge the logo to properly fill its available area while maintaining its aspect ratio.
* Align it correctly from the left side with proper spacing.
* Make its sizing and behavior consistent with the website header logo.

3. Sidebar & Global Scrollbars

* Make the sidebar scrollbar significantly thinner.
* Hide the scrollbar up/down arrows.
* Reduce the scrollbar thumb height so it takes up less space.
* Use the same thin scrollbar style for the POS Current Order card and other scrollable dashboard components.
* Reduce the sidebar width slightly from the right side while maintaining usability.

4. POS & Menu Cards

* Reduce the category tab width from the right side.
* Size each category based on its text, but never allow it to exceed 10 characters in visible width.
* If a category exceeds the limit, fade/clip the final characters cleanly.
* Hide the Add button from menu cards.
* Reduce unnecessary spacing between menu-card content.
* Combo/Deal cards should display their description.
* Other menu cards should not display descriptions.
* Remove the unused description area from those cards completely so the cards become more compact.
* Reduce the size of Available and other status badges while keeping them clearly readable.

5. Stats & Section UI
   Improve the styling of the statistics/cards and make them clean, professional, compact, and consistent across:

* Delivery
* Orders — keep key information on one line where possible; reduce content size where appropriate
* Customers
* Loyalty
* Reviews
* Analytics
* HR & Staff
* Finance & P&L

Avoid oversized cards, excessive whitespace, unnecessary decoration, or inconsistent typography.

6. Header Search & Notifications

* Make the dashboard search bar compact by default.
* When clicked/focused, smoothly expand it.
* When clicking outside, collapse it back to its compact state.
* If the notification card is open, clicking outside it should close it.
* Ensure these interactions work correctly on desktop and mobile without layout shifts.

7. Orders

* On desktop, display 3 order cards per row where the available width allows.
* Keep the cards compact and readable.
* In Order Details, show the actual price for every individual item.
* Display the corresponding item images.
* Ensure totals and item-level pricing are accurate and consistent with the actual order data.

8. Dark Mode

* Fix all badges, status indicators, and icons with poor visibility in dark mode.
* Ensure proper background/text/icon contrast without introducing harsh white elements.
* Make the close/cross (×) icon white and clearly visible everywhere in dark mode and wherever required by the theme.

9. Order Management Workflow
   Review the complete order-status workflow and simplify it for fast order-manager operation.

* Order managers should be able to directly advance an order to the next appropriate status without unnecessarily depending on another staff role/action.
* For example, if an order is sent to Preparing, the Order Manager should have direct access to the next valid action instead of waiting for a separate kitchen action when appropriate.
* Preserve the KDS/Kitchen workflow and synchronization, but do not create unnecessary blocking dependencies.
* Clearly define valid next actions based on the current order status.
* Keep actions simple, fast, and logically ordered.
* Ensure every status/action remains synchronized between Orders, Order Details, KDS, delivery, and the customer-facing order tracking.

Do not redesign unrelated parts of the dashboard. Preserve existing functionality and data. Verify all changes across desktop/mobile, light/dark themes, scrolling states, modals, and order-status transitions.
