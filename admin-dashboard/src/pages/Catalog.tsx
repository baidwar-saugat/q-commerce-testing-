import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api, fetcher } from "../api";
import { Plus, Tag, Box } from "lucide-react";

export default function Catalog() {
  const queryClient = useQueryClient();

  const { register: regCat, handleSubmit: subCat, reset: resetCat } = useForm();

  const {
    register: regProd,
    handleSubmit: subProd,
    reset: resetProd,
  } = useForm();

  // 1. Fetch Data
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetcher("/admin/categories"),
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetcher("/admin/products"),
  });

  // 2. Mutations (Create Data) WITH FIXES

  // --- FIX: Create Category ---
  const createCategory = useMutation({
    mutationFn: (data: any) => {
      // 1. Fix Empty Image String Issue
      const payload = {
        name: data.name,
        // If image is empty string, send undefined. Zod hates empty strings for URLs.
        image: data.image && data.image.trim() !== "" ? data.image : undefined,
      };
      return api.post("/admin/categories", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetCat();
      alert("✅ Category Created Successfully!");
    },
    onError: (err: any) => {
      alert(`❌ Failed to create Category: ${err.message}`);
    },
  });

  // --- FIX: Create Product ---
  const createProduct = useMutation({
    mutationFn: (data: any) => {
      // 1. Convert Price to Number
      // 2. Fix Empty Image String
      const payload = {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        basePrice: Number(data.basePrice), // Ensure Number
        image: data.image && data.image.trim() !== "" ? data.image : undefined,
        isAdult: false,
      };
      return api.post("/admin/products", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetProd();
      alert("✅ Product Created Successfully!");
    },
    onError: (err: any) => {
      alert(`❌ Failed to create Product: ${err.message}`);
    },
  });

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Master Catalog</h1>

      {/* SECTION 1: CATEGORIES */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <Tag size={18} /> New Category
          </h2>
          <form
            onSubmit={subCat((data) => createCategory.mutate(data))}
            className="space-y-3"
          >
            <input
              {...regCat("name")}
              placeholder="Category Name (e.g. Drinks)"
              className="w-full border p-2 rounded"
              required
            />
            <input
              {...regCat("image")}
              placeholder="Image URL (Optional)"
              className="w-full border p-2 rounded"
            />
            <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium">
              Add Category
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold mb-4">Existing Categories</h2>
          <div className="flex flex-wrap gap-2">
            {!categories || categories.length === 0 ? (
              <p className="text-gray-400 text-sm">No categories yet.</p>
            ) : (
              categories.map((c: any) => (
                <span
                  key={c.id}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100"
                >
                  {c.name}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: PRODUCTS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <Box size={18} /> New Master Product
          </h2>
          <form
            onSubmit={subProd((data) => createProduct.mutate(data))}
            className="space-y-3"
          >
            <input
              {...regProd("name")}
              placeholder="Product Name (e.g. Coke)"
              className="w-full border p-2 rounded"
              required
            />
            <input
              {...regProd("description")}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />
            <input
              {...regProd("basePrice")}
              type="number"
              placeholder="Base Price (Rs)"
              className="w-full border p-2 rounded"
              required
            />
            <select
              {...regProd("categoryId")}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              {...regProd("image")}
              placeholder="Image URL (Optional)"
              className="w-full border p-2 rounded"
            />
            <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-medium">
              Add Product
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-y-auto max-h-[500px]">
          <h2 className="font-bold mb-4">Master Product List</h2>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p: any) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-gray-500">
                      {p.category?.name || "Uncategorized"}
                    </td>
                    <td className="p-3">Rs. {p.basePrice}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
