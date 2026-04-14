// Test script to verify subcategories are being saved and fetched correctly

const API_URL = 'http://localhost:5000/api';
let adminToken = null;
let testCategoryId = null;

const log = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : '→';
    const color = type === 'success' ? '\x1b[32m' : type === 'error' ? '\x1b[31m' : '\x1b[36m';
    console.log(`${color}[${timestamp}] ${prefix} ${message}\x1b[0m`);
};

async function testSubcategories() {
    try {
        log('Starting Subcategory Test Suite', 'info');
        log('=========================================', 'info');

        // Step 1: Admin Login
        log('Step 1: Admin Login', 'info');
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });

        if (!loginResponse.ok) {
            log(`Login failed. Status: ${loginResponse.status}`, 'error');
            return;
        }

        const loginData = await loginResponse.json();
        adminToken = loginData.token;
        log(`Admin login successful`, 'success');

        // Step 2: Create category WITH subcategories
        log('\nStep 2: Create Category WITH Subcategories', 'info');
        const testCategoryName = `Test Category ${Date.now()}`;
        const testSubcategories = [
            { name: 'Subcategory 1' },
            { name: 'Subcategory 2' },
            { name: 'Subcategory 3' }
        ];

        log(`Creating category: "${testCategoryName}"`, 'info');
        log(`With ${testSubcategories.length} subcategories:`, 'info');
        testSubcategories.forEach((sub, idx) => {
            log(`  ${idx + 1}. ${sub.name}`);
        });

        const createResponse = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                name: testCategoryName,
                description: 'Test category with subcategories',
                image: '',
                subcategories: testSubcategories
            })
        });

        const createData = await createResponse.json();

        if (!createResponse.ok) {
            log(`Failed to create category. Error: ${createData.error}`, 'error');
            log(`Response status: ${createResponse.status}`, 'error');
            console.log('Response data:', createData);
            return;
        }

        testCategoryId = createData.category._id;
        log(`Category created successfully with ID: ${testCategoryId}`, 'success');

        // Check if subcategories were saved
        if (createData.category.subcategories && createData.category.subcategories.length > 0) {
            log(`✓ Subcategories saved in response: ${createData.category.subcategories.length}`, 'success');
            createData.category.subcategories.forEach((sub, idx) => {
                log(`  ${idx + 1}. ${sub.name} (ID: ${sub._id})`);
            });
        } else {
            log(`✗ NO subcategories in response!`, 'error');
            log(`Response category data:`, 'error');
            console.log(createData.category);
        }

        // Step 3: Fetch the category to verify subcategories persisted
        log('\nStep 3: Fetch Category to Verify Subcategories Persisted', 'info');
        const fetchResponse = await fetch(`${API_URL}/categories/${testCategoryId}`);
        const fetchData = await fetchResponse.json();

        if (!fetchResponse.ok) {
            log(`Failed to fetch category. Status: ${fetchResponse.status}`, 'error');
            return;
        }

        log(`Category fetched: "${fetchData.name}"`, 'success');

        if (fetchData.subcategories && fetchData.subcategories.length > 0) {
            log(`✓ Subcategories retrieved from DB: ${fetchData.subcategories.length}`, 'success');
            fetchData.subcategories.forEach((sub, idx) => {
                log(`  ${idx + 1}. ${sub.name} (ID: ${sub._id})`);
            });
        } else {
            log(`✗ NO subcategories found in DB!`, 'error');
            log(`Fetched category data:`, 'error');
            console.log(fetchData);
        }

        // Step 4: Get all categories and check subcategories
        log('\nStep 4: Get All Categories and Check Subcategories', 'info');
        const allCatsResponse = await fetch(`${API_URL}/categories`);
        const allCats = await allCatsResponse.json();

        const testCat = allCats.find(c => c._id === testCategoryId);
        if (testCat) {
            log(`Found test category in all categories list`, 'success');
            if (testCat.subcategories && testCat.subcategories.length > 0) {
                log(`✓ Subcategories in list: ${testCat.subcategories.length}`, 'success');
                testCat.subcategories.forEach((sub, idx) => {
                    log(`  ${idx + 1}. ${sub.name}`);
                });
            } else {
                log(`✗ NO subcategories in list!`, 'error');
            }
        } else {
            log(`✗ Test category NOT found in all categories list!`, 'error');
        }

        // Step 5: Test database query directly
        log('\nStep 5: Raw MongoDB Data Check', 'info');
        const mongoResponse = await fetch(`${API_URL}/categories/${testCategoryId}/raw`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        }).catch(() => null);

        if (mongoResponse && mongoResponse.ok) {
            const mongoData = await mongoResponse.json();
            log(`Raw MongoDB data:`, 'info');
            console.log(JSON.stringify(mongoData, null, 2));
        }

        // Step 6: Delete test category
        log('\nStep 6: Clean Up - Delete Test Category', 'info');
        const deleteResponse = await fetch(`${API_URL}/categories/${testCategoryId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (deleteResponse.ok) {
            log(`Test category deleted successfully`, 'success');
        } else {
            log(`Failed to delete test category`, 'error');
        }

        log('\n=========================================', 'info');
        log('Subcategory Test Suite Completed!', 'success');

    } catch (error) {
        log(`Test error: ${error.message}`, 'error');
        console.error(error);
    }
}

// Run tests with delay
log('Setting up subcategory tests...');
log('Waiting for backend to be ready...\n');
setTimeout(testSubcategories, 2000);
