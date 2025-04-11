import { Controller } from 'react-hook-form'
import Input from '../components/input'
import { formatNumber } from '../utils/utils'
import Radio from '../components/radio'

const InheritedAssets = ({ control, errors, saveDataToLocalStorage }: any) => {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }

  return (
    <>
      <div className='h1 text-center text-[25px]'>相続資産</div>
      <div className='mt-3'>
        <label className='block font-medium text-[12px]'>
          配偶者の有無 <span className='text-red-500'>※</span>
        </label>
        <div className='flex gap-4 items-center'>
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
                  className='form-radio'
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
                  className='form-radio'
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
          <span className='text-red-500 text-sm mt-1'>
            {errors.maritalStatus.message}
          </span>
        )}
      </div>

      <div className='mt-3'>
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
              className='form-input'
              error={errors.numberOfChildren?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('numberOfChildren', field.value)}
              value={field.value}
            />
          )}
        />
      </div>
      <div className='mt-3'>
        <Controller
          name='cashAndDeposits'
          control={control}
          render={({ field }) => (
            <Input
              label='現預金'
              id='cashAndDeposits'
              type='text'
              name='cashAndDeposits'
              placeholder='現預金を入力してください'
              className='form-input'
              error={errors.cashAndDeposits?.message}
              onchange={(e) => {
                const formattedValue = formatNumber(e.target.value)
                field.onChange(formattedValue)
                saveDataToLocalStorage('cashAndDeposits', formattedValue)
              }}
              value={field.value ? formatNumber(field.value) : ''}
            />
          )}
        />
      </div>
      <div className='mt-3'>
        <Controller
          name='retirementBenefits'
          control={control}
          render={({ field }) => (
            <Input
              label='退職金（支給予定額）'
              id='retirementBenefits'
              type='text'
              name='retirementBenefits'
              placeholder='退職金を入力してください'
              className='form-input'
              error={errors.retirementBenefits?.message}
              onchange={(e) => {
                const formattedValue = formatNumber(e.target.value)
                field.onChange(formattedValue)
                saveDataToLocalStorage('retirementBenefits', formattedValue)
              }}
              value={field.value ? formatNumber(field.value) : ''}
            />
          )}
        />
      </div>
      <div className='mt-3'>
        <Controller
          name='realEstate'
          control={control}
          render={({ field }) => (
            <Input
              label='不動産'
              id='realEstate'
              type='text'
              name='realEstate'
              placeholder='不動産を入力してください'
              className='form-input'
              error={errors.realEstate?.message}
              onchange={(e) => {
                const formattedValue = formatNumber(e.target.value)
                field.onChange(formattedValue)
                saveDataToLocalStorage('realEstate', formattedValue)
              }}
              value={field.value ? formatNumber(field.value) : ''}
            />
          )}
        />
      </div>
      <div className='mt-3'>
        <Controller
          name='securities'
          control={control}
          render={({ field }) => (
            <Input
              label='有価証券（自社株以外）'
              id='securities'
              type='text'
              name='securities'
              placeholder='有価証券を入力してください'
              className='form-input'
              error={errors.securities?.message}
              onchange={(e) => {
                const formattedValue = formatNumber(e.target.value)
                field.onChange(formattedValue)
                saveDataToLocalStorage('securities', formattedValue)
              }}
              value={field.value ? formatNumber(field.value) : ''}
            />
          )}
        />
      </div>
      <div className='mt-3'>
        <Controller
          name='amountOfLifeInsurance'
          control={control}
          render={({ field }) => (
            <Input
              label='生命保険等の額
'
              id='amountOfLifeInsurance'
              type='text'
              name='amountOfLifeInsurance'
              placeholder='生命保険等の額を入力してください'
              className='form-input'
              error={errors.amountOfLifeInsurance?.message}
              onchange={(e) => {
                const formattedValue = formatNumber(e.target.value)
                field.onChange(formattedValue)
                saveDataToLocalStorage('amountOfLifeInsurance', formattedValue)
              }}
              value={field.value ? formatNumber(field.value) : ''}
            />
          )}
        />
      </div>
      <div className='mt-3'>
        <Controller
          name='otherAssets'
          control={control}
          render={({ field }) => (
            <Input
              label='その他財産（貸付金等）'
              id='otherAssets'
              type='text'
              name='otherAssets'
              placeholder='その他財産を入力してください'
              className='form-input'
              error={errors.otherAssets?.message}
              onchange={(e) => {
                const formattedValue = formatNumber(e.target.value)
                field.onChange(formattedValue)
                saveDataToLocalStorage('otherAssets', formattedValue)
              }}
              value={field.value ? formatNumber(field.value) : ''}
            />
          )}
        />
      </div>
      <div className='mt-3'>
        <Controller
          name='debts'
          control={control}
          render={({ field }) => (
            <Input
              label='債務'
              id='debts'
              type='text'
              name='debts'
              placeholder='債務を入力してください'
              className='form-input'
              error={errors.debts?.message}
              onchange={(e) => {
                const formattedValue = formatNumber(e.target.value)
                field.onChange(formattedValue)
                saveDataToLocalStorage('debts', formattedValue)
              }}
              value={field.value ? formatNumber(field.value) : ''}
            />
          )}
        />
      </div>
    </>
  )
}

export default InheritedAssets
