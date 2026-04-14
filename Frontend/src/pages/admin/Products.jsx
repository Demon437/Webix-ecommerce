import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AddProductModal from './AddProductModal';

const AdminProducts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    /* ================= AUTH ================= */
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user]);

    /* ================= FETCH ================= */

    const fetchCategories = async () => {
        const res = await fetch('http://localhost:5000/api/categories');
        const data = await res.json();
        setCategories(data || []);
    };

    const fetchProducts = async () => {
        setLoading(true);

        const queryObj = {
            page,
            limit: 15
        };

        if (searchTerm) queryObj.search = searchTerm;
        if (categoryFilter) queryObj.category = categoryFilter;

        const query = new URLSearchParams(queryObj);

        console.log("🔥 API QUERY:", query.toString());

        const res = await fetch(`http://localhost:5000/api/products?${query}`);
        const data = await res.json();

        console.log("🔥 API RESPONSE:", data);

        setProducts(data.products || []);
        setTotalPages(data.pagination?.pages || 1);

        setLoading(false);
    };

    /* ================= LOAD ================= */

    // Page change
    useEffect(() => {
        fetchProducts();
    }, [page]);

    // First load
    useEffect(() => {
        fetchCategories();
    }, []);

    // Filter change
    useEffect(() => {
        setPage(1);
        fetchProducts();
    }, [searchTerm, categoryFilter]);

    /* ================= ACTIONS ================= */

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete product?")) {
            await base44.entities.Product.remove(id);
            fetchProducts();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}
            <div className="bg-white border-b p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
                        <ArrowLeft size={18} />
                    </Button>
                    <h1 className="text-xl font-bold">Product Management</h1>
                </div>

                <Button onClick={() => setShowAddModal(true)}>
                    <Plus size={16} className="mr-2" />
                    Add Product
                </Button>
            </div>

            <div className="p-6 max-w-7xl mx-auto">

                {/* FILTERS */}
                <Card className="mb-6">
                    <CardContent className="p-4 flex gap-4 flex-wrap">
                        <div className="flex items-center gap-2 flex-1">
                            <Search size={16} />
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="border px-3 py-2 rounded"
                            onChange={(e) => {
                                console.log("🔥 Selected Category:", e.target.value);
                                setCategoryFilter(e.target.value);
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </CardContent>
                </Card>

                {/* TABLE */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products ({products.length})</CardTitle>
                        <CardDescription>Manage your store products</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <div className="text-center py-10">Loading...</div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-100">
                                        <th className="p-3 text-left">Product</th>
                                        <th className="p-3 text-left">Price</th>
                                        <th className="p-3 text-left">Stock</th>
                                        <th className="p-3 text-left">Category</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id} className="border-b hover:bg-gray-50">

                                            <td className="p-3 flex items-center gap-3">
                                                <img
                                                    src={product.images?.[0] || "https://via.placeholder.com/40"}
                                                    className="w-10 h-10 rounded object-contain"
                                                />
                                                <div>
                                                    <p className="font-medium">{product.title}</p>
                                                    <p className="text-xs text-gray-500">{product.brand}</p>
                                                </div>
                                            </td>

                                            <td className="p-3">₹{product.price}</td>

                                            <td className="p-3">
                                                <span className={
                                                    product.stock > 10
                                                        ? "text-green-600"
                                                        : product.stock > 0
                                                            ? "text-yellow-600"
                                                            : "text-red-600"
                                                }>
                                                    {product.stock || "Out"}
                                                </span>
                                            </td>

                                            <td className="p-3">{product.category?.name}</td>

                                            <td className="p-3 text-right">
                                                <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(product._id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* PAGINATION */}
                        <div className="flex justify-center gap-4 mt-6">
                            <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                            <span>Page {page} / {totalPages}</span>
                            <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* MODAL */}
            <AddProductModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                }}
                onSuccess={fetchProducts}
                categories={categories}
                product={editingProduct}
                onCategoriesUpdated={fetchCategories}
            />
        </div>
    );
};

export default AdminProducts;