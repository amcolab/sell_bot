import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import Input from '../components/input';
import Select from '../components/select';
import { formatNumber } from '../utils/utils';
import {
  getTopLevelIndustries,
  getChildIndustries,
  convertToSelectOptions,
  hasChildren,
} from '../utils/industryUtils';
import Radio from '../components/radio';
import HeaderSection from '../components/header-section';

// TypeScript interfaces for type safety
interface Industry {
  category1: string;
  category2: string;
  category3: string;
  specialCase: 'over50' | 'under50' | '';
  revenuePercentage1: string;
  revenuePercentage2: string;
  revenuePercentage3: string;
  category2_2: string;
  category3_2: string;
  category2_3: string;
  category3_3: string;
}

interface Financial {
  profit: string;
  dividends: string;
}

interface Subsidiary {
  industry: Industry;
  financial: Financial;
}

interface FormValues {
  applicationType: string;
  numberOfSubsidiaries: string;
  mainCompany: {
    industry: Industry;
    financial: Financial;
  };
  subsidiaries: Subsidiary[];
}

interface BusinessInformationProps {
  control: any; // Replace with Control<FormValues> if using TypeScript
  errors: any; // Replace with FieldErrors<FormValues>
  saveDataToLocalStorage: (key: string, value: string) => void;
  ensureSubsidiaryStructure: (index: number) => void;
  setValue: (name: string, value: any, options?: any) => void; // Replace with UseFormSetValue<FormValues>
}

