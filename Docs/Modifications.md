Implement the following changes while preserving the existing design and functionality:

1. Home Page → Menu/Home
- Make the current Menu page the new Home page.
- Use `meldough/index.html` as the new Home/Menu page.
- Keep `meldough/pages/other.html` for the other page content/routes.
- The new Home/Menu page should contain all product categories currently available on the Menu page.
- Keep the category tab bar and behavior exactly like the current Menu page.
- Keep the App Install, Reviews, and Contact sections on this page.
- Keep only the main hero image; remove any additional/duplicate hero offer images.

2. Menu/Product Cards
- On the new Home/Menu page, show all menu categories and products.
- Use the **Home page card design** for the product cards.
- Remove descriptions from the main product cards.
- Reduce unnecessary spacing/content gaps to make the cards more compact.
- Keep the product description inside the **menu item modal** only.
- Do not remove or modify the modal description.

3. Mobile Bottom Navigation
Replace the current bottom navigation with exactly:
- Menu
- Offers
- Orders
- Search
- Profile

- Remove the Home icon completely.
- The Menu icon should represent the new Home/Menu page.
- Move Search from the header/floating mobile area into the bottom navigation.
- Search must behave exactly like the existing Search functionality.
- Remove the old mobile/header Search control so there is only one Search entry in the bottom navigation.

4. General
- The new Home/Menu page should feel like a unified restaurant ordering homepage rather than a separate traditional Menu page.
- Preserve the existing category navigation, ordering flow, cart, modals, reviews, contact, and app-install functionality.
- Ensure desktop and mobile layouts remain responsive.
- Do not introduce duplicate navigation, search controls, hero images, or category sections.