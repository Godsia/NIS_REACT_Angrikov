import React, { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../app/api/productsApi';
import { useAppSelector } from '../../shared/lib/redux';
import { selectPageSize } from '../../app/store/selectors';
import { Button } from '../../shared/ui/Button';
import styles from './ProductListPage.module.css';

export function ProductListPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = useAppSelector(selectPageSize);

  const q = searchParams.get('q') ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const skip = (page - 1) * pageSize;

  const [searchInput, setSearchInput] = useState(q);

  const { data, isLoading, isError, refetch } = useGetProductsQuery(
    useMemo(
      () => (q ? { q, limit: pageSize, skip } : { limit: pageSize, skip }),
      [q, pageSize, skip]
    )
  );

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const next = new URLSearchParams(searchParams);
      next.set('q', searchInput.trim());
      next.delete('page');
      setSearchParams(next);
    },
    [searchInput, searchParams, setSearchParams]
  );

  const goToPage = useCallback(
    (newPage: number) => {
      const next = new URLSearchParams(searchParams);
      next.set('page', String(newPage));
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  if (isLoading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{t('products.title')}</h1>
        <p className={styles.state}>{t('common.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{t('products.title')}</h1>
        <p className={styles.error}>{t('common.error')}</p>
        <Button onClick={() => refetch()}>{t('common.retry')}</Button>
      </div>
    );
  }

  const products = data?.products ?? [];
  const isEmpty = products.length === 0;
  const emptyMessage = q ? t('products.emptySearch') : t('products.empty');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('products.list')}</h1>

      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="search"
          placeholder={t('products.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.searchInput}
        />
        <Button type="submit">{t('common.search')}</Button>
      </form>

      {isEmpty ? (
        <p className={styles.state}>{emptyMessage}</p>
      ) : (
        <>
          <ul className={styles.list}>
            {products.map((product) => (
              <li key={product.id} className={styles.item}>
                <Link to={`/products/${product.id}`} className={styles.link}>
                  <img src={product.thumbnail} alt="" className={styles.thumb} />
                  <div className={styles.info}>
                    <span className={styles.name}>{product.title}</span>
                    <span className={styles.meta}>
                      {t('products.category')}: {product.category} · {t('products.price')}: ${product.price} ·
                      {t('products.rating')}: {product.rating}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                variant="secondary"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                {t('products.prev')}
              </Button>
              <span className={styles.pageInfo}>
                {t('products.page')} {currentPage} {t('products.of')} {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                {t('products.next')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
