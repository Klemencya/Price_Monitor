const apiRoot = process.env.NEXT_PUBLIC_API_ROOT
import type { CategoryModel } from "./models/Category"
import type { ProductPriceModel, ProductWithPriceModel } from "./models/Product"

export function getProductById(id: string): Promise<ProductWithPriceModel | undefined> {
  return fetch(`${apiRoot}/products/${id}`)
    .then(async (res) => {
      if (res.status === 404) {
        return
      }
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as ProductWithPriceModel
    })
}

export function getProductHistoryById(id: string): Promise<ProductPriceModel[]> {
  return fetch(`${apiRoot}/product/${id}/history`)
    .then(async (res) => {
      if (res.status === 404) {
        return []
      }
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as ProductPriceModel[]
    })
}

export function searchProducts(query: string): Promise<ProductWithPriceModel[]> {
  const queryString = new URLSearchParams({
    query,
  })
  return fetch(`${apiRoot}/products/search?${queryString}`)
    .then(async (res) => {
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as ProductWithPriceModel[]
    })
}

export function getCategories(parentId: number | null, signal?: AbortSignal): Promise<CategoryModel[]> {
  const params = parentId !== null
    ? new URLSearchParams({ parentId: parentId.toString() })
    : new URLSearchParams()
  return fetch(`${apiRoot}/categories?${params}`, { signal })
    .then(async (res) => {
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as CategoryModel[]
    })
}

export enum SortType {
  name = "name",
  price = "price",
  unitPrice = "unitPrice",
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export function getProductsByCategory(categoryId: number, {
  sortType,
  sortOrder,
  signal,
}: {
  sortType?: SortType
  sortOrder?: SortOrder
  signal?: AbortSignal
} = {}): Promise<ProductWithPriceModel[]> {
  const params = new URLSearchParams()
  if (sortType) {
    params.append("sort", sortType)
  }
  if (sortOrder) {
    params.append("sortOrder", sortOrder)
  }
  return fetch(`${apiRoot}/categories/${categoryId}/products?${params}`, { signal })
    .then(async (res) => {
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as ProductWithPriceModel[]
    })
}