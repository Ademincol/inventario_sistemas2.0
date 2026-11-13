// app/components/InventoryTable.tsx
"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "../lib/supabase"
import { Loader2, Edit, Trash2, Plus } from "lucide-react"

interface InventoryItem {
  id: number
  factura: string | null
  fecha_factura: string | null
  // ... include only a subset for brevity, add more as needed
  producto: string | null
  descripcion: string | null
  marca: string | null
  cantidad: number | null
  precio_und: number | null
  total: number | null
}

interface Props {
  userRole: string // "admin" or "lector"
}

export default function InventoryTable({ userRole }: Props) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [brandFilter, setBrandFilter] = useState<string>("")

  // Fetch data
  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("inventario_sistemas").select(`
      id, factura, fecha_factura, producto, descripcion, marca, cantidad, precio_und, total`
    )
    if (error) console.error(error)
    else setItems(data as InventoryItem[])
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Delete (admin only)
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este registro?")) return
    const { error } = await supabase.from("inventario_sistemas").delete().eq("id", id)
    if (error) alert(error.message)
    else fetchItems()
  }

  // Simple in‑memory filtering
  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch =
        search === "" ||
        [i.factura, i.producto, i.descripcion, i.marca].some((v) =>
          v?.toString().toLowerCase().includes(search.toLowerCase())
        )
      const matchesBrand = brandFilter === "" || i.marca === brandFilter
      return matchesSearch && matchesBrand
    })
  }, [items, search, brandFilter])

  // Distinct brand list for filter dropdown
  const brandOptions = useMemo(() => {
    const set = new Set<string>()
    items.forEach((i) => i.marca && set.add(i.marca))
    return Array.from(set)
  }, [items])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded border px-2 py-1 focus:outline-none"
          />
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="rounded border px-2 py-1 focus:outline-none"
          >
            <option value="">Todas las marcas</option>
            {brandOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        {userRole === "admin" && (
          <button
            onClick={() => alert("Abrir modal de creación – no implementado en demo")}
            className="flex items-center gap-1 rounded bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Añadir nuevo
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Factura</th>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Marca</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Precio</th>
              <th className="px-4 py-2 text-left">Total</th>
              {userRole === "admin" && <th className="px-4 py-2">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.factura}</td>
                <td className="px-4 py-2">{item.producto}</td>
                <td className="px-4 py-2">{item.marca}</td>
                <td className="px-4 py-2 text-right">{item.cantidad}</td>
                <td className="px-4 py-2 text-right">{item.precio_und?.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{item.total?.toFixed(2)}</td>
                {userRole === "admin" && (
                  <td className="px-2 py-1">
                    <button
                      onClick={() => alert("Abrir modal de edición – no implementado")}
                      className="mr-2 rounded bg-yellow-500 px-2 py-1 text-xs text-white hover:bg-yellow-600"
                    >
                      <Edit className="inline h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                    >
                      <Trash2 className="inline h-3 w-3" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

