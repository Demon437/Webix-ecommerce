import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, LogOut, X, Check } from 'lucide-react';

const AdminCategories = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        subcategories: []
    });
    const [newSubcategory, setNewSubcategory] = useState('');
    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        } else {
            fetchCategories();
        }
    }, [user, navigate]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('You must be logged in to manage categories. Please refresh and login again.');
        }

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Category name is required');
            return;
        }

        try {
            setError(null);

            if (editingId) {
                // Update existing category details (name, description, image)
                const response = await fetch(`${API_BASE_URL}/categories/${editingId}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        description: formData.description.trim(),
                        image: formData.image.trim(),
                        subcategories: formData.subcategories.filter(sub => sub._id) // Only send existing subcategories
                    })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to update category');
                }

                // Add new subcategories one by one using the dedicated endpoint
                const newSubcategories = formData.subcategories.filter(sub => !sub._id);
                for (const sub of newSubcategories) {
                    const subResponse = await fetch(`${API_BASE_URL}/categories/${editingId}/subcategories`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ subcategoryName: sub.name })
                    });

                    const subData = await subResponse.json();
                    if (!subResponse.ok) {
                        throw new Error(subData.error || 'Failed to add subcategory');
                    }
                }

                setSuccessMessage('Category updated successfully!');
            } else {
                // Create new category
                const response = await fetch(`${API_BASE_URL}/categories`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        description: formData.description.trim(),
                        image: formData.image.trim(),
                        subcategories: formData.subcategories.map(sub => ({ name: sub.name }))
                    })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create category');
                }

                setSuccessMessage('Category added successfully!');
            }

            setTimeout(() => setSuccessMessage(''), 3000);
            setFormData({ name: '', description: '', image: '', subcategories: [] });
            setShowForm(false);
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            setError(err.message);
            console.error('Error saving category:', err);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to delete category');

            setSuccessMessage('Category deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchCategories();
        } catch (err) {
            setError(err.message);
            console.error('Error deleting category:', err);
        }
    };

    const handleEditCategory = (category) => {
        setFormData({
            name: category.name,
            description: category.description || '',
            image: category.image || '',
            subcategories: category.subcategories || []
        });
        setEditingId(category._id);
        setShowForm(true);
    };

    const handleAddSubcategory = () => {
        if (newSubcategory.trim()) {
            setFormData(prev => ({
                ...prev,
                subcategories: [...prev.subcategories, { name: newSubcategory.trim() }]
            }));
            setNewSubcategory('');
        }
    };

    const handleRemoveSubcategory = async (index) => {
        const subcategoryToRemove = formData.subcategories[index];

        // If it's an existing subcategory with an _id, delete it from the database
        if (subcategoryToRemove._id && editingId) {
            if (!window.confirm('Are you sure you want to remove this subcategory?')) return;

            try {
                const response = await fetch(`${API_BASE_URL}/categories/${editingId}/subcategories/${subcategoryToRemove._id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to remove subcategory');
                }

                setSuccessMessage('Subcategory removed successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                setError(err.message);
                console.error('Error removing subcategory:', err);
                return;
            }
        }

        // Remove from form
        setFormData(prev => ({
            ...prev,
            subcategories: prev.subcategories.filter((_, i) => i !== index)
        }));
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-700 p-6 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Category Management</h1>
                        <p className="text-blue-100 mt-2">Manage your store categories</p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="flex items-center gap-2"
                    >
                        <LogOut size={18} />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Add Category Button */}
                {!showForm && (
                    <Button
                        onClick={() => {
                            setShowForm(true);
                            setEditingId(null);
                            setFormData({ name: '', description: '', image: '', subcategories: [] });
                        }}
                        className="mb-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        Add New Category
                    </Button>
                )}

                {/* Add/Edit Form */}
                {showForm && (
                    <Card className="mb-8 bg-white">
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit Category' : 'Add New Category'}</CardTitle>
                            <CardDescription>
                                Fill in the details below to {editingId ? 'update' : 'create'} a category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddCategory} className="space-y-4">
                                {/* Category Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Name *
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Electronics, Clothing, Home & Garden"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe this category..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image URL
                                    </label>
                                    <Input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                {/* Subcategories */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subcategories
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <Input
                                            type="text"
                                            value={newSubcategory}
                                            onChange={(e) => setNewSubcategory(e.target.value)}
                                            placeholder="Enter subcategory name"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddSubcategory();
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddSubcategory}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    {/* Subcategories List */}
                                    {formData.subcategories.length > 0 && (
                                        <div className="space-y-2">
                                            {formData.subcategories.map((sub, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200"
                                                >
                                                    <span className="text-sm text-gray-700">
                                                        {sub.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSubcategory(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Check size={18} />
                                        {editingId ? 'Update Category' : 'Add Category'}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingId(null);
                                            setFormData({
                                                name: '',
                                                description: '',
                                                image: '',
                                                subcategories: []
                                            });
                                        }}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Categories List */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Categories ({categories.length})
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : categories.length === 0 ? (
                        <Card className="bg-white">
                            <CardContent className="p-8 text-center">
                                <p className="text-gray-500">No categories found. Add one to get started!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <Card key={category._id} className="bg-white hover:shadow-lg transition">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-1">
                                                    {category.name}
                                                </CardTitle>
                                                <CardDescription className="text-sm">
                                                    {category.description || 'No description'}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Category Image */}
                                        {category.image && (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-32 object-cover rounded"
                                            />
                                        )}

                                        {/* Subcategories */}
                                        {category.subcategories && category.subcategories.length > 0 && (
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                                    Subcategories ({category.subcategories.length}):
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {category.subcategories.map((sub, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                                                        >
                                                            {sub.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        <div className="text-xs text-gray-500 pt-2 border-t">
                                            <p>Added: {new Date(category.createdAt).toLocaleDateString()}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                onClick={() => handleEditCategory(category)}
                                                size="sm"
                                                className="flex-1 bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2"
                                            >
                                                <Edit2 size={16} />
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteCategory(category._id)}
                                                size="sm"
                                                variant="destructive"
                                                className="flex-1 flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
