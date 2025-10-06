import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { db } from "../../firebase/config";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "./../../assets/styles/ProductManagement.css";
import { Box, Pencil, Trash, PlusCircle } from "lucide-react";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const productsRef = collection(db, "products");

  const fetchProducts = useCallback(async () => {
    const snap = await getDocs(productsRef);
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, [productsRef]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    await fetchProducts();
  };

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState(() => localStorage.getItem('admin_search') || "");
  const [categoryFilter, setCategoryFilter] = useState(() => localStorage.getItem('admin_categoryFilter') || "");
  const [showModal, setShowModal] = useState(() => localStorage.getItem('admin_showModal') === 'true');
  const [modalForm, setModalForm] = useState({ name: "", price: "", description: "", image: "", category: "", stock: "", featured: false });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [
    ...filteredProducts.filter(p => p.featured),
    ...filteredProducts.filter(p => !p.featured)
  ];

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const openModal = () => {
    setEditMode(false);
    setEditId(null);
    setModalForm({ name: "", price: "", description: "", image: "", category: "", stock: "", featured: false });
    setShowModal(true);
    localStorage.setItem('admin_showModal', 'true');
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setEditId(product.id);
    setModalForm({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      image: product.image || "",
      category: product.category || "",
      stock: product.stock || "",
      featured: product.featured || false
    });
    setShowModal(true);
    localStorage.setItem('admin_showModal', 'true');
  };

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem('admin_showModal', 'false');
  };

  const handleModalChange = e => {
    const { name, value, type, checked } = e.target;
    setModalForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleModalSubmit = async e => {
    e.preventDefault();

    const payload = {
      name: modalForm.name,
      price: parseFloat(modalForm.price),
      description: modalForm.description,
      image: modalForm.image,
      category: modalForm.category,
      stock: parseInt(modalForm.stock, 10) || 0,
      featured: modalForm.featured
    };

    if (editMode && editId) {
      await updateDoc(doc(db, "products", editId), payload);
    } else {
      await addDoc(productsRef, payload);
    }

    fetchProducts();
    closeModal();
  };

  return (
    <div className="product-management">
      <div className="header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your product inventory</p>
        </div>
        <button className="add-btn" onClick={openModal}>+ Add Product</button>
      </div>

      <div className="filter-container">
        <form className="filter-form" onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              localStorage.setItem('admin_search', e.target.value);
            }}
          />
          <select
            value={categoryFilter}
            onChange={e => {
              setCategoryFilter(e.target.value);
              localStorage.setItem('admin_categoryFilter', e.target.value);
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </form>
      </div>

      <div className="product-table-container">
        <div className="table-header">
          <span><Box size={20} /> Products ({sortedProducts.length})</span>
        </div>
        <div className="product-list">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      {p.image && <img src={p.image} alt={p.name} />}
                      <div>
                        <strong>{p.name}</strong>
                        {p.description && <p>{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>${p.price}</td>
                  <td>{p.stock || 0}</td>
                  <td>
                    {p.featured && <span className="status featured">Featured</span>}
                    <span className="status in">In Stock</span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => openEditModal(p)}>
                      <Pencil size={16} />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className={`modal-header ${editMode ? "edit-mode" : ""}`}>
              <PlusCircle size={22} />
              <h2>{editMode ? "Edit Product" : "Add New Product"}</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <p className="modal-subtitle">
              {editMode ? `Editing "${modalForm.name}"` : "Create a new product for your store"}
            </p>
            <form className="modal-form" onSubmit={handleModalSubmit}>
              <div className="form-row">
                <input name="name" placeholder="Product Name *" value={modalForm.name} onChange={handleModalChange} required />
                <input name="price" type="number" min="0" step="0.01" placeholder="Price *" value={modalForm.price} onChange={handleModalChange} required />
              </div>
              <textarea name="description" placeholder="Description *" value={modalForm.description} onChange={handleModalChange} required />
              <input name="image" placeholder="Image URL" value={modalForm.image} onChange={handleModalChange} />
              <div className="form-row">
                <input
                  name="category"
                  placeholder="Enter or select category *"
                  value={modalForm.category}
                  onChange={handleModalChange}
                  list="category-options"
                  required
                />
                <datalist id="category-options">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                <input name="stock" type="number" min="0" step="1" placeholder="Stock Quantity *" value={modalForm.stock} onChange={handleModalChange} required />
              </div>
              <div className="checkbox">
                <input
                  id="featured-product-checkbox"
                  name="featured"
                  type="checkbox"
                  checked={modalForm.featured}
                  onChange={handleModalChange}
                />
                <label htmlFor="featured-product-checkbox">Featured Product</label>
              </div>
              <div className="modal-actions">
                <button className="add-btn" type="submit">
                  <PlusCircle size={16} />
                  {editMode ? "Save Changes" : "Add Product"}
                </button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
