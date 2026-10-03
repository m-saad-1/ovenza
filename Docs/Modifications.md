Implement the following fixes without changing unrelated design or functionality:

1. Modals — Mobile & Desktop

* Mobile: Ensure every modal is fully visible within the viewport with proper top spacing on all screen sizes.
* Apply this to Search, Order Confirmation, and all other modals.
* If modal content exceeds the available height, keep the modal size within the viewport and make only the modal content scrollable.
* Desktop: For the Order Confirmation modal, hide the website header behind/within the modal view.
* Keep the desktop modal size fixed; if content exceeds the available height, add an internal scrollbar instead of increasing the modal from the top or bottom.
* Ensure no modal causes page overflow or gets clipped.

2. Desktop Side Spacing

* Remove the unnecessary side-wall/cutter constraints.
* Content such as review cards, tabs, and other sections must not be cut off on the left or right.
* Ensure proper responsive width and horizontal spacing across desktop screen sizes.

3. Mobile Reviews & WhatsApp

* On the mobile Home page, display all customer reviews as text and move them below the “Rate Us” section.
* On the Reviews page, temporarily hide the “Submit Review” button.
* Use the same WhatsApp icon/asset from the header Contact modal in the Home page Contact section.

4. Mobile Menu & Social Indicator

* On the mobile Menu page, make the category bar touch/align closely with the header.
* Slightly soften the social indicator border line in dark mode.

5. Footer Social Icons

* Match the footer social icon colors with the social icons used in the hamburger menu.
* Add all available social icons to the footer.

6. Modal Scrolling & Back Behavior

* When a modal has internal scrolling, prevent the background page from scrolling.
* Scrolling must remain limited to the active modal.
* Back buttons must correctly close the current modal or return to the previous modal/page state instead of navigating unexpectedly.

7. Dark Mode Visibility

* Fix all badges, icons, and small UI elements that have poor visibility in dark mode.
* Ensure proper background, border, and text contrast.
* Pay particular attention to:

  * Menu modal category badges
  * About page badges
  * About page icons
  * Other badges/icons currently missing a visible background
* Do not use harsh white backgrounds or borders; keep the existing dark theme aesthetic while making every element clearly visible.

Verify all changes on mobile and desktop, including different viewport sizes. Do not introduce horizontal overflow, clipping, layout shifts, or regressions.