const BusinessInformation = ({
  control,
  errors,
  saveDataToLocalStorage,
  ensureSubsidiaryStructure,
  setValue,
}: BusinessInformationProps) => {
  // Memoize saveDataToLocalStorage
  const memoizedSaveDataToLocalStorage = useCallback(
    (key: string, value: string) => {
      saveDataToLocalStorage(key, value);
    },
    [saveDataToLocalStorage]
  );

  // Watch form fields with useWatch for stable references
  const applicationType = useWatch({
    control,
    name: 'applicationType',
    defaultValue: '',
  });
  const numberOfSubsidiaries = useWatch({
    control,
    name: 'numberOfSubsidiaries',
    defaultValue: '0',
  });
  const mainCompanyIndustry = useWatch({
    control,
    name: 'mainCompany.industry',
    defaultValue: {
      category1: '',
      category2: '',
      category3: '',
      specialCase: '',
      revenuePercentage1: '',
      revenuePercentage2: '',
      revenuePercentage3: '',
      category2_2: '',
      category3_2: '',
      category2_3: '',
      category3_3: '',
    },
  });
  const subsidiaries = useWatch({
    control,
    name: 'subsidiaries',
    defaultValue: [],
  });

  const subsidiariesCount = numberOfSubsidiaries ? parseInt(numberOfSubsidiaries) : 0;

  const { fields, replace } = useFieldArray({
    control,
    name: 'subsidiaries',
  });

  // State for industry selections
  const [topLevelIndustries] = useState(convertToSelectOptions(getTopLevelIndustries()));
  const [secondLevelIndustries, setSecondLevelIndustries] = useState([
    { value: '', label: '選択してください' },
  ]);
  const [thirdLevelIndustries, setThirdLevelIndustries] = useState([
    { value: '', label: '選択してください' },
  ]);

  const [subsidiaryIndustries, setSubsidiaryIndustries] = useState(
    Array(subsidiariesCount).fill({
      secondLevel: [{ value: '', label: '選択してください' }],
      thirdLevel: [{ value: '', label: '選択してください' }],
      secondLevel_2: [{ value: '', label: '選択してください' }],
      thirdLevel_2: [{ value: '', label: '選択してください' }],
      secondLevel_3: [{ value: '', label: '選択してください' }],
      thirdLevel_3: [{ value: '', label: '選択してください' }],
    })
  );

  // Update second level industries for main company
  useEffect(() => {
    if (mainCompanyIndustry.category1) {
      const children = getChildIndustries(mainCompanyIndustry.category1);
      setSecondLevelIndustries(convertToSelectOptions(children));
    } else {
      setSecondLevelIndustries([{ value: '', label: '選択してください' }]);
      setValue('mainCompany.industry.category2', '', { shouldValidate: false });
      setValue('mainCompany.industry.category3', '', { shouldValidate: false });
      memoizedSaveDataToLocalStorage('mainCompany.industry.category2', '');
      memoizedSaveDataToLocalStorage('mainCompany.industry.category3', '');
    }
  }, [mainCompanyIndustry.category1, setValue, memoizedSaveDataToLocalStorage]);

  // Update third level industries for main company
  useEffect(() => {
    if (mainCompanyIndustry.category2) {
      const children = getChildIndustries(mainCompanyIndustry.category2);
      setThirdLevelIndustries(convertToSelectOptions(children));
    } else {
      setThirdLevelIndustries([{ value: '', label: '選択してください' }]);
      setValue('mainCompany.industry.category3', '', { shouldValidate: false });
      memoizedSaveDataToLocalStorage('mainCompany.industry.category3', '');
    }
  }, [mainCompanyIndustry.category2, setValue, memoizedSaveDataToLocalStorage]);

  // Handle revenuePercentage3 reset for main company
  useEffect(() => {
    const rev1 = parseInt(mainCompanyIndustry.revenuePercentage1 || '0');
    const rev2 = parseInt(mainCompanyIndustry.revenuePercentage2 || '0');
    if (rev1 + rev2 < 50 && !mainCompanyIndustry.revenuePercentage3) {
      setValue('mainCompany.industry.revenuePercentage3', '', { shouldValidate: false });
      memoizedSaveDataToLocalStorage('mainCompany.industry.revenuePercentage3', '');
    }
  }, [
    mainCompanyIndustry.revenuePercentage1,
    mainCompanyIndustry.revenuePercentage2,
    mainCompanyIndustry.revenuePercentage3,
    setValue,
    memoizedSaveDataToLocalStorage,
  ]);

  // Handle subsidiary count change
  useEffect(() => {
    if (applicationType === '子会社含む' && subsidiariesCount > 0) {
      const newFields = Array(subsidiariesCount)
        .fill(null)
        .map(() => ({
          industry: {
            category1: '',
            category2: '',
            category3: '',
            specialCase: '',
            revenuePercentage1: '',
            revenuePercentage2: '',
            revenuePercentage3: '',
            category2_2: '',
            category3_2: '',
            category2_3: '',
            category3_3: '',
          },
          financial: {
            profit: '0',
            dividends: '0',
          },
        }));
      replace(newFields);
    } else {
      replace([]);
    }
  }, [applicationType, subsidiariesCount, replace]);

  // Update subsidiary industry options
  useEffect(() => {
    const newSubsidiaryIndustries = subsidiaries.map((_: any, index: number) => {
      const selectedCategory1 = subsidiaries[index]?.industry?.category1 || '';
      const selectedCategory2 = subsidiaries[index]?.industry?.category2 || '';
      const selectedCategory2_2 = subsidiaries[index]?.industry?.category2_2 || '';
      const selectedCategory2_3 = subsidiaries[index]?.industry?.category2_3 || '';

      return {
        secondLevel: selectedCategory1
          ? convertToSelectOptions(getChildIndustries(selectedCategory1))
          : [{ value: '', label: '選択してください' }],
        thirdLevel: selectedCategory2
          ? convertToSelectOptions(getChildIndustries(selectedCategory2))
          : [{ value: '', label: '選択してください' }],
        secondLevel_2: selectedCategory1
          ? convertToSelectOptions(getChildIndustries(selectedCategory1))
          : [{ value: '', label: '選択してください' }],
        thirdLevel_2: selectedCategory2_2
          ? convertToSelectOptions(getChildIndustries(selectedCategory2_2))
          : [{ value: '', label: '選択してください' }],
        secondLevel_3: selectedCategory1
          ? convertToSelectOptions(getChildIndustries(selectedCategory1))
          : [{ value: '', label: '選択してください' }],
        thirdLevel_3: selectedCategory2_3
          ? convertToSelectOptions(getChildIndustries(selectedCategory2_3))
          : [{ value: '', label: '選択してください' }],
      };
    });
    setSubsidiaryIndustries(newSubsidiaryIndustries);
  }, [subsidiaries]);

  // Centralized reset logic for subsidiaries
  useEffect(() => {
    subsidiaries.forEach((_: any, index: number) => {
      const rev1 = parseInt(subsidiaries[index]?.industry?.revenuePercentage1 || '0');
      const rev2 = parseInt(subsidiaries[index]?.industry?.revenuePercentage2 || '0');
      const rev3 = subsidiaries[index]?.industry?.revenuePercentage3;
      if (rev1 + rev2 < 50 && !rev3) {
        setValue(`subsidiaries.${index}.industry.revenuePercentage3`, '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.revenuePercentage3`, '');
      }
    });
  }, [subsidiaries, setValue, memoizedSaveDataToLocalStorage]);

  return (
    <HeaderSection title="会社情報" stepNumber={4}>
      {/* Main Company Industry Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Controller
          name="mainCompany.industry.category1"
          control={control}
          render={({ field }) => (
            <div>
              <Select
                name={field.name}
                id={field.name}
                label="業種目大分類"
                required={true}
                value={field.value}
                error={errors.mainCompany?.industry?.category1?.message}
                options={topLevelIndustries}
                onchange={(e) => {
                  field.onChange(e.target.value);
                  memoizedSaveDataToLocalStorage('mainCompany.industry.category1', e.target.value);
                }}
              />
            </div>
          )}
        />

        {mainCompanyIndustry.category1 && hasChildren(mainCompanyIndustry.category1) && (
          <Controller
            name="mainCompany.industry.category2"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  name={field.name}
                  id={field.name}
                  label="業種目中分類"
                  required={true}
                  value={field.value}
                  error={errors.mainCompany?.industry?.category2?.message}
                  options={secondLevelIndustries}
                  onchange={(e) => {
                    field.onChange(e.target.value);
                    memoizedSaveDataToLocalStorage('mainCompany.industry.category2', e.target.value);
                  }}
                />
              </div>
            )}
          />
        )}

        {mainCompanyIndustry.category2 && hasChildren(mainCompanyIndustry.category2) && (
          <Controller
            name="mainCompany.industry.category3"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  name={field.name}
                  id={field.name}
                  label="業種目小分類"
                  required={true}
                  value={field.value}
                  error={errors.mainCompany?.industry?.category3?.message}
                  options={thirdLevelIndustries}
                  onchange={(e) => {
                    field.onChange(e.target.value);
                    memoizedSaveDataToLocalStorage('mainCompany.industry.category3', e.target.value);
                  }}
                />
              </div>
            )}
          />
        )}
      </div>

      {/* Main Company Special Case and Revenue Percentages */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">業種区分特例</label>
          <div className="space-y-2">
            <Controller
              name="mainCompany.industry.specialCase"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Radio
                    name={field.name}
                    id={`${field.name}_over50`}
                    title="主たる事業の売上が全体売上の50％超である"
                    value="over50"
                    checked={field.value === 'over50'}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      memoizedSaveDataToLocalStorage('mainCompany.industry.specialCase', e.target.value);
                    }}
                  />
                  <Radio
                    name={field.name}
                    id={`${field.name}_under50`}
                    title="主たる事業の売上が全体売上の50％以下である"
                    value="under50"
                    checked={field.value === 'under50'}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      memoizedSaveDataToLocalStorage('mainCompany.industry.specialCase', e.target.value);
                    }}
                  />
                </div>
              )}
            />
          </div>
        </div>

        {mainCompanyIndustry.specialCase === 'under50' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="mainCompany.industry.revenuePercentage1"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="text"
                      name={field.name}
                      id={field.name}
                      label="主たる事業の売上"
                      required={true}
                      placeholder="%"
                      value={field.value ? `${field.value}` : ''}
                      error={errors.mainCompany?.industry?.revenuePercentage1?.message}
                      onchange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        const cleanValue = value === '0' ? '' : value.replace(/^0+/, '');
                        field.onChange(cleanValue);
                        memoizedSaveDataToLocalStorage('mainCompany.industry.revenuePercentage1', cleanValue);
                      }}
                      onblur={() => {
                        if (!field.value) {
                          field.onChange('');
                          memoizedSaveDataToLocalStorage('mainCompany.industry.revenuePercentage1', '');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                    />
                  </div>
                )}
              />

              <Controller
                name="mainCompany.industry.revenuePercentage2"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="text"
                      name={field.name}
                      id={field.name}
                      label="２位の売上"
                      required={true}
                      placeholder="%"
                      value={field.value ? `${field.value}` : ''}
                      error={errors.mainCompany?.industry?.revenuePercentage2?.message}
                      onchange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        const cleanValue = value === '0' ? '' : value.replace(/^0+/, '');
                        field.onChange(cleanValue);
                        memoizedSaveDataToLocalStorage('mainCompany.industry.revenuePercentage2', cleanValue);
                      }}
                      onblur={() => {
                        if (!field.value) {
                          field.onChange('');
                          memoizedSaveDataToLocalStorage('mainCompany.industry.revenuePercentage2', '');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                    />
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="mainCompany.industry.category2_2"
                control={control}
                render={({ field }) => (
                  <div>
                    <Select
                      name={field.name}
                      id={field.name}
                      label="２位の売上 - 業種目中分類"
                      required={true}
                      value={field.value}
                      error={errors.mainCompany?.industry?.category2_2?.message}
                      options={secondLevelIndustries}
                      onchange={(e) => {
                        field.onChange(e.target.value);
                        memoizedSaveDataToLocalStorage('mainCompany.industry.category2_2', e.target.value);
                      }}
                    />
                  </div>
                )}
              />

              {mainCompanyIndustry.category2_2 && hasChildren(mainCompanyIndustry.category2_2) && (
                <Controller
                  name="mainCompany.industry.category3_2"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        name={field.name}
                        id={field.name}
                        label="２位の売上 - 業種目小分類"
                        required={true}
                        value={field.value}
                        error={errors.mainCompany?.industry?.category3_2?.message}
                        options={thirdLevelIndustries}
                        onchange={(e) => {
                          field.onChange(e.target.value);
                          memoizedSaveDataToLocalStorage('mainCompany.industry.category3_2', e.target.value);
                        }}
                      />
                    </div>
                  )}
                />
              )}
            </div>

            {mainCompanyIndustry.revenuePercentage1 &&
              mainCompanyIndustry.revenuePercentage2 &&
              parseInt(mainCompanyIndustry.revenuePercentage1 || '0') +
                parseInt(mainCompanyIndustry.revenuePercentage2 || '0') <
                50 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="mainCompany.industry.revenuePercentage3"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Input
                            type="text"
                            name={field.name}
                            id={field.name}
                            label="３位の売上"
                            required={true}
                            placeholder="%"
                            value={field.value ? `${field.value}` : ''}
                            error={errors.mainCompany?.industry?.revenuePercentage3?.message}
                            onchange={(e) => {
                              const value = e.target.value.replace(/[^\d]/g, '');
                              const cleanValue = value === '0' ? '' : value.replace(/^0+/, '');
                              field.onChange(cleanValue);
                              memoizedSaveDataToLocalStorage('mainCompany.industry.revenuePercentage3', cleanValue);
                            }}
                            onblur={() => {
                              if (!field.value) {
                                field.onChange('');
                                memoizedSaveDataToLocalStorage('mainCompany.industry.revenuePercentage3', '');
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="mainCompany.industry.category2_3"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Select
                            name={field.name}
                            id={field.name}
                            label="３位の売上 - 業種目中分類"
                            required={true}
                            value={field.value}
                            error={errors.mainCompany?.industry?.category2_3?.message}
                            options={secondLevelIndustries}
                            onchange={(e) => {
                              field.onChange(e.target.value);
                              memoizedSaveDataToLocalStorage('mainCompany.industry.category2_3', e.target.value);
                            }}
                          />
                        </div>
                      )}
                    />

                    {mainCompanyIndustry.category2_3 && hasChildren(mainCompanyIndustry.category2_3) && (
                      <Controller
                        name="mainCompany.industry.category3_3"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Select
                              name={field.name}
                              id={field.name}
                              label="３位の売上 - 業種目小分類"
                              required={true}
                              value={field.value}
                              error={errors.mainCompany?.industry?.category3_3?.message}
                              options={thirdLevelIndustries}
                              onchange={(e) => {
                                field.onChange(e.target.value);
                                memoizedSaveDataToLocalStorage('mainCompany.industry.category3_3', e.target.value);
                              }}
                            />
                          </div>
                        )}
                      />
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Main Company Financial Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="mainCompany.financial.profit"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                type="text"
                name={field.name}
                id={field.name}
                label="利益（1年目〜10年目）"
                required={false}
                placeholder="利益を入力してください（単位：円）"
                value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
                error={errors.mainCompany?.financial?.profit?.message}
                onchange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  const cleanValue = value === '0' ? '0' : value.replace(/^0+/, '');
                  const formattedValue = formatNumber(cleanValue);
                  field.onChange(formattedValue);
                  memoizedSaveDataToLocalStorage('mainCompany.financial.profit', formattedValue);
                }}
                onblur={() => {
                  if (!field.value) {
                    field.onChange('0');
                    memoizedSaveDataToLocalStorage('mainCompany.financial.profit', '0');
                  }
                }}
              />
              <p className="text-sm text-gray-600 mt-1">
                ※記載がない場合には前年度利益と同額と仮定します。
              </p>
            </div>
          )}
        />

        <Controller
          name="mainCompany.financial.dividends"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                type="text"
                name={field.name}
                id={field.name}
                label="配当（1年目〜10年目）"
                required={false}
                placeholder="配当金を入力してください（単位：円）"
                value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
                error={errors.mainCompany?.financial?.dividends?.message}
                onchange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  const cleanValue = value === '0' ? '0' : value.replace(/^0+/, '');
                  const formattedValue = formatNumber(cleanValue);
                  field.onChange(formattedValue);
                  memoizedSaveDataToLocalStorage('mainCompany.financial.dividends', formattedValue);
                }}
                onblur={() => {
                  if (!field.value) {
                    field.onChange('0');
                    memoizedSaveDataToLocalStorage('mainCompany.financial.dividends', '0');
                  }
                }}
              />
            </div>
          )}
        />
      </div>

      {/* Subsidiaries Section */}
      {applicationType === '子会社含む' && subsidiariesCount > 0 && (
        <>
          {fields.map((field, index) => (
            <div key={field.id} className="mt-2">
              <h3 className="text-lg font-semibold mb-3">子会社 {index + 1} 情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Controller
                  name={`subsidiaries.${index}.industry.category1`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        name={field.name}
                        id={field.name}
                        label="業種目大分類"
                        required={true}
                        value={field.value}
                        error={errors.subsidiaries?.[index]?.industry?.category1?.message}
                        options={topLevelIndustries}
                        onchange={(e) => {
                          field.onChange(e.target.value);
                          ensureSubsidiaryStructure(index);
                          memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.category1`, e.target.value);
                        }}
                      />
                    </div>
                  )}
                />

                {subsidiaries[index]?.industry?.category1 && hasChildren(subsidiaries[index]?.industry?.category1) && (
                  <Controller
                    name={`subsidiaries.${index}.industry.category2`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Select
                          name={field.name}
                          id={field.name}
                          label="業種目中分類"
                          required={true}
                          value={field.value}
                          error={errors.subsidiaries?.[index]?.industry?.category2?.message}
                          options={subsidiaryIndustries[index]?.secondLevel || [{ value: '', label: '選択してください' }]}
                          onchange={(e) => {
                            field.onChange(e.target.value);
                            ensureSubsidiaryStructure(index);
                            memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.category2`, e.target.value);
                          }}
                        />
                      </div>
                    )}
                  />
                )}

                {subsidiaries[index]?.industry?.category2 && hasChildren(subsidiaries[index]?.industry?.category2) && (
                  <Controller
                    name={`subsidiaries.${index}.industry.category3`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Select
                          name={field.name}
                          id={field.name}
                          label="業種目小分類"
                          required={true}
                          value={field.value}
                          error={errors.subsidiaries?.[index]?.industry?.category3?.message}
                          options={subsidiaryIndustries[index]?.thirdLevel || [{ value: '', label: '選択してください' }]}
                          onchange={(e) => {
                            field.onChange(e.target.value);
                            ensureSubsidiaryStructure(index);
                            memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.category3`, e.target.value);
                          }}
                        />
                      </div>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">業種区分特例</label>
                  <div className="space-y-2">
                    <Controller
                      name={`subsidiaries.${index}.industry.specialCase`}
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Radio
                            name={field.name}
                            id={`${field.name}_over50`}
                            title="主たる事業の売上が全体売上の50％超である"
                            value="over50"
                            checked={field.value === 'over50'}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              ensureSubsidiaryStructure(index);
                              memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.specialCase`, e.target.value);
                            }}
                          />
                          <Radio
                            name={field.name}
                            id={`${field.name}_under50`}
                            title="主たる事業の売上が全体売上の50％以下である"
                            value="under50"
                            checked={field.value === 'under50'}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              ensureSubsidiaryStructure(index);
                              memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.specialCase`, e.target.value);
                            }}
                          />
                          {errors.subsidiaries?.[index]?.industry?.specialCase && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.subsidiaries[index].industry.specialCase.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {subsidiaries[index]?.industry?.specialCase === 'under50' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name={`subsidiaries.${index}.industry.revenuePercentage1`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              type="text"
                              name={field.name}
                              id={field.name}
                              label="主たる事業の売上"
                              required={true}
                              placeholder="%"
                              value={field.value ? `${field.value}` : ''}
                              error={errors.subsidiaries?.[index]?.industry?.revenuePercentage1?.message}
                              onchange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                const cleanValue = value === '0' ? '' : value.replace(/^0+/, '');
                                field.onChange(cleanValue);
                                ensureSubsidiaryStructure(index);
                                memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.revenuePercentage1`, cleanValue);
                              }}
                              onblur={() => {
                                if (!field.value) {
                                  field.onChange('');
                                  ensureSubsidiaryStructure(index);
                                  memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.revenuePercentage1`, '');
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                            />
                          </div>
                        )}
                      />

                      <Controller
                        name={`subsidiaries.${index}.industry.revenuePercentage2`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              type="text"
                              name={field.name}
                              id={field.name}
                              label="２位の売上"
                              required={true}
                              placeholder="%"
                              value={field.value ? `${field.value}` : ''}
                              error={errors.subsidiaries?.[index]?.industry?.revenuePercentage2?.message}
                              onchange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                const cleanValue = value === '0' ? '' : value.replace(/^0+/, '');
                                field.onChange(cleanValue);
                                ensureSubsidiaryStructure(index);
                                memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.revenuePercentage2`, cleanValue);
                              }}
                              onblur={() => {
                                if (!field.value) {
                                  field.onChange('');
                                  ensureSubsidiaryStructure(index);
                                  memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.revenuePercentage2`, '');
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name={`subsidiaries.${index}.industry.category2_2`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Select
                              name={field.name}
                              id={field.name}
                              label="２位の売上 - 業種目中分類"
                              required={true}
                              value={field.value}
                              error={errors.subsidiaries?.[index]?.industry?.category2_2?.message}
                              options={subsidiaryIndustries[index]?.secondLevel_2 || [{ value: '', label: '選択してください' }]}
                              onchange={(e) => {
                                field.onChange(e.target.value);
                                ensureSubsidiaryStructure(index);
                                memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.category2_2`, e.target.value);
                              }}
                            />
                          </div>
                        )}
                      />

                      {subsidiaries[index]?.industry?.category2_2 && hasChildren(subsidiaries[index]?.industry?.category2_2) && (
                        <Controller
                          name={`subsidiaries.${index}.industry.category3_2`}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Select
                                name={field.name}
                                id={field.name}
                                label="２位の売上 - 業種目小分類"
                                required={true}
                                value={field.value}
                                error={errors.subsidiaries?.[index]?.industry?.category3_2?.message}
                                options={subsidiaryIndustries[index]?.thirdLevel_2 || [{ value: '', label: '選択してください' }]}
                                onchange={(e) => {
                                  field.onChange(e.target.value);
                                  ensureSubsidiaryStructure(index);
                                  memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.category3_2`, e.target.value);
                                }}
                              />
                            </div>
                          )}
                        />
                      )}
                    </div>

                    {subsidiaries[index]?.industry?.revenuePercentage1 &&
                      subsidiaries[index]?.industry?.revenuePercentage2 &&
                      parseInt(subsidiaries[index]?.industry?.revenuePercentage1 || '0') +
                        parseInt(subsidiaries[index]?.industry?.revenuePercentage2 || '0') <
                        50 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                              name={`subsidiaries.${index}.industry.revenuePercentage3`}
                              control={control}
                              render={({ field }) => (
                                <div>
                                  <Input
                                    type="text"
                                    name={field.name}
                                    id={field.name}
                                    label="３位の売上"
                                    required={true}
                                    placeholder="%"
                                    value={field.value ? `${field.value}` : ''}
                                    error={errors.subsidiaries?.[index]?.industry?.revenuePercentage3?.message}
                                    onchange={(e) => {
                                      const value = e.target.value.replace(/[^\d]/g, '');
                                      const cleanValue = value === '0' ? '' : value.replace(/^0+/, '');
                                      field.onChange(cleanValue);
                                      ensureSubsidiaryStructure(index);
                                      memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.revenuePercentage3`, cleanValue);
                                    }}
                                    onblur={() => {
                                      if (!field.value) {
                                        field.onChange('');
                                        ensureSubsidiaryStructure(index);
                                        memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.revenuePercentage3`, '');
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        (e.target as HTMLInputElement).blur();
                                      }
                                    }}
                                  />
                                </div>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                              name={`subsidiaries.${index}.industry.category2_3`}
                              control={control}
                              render={({ field }) => (
                                <div>
                                  <Select
                                    name={field.name}
                                    id={field.name}
                                    label="３位の売上 - 業種目中分類"
                                    required={true}
                                    value={field.value}
                                    error={errors.subsidiaries?.[index]?.industry?.category2_3?.message}
                                    options={subsidiaryIndustries[index]?.secondLevel_3 || [{ value: '', label: '選択してください' }]}
                                    onchange={(e) => {
                                      field.onChange(e.target.value);
                                      ensureSubsidiaryStructure(index);
                                      memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.category2_3`, e.target.value);
                                    }}
                                  />
                                </div>
                              )}
                            />

                            {subsidiaries[index]?.industry?.category2_3 && hasChildren(subsidiaries[index]?.industry?.category2_3) && (
                              <Controller
                                name={`subsidiaries.${index}.industry.category3_3`}
                                control={control}
                                render={({ field }) => (
                                  <div>
                                    <Select
                                      name={field.name}
                                      id={field.name}
                                      label="３位の売上 - 業種目小分類"
                                      required={true}
                                      value={field.value}
                                      error={errors.subsidiaries?.[index]?.industry?.category3_3?.message}
                                      options={subsidiaryIndustries[index]?.thirdLevel_3 || [{ value: '', label: '選択してください' }]}
                                      onchange={(e) => {
                                        field.onChange(e.target.value);
                                        ensureSubsidiaryStructure(index);
                                        memoizedSaveDataToLocalStorage(`subsidiaries.${index}.industry.category3_3`, e.target.value);
                                      }}
                                    />
                                  </div>
                                )}
                              />
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`subsidiaries.${index}.financial.profit`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        type="text"
                        name={field.name}
                        id={field.name}
                        label="利益（1年目〜10年目）"
                        required={false}
                        placeholder="利益を入力してください（単位：円）"
                        value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
                        error={errors.subsidiaries?.[index]?.financial?.profit?.message}
                        onchange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          const cleanValue = value === '0' ? '0' : value.replace(/^0+/, '');
                          const formattedValue = formatNumber(cleanValue);
                          field.onChange(formattedValue);
                          ensureSubsidiaryStructure(index);
                          memoizedSaveDataToLocalStorage(`subsidiaries.${index}.financial.profit`, formattedValue);
                        }}
                        onblur={() => {
                          if (!field.value) {
                            field.onChange('0');
                            ensureSubsidiaryStructure(index);
                            memoizedSaveDataToLocalStorage(`subsidiaries.${index}.financial.profit`, '0');
                          }
                        }}
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        ※記載がない場合には前年度利益と同額と仮定します。
                      </p>
                    </div>
                  )}
                />

                <Controller
                  name={`subsidiaries.${index}.financial.dividends`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        type="text"
                        name={field.name}
                        id={field.name}
                        label="配当（1年目〜10年目）"
                        required={false}
                        placeholder="配当金を入力してください（単位：円）"
                        value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
                        error={errors.subsidiaries?.[index]?.financial?.dividends?.message}
                        onchange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          const cleanValue = value === '0' ? '0' : value.replace(/^0+/, '');
                          const formattedValue = formatNumber(cleanValue);
                          field.onChange(formattedValue);
                          ensureSubsidiaryStructure(index);
                          memoizedSaveDataToLocalStorage(`subsidiaries.${index}.financial.dividends`, formattedValue);
                        }}
                        onblur={() => {
                          if (!field.value) {
                            field.onChange('0');
                            ensureSubsidiaryStructure(index);
                            memoizedSaveDataToLocalStorage(`subsidiaries.${index}.financial.dividends`, '0');
                          }
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          ))}
        </>
      )}
      <div className="h-px bg-[#eee] my-5"></div>
    </HeaderSection>
  );
};

export default BusinessInformation;
