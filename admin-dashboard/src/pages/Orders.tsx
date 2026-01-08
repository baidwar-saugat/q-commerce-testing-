import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, fetcher } from "../api";

export default function Orders() {
  const [selectedStore, setSelectedStore] = useState("");
  const queryClient = useQueryClient();

  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetcher("/admin/stores"),
  });

  const { data: orderData } = useQuery({
    queryKey: ["orders", selectedStore],
    queryFn: () => fetcher(`/orders/store/${selectedStore}`),
    enabled: !!selectedStore,
  });

  const orders = orderData?.orders || [];

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: any) =>
      api.patch(`/orders/${id}/status`, { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["orders", selectedStore] }),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Live Orders</h1>

      <select
        className="w-full p-3 border rounded-lg bg-white mb-6"
        onChange={(e) => setSelectedStore(e.target.value)}
        value={selectedStore}
      >
        <option value="">-- Select Store to View Orders --</option>
        {stores?.map((s: any) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <div className="grid gap-4">
        {selectedStore && orders.length === 0 && (
          <p className="text-gray-500">No orders found.</p>
        )}

        {orders.map((order: any) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">
                  #{order.id.split("-")[0]}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <h3 className="font-bold text-xl">Rs. {order.total}</h3>
              <p className="text-sm text-gray-500">User: {order.user.name}</p>

              <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    <span className="font-bold">{item.quantity}x</span>
                    <span>{item.product.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2">
              {order.status === "PENDING" && (
                <button
                  onClick={() =>
                    updateStatus.mutate({ id: order.id, status: "PREPARING" })
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Accept Order
                </button>
              )}
              {order.status === "PREPARING" && (
                <button
                  onClick={() =>
                    updateStatus.mutate({ id: order.id, status: "READY" })
                  }
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Mark Ready
                </button>
              )}
              {order.status === "READY" && (
                <button
                  onClick={() =>
                    updateStatus.mutate({ id: order.id, status: "COMPLETED" })
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
