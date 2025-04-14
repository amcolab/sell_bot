import { Controller } from 'react-hook-form'
import Input from '../components/input'
import { formatNumber } from '../utils/utils'
import Radio from '../components/radio'

const InheritedAssets = ({ control, errors, saveDataToLocalStorage }: any) => {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }

  return (
    <div className="mt-2">
      <div>
        <h3 className="text-lg font-semibold mb-3">
          <span className="inline-block w-8 h-8 leading-8 text-center text-white bg-[#0a2e52] rounded-full mr-2">
            6
          </span>
          相続資産
        </h3>
      </div>
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
                  id='maritalStatus-introducer'
                  type='radio'
                  name='maritalStatus'
                  onChange={() => {
                    field.onChange('あり')
                    handleBlur('maritalStatus', 'あり')
                  }}
                  onBlur={field.onBlur}
                  checked={field.value === 'あり'}
                  title='あり'
                  required={true}
                />
                <Radio
                  id='maritalStatus-mail'
                  type='radio'
                  name='maritalStatus'
                  onChange={() => {
                    field.onChange('なし')
                    handleBlur('maritalStatus', 'なし')
                  }}
                  onBlur={field.onBlur}
                  checked={field.value === 'なし'}
                  title='なし'
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

      <div className='mb-5'>
        <Controller
          name='numberOfChildren'
          control={control}
          render={({ field }) => (
            <Input
              label='子どもの人数'
              id='numberOfChildren'
              type='text'
              name='numberOfChildren'
              placeholder='子どもの人数を入力してください'
              error={errors.numberOfChildren?.message}
              onchange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value === '0') {
                  field.onChange('0')
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  field.onChange(cleanValue)
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  handleBlur('numberOfChildren', '0')
                } else {
                  handleBlur('numberOfChildren', field.value)
                }
              }}
              value={field.value || '0'}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='cashAndDeposits'
          control={control}
          render={({ field }) => (
            <Input
              label='現預金'
              id='cashAndDeposits'
              type='text'
              name='cashAndDeposits'
              placeholder='現預金を入力してください（単位：円）'
              error={errors.cashAndDeposits?.message}
              onchange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value === '0') {
                  field.onChange('0')
                  saveDataToLocalStorage('cashAndDeposits', '0')
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  const formattedValue = formatNumber(cleanValue)
                  field.onChange(formattedValue)
                  saveDataToLocalStorage('cashAndDeposits', formattedValue)
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  saveDataToLocalStorage('cashAndDeposits', '0')
                }
              }}
              value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='retirementBenefits'
          control={control}
          render={({ field }) => (
            <Input
              label='退職金（支給予定額）'
              id='retirementBenefits'
              type='text'
              name='retirementBenefits'
              placeholder='退職金を入力してください（単位：円）'
              error={errors.retirementBenefits?.message}
              onchange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value === '0') {
                  field.onChange('0')
                  saveDataToLocalStorage('retirementBenefits', '0')
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  const formattedValue = formatNumber(cleanValue)
                  field.onChange(formattedValue)
                  saveDataToLocalStorage('retirementBenefits', formattedValue)
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  saveDataToLocalStorage('retirementBenefits', '0')
                }
              }}
              value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='realEstate'
          control={control}
          render={({ field }) => (
            <Input
              label='不動産'
              id='realEstate'
              type='text'
              name='realEstate'
              placeholder='不動産を入力してください（単位：円）'
              error={errors.realEstate?.message}
              onchange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value === '0') {
                  field.onChange('0')
                  saveDataToLocalStorage('realEstate', '0')
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  const formattedValue = formatNumber(cleanValue)
                  field.onChange(formattedValue)
                  saveDataToLocalStorage('realEstate', formattedValue)
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  saveDataToLocalStorage('realEstate', '0')
                }
              }}
              value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='securities'
          control={control}
          render={({ field }) => (
            <Input
              label='有価証券（自社株以外）'
              id='securities'
              type='text'
              name='securities'
              placeholder='有価証券を入力してください（単位：円）'
              error={errors.securities?.message}
              onchange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value === '0') {
                  field.onChange('0')
                  saveDataToLocalStorage('securities', '0')
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  const formattedValue = formatNumber(cleanValue)
                  field.onChange(formattedValue)
                  saveDataToLocalStorage('securities', formattedValue)
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  saveDataToLocalStorage('securities', '0')
                }
              }}
              value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='amountOfLifeInsurance'
          control={control}
          render={({ field }) => (
            <Input
              label='生命保険等の額'
              id='amountOfLifeInsurance'
              type='text'
              name='amountOfLifeInsurance'
              placeholder='生命保険等の額を入力してください（単位：円）'
              error={errors.amountOfLifeInsurance?.message}
              onchange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value === '0') {
                  field.onChange('0')
                  saveDataToLocalStorage('amountOfLifeInsurance', '0')
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  const formattedValue = formatNumber(cleanValue)
                  field.onChange(formattedValue)
                  saveDataToLocalStorage('amountOfLifeInsurance', formattedValue)
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  saveDataToLocalStorage('amountOfLifeInsurance', '0')
                }
              }}
              value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='otherAssets'
          control={control}
          render={({ field }) => (
            <Input
              label='その他財産（貸付金等）'
              id='otherAssets'
              type='text'
              name='otherAssets'
              placeholder='その他財産を入力してください（単位：円）'
              error={errors.otherAssets?.message}
              onchange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value === '0') {
                  field.onChange('0')
                  saveDataToLocalStorage('otherAssets', '0')
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  const formattedValue = formatNumber(cleanValue)
                  field.onChange(formattedValue)
                  saveDataToLocalStorage('otherAssets', formattedValue)
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  saveDataToLocalStorage('otherAssets', '0')
                }
              }}
              value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='debts'
          control={control}
          render={({ field }) => (
            <Input
              label='債務'
              id='debts'
              type='text'
              name='debts'
              placeholder='債務を入力してください（単位：円）'
              error={errors.debts?.message}
              onchange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value === '0') {
                  field.onChange('0')
                  saveDataToLocalStorage('debts', '0')
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  const formattedValue = formatNumber(cleanValue)
                  field.onChange(formattedValue)
                  saveDataToLocalStorage('debts', formattedValue)
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  saveDataToLocalStorage('debts', '0')
                }
              }}
              value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
            />
          )}
        />
      </div>
      <div className='h-px bg-[#eee] my-5'></div>
    </div>
  )
}

export default InheritedAssets
