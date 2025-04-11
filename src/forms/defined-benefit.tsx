import { Controller } from 'react-hook-form'
import Input from '../components/input'
import { formatNumber } from '../utils/utils'

const DefinedBenefit = ({ control, errors, saveDataToLocalStorage }: any) => {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }

  return (
    <>
      <div className='h1 text-center text-[25px]'>確定給付</div>
      <div className='mt-3'>
        <Controller
          name='currentSalary'
          control={control}
          render={({ field }) => (
            <Input
              label='現在の月額役員報酬'
              id='currentSalary'
              type='text'
              name='currentSalary'
              placeholder='現在の月額役員報酬を入力してください'
              className='form-input'
              error={errors.currentSalary?.message}
              onchange={(e) => {
                const formattedValue = formatNumber(e.target.value)
                field.onChange(formattedValue)
                saveDataToLocalStorage('currentSalary', formattedValue)
              }}
              value={field.value ? formatNumber(field.value) : ''}
              required={true}
            />
          )}
        />
      </div>
      <div className='mt-3'>
        <Controller
          name='numberOfYears'
          control={control}
          render={({ field }) => (
            <Input
              label='取締役勤続年数'
              id='numberOfYears'
              type='text'
              name='numberOfYears'
              placeholder='取締役勤続年数を入力してください'
              className='form-input'
              error={errors.numberOfYears?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('numberOfYears', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
      </div>
    </>
  )
}

export default DefinedBenefit
