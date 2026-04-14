import React, { useEffect, useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const AddProductModal = ({ isOpen, onClose, onSuccess, categories = [], onCategoriesUpdated, product }) => {
    const [loading, setLoading] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [newCategorySubcategories, setNewCategorySubcategories] = useState([]);
    const [newSubcategoryInput, setNewSubcategoryInput] = useState('');
    const [addingCategory, setAddingCategory] = useState(false);
    const [showAddSubcategory, setShowAddSubcategory] = useState(false);
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [showAddSubcategoryForm, setShowAddSubcategoryForm] = useState(false);
    const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState('');
    const [newSubcategoryInputName, setNewSubcategoryInputName] = useState('');
    const [addingSubcategory, setAddingSubcategory] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        subcategory: '',
        brand: '',
        colors: [],
        sizes: [],
        material: '',
        fit: 'regular',
        is_featured: false,
        is_best_seller: false,
        is_trending: false,
        images: []
    });

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || "",
                description: product.description || "",
                price: product.price || "",
                stock: product.stock || "",
                category: product.category?._id || "",
                subcategory: product.subcategory || "",
                brand: product.brand || "",
                colors: product.colors || [],
                sizes: product.sizes || [],
                material: product.material || "",
                fit: product.fit || "regular",
                is_featured: product.is_featured || false,
                is_best_seller: product.is_best_seller || false,
                is_trending: product.is_trending || false,
                images: product.images || []
            });

            // 🔥 load subcategories also
            const selectedCat = categories.find(c => c._id === product.category?._id);
            if (selectedCat?.subcategories) {
                setSubcategories(selectedCat.subcategories);
            }
        }
    }, [product, categories]);

    const [imageInput, setImageInput] = useState('');
    const [colorInput, setColorInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fitOptions = ['slim', 'regular', 'loose', 'custom'];

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('You must be logged in as an admin to perform this action. Please refresh and log in again.');
        }

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            setError('Category name is required');
            return;
        }

        try {
            setAddingCategory(true);
            setError('');

            const payload = {
                name: newCategoryName.trim(),
                description: newCategoryDescription.trim(),
                image: ''
            };

            console.log('📤 Sending Category Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            console.log('📥 Category Response:', JSON.stringify(responseData, null, 2));

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to create category');
            }

            setSuccess(`Category "${newCategoryName}" added successfully!`);
            setTimeout(() => setSuccess(''), 3000);
            setNewCategoryName('');
            setNewCategoryDescription('');
            setNewCategorySubcategories([]);
            setNewSubcategoryInput('');
            setShowAddCategory(false);

            // Force refresh categories with a small delay to ensure database is updated
            if (onCategoriesUpdated) {
                console.log('🔄 Refreshing categories list...');
                setTimeout(() => {
                    onCategoriesUpdated();
                }, 500); // Wait 500ms for database to persist
            }
        } catch (err) {
            setError(err.message || 'Error adding category');
            console.error('❌ Error adding category:', err);
        } finally {
            setAddingCategory(false);
        }
    };

    const handleAddSubcategoryToCategory = async (e) => {
        e.preventDefault();
        if (!selectedCategoryForSubcategory.trim()) {
            setError('Please select a category');
            return;
        }
        if (!newSubcategoryInputName.trim()) {
            setError('Subcategory name is required');
            return;
        }

        try {
            setAddingSubcategory(true);
            setError('');

            const payload = {
                subcategoryName: newSubcategoryInputName.trim()
            };

            console.log('📤 Sending Subcategory Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(`http://localhost:5000/api/categories/${selectedCategoryForSubcategory}/subcategories`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            console.log('📥 Subcategory Response:', JSON.stringify(responseData, null, 2));

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to add subcategory');
            }

            setSuccess(`Subcategory "${newSubcategoryInputName}" added successfully!`);
            setTimeout(() => setSuccess(''), 3000);
            setNewSubcategoryInputName('');
            setSelectedCategoryForSubcategory('');
            setShowAddSubcategoryForm(false);

            // Refresh categories if needed
            if (onCategoriesUpdated) {
                console.log('🔄 Refreshing categories list...');
                setTimeout(() => {
                    onCategoriesUpdated();
                }, 500);
            }
        } catch (err) {
            setError(err.message || 'Error adding subcategory');
            console.error('❌ Error adding subcategory:', err);
        } finally {
            setAddingSubcategory(false);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setFormData(prev => ({
            ...prev,
            category: categoryId,
            subcategory: ''
        }));

        const category = categories.find(c => c._id === categoryId);
        if (category && category.subcategories) {
            setSubcategories(category.subcategories);
        } else {
            setSubcategories([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file input for images (max 4 images)
    const handleImageFileInput = (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = 4 - formData.images.length;

        if (remainingSlots <= 0) {
            setError('Maximum 4 images allowed. Please remove some images to add more.');
            return;
        }

        const filesToAdd = files.slice(0, remainingSlots);

        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, event.target.result]
                }));
            };
            reader.readAsDataURL(file);
        });

        if (files.length > remainingSlots) {
            setError(`Only ${remainingSlots} image(s) can be added. Maximum 4 images allowed.`);
        }
    };

    const addImage = () => {
        if (formData.images.length >= 4) {
            setError('Maximum 4 images allowed');
            return;
        }
        if (imageInput.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageInput.trim()]
            }));
            setImageInput('');
            setError(''); // Clear error if previously set
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addColor = () => {
        if (colorInput.trim()) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, colorInput.trim()]
            }));
            setColorInput('');
        }
    };

    const removeColor = (index) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const addSize = () => {
        if (sizeInput.trim()) {
            setFormData(prev => ({
                ...prev,
                sizes: [...prev.sizes, sizeInput.trim()]
            }));
            setSizeInput('');
        }
    };

    const removeSize = (index) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.title.trim()) {
            setError('Product title is required');
            return;
        }
        if (!formData.price || formData.price <= 0) {
            setError('Valid price is required');
            return;
        }
        if (!formData.stock || formData.stock < 0) {
            setError('Valid stock is required');
            return;
        }
        if (!formData.category) {
            setError('Category is required');
            return;
        }
        if (formData.images.length === 0) {
            setError('At least 1 image is required');
            return;
        }
        if (formData.images.length > 4) {
            setError('Maximum 4 images allowed');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            const response = await fetch('http://localhost:5000/api/products/create', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to add product');
            }

            setSuccess('Product added successfully!');

            setTimeout(() => {
                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    stock: '',
                    category: '',
                    subcategory: '',
                    brand: '',
                    colors: [],
                    sizes: [],
                    material: '',
                    fit: 'regular',
                    is_featured: false,
                    is_best_seller: false,
                    is_trending: false,
                    images: []
                });
                onSuccess();
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.message || 'Error adding product');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="bg-white border-gray-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <CardHeader className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900">
                            {product ? "Edit Product" : "Add New Product"}
                        </CardTitle>
                        <CardDescription>Fill in all the details for your new product</CardDescription>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        <X size={24} />
                    </button>
                </CardHeader>

                <CardContent className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title *</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter product title"
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
                                <Input
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    placeholder="Enter brand name"
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter product description"
                                className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
                                <Input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity *</label>
                                <Input
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">Category *</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCategory(!showAddCategory)}
                                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition"
                                    >
                                        {showAddCategory ? 'Cancel' : '+ Add'}
                                    </button>
                                </div>

                                {showAddCategory && (
                                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                        <input
                                            type="text"
                                            placeholder="Category name"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm text-gray-900"
                                        />
                                        <textarea
                                            placeholder="Description (optional)"
                                            value={newCategoryDescription}
                                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm text-gray-900"
                                            rows="2"
                                        />

                                        <button
                                            type="button"
                                            onClick={handleAddCategory}
                                            disabled={addingCategory || !newCategoryName.trim()}
                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded text-sm font-medium transition"
                                        >
                                            {addingCategory ? 'Creating...' : 'Create'}
                                        </button>
                                    </div>
                                )}

                                <Select value={formData.category} onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-300">
                                        {categories.map(cat => (
                                            <SelectItem key={cat._id} value={cat._id} className="text-gray-900">
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">Subcategory</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddSubcategoryForm(!showAddSubcategoryForm)}
                                        className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition"
                                    >
                                        {showAddSubcategoryForm ? 'Cancel' : '+ Add'}
                                    </button>
                                </div>

                                {showAddSubcategoryForm && (
                                    <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded">
                                        <div className="mb-2">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Category *</label>
                                            <Select value={selectedCategoryForSubcategory} onValueChange={setSelectedCategoryForSubcategory}>
                                                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-gray-300">
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat._id} value={cat._id} className="text-gray-900">
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="mb-2">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter subcategory name"
                                                value={newSubcategoryInputName}
                                                onChange={(e) => setNewSubcategoryInputName(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddSubcategoryToCategory(e);
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddSubcategoryToCategory}
                                            disabled={addingSubcategory || !selectedCategoryForSubcategory || !newSubcategoryInputName.trim()}
                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded text-sm font-medium transition"
                                        >
                                            {addingSubcategory ? 'Adding...' : 'Add Subcategory'}
                                        </button>
                                    </div>
                                )}

                                <Select value={formData.subcategory} onValueChange={(value) => handleSelectChange('subcategory', value)}>
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select subcategory" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-300">
                                        {subcategories.length > 0 && subcategories.map(sub => (
                                            <SelectItem key={sub._id} value={sub.name} className="text-gray-900">
                                                {sub.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Material</label>
                                <Input
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Cotton, Polyester"
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Fit</label>
                                <Select value={formData.fit} onValueChange={(value) => handleSelectChange('fit', value)}>
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-300">
                                        {fitOptions.map(f => (
                                            <SelectItem key={f} value={f} className="text-gray-900">
                                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Available Colors</label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                                    placeholder="Enter color"
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                                <Button
                                    type="button"
                                    onClick={addColor}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.colors.map((color, index) => (
                                    <div key={index} className="bg-blue-100 px-3 py-1 rounded flex items-center gap-2 border border-blue-300">
                                        <span className="text-sm text-gray-700">{color}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeColor(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Available Sizes</label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                                    placeholder="Enter size"
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                                <Button
                                    type="button"
                                    onClick={addSize}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.sizes.map((size, index) => (
                                    <div key={index} className="bg-blue-100 px-3 py-1 rounded flex items-center gap-2 border border-blue-300">
                                        <span className="text-sm text-gray-700">{size}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSize(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Images *
                                <span className="text-xs font-normal text-gray-500 ml-1">
                                    ({formData.images.length}/4 images)
                                </span>
                            </label>

                            {/* File Upload */}
                            <div className={`mb-3 p-4 border-2 border-dashed rounded bg-blue-50 cursor-pointer hover:bg-blue-100 transition ${formData.images.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <label className={`flex items-center justify-center gap-2 ${formData.images.length >= 4 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <Upload size={20} className="text-blue-600" />
                                    <span className="text-sm text-blue-600 font-medium">
                                        {formData.images.length >= 4
                                            ? 'Maximum 4 images reached'
                                            : 'Click to upload images from your desktop'}
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageFileInput}
                                        disabled={formData.images.length >= 4}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* URL Input */}
                            <div className="flex gap-2 mb-3">
                                <Input
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    placeholder="Or enter image URL"
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                                <Button
                                    type="button"
                                    onClick={addImage}
                                    disabled={formData.images.length >= 4}
                                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add URL
                                </Button>
                            </div>

                            {/* Image Preview */}
                            <div className="space-y-2">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 hover:bg-gray-100">
                                        {image.startsWith('data:') ? (
                                            <img src={image} alt={`preview-${index}`} className="w-10 h-10 rounded object-cover" />
                                        ) : (
                                            <span className="text-xs text-gray-500">🔗</span>
                                        )}
                                        <span className="text-sm text-gray-600 truncate flex-1 ml-2">{image.substring(0, 50)}...</span>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-700 font-medium">Featured</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_best_seller"
                                    checked={formData.is_best_seller}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-700 font-medium">Best Seller</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_trending"
                                    checked={formData.is_trending}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-700 font-medium">Trending</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {loading
                                    ? (product ? 'Updating...' : 'Adding...')
                                    : (product ? 'Update Product' : 'Add Product')
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddProductModal;
