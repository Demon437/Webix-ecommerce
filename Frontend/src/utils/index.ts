export function createPageUrl(pageName: string) {
    // Handle admin pages: AdminDashboard -> /admin/dashboard
    if (pageName.startsWith('Admin')) {
        const withoutAdmin = pageName.replace('Admin', '');
        const kebab = withoutAdmin
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // Add dash before capital letters
            .toLowerCase();
        return `/admin/${kebab}`;
    }
    // Handle home page
    if (pageName === 'Home') {
        return '/';
    }
    return '/' + pageName.replace(/ /g, '-');
}

// Currency conversion rate: 1 USD = 83.5 INR
const USD_TO_INR_RATE = 83.5;

export function formatPriceINR(price: number): string {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}
export function convertDollarToRupees(priceInDollars: number): number {
    return priceInDollars * USD_TO_INR_RATE;
}