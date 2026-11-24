# FixIt Project Details

## What is FixIt?
FixIt is a dedicated platform designed to connect users who need electronic repairs (smartphones, tablets, PCs, and laptops) with trusted, local repair shops. 

It serves a dual purpose:
1. **For Customers:** It provides an easy way to search for shops based on location, device type, and ratings, request repairs, and track the status of their devices.
2. **For Repair Shops:** It acts as a comprehensive management tool to showcase their portfolio, manage incoming service requests, track active repair tasks, and build their reputation through customer reviews.

---

## User Roles & Capabilities

The platform is divided into three distinct user experiences based on their role:

### 1. Visitor (Unauthenticated User)
A visitor is someone who lands on the platform but hasn't created an account or logged in yet.

**What they can do:**
- **Explore the Platform:** View the landing page to understand what FixIt offers.
- **Search for Shops:** Use the advanced search page to find repair shops. They can filter by location (Wilaya/City), device type (Phone/Tablet or PC/Laptop), and minimum rating.
- **View Shop Profiles:** Browse a shop's public profile, which includes their "About Us" section, portfolio of past repairs, working hours, supported devices(phone / pc ) location on the map, and customer reviews.
- **Authentication:** Register a new account (as a customer or a shop) or log in to an existing account.

**Available Pages:**
- `LandingPage`
- `Search`
- `ShopPublicProfile`
- `Login`
- `Register`

---

### 2. Customer (Authenticated User)
A customer is a registered user looking to get their devices repaired.

**What they can do:**
- **Dashboard Overview:** View a summary of their repair activities,search for shops , recent requests, and statistics.
- **Send Repair Requests:** Contact a specific shop directly from their profile to request a repair, providing details about the device model, the problem, and optional photo attachments.
- **Manage Devices & Repairs:** Track the status of their current and past repair requests in the "My Devices" section.
- **Save Shops:** Bookmark favorite or trusted shops for quick access later,also they can add a note to remember this shop(great for screen fix).
- **Leave & Manage Reviews:** Write reviews for shops after a repair is completed, and manage their past feedback in the Review History.
- **Profile Management:** Update their personal information, password, and avatar and option to delete there account .

**Available Pages:**
- `Dashboard`
- `SendRequest`
- `MyDevices`
- `SavedShops`
- `LeaveReview`
- `ReviewHistory`
- `Profile` (Settings)

---

### 3. Shop (Service Provider)
A shop is a registered repair business offering services to customers on the platform.

**What they can do:**
- **Manage Public Profile:** Setup their storefront. They can upload portfolio images, write a description, and define their supported devices,and working hours.
- **Handle Service Requests:** Receive, review, and accept/reject incoming repair requests from customers.
- **Track Active Tasks:** Manage their ongoing repairs, updating statuses so customers know the progress of their devices,and add notes with the status to the customer.
- **Manage Reviews:** View what customers are saying about their services and report the reviews if its not real or not from a real customer.
- **Shop Settings:** Configure their working hours, exact map location, contact information (phone, email, WhatsApp), and manage their account security.
- **Account Management:** Option to delete the shop account if they no longer wish to use the platform.

**Available Pages:**
- `ShopProfile` (Dashboard / Overview)
- `ServiceRequests`
- `ActiveTasks`
- `CustomerReviews`
- `Settings`
- `DeleteAccount`

---

## Technical Architecture (Frontend)
- **Framework:** React.js (with React Router for navigation).
- **Styling:** CSS Modules with a centralized design system using CSS Variables (`index.css`) for a consistent dark-mode aesthetic (featuring cyan and amber accents).
- **Icons:** FontAwesome.
- **Structure:** 
  - `src/pages`: Grouped logically by role (`visitor`, `customer`, `shop`).
  - `src/components`: Reusable UI elements, navigation bars (role-specific), and page-specific components.
  - `src/constants`: Static data like Algerian Wilayas and Cities for location filtering.

This separation of concerns ensures that the application is scalable, maintainable, and provides tailored experiences securely based on the user's role.
