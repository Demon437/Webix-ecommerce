const test = (pageName) => {
    const withoutAdmin = pageName.replace('Admin', '');
    const kebab = withoutAdmin
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
    return `/admin/${kebab}`;
};

console.log('AdminDashboard -> ' + test('AdminDashboard'));
console.log('AdminProducts -> ' + test('AdminProducts'));
console.log('AdminOrders -> ' + test('AdminOrders'));
console.log('AdminUsers -> ' + test('AdminUsers'));
