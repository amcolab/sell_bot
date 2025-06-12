import { Controller, useFieldArray, useWatch, Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Input from '../components/input';
import Select from '../components/select';
import { formatNumber } from '../utils/utils';
import {
  getTopLevelIndustries,
  getChildIndustries,
  convertToSelectOptions,
  hasChildren,
  getIndustryById,
} from '../utils/industryUtils';
import Radio from '../components/radio';
import HeaderSection from '../components/header-section';
import isEqual from 'lodash/isEqual';

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
  category1_2: string;
  category1_3: string;
  hasChildren: boolean;
  hasChildren2: boolean;
  hasChildren3: boolean;
}

interface Financial {
  profit: string;
  dividends: string;
}

interface Subsidiary {
  industry: {
    category1: string;
    category2: string;
    category3: string;
    hasChildren: boolean;
  };
  financial: {
    profit: string;
  };
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
  control: any;
  errors: FieldErrors<FormValues>;
  saveDataToLocalStorage: (key: string, value: string) => void;
  ensureSubsidiaryStructure: (index: number) => void;
  setValue: UseFormSetValue<FormValues>;
  setError: any
}

const BusinessInformation = ({
  control,
  errors,
  saveDataToLocalStorage,
  ensureSubsidiaryStructure,
  setValue,
  setError,
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
      category1_2: '',
      category2_2: '',
      category3_2: '',
      category1_3: '',
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
  const [secondLevelIndustries2, setSecondLevelIndustries2] = useState([
    { value: '', label: '選択してください' },
  ]);
  const [thirdLevelIndustries2, setThirdLevelIndustries2] = useState([
    { value: '', label: '選択してください' },
  ]);
  const [secondLevelIndustries3, setSecondLevelIndustries3] = useState([
    { value: '', label: '選択してください' },
  ]);
  const [thirdLevelIndustries3, setThirdLevelIndustries3] = useState([
    { value: '', label: '選択してください' },
  ]);

  // Memoize initial subsidiaryIndustries
  const initialSubsidiaryIndustries = useMemo(
    () =>
      Array(subsidiariesCount).fill({
        secondLevel: [{ value: '', label: '選択してください' }],
        thirdLevel: [{ value: '', label: '選択してください' }],
      }),
    [subsidiariesCount]
  );

  const [subsidiaryIndustries, setSubsidiaryIndustries] = useState(initialSubsidiaryIndustries);

  // Add a ref to track previous subsidiaries count
  const prevSubsidiariesCountRef = useRef(subsidiariesCount);

  useEffect(() => {
    // Only run if subsidiaries count has changed
    if (applicationType === '子会社含む' && subsidiariesCount > 0 && prevSubsidiariesCountRef.current !== subsidiariesCount) {
      const currentFields = fields;
      const newFields = Array(subsidiariesCount)
        .fill(null)
        .map((_, index) => {
          // If we have existing data for this index, use it
          if (currentFields[index]) {
            return currentFields[index];
          }
          // Otherwise create new empty fields
          return {
            industry: {
              category1: '',
              category2: '',
              category3: '',
              hasChildren: false,
            },
            financial: {
              profit: '0',
            },
          };
        }) as Subsidiary[];
      replace(newFields);
      prevSubsidiariesCountRef.current = subsidiariesCount;
    } else if (applicationType !== '子会社含む') {
      replace([]);
      prevSubsidiariesCountRef.current = 0;
    }
  }, [applicationType, subsidiariesCount, replace]);

  // Update second level industries for main company (category1 → category2)
  useEffect(() => {
    if (mainCompanyIndustry.category1) {
      const parentId = parseInt(mainCompanyIndustry.category1);
      const children = getChildIndustries(parentId);
      const newOptions = convertToSelectOptions(children);
      const hasChildren = children.length > 0;

      setSecondLevelIndustries((prev) => {
        if (!isEqual(prev, newOptions)) {
          return newOptions;
        }
        return prev;
      });

      setValue('mainCompany.industry.hasChildren', hasChildren, { shouldValidate: false });
    } else {
      setSecondLevelIndustries((prev) => {
        const defaultOption = [{ value: '', label: '選択してください' }];
        if (!isEqual(prev, defaultOption)) {
          return defaultOption;
        }
        return prev;
      });
      if (mainCompanyIndustry.category2 !== '') {
        setValue('mainCompany.industry.category2', '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage('mainCompany.industry.category2', '');
      }
      if (mainCompanyIndustry.category3 !== '') {
        setValue('mainCompany.industry.category3', '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage('mainCompany.industry.category3', '');
      }
      setValue('mainCompany.industry.hasChildren', false, { shouldValidate: false });
    }
  }, [mainCompanyIndustry.category1, mainCompanyIndustry.category2, mainCompanyIndustry.category3, setValue, memoizedSaveDataToLocalStorage]);

  // Update third level industries for main company (category2 → category3)
  useEffect(() => {
    if (mainCompanyIndustry.category2) {
      const parentId = parseInt(mainCompanyIndustry.category2);
      const children = getChildIndustries(parentId);
      const newOptions = convertToSelectOptions(children);
      const hasChildren = children.length > 0;

      setThirdLevelIndustries((prev) => {
        if (!isEqual(prev, newOptions)) {
          return newOptions;
        }
        return prev;
      });

      setValue('mainCompany.industry.hasChildren', hasChildren, { shouldValidate: false });
    } else {
      setThirdLevelIndustries((prev) => {
        const defaultOption = [{ value: '', label: '選択してください' }];
        if (!isEqual(prev, defaultOption)) {
          return defaultOption;
        }
        return prev;
      });
      if (mainCompanyIndustry.category3 !== '') {
        setValue('mainCompany.industry.category3', '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage('mainCompany.industry.category3', '');
      }
    }
  }, [mainCompanyIndustry.category2, mainCompanyIndustry.category3, setValue, memoizedSaveDataToLocalStorage]);

  // Update second level industries for second revenue source (category1_2 → category2_2)
  useEffect(() => {
    if (mainCompanyIndustry.category1_2) {
      const parentId = parseInt(mainCompanyIndustry.category1_2);
      const children = getChildIndustries(parentId);
      const newOptions = convertToSelectOptions(children);
      const hasChildren = children.length > 0;

      setSecondLevelIndustries2((prev) => {
        if (!isEqual(prev, newOptions)) {
          return newOptions;
        }
        return prev;
      });

      setValue('mainCompany.industry.hasChildren2', hasChildren, { shouldValidate: false });
    } else {
      setSecondLevelIndustries2((prev) => {
        const defaultOption = [{ value: '', label: '選択してください' }];
        if (!isEqual(prev, defaultOption)) {
          return defaultOption;
        }
        return prev;
      });
      if (mainCompanyIndustry.category2_2 !== '') {
        setValue('mainCompany.industry.category2_2', '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage('mainCompany.industry.category2_2', '');
      }
      if (mainCompanyIndustry.category3_2 !== '') {
        setValue('mainCompany.industry.category3_2', '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage('mainCompany.industry.category3_2', '');
      }
    }
  }, [mainCompanyIndustry.category1_2, mainCompanyIndustry.category2_2, mainCompanyIndustry.category3_2, setValue, memoizedSaveDataToLocalStorage]);

  // Update third level industries for second revenue source (category2_2 → category3_2)
  useEffect(() => {
    if (mainCompanyIndustry.category2_2) {
      const parentId = parseInt(mainCompanyIndustry.category2_2);
      const children = getChildIndustries(parentId);
      const newOptions = convertToSelectOptions(children);
      const hasChildren = children.length > 0;

      setThirdLevelIndustries2((prev) => {
        if (!isEqual(prev, newOptions)) {
          return newOptions;
        }
        return prev;
      });

      setValue('mainCompany.industry.hasChildren2', hasChildren, { shouldValidate: false });
    } else {
      setThirdLevelIndustries2((prev) => {
        const defaultOption = [{ value: '', label: '選択してください' }];
        if (!isEqual(prev, defaultOption)) {
          return defaultOption;
        }
        return prev;
      });
      if (mainCompanyIndustry.category3_2 !== '') {
        setValue('mainCompany.industry.category3_2', '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage('mainCompany.industry.category3_2', '');
      }
    }
  }, [mainCompanyIndustry.category2_2, mainCompanyIndustry.category3_2, setValue, memoizedSaveDataToLocalStorage]);

  // Update second level industries for third revenue source (category1_3 → category2_3)
  useEffect(() => {
    if (mainCompanyIndustry.category1_3) {
      const parentId = parseInt(mainCompanyIndustry.category1_3);
      const children = getChildIndustries(parentId);
      const newOptions = convertToSelectOptions(children);
      const hasChildren = children.length > 0;

      setSecondLevelIndustries3((prev) => {
        if (!isEqual(prev, newOptions)) {
          return newOptions;
        }
        return prev;
      });

      setValue('mainCompany.industry.hasChildren3', hasChildren, { shouldValidate: false });
    } else {
      setSecondLevelIndustries3((prev) => {
        const defaultOption = [{ value: '', label: '選択してください' }];
        if (!isEqual(prev, defaultOption)) {
          return defaultOption;
        }
        return prev;
      });
      if (mainCompanyIndustry.category2_3 !== '') {
        setValue('mainCompany.industry.category2_3', '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage('mainCompany.industry.category2_3', '');
      }
      if (mainCompanyIndustry.category3_3 !== '') {
        setValue('mainCompany.industry.category3_3', '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage('mainCompany.industry.category3_3', '');
      }
    }
  }, [mainCompanyIndustry.category1_3, mainCompanyIndustry.category2_3, mainCompanyIndustry.category3_3, setValue, memoizedSaveDataToLocalStorage]);

  // Update third level industries for third revenue source (category2_3 → category3_3)
  useEffect(() => {
    if (mainCompanyIndustry.category2_3) {
      const parentId = parseInt(mainCompanyIndustry.category2_3);
      const children = getChildIndustries(parentId);
      const newOptions = convertToSelectOptions(children);
      const hasChildren = children.length > 0;

      setThirdLevelIndustries3((prev) => {
        if (!isEqual(prev, newOptions)) {
          return newOptions;
        }
        return prev;
      });

      setValue('mainCompany.industry.hasChildren3', hasChildren, { shouldValidate: false });
    } else {
      setThirdLevelIndustries3((prev) => {
        const defaultOption = [{ value: '', label: '選択してください' }];
        if (!isEqual(prev, defaultOption)) {
          return defaultOption;
        }
        return prev;
      });
      if (mainCompanyIndustry.category3_3 !== '') {
        setValue('mainCompany.industry.category3_3', '', { shouldValidate: false });
        memoizedSaveDataToLocalStorage('mainCompany.industry.category3_3', '');
      }
    }
  }, [mainCompanyIndustry.category2_3, mainCompanyIndustry.category3_3, setValue, memoizedSaveDataToLocalStorage]);

  // Handle revenuePercentage3 reset for main company
  useEffect(() => {
    const rev1 = parseInt(mainCompanyIndustry.revenuePercentage1 || '0');
    const rev2 = parseInt(mainCompanyIndustry.revenuePercentage2 || '0');
    const rev3 = mainCompanyIndustry.revenuePercentage3;
    if (rev1 + rev2 >= 50 && rev3 !== '') {
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

  // Update subsidiary industry options
  useEffect(() => {
    const newSubsidiaryIndustries = subsidiaries.map((_: any, index: number) => {
      const secondLevel = subsidiaries[index]?.industry?.category1
        ? convertToSelectOptions(getChildIndustries(parseInt(subsidiaries[index].industry.category1)))
        : [{ value: '', label: '選択してください' }];
  
      const thirdLevel = subsidiaries[index]?.industry?.category2
        ? convertToSelectOptions(getChildIndustries(parseInt(subsidiaries[index].industry.category2)))
        : [{ value: '', label: '選択してください' }];
  
      // Only update hasChildren if it has changed
      if (subsidiaries[index]?.industry?.category1) {
        const hasChildren = secondLevel.length > 1;
        if (subsidiaries[index].industry.hasChildren !== hasChildren) {
          setValue(`subsidiaries.${index}.industry.hasChildren`, hasChildren, {
            shouldValidate: false,
            shouldDirty: false, // Prevent form state changes that trigger re-renders
          });
        }
      }
  
      if (subsidiaries[index]?.industry?.category2) {
        const hasChildren = thirdLevel.length > 1;
        if (subsidiaries[index].industry.hasChildren !== hasChildren) {
          setValue(`subsidiaries.${index}.industry.hasChildren`, hasChildren, {
            shouldValidate: false,
            shouldDirty: false,
          });
        }
      }
  
      return {
        secondLevel,
        thirdLevel,
      };
    });
  
    setSubsidiaryIndustries((prev) => {
      if (!isEqual(prev, newSubsidiaryIndustries)) {
        return newSubsidiaryIndustries;
      }
      return prev;
    });
  }, [
    JSON.stringify(subsidiaries.map((s: any) => ({
      category1: s?.industry?.category1,
      category2: s?.industry?.category2,
    }))),
    setValue,
  ]);

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
                  setValue('mainCompany.industry.category2', '');
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
                    setValue('mainCompany.industry.category3', '');
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
          <label className="block text-sm font-medium text-gray-700 mb-2">業種区分特例 <span className="text-[#e74c3c]">*</span></label> 
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
          {errors.mainCompany?.industry?.specialCase && (
          <span className='block mt-1 text-sm text-[#e74c3c]'>
            {errors.mainCompany?.industry?.specialCase?.message}
          </span>
        )}
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
                name="mainCompany.industry.category1_2"
                control={control}
                render={({ field }) => (
                  <div>
                    <Select
                      name={field.name}
                      id={field.name}
                      label="２位の売上 - 業種目大分類"
                      required={true}
                      value={field.value}
                      error={errors.mainCompany?.industry?.category1_2?.message}
                      options={topLevelIndustries}
                      onchange={(e) => {
                        field.onChange(e.target.value);
                        setValue('mainCompany.industry.category2_2', '');
                        memoizedSaveDataToLocalStorage('mainCompany.industry.category1_2', e.target.value);
                      }}
                    />
                  </div>
                )}
              />

              {mainCompanyIndustry.category1_2 && hasChildren(mainCompanyIndustry.category1_2) && (
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
                        options={secondLevelIndustries2}
                        onchange={(e) => {
                          field.onChange(e.target.value);
                          setValue('mainCompany.industry.category3_2', '');
                          memoizedSaveDataToLocalStorage('mainCompany.industry.category2_2', e.target.value);
                        }}
                      />
                    </div>
                  )}
                />
              )}

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
                        options={thirdLevelIndustries2}
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
              parseInt(mainCompanyIndustry.revenuePercentage1) +
                parseInt(mainCompanyIndustry.revenuePercentage2) <
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
                      name="mainCompany.industry.category1_3"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Select
                            name={field.name}
                            id={field.name}
                            label="３位の売上 - 業種目大分類"
                            required={true}
                            value={field.value}
                            error={errors.mainCompany?.industry?.category1_3?.message}
                            options={topLevelIndustries}
                            onchange={(e) => {
                              field.onChange(e.target.value);
                              setValue('mainCompany.industry.category2_3', '');
                              memoizedSaveDataToLocalStorage('mainCompany.industry.category1_3', e.target.value);
                            }}
                          />
                        </div>
                      )}
                    />

                    {mainCompanyIndustry.category1_3 && hasChildren(mainCompanyIndustry.category1_3) && (
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
                              options={secondLevelIndustries3}
                              onchange={(e) => {
                                field.onChange(e.target.value);
                                  setValue('mainCompany.industry.category3_3', '');
                                memoizedSaveDataToLocalStorage('mainCompany.industry.category2_3', e.target.value);
                              }}
                            />
                          </div>
                        )}
                      />
                    )}

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
                              options={thirdLevelIndustries3}
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
                          setValue(`subsidiaries.${index}.industry.category2`, '');
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
                            setValue(`subsidiaries.${index}.industry.category3`, '');
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
