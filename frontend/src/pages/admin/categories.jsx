import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, FolderPlus, ListCollapse, Loader2, Eye } from 'lucide-react';
import AdminStatCard from "../../components/admin/dashboard/AdminStatCard";
import { categoriesAPI } from "../../services/api";
import DataTable from "../../components/ui/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ConfirmDialog from "../../components/ui/confirm-dialog";
import toast from "react-hot-toast";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(""); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [editingCategory, setEditingCategory] = useState(null); 
    const [formData, setFormData] = useState({ name:'', description:'' }); 
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    
    const loadCategories = async () => { 
        try { 
            setIsLoading(true); 
            setError(''); 
            const res = await categoriesAPI.getCategories(); 
            setCategories(res?.data || []); 
        } catch (err) { 
            setError(err.message ||'Failed to load categories.'); 
        } finally { 
            setIsLoading(false); 
        } 
    }; 
    
    useEffect(() => { loadCategories(); }, []); 
    
    const handleOpenAddModal = () => { 
        setEditingCategory(null); 
        setFormData({ name:'', description:'' }); 
        setIsModalOpen(true); 
    }; 
    
    const handleOpenEditModal = (cat) => { 
        setEditingCategory(cat); 
        setFormData({ name: cat.name, description: cat.description ||'' }); 
        setIsModalOpen(true); 
    }; 
    
    const confirmDelete = (cat) => {
        setCategoryToDelete(cat);
        setConfirmOpen(true);
    };
    
    const executeDelete = async () => { 
        if (!categoryToDelete) return;
        try { 
            await categoriesAPI.deleteCategory(categoryToDelete._id); 
            toast.success('Category deleted successfully');
            await loadCategories(); 
        } catch (err) { 
            toast.error(err.message ||'Failed to delete category.'); 
        } finally {
            setCategoryToDelete(null);
            setConfirmOpen(false);
        }
    }; 
    
    const handleFormSubmit = async (e) => { 
        e.preventDefault(); 
        if (!formData.name.trim()) return; 
        try { 
            setIsSaving(true); 
            setError(''); 
            if (editingCategory) { 
                await categoriesAPI.updateCategory(editingCategory._id, formData); 
                toast.success('Category updated successfully');
            } else { 
                await categoriesAPI.createCategory(formData); 
                toast.success('Category created successfully');
            } 
            setIsModalOpen(false); 
            await loadCategories(); 
        } catch (err) { 
            toast.error(err.message ||'Failed to save category.'); 
        } finally { 
            setIsSaving(false); 
        } 
    }; 
    
    const columns = useMemo(() => [
        {
            header: 'Category Name',
            accessorKey: 'name',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans font-bold text-foreground leading-tight block">{row.original.name}</span>
            )
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans text-muted-foreground max-w-[300px] truncate block leading-tight">
                    {row.original.description || 'No description listed.'}
                </span>
            )
        },
        {
            header: 'Created On',
            accessorKey: 'createdAt',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans text-muted-foreground leading-tight block">
                    {new Date(row.original.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            )
        },
        {
            header: 'Actions',
            id: 'actions',
            meta: { headerClassName: 'text-center', cellClassName: 'flex justify-center' },
            cell: ({ row }) => (
                <button onClick={() => handleOpenEditModal(row.original)} className="text-muted-foreground hover:text-primary transition-colors p-1" title="View Details">
                    <Eye className="w-4 h-4" />
                </button>
            )
        }
    ], []);

    if (isLoading) { 
        return ( 
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3"> 
                <Loader2 className="w-10 h-10 animate-spin text-primary" /> 
                <p className="text-sm font-sans text-muted-foreground">Loading categories...</p> 
            </div> 
        ); 
    } 
    
    return ( 
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full duration-500"> 
            {/* Page Header */} 
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"> 
                <div> 
                    <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1"> Category Management </h1> 
                    <p className="text-muted-foreground font-sans text-xs"> Manage product and shop categories across the Artisan Hub ecosystem. </p> 
                </div> 
                <Button onClick={handleOpenAddModal} className="flex items-center gap-2 self-start sm:self-auto" > 
                    <FolderPlus className="w-4 h-4" /> <span>Add Category</span> 
                </Button> 
            </div> 
            
            {error && ( 
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-sans"> 
                    {error} 
                </div> 
            )} 
            
            {/* Stats Grid */} 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> 
                <AdminStatCard title="Total Categories" value={categories.length} subtext="Active System Categories" icon={ListCollapse} /> 
                <AdminStatCard title="Dynamic Categories" value="Enabled" subtext="Database backed catalog listings" icon={FolderPlus} /> 
            </div> 
            
            <div className="w-full">
                <DataTable
                    title="All Categories"
                    columns={columns}
                    data={categories}
                    emptyStateMessage="No categories found."
                />
            </div>

            {/* Add/Edit Modal */} 
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogClose onClick={() => setIsModalOpen(false)} />
                    {/* Header */} 
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </DialogTitle>
                    </DialogHeader> 
                    {/* Form */} 
                    <form onSubmit={handleFormSubmit}> 
                        <div className="p-6 space-y-4"> 
                            <div className="space-y-1.5"> 
                                <label htmlFor="name" className="field-label">Category Name</label> 
                                <Input id="name" type="text" required disabled={isSaving} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Stoneware" /> 
                            </div> 
                            <div className="space-y-1.5"> 
                                <label htmlFor="description" className="field-label">Description</label> 
                                <Textarea id="description" rows={4} disabled={isSaving} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what kind of crafts belong to this category..." /> 
                            </div> 
                        </div> 
                        {/* Footer */} 
                        <div className="bg-muted/30 p-5 border-t border-border flex justify-between gap-3"> 
                            {editingCategory ? (
                                <Button type="button" variant="destructive" onClick={() => { setIsModalOpen(false); confirmDelete(editingCategory); }} disabled={isSaving}> Delete </Button>
                            ) : <div></div>}
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving} > Cancel </Button> 
                                <Button type="submit" disabled={isSaving} > 
                                    {isSaving ? ( <> <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Saving... </> ) : ('Save')} 
                                </Button> 
                            </div>
                        </div> 
                    </form> 
                </DialogContent>
            </Dialog> 

            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={executeDelete}
                title="Delete Category"
                message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This might affect products using it.`}
                isDestructive={true}
                confirmText="Delete"
            />
        </div> 
    );
};
export default CategoriesPage;
