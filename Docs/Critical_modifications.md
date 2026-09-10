### Dashboard Modifications

Implement the following changes while preserving the existing dashboard design, functionality, and responsiveness.

1. **Sidebar Counters**

   * Add notification/order counters to relevant sidebar tabs such as:

     * Orders
     * Reservations
     * Delivery
     * Other tabs where a count/status indicator is useful.
   * Use **number badges** where an actual count is meaningful.
   * For some tabs, use only a **small notification dot** instead of a number.
   * Keep badges compact and visually consistent with the sidebar.

2. **POS Menu Items**

   * Remove the visible scrollbar from the POS menu-items container.
   * Keep the existing horizontal scrolling functionality.
   * Users should still be able to scroll/swipe through the menu items without seeing a scrollbar.

3. **Content & Media Management**

   * Under **Offer Images**, add all offer images currently used in the existing demo.
   * Keep the **exact existing demo names** for each offer.
   * Ensure these images are actually connected to the relevant offer content instead of being static placeholders.
   * Under **Gallery**, add all media currently used in the website's Gallery section.
   * Connect the Gallery management tab to the actual **Gallery page**, so changes made in the dashboard are reflected on the website.
   * In the **Contact** section, display the currently selected **branch name**.
   * Have **one branch selected by default**.
   * When the user attempts to switch to another branch, require **branch credentials/authentication** before allowing the switch.
   * Keep the selected branch state consistent across relevant dashboard sections.

4. **About Panel Button**

   * Add a new **“About Panel”** floating/juggling button at the bottom-right.
   * On mobile, position it directly **above the “Open on Desktop” button**.
   * Remove the juggling/attention animation from the **“Open on Desktop”** button.
   * The new **About Panel** button should be the only one using the juggling/attention animation.
   * Clicking **About Panel** should open a professional informational modal explaining:

     * What this admin panel/dashboard is.
     * What the different dashboard capabilities are.
     * How the panel can be customized for each restaurant/business.
     * That the restaurant will receive only the features and services relevant to its business needs.
     * How modules, workflows, branding, permissions, and functionality can be tailored to the restaurant.
   * Keep the modal fully responsive and properly styled in both Light and Dark modes.
   * Ensure the button/modal does not overlap the chatbot, cart, footer, or other floating controls.

### Final Verification

Verify all changes on desktop and mobile. Ensure counters, branch selection/authentication, media connections, floating buttons, and the About Panel modal are fully functional—not just visual mockups.
