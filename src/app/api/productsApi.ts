import { baseApi } from './baseApi';
import type { Product, ProductsResponse, ProductsQueryParams } from '../../entities/product/model/types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductsResponse, ProductsQueryParams | void>({
      query: (params) => {
        if (params?.q) {
          return { url: '/products/search', params: { q: params.q, limit: params.limit, skip: params.skip } };
        }
        return {
          url: '/products',
          params: params ? { limit: params.limit, skip: params.skip } : undefined,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    getProduct: build.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_, __, id) => [{ type: 'Products', id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productsApi;
