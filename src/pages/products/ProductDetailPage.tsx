import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useGetProductQuery } from '../../app/api/productsApi';
import { Button } from '../../shared/ui/Button';
import styles from './ProductDetailPage.module.css';

export function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : NaN;

  const { data: product, isLoading, isError, refetch } = useGetProductQuery(productId, {
    skip: !Number.isFinite(productId),
  });

  if (!Number.isFinite(productId)) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{t('common.error')}</p>
        <Link to="/products">
          <Button variant="secondary">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p className={styles.state}>{t('common.loading')}</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{t('common.error')}</p>
        <Button onClick={() => refetch()}>{t('common.retry')}</Button>
        <Link to="/products" style={{ marginLeft: 8 }}>
          <Button variant="secondary">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/products" className={styles.backLink}>
        ← {t('common.back')}
      </Link>
      <div className={styles.card}>
        <img src={product.thumbnail} alt="" className={styles.image} />
        <div className={styles.content}>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.description}>{product.description}</p>
          <dl className={styles.meta}>
            <dt>{t('products.category')}</dt>
            <dd>{product.category}</dd>
            <dt>{t('products.price')}</dt>
            <dd>${product.price}</dd>
            <dt>{t('products.rating')}</dt>
            <dd>{product.rating}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
