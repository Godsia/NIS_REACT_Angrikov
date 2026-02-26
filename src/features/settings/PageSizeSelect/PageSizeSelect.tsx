import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../shared/lib/redux';
import { selectPageSize } from '../../../app/store/selectors';
import { setPageSize } from '../../../app/store/settingsSlice';
import type { PageSize } from '../../../shared/config/constants';
import { PAGE_SIZES } from '../../../shared/config/constants';

export function PageSizeSelect() {
  const { t } = useTranslation();
  const pageSize = useAppSelector(selectPageSize);
  const dispatch = useAppDispatch();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setPageSize(Number(e.target.value) as PageSize));
    },
    [dispatch]
  );

  return (
    <div>
      <label htmlFor="page-size-select">{t('settings.pageSize')}</label>
      <select
        id="page-size-select"
        value={pageSize}
        onChange={handleChange}
        style={{ marginLeft: 8, padding: '4px 8px' }}
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
