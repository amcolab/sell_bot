import { Controller, useFormContext } from 'react-hook-form'
import Input from '../components/input'
import Radio from '../components/radio'
import HeaderSection from '../components/header-section'
import { formatNumber } from '../utils/utils'

const InheritedAssets = ({
  control,
  errors,
  saveDataToLocalStorage,
  watch,
  setValue,
}: any) => {
  const maritalStatus = watch('maritalStatus')
  const numberOfChildrenWithSpouse = watch('numberOfChildrenWithSpouse') || '0'
  const numberOfOtherChildren = watch('numberOfOtherChildren') || '0'
  const includeSpouseAssets = watch('includeSpouseAssets')
  const numberOfChildren = watch('numberOfChildren') || '0'
  const totalChildren =
    Number(numberOfChildrenWithSpouse) + Number(numberOfOtherChildren) + Number(numberOfChildren)

  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }

  const resetFields = (fields: string[]) => {
    fields.forEach((field) => {
      setValue(field, '')
      handleBlur(field, '')
    })
  }

  return (
    <HeaderSection title='相続税シミュレーション' stepNumber={6}>
      {/* Statutory Heir Confirmation */}
      <div className='mb-5'>
        <h3 className='text-lg font-semibold mb-3'>法定相続人確認</h3>
        <label className='block mb-1.5 text-[#0a2e52] text-sm font-medium'>
          配偶者の有無 <span className='text-[#e74c3c]'>*</span>
        </label>
        <div className='flex gap-4'>
          <Controller
            name='maritalStatus'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <>
                <Radio
                  id='maritalStatus-yes'
                  type='radio'
                  name='maritalStatus'
                  onChange={() => {
                    field.onChange('はい')
                    handleBlur('maritalStatus', 'はい')
                    resetFields([
                      'numberOfChildrenWithSpouse',
                      'numberOfOtherChildren',
                      'numberOfLivingParents',
                      'numberOfLivingSiblings',
                      'numberOfChildren',
                    ])
                  }}
                  onBlur={field.onBlur}
                  checked={field.value === 'はい'}
                  title='はい'
                  required={true}
                />
                <Radio
                  id='maritalStatus-no'
                  type='radio'
                  name='maritalStatus'
                  onChange={() => {
                    field.onChange('いいえ')
                    handleBlur('maritalStatus', 'いいえ')
                    resetFields([
                      'numberOfChildrenWithSpouse',
                      'numberOfOtherChildren',
                      'numberOfLivingParents',
                      'numberOfLivingSiblings',
                    ])
                  }}
                  onBlur={field.onBlur}
                  checked={field.value === 'いいえ'}
                  title='いいえ'
                />
              </>
            )}
          />
        </div>
        {errors.maritalStatus && (
          <span className='block mt-1 text-sm text-[#e74c3c]'>
            {errors.maritalStatus.message}
          </span>
        )}
      </div>

      {maritalStatus === 'はい' && (
        <>
          <div className='mb-5'>
            <Controller
              name='numberOfChildrenWithSpouse'
              control={control}
              render={({ field }) => (
                <Input
                  label='現在の配偶者との間のお子様の人数'
                  id='numberOfChildrenWithSpouse'
                  type='text'
                  name='numberOfChildrenWithSpouse'
                  placeholder='人数を入力してください'
                  error={errors.numberOfChildrenWithSpouse?.message}
                  onchange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    const cleanValue = value.replace(/^0+/, '') || '0'
                    field.onChange(cleanValue)
                    handleBlur('numberOfChildrenWithSpouse', cleanValue)
                    if (Number(cleanValue) > 0) {
                      resetFields([
                        'numberOfLivingParents',
                        'numberOfLivingSiblings',
                      ])
                    }
                  }}
                  onblur={() => {
                    if (!field.value) {
                      field.onChange('0')
                      handleBlur('numberOfChildrenWithSpouse', '0')
                    }
                  }}
                  value={field.value || '0'}
                />
              )}
            />
          </div>
          <div className='mb-5'>
            <Controller
              name='numberOfOtherChildren'
              control={control}
              render={({ field }) => (
                <Input
                  label='上記以外のお子様の人数'
                  id='numberOfOtherChildren'
                  type='text'
                  name='numberOfOtherChildren'
                  placeholder='人数を入力してください'
                  error={errors.numberOfOtherChildren?.message}
                  onchange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    const cleanValue = value.replace(/^0+/, '') || '0'
                    field.onChange(cleanValue)
                    handleBlur('numberOfOtherChildren', cleanValue)
                    if (Number(cleanValue) > 0) {
                      resetFields([
                        'numberOfLivingParents',
                        'numberOfLivingSiblings',
                      ])
                    }
                  }}
                  onblur={() => {
                    if (!field.value) {
                      field.onChange('0')
                      handleBlur('numberOfOtherChildren', '0')
                    }
                  }}
                  value={field.value || '0'}
                />
              )}
            />
            <p className='text-sm text-gray-500 mt-1'>
              ※前婚など、現在の配偶者以外との間に生まれたお子様の人数
            </p>
          </div>
        </>
      )}

      {maritalStatus === 'いいえ' && (
        <>
          <div className='mb-5'>
            <Controller
              name='numberOfChildren'
              control={control}
              render={({ field }) => (
                <Input
                  label='お子様の人数'
                  id='numberOfChildren'
                  type='text'
                  name='numberOfChildren'
                  placeholder='お子様の人数を入力してください'
                  error={errors.numberOfChildren?.message}
                  onchange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    const cleanValue = value.replace(/^0+/, '') || '0'
                    field.onChange(cleanValue)
                    handleBlur('numberOfChildren', cleanValue)
                    if (Number(cleanValue) > 0) {
                      resetFields([
                        'numberOfLivingParents',
                        'numberOfLivingSiblings',
                      ])
                    }
                  }}
                  onblur={() => {
                    if (!field.value) {
                      field.onChange('0')
                      handleBlur('numberOfChildrenWithSpouse', '0')
                    }
                  }}
                  value={field.value || '0'}
                />
              )}
            />
          </div>
        </>
      )}

      {totalChildren === 0 && (
        <>
          <div className='mb-5'>
            <Controller
              name='numberOfLivingParents'
              control={control}
              render={({ field }) => (
                <Input
                  label='ご存命のご両親'
                  id='numberOfLivingParents'
                  type='text'
                  name='numberOfLivingParents'
                  placeholder='人数を入力してください'
                  error={errors.numberOfLivingParents?.message}
                  onchange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    const cleanValue = value.replace(/^0+/, '') || '0'
                    field.onChange(cleanValue)
                    handleBlur('numberOfLivingParents', cleanValue)
                  }}
                  onblur={() => {
                    if (!field.value) {
                      field.onChange('0')
                      handleBlur('numberOfLivingParents', '0')
                    }
                  }}
                  value={field.value || '0'}
                />
              )}
            />
          </div>
          <div className='mb-5'>
            <Controller
              name='numberOfLivingSiblings'
              control={control}
              render={({ field }) => (
                <Input
                  label='ご存命のご兄弟'
                  id='numberOfLivingSiblings'
                  type='text'
                  name='numberOfLivingSiblings'
                  placeholder='人数を入力してください'
                  error={errors.numberOfLivingSiblings?.message}
                  onchange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    const cleanValue = value.replace(/^0+/, '') || '0'
                    field.onChange(cleanValue)
                    handleBlur('numberOfLivingSiblings', cleanValue)
                  }}
                  onblur={() => {
                    if (!field.value) {
                      field.onChange('0')
                      handleBlur('numberOfLivingSiblings', '0')
                    }
                  }}
                  value={field.value || '0'}
                />
              )}
            />
          </div>
        </>
      )}

      {/* Owner's Information */}
      <div className='mb-5'>
        <h3 className='text-lg font-semibold mb-3'>オーナーの財産</h3>
        <Controller
          name='ownerName'
          control={control}
          render={({ field }) => (
            <Input
              label='オーナー氏名'
              id='ownerName'
              type='text'
              name='ownerName'
              placeholder='氏名を入力してください'
              error={errors.ownerName?.message}
              onchange={(e) => {
                field.onChange(e.target.value)
                handleBlur('ownerName', e.target.value)
              }}
              value={field.value || ''}
            />
          )}
        />
      </div>

      {[
        'cashAndDeposits',
        'retirementBenefits',
        'realEstate',
        'securities',
        'amountOfLifeInsurance',
        'otherAssets',
        'debts',
      ].map((fieldName) => (
        <div className='mb-5' key={fieldName}>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <Input
                label={
                  {
                    cashAndDeposits: '現預金',
                    retirementBenefits: '退職金（支給予定額）',
                    realEstate: '不動産',
                    securities: '有価証券等の金融資産（自社株以外）',
                    amountOfLifeInsurance: '生命保険の額',
                    otherAssets: 'その他財産（貸付金等）',
                    debts: '債務',
                  }[fieldName]
                }
                id={fieldName}
                type='text'
                name={fieldName}
                placeholder={`金額を入力してください（単位：円）`}
                error={errors[fieldName]?.message}
                onchange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '')
                  const cleanValue = value.replace(/^0+/, '') || '0'
                  field.onChange(cleanValue)
                  handleBlur(fieldName, cleanValue)
                }}
                onblur={() => {
                  if (!field.value) {
                    field.onChange('0')
                    handleBlur(fieldName, '0')
                  }
                }}
                value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
              />
            )}
          />
        </div>
      ))}

      {/* Include Spouse's Assets */}
      <div className='mb-4'>
        <label className='block mb-1.5 text-[#0a2e52] text-sm font-medium'>
          配偶者の財産も加える <span className='text-[#e74c3c]'>*</span>
        </label>
        <div className='flex gap-4'>
          <Controller
            name='includeSpouseAssets'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <>
                <Radio
                  id='includeSpouseAssets-yes'
                  type='radio'
                  name='includeSpouseAssets'
                  onChange={() => {
                    field.onChange('はい')
                    handleBlur('includeSpouseAssets', 'はい')
                  }}
                  onBlur={field.onBlur}
                  checked={field.value === 'はい'}
                  title='はい'
                  required={true}
                />
                <Radio
                  id='includeSpouseAssets-no'
                  type='radio'
                  name='includeSpouseAssets'
                  onChange={() => {
                    field.onChange('いいえ')
                    handleBlur('includeSpouseAssets', 'いいえ')
                    // Reset all spouse-related fields when selecting "no"
                    resetFields([
                      'spouseName',
                      'spouseCashAndDeposits',
                      'spouseRetirementBenefits',
                      'spouseRealEstate',
                      'spouseSecurities',
                      'spouseAmountOfLifeInsurance',
                      'spouseOtherAssets',
                      'spouseDebts',
                    ])
                  }}
                  onBlur={field.onBlur}
                  checked={field.value === 'いいえ'}
                  title='いいえ'
                />
              </>
            )}
          />
        </div>
        <div className=''>
          <label className='text-[12px] text-gray-600 mt-1'>※配偶者の財産も含めて相続税シミュレーションをする。</label>
        </div>
        {errors.includeSpouseAssets && (
          <span className='block mt-1 text-sm text-[#e74c3c]'>
            {errors.includeSpouseAssets.message}
          </span>
        )}
      </div>

      {/* Spouse's Assets */}
      {includeSpouseAssets === 'はい' && (
        <>
          <div className='mb-5'>
            <h3 className='text-lg font-semibold mb-3'>配偶者の財産</h3>
            <Controller
              name='spouseName'
              control={control}
              render={({ field }) => (
                <Input
                  label='配偶者氏名'
                  id='spouseName'
                  type='text'
                  name='spouseName'
                  placeholder='氏名を入力してください'
                  error={errors.spouseName?.message}
                  onchange={(e) => {
                    field.onChange(e.target.value)
                    handleBlur('spouseName', e.target.value)
                  }}
                  value={field.value || ''}
                  required={true}
                />
              )}
            />
          </div>

          {[
            'spouseCashAndDeposits',
            'spouseRetirementBenefits',
            'spouseRealEstate',
            'spouseSecurities',
            'spouseAmountOfLifeInsurance',
            'spouseOtherAssets',
            'spouseDebts',
          ].map((fieldName) => (
            <div className='mb-5' key={fieldName}>
              <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                  <Input
                    label={
                      {
                        spouseCashAndDeposits: '現預金',
                        spouseRetirementBenefits: '退職金（支給予定額）',
                        spouseRealEstate: '不動産',
                        spouseSecurities: '有価証券等の金融資産（自社株以外）',
                        spouseAmountOfLifeInsurance: '生命保険の額',
                        spouseOtherAssets: 'その他財産（貸付金等）',
                        spouseDebts: '債務',
                      }[fieldName]
                    }
                    id={fieldName}
                    type='text'
                    name={fieldName}
                    placeholder={`金額を入力してください（単位：円）`}
                    error={errors[fieldName]?.message}
                    onchange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '')
                      const cleanValue = value.replace(/^0+/, '') || '0'
                      field.onChange(cleanValue)
                      handleBlur(fieldName, cleanValue)
                    }}
                    onblur={() => {
                      if (!field.value) {
                        field.onChange('0')
                        handleBlur(fieldName, '0')
                      }
                    }}
                    value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
                  />
                )}
              />
            </div>
          ))}
        </>
      )}
    </HeaderSection>
  )
}

export default InheritedAssets
