import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, fetcher } from "../api";

export default function Inventory() {
  const [selectedStore, setSelectedStore] = useState("");
  const queryClient = useQueryClient();

  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetcher("/admin/stores"),
  });
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetcher("/admin/products"),
  });

  // Fetch Menu of selected store
  const { data: menu } = useQuery({
    queryKey: ["menu", selectedStore],
    queryFn: () => fetcher(`/inventory/${selectedStore}/menu`),
    enabled: !!selectedStore,
  });

  // Assign Product to Store
  const assignMutation = useMutation({
    mutationFn: (data: any) =>
      api.post(`/inventory/${selectedStore}/products`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu", selectedStore] });
      alert("Added to Menu!");
    },
  });

  const handleAdd = (product: any) => {
    if (!selectedStore) return alert("Select a store first");
    const price = prompt(
      `Set price for ${product.name} (Base: ${product.basePrice})`,
      product.basePrice.toString()
    );
    if (price) {
      assignMutation.mutate({
        productId: product.id,
        price: Number(price),
        isAvailable: true,
        stock: 100,
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Inventory Matrix</h1>

      {/* Store Selector */}
      <select
        className="w-full p-3 border rounded-lg text-lg font-bold bg-white"
        onChange={(e) => setSelectedStore(e.target.value)}
        value={selectedStore}
      >
        <option value="">-- Select Store to Manage --</option>
        {stores?.map((s: any) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.address})
          </option>
        ))}
      </select>

      {selectedStore && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Available Global Products */}
          <div className="bg-white p-6 rounded-xl border">
            <h2 className="font-bold mb-4 text-gray-500 uppercase">
              Global Catalog
            </h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {products?.map((p: any) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 border rounded"
                >
                  <span>
                    {p.name} (Rs. {p.basePrice})
                  </span>
                  <button
                    onClick={() => handleAdd(p)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                  >
                    + Add to Store
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Current Store Menu */}
          <div className="bg-white p-6 rounded-xl border border-blue-200">
            <h2 className="font-bold mb-4 text-blue-600 uppercase">
              Live Menu
            </h2>
            <div className="space-y-2">
              {menu?.length === 0 && (
                <p className="text-gray-400">No items in this store yet.</p>
              )}
              {menu?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 border-b"
                >
                  <div>
                    <p className="font-bold">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">Rs. {item.price}</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 rounded">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
