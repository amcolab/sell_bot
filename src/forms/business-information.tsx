import { Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import Input from '../components/input'
import Select from '../components/select'
import { formatNumber } from '../utils/utils'
import {
  getTopLevelIndustries,
  getChildIndustries,
  convertToSelectOptions,
  hasChildren,
} from '../utils/industryUtils'

const BusinessInformation = ({
  control,
  errors,
  saveDataToLocalStorage,
  watch,
  ensureSubsidiaryStructure,
}: any) => {
  const applicationType = watch('applicationType')
  const numberOfSubsidiaries = watch('numberOfSubsidiaries')
  const subsidiariesCount = numberOfSubsidiaries
    ? parseInt(numberOfSubsidiaries)
    : 0

  // 階層的な業種選択のための状態
  const [topLevelIndustries, setTopLevelIndustries] = useState(
    convertToSelectOptions(getTopLevelIndustries())
  )
  const [secondLevelIndustries, setSecondLevelIndustries] = useState([
    { value: '', label: '選択してください' },
  ])
  const [thirdLevelIndustries, setThirdLevelIndustries] = useState([
    { value: '', label: '選択してください' },
  ])

  // Watch for changes in industry selections
  const selectedIndustry1 = watch('mainCompany.industry.category1')
  const selectedIndustry2 = watch('mainCompany.industry.category2')

  // Update second level industries when first level changes
  useEffect(() => {
    if (selectedIndustry1) {
      const children = getChildIndustries(selectedIndustry1)
      setSecondLevelIndustries(convertToSelectOptions(children))
    } else {
      setSecondLevelIndustries([{ value: '', label: '選択してください' }])
      // Only reset child categories if parent is cleared
      saveDataToLocalStorage('mainCompany.industry.category2', '')
      saveDataToLocalStorage('mainCompany.industry.category3', '')
    }
  }, [selectedIndustry1, saveDataToLocalStorage])

  // Update third level industries when second level changes
  useEffect(() => {
    if (selectedIndustry2) {
      const children = getChildIndustries(selectedIndustry2)
      setThirdLevelIndustries(convertToSelectOptions(children))
    } else {
      setThirdLevelIndustries([{ value: '', label: '選択してください' }])
      // Only reset category3 if category2 is cleared
      saveDataToLocalStorage('mainCompany.industry.category3', '')
    }
  }, [selectedIndustry2, saveDataToLocalStorage])

  const subsidiaryIndices =
    subsidiariesCount > 0
      ? Array.from({ length: subsidiariesCount }, (_, i) => i + 1)
      : []

  // Ensure proper data structure for all subsidiaries
  useEffect(() => {
    if (applicationType === '子会社含む' && subsidiariesCount > 0) {
      // Only ensure structure for subsidiaries up to the current count
      for (let i = 1; i <= subsidiariesCount; i++) {
        ensureSubsidiaryStructure(i)
      }
    }
  }, [applicationType, subsidiariesCount, ensureSubsidiaryStructure])

  return (
    <div className='mt-2'>
      <div>
        <h3 className='text-lg font-semibold mb-3'>本社情報</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <Controller
            name='mainCompany.industry.category1'
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  name={field.name}
                  id={field.name}
                  label='業種目大分類'
                  required={true}
                  value={field.value}
                  error={errors.mainCompany?.industry?.category1?.message}
                  options={topLevelIndustries}
                  onchange={(e) => {
                    field.onChange(e)
                    saveDataToLocalStorage(
                      'mainCompany.industry.category1',
                      e.target.value
                    )
                  }}
                />
              </div>
            )}
          />

          {selectedIndustry1 && hasChildren(selectedIndustry1) && (
            <Controller
              name='mainCompany.industry.category2'
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    name={field.name}
                    id={field.name}
                    label='業種目中分類'
                    required={true}
                    value={field.value}
                    error={errors.mainCompany?.industry?.category2?.message}
                    options={secondLevelIndustries}
                    onchange={(e) => {
                      field.onChange(e)
                      saveDataToLocalStorage(
                        'mainCompany.industry.category2',
                        e.target.value
                      )
                    }}
                  />
                </div>
              )}
            />
          )}

          {selectedIndustry2 && hasChildren(selectedIndustry2) && (
            <Controller
              name='mainCompany.industry.category3'
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    name={field.name}
                    id={field.name}
                    label='業種目小分類'
                    required={true}
                    value={field.value}
                    error={errors.mainCompany?.industry?.category3?.message}
                    options={thirdLevelIndustries}
                    onchange={(e) => {
                      field.onChange(e)
                      saveDataToLocalStorage(
                        'mainCompany.industry.category3',
                        e.target.value
                      )
                    }}
                  />
                </div>
              )}
            />
          )}

          <Controller
            name='mainCompany.industry.classification'
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  name={field.name}
                  id={field.name}
                  label='業種区分の例外'
                  required={true}
                  value={field.value}
                  error={errors.mainCompany?.industry?.classification?.message}
                  options={[
                    { value: '', label: '選択してください' },
                    { value: '該当なし', label: '該当なし' },
                  ]}
                  onchange={(e) => {
                    field.onChange(e)
                    saveDataToLocalStorage(
                      'mainCompany.industry.classification',
                      e.target.value
                    )
                  }}
                />
              </div>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Controller
            name='mainCompany.financial.profit'
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  type='text'
                  name={field.name}
                  id={field.name}
                  label='利益（1年目〜10年目）'
                  required={true}
                  placeholder='利益を入力してください'
                  value={field.value ? formatNumber(field.value) : ''}
                  error={errors.mainCompany?.financial?.profit?.message}
                  onchange={(e) => {
                    const formattedValue = formatNumber(e.target.value)
                    field.onChange(formattedValue)
                    saveDataToLocalStorage(
                      'mainCompany.financial.profit',
                      formattedValue
                    )
                  }}
                />
              </div>
            )}
          />

          <Controller
            name='mainCompany.financial.dividends'
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  type='text'
                  name={field.name}
                  id={field.name}
                  label='配当（1年目〜10年目）'
                  required={true}
                  placeholder='配当金を入力してください'
                  value={field.value ? formatNumber(field.value) : ''}
                  error={errors.mainCompany?.financial?.dividends?.message}
                  onchange={(e) => {
                    const formattedValue = formatNumber(e.target.value)
                    field.onChange(formattedValue)
                    saveDataToLocalStorage(
                      'mainCompany.financial.dividends',
                      formattedValue
                    )
                  }}
                />
              </div>
            )}
          />
        </div>
      </div>

      {applicationType === '子会社含む' && subsidiariesCount > 0 && (
        <>
          {errors.subsidiaries &&
            typeof errors.subsidiaries === 'object' &&
            !Array.isArray(errors.subsidiaries) && (
              <div className='mb-4 p-2 bg-red-50 border border-red-200 rounded'>
                <p className='text-red-500 text-sm'>
                  {errors.subsidiaries.message}
                </p>
              </div>
            )}
          {subsidiaryIndices.map((index) => (
            <div key={index} className='mt-2'>
              <h3 className='text-lg font-semibold mb-3'>
                子会社 {index} 情報
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <Controller
                  name={`subsidiaries[${index}].industry.category1`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        name={field.name}
                        id={field.name}
                        label='業種目大分類'
                        required={true}
                        value={field.value}
                        error={
                          errors.subsidiaries?.[index]?.industry?.category1
                            ?.message
                        }
                        options={topLevelIndustries}
                        onchange={(e) => {
                          field.onChange(e)
                          // Ensure correct data structure
                          ensureSubsidiaryStructure(index)
                          saveDataToLocalStorage(
                            `subsidiaries[${index}].industry.category1`,
                            e.target.value
                          )
                        }}
                      />
                    </div>
                  )}
                />

                {watch(`subsidiaries[${index}].industry.category1`) &&
                  hasChildren(
                    watch(`subsidiaries[${index}].industry.category1`)
                  ) && (
                    <Controller
                      name={`subsidiaries[${index}].industry.category2`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Select
                            name={field.name}
                            id={field.name}
                            label='業種目中分類'
                            required={true}
                            value={field.value}
                            error={
                              errors.subsidiaries?.[index]?.industry?.category2
                                ?.message
                            }
                            options={getChildIndustries(
                              watch(`subsidiaries[${index}].industry.category1`)
                            ).map((child) => ({
                              value: child.value,
                              label: child.value,
                            }))}
                            onchange={(e) => {
                              field.onChange(e)
                              // Ensure correct data structure
                              ensureSubsidiaryStructure(index)
                              saveDataToLocalStorage(
                                `subsidiaries[${index}].industry.category2`,
                                e.target.value
                              )
                            }}
                          />
                        </div>
                      )}
                    />
                  )}

                {watch(`subsidiaries[${index}].industry.category2`) &&
                  hasChildren(
                    watch(`subsidiaries[${index}].industry.category2`)
                  ) && (
                    <Controller
                      name={`subsidiaries[${index}].industry.category3`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Select
                            name={field.name}
                            id={field.name}
                            label='業種目小分類'
                            required={true}
                            value={field.value}
                            error={
                              errors.subsidiaries?.[index]?.industry?.category3
                                ?.message
                            }
                            options={getChildIndustries(
                              watch(`subsidiaries[${index}].industry.category2`)
                            ).map((child) => ({
                              value: child.value,
                              label: child.value,
                            }))}
                            onchange={(e) => {
                              field.onChange(e)
                              // Ensure correct data structure
                              ensureSubsidiaryStructure(index)
                              saveDataToLocalStorage(
                                `subsidiaries[${index}].industry.category3`,
                                e.target.value
                              )
                            }}
                          />
                        </div>
                      )}
                    />
                  )}

                <Controller
                  name={`subsidiaries[${index}].industry.classification`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        name={field.name}
                        id={field.name}
                        label='業種分類の例外'
                        required={true}
                        value={field.value}
                        error={
                          errors.subsidiaries?.[index]?.industry?.classification
                            ?.message
                        }
                        options={[
                          { value: '', label: '選択してください' },
                          { value: '該当なし', label: '該当なし' },
                        ]}
                        onchange={(e) => {
                          field.onChange(e)
                          // Ensure correct data structure
                          ensureSubsidiaryStructure(index)
                          saveDataToLocalStorage(
                            `subsidiaries[${index}].industry.classification`,
                            e.target.value
                          )
                        }}
                      />
                    </div>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Controller
                  name={`subsidiaries[${index}].financial.profit`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        type='text'
                        name={field.name}
                        id={field.name}
                        label='利益（1年目〜10年目）'
                        required={true}
                        placeholder='利益を入力してください'
                        value={field.value ? formatNumber(field.value) : ''}
                        error={
                          errors.subsidiaries?.[index]?.financial?.profit
                            ?.message
                        }
                        onchange={(e) => {
                          const formattedValue = formatNumber(e.target.value)
                          field.onChange(formattedValue)
                          // Ensure correct data structure
                          ensureSubsidiaryStructure(index)
                          saveDataToLocalStorage(
                            `subsidiaries[${index}].financial.profit`,
                            formattedValue
                          )
                        }}
                      />
                    </div>
                  )}
                />

                <Controller
                  name={`subsidiaries[${index}].financial.dividends`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        type='text'
                        name={field.name}
                        id={field.name}
                        label='配当（1年目〜10年目）'
                        required={true}
                        placeholder='配当金を入力してください'
                        value={field.value ? formatNumber(field.value) : ''}
                        error={
                          errors.subsidiaries?.[index]?.financial?.dividends
                            ?.message
                        }
                        onchange={(e) => {
                          const formattedValue = formatNumber(e.target.value)
                          field.onChange(formattedValue)
                          // Ensure correct data structure
                          ensureSubsidiaryStructure(index)
                          saveDataToLocalStorage(
                            `subsidiaries[${index}].financial.dividends`,
                            formattedValue
                          )
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
    </div>
  )
}

export default BusinessInformation
