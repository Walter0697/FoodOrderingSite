# Food Ordering Site

### 🏁 Introduction

-   This project is for marking down the preferred order snack for our companies, so that we can check on the current budget from our finance department, making sure not to pass it while satisfying every staffs' needs.

### 🧳 Planned Feature

-   ✅ Fetching information from Snack Ordering Company
-   ✅ Calculating total
-   ✅ lock form for +/- 1 month
-   ✅ lock form whenever admin is purchasing
-   ✅ lock form when the form is ordered
-   ✅ expected delivery date, actual price and extra notes for reasonings
-   ✅ Status for Monthly Ordering
-   ✅ Reminder for ordering to prevent overflow
-   [] Watch history price for the current product
-   ✅ Adding company from for product
-   ✅ History summary page

### 🐜 Limitation

-   Middleware does not work as expected in Next.js 13, it forces all routes to have the same middleware, resulting in server side code broken in client side. So I have to use a workaround to mock a middleware behaviour.
