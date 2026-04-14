// Test script for Admin Category Management
// This tests all category API endpoints

const API_URL = 'http://localhost:5000/api';

// Store admin token for authenticated requests
let adminToken = null;
let categoryId = null;

const log = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : '→';
    const color = type === 'success' ? '\x1b[32m' : type === 'error' ? '\x1b[31m' : '\x1b[36m';
    console.log(`${color}[${timestamp}] ${prefix} ${message}\x1b[0m`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testCategoryAPI() {
    try {
        log('Starting Admin Category Management Tests');
        log('=========================================', 'info');

        // Step 1: Login as admin to get token
        log('Step 1: Admin Login', 'info');
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            adminToken = loginData.token;
            log(`Admin login successful. Token received.`, 'success');
        } else {
            log(`Admin login failed. Status: ${loginResponse.status}`, 'error');
            log('Make sure an admin user exists with email: admin@example.com and password: admin123', 'error');
            return;
        }

        // Step 2: Get all categories
        log('\nStep 2: Get All Categories', 'info');
        const getCategoriesResponse = await fetch(`${API_URL}/categories`);
        if (getCategoriesResponse.ok) {
            const categories = await getCategoriesResponse.json();
            log(`Retrieved ${categories.length} categories`, 'success');
            categories.forEach(cat => {
                log(`  - ${cat.name} (${cat.subcategories?.length || 0} subcategories)`);
            });
        } else {
            log(`Failed to get categories. Status: ${getCategoriesResponse.status}`, 'error');
        }

        // Step 3: Create a new category
        log('\nStep 3: Create New Category', 'info');
        const newCategoryData = {
            name: `Test Category ${Date.now()}`,
            description: 'This is a test category created by the admin',
            image: 'https://via.placeholder.com/300x200?text=Category',
            subcategories: [
                { name: 'Subcategory 1' },
                { name: 'Subcategory 2' }
            ]
        };

        const createResponse = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(newCategoryData)
        });

        if (createResponse.ok) {
            const createdCategory = await createResponse.json();
            categoryId = createdCategory.category._id;
            log(`Category created successfully with ID: ${categoryId}`, 'success');
            log(`  - Name: ${createdCategory.category.name}`);
            log(`  - Subcategories: ${createdCategory.category.subcategories.length}`);
        } else {
            const error = await createResponse.json();
            log(`Failed to create category. Error: ${error.error}`, 'error');
            return;
        }

        // Step 4: Get single category
        log('\nStep 4: Get Single Category', 'info');
        const getSingleResponse = await fetch(`${API_URL}/categories/${categoryId}`);
        if (getSingleResponse.ok) {
            const category = await getSingleResponse.json();
            log(`Retrieved category: ${category.name}`, 'success');
            log(`  - Description: ${category.description}`);
            log(`  - Subcategories: ${category.subcategories.map(s => s.name).join(', ')}`);
        } else {
            log(`Failed to get category. Status: ${getSingleResponse.status}`, 'error');
        }

        // Step 5: Update category
        log('\nStep 5: Update Category', 'info');
        const updateData = {
            name: `${newCategoryData.name} - Updated`,
            description: 'Updated description for the test category'
        };

        const updateResponse = await fetch(`${API_URL}/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(updateData)
        });

        if (updateResponse.ok) {
            const updatedCategory = await updateResponse.json();
            log(`Category updated successfully`, 'success');
            log(`  - New name: ${updatedCategory.category.name}`);
            log(`  - New description: ${updatedCategory.category.description}`);
        } else {
            const error = await updateResponse.json();
            log(`Failed to update category. Error: ${error.error}`, 'error');
        }

        // Step 6: Add subcategory
        log('\nStep 6: Add Subcategory', 'info');
        const subResponse = await fetch(`${API_URL}/categories/${categoryId}/subcategories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ subcategoryName: 'New Subcategory' })
        });

        if (subResponse.ok) {
            const updated = await subResponse.json();
            log(`Subcategory added successfully`, 'success');
            log(`  - Total subcategories: ${updated.category.subcategories.length}`);
        } else {
            const error = await subResponse.json();
            log(`Failed to add subcategory. Error: ${error.error}`, 'error');
        }

        // Step 7: Verify category was updated
        log('\nStep 7: Verify Updated Category', 'info');
        const verifyResponse = await fetch(`${API_URL}/categories/${categoryId}`);
        if (verifyResponse.ok) {
            const category = await verifyResponse.json();
            log(`Category verified`, 'success');
            log(`  - Name: ${category.name}`);
            log(`  - Subcategories: ${category.subcategories.map(s => s.name).join(', ')}`);
        }

        // Step 8: Delete category
        log('\nStep 8: Delete Category', 'info');
        const deleteResponse = await fetch(`${API_URL}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (deleteResponse.ok) {
            log(`Category deleted successfully`, 'success');
        } else {
            const error = await deleteResponse.json();
            log(`Failed to delete category. Error: ${error.error}`, 'error');
        }

        // Step 9: Verify deletion
        log('\nStep 9: Verify Deletion', 'info');
        const verifyDeleteResponse = await fetch(`${API_URL}/categories/${categoryId}`);
        if (verifyDeleteResponse.status === 404) {
            log(`Category successfully deleted and cannot be found`, 'success');
        } else {
            log(`Category still exists after delete`, 'error');
        }

        log('\n=========================================', 'info');
        log('All category management tests completed!', 'success');

    } catch (error) {
        log(`Test error: ${error.message}`, 'error');
        console.error(error);
    }
}

// Run tests
log('Setting up admin category management tests...');
log('Make sure the backend is running on http://localhost:5000');
log('Waiting 2 seconds before starting tests...\n');

setTimeout(testCategoryAPI, 2000);
