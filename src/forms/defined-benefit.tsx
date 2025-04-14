import { Controller } from 'react-hook-form'
import Input from '../components/input'
import { formatNumber } from '../utils/utils'

const DefinedBenefit = ({ control, errors, saveDataToLocalStorage }: any) => {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }

  return (
    <div className="mt-2">
      <div>
        <h3 className="text-lg font-semibold mb-3">
          <span className="inline-block w-8 h-8 leading-8 text-center text-white bg-[#0a2e52] rounded-full mr-2">
            5
          </span>
          確定給付
        </h3>
      </div>
      <div className='mb-5'>
        <Controller
          name='currentSalary'
          control={control}
          render={({ field }) => (
            <Input
              label='現在の月額役員報酬'
              id='currentSalary'
              type='text'
              name='currentSalary'
              placeholder='現在の月額役員報酬を入力してください（単位：円）'
              error={errors.currentSalary?.message}
              onchange={(e) => {
                console.log(e.target.value);
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value === '0') {
                  field.onChange('0')
                  saveDataToLocalStorage('currentSalary', '')
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  const formattedValue = formatNumber(cleanValue)
                  field.onChange(formattedValue)
                  saveDataToLocalStorage('currentSalary', formattedValue)
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  saveDataToLocalStorage('currentSalary', '0')
                }
              }}
              value={field.value ? `¥${formatNumber(field.value)}` : '¥0'}
              required={true}
            />
          )}
        />
      </div>
      <div className='mb-5'>
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
              error={errors.numberOfYears?.message}
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
                  handleBlur('numberOfYears', '0')
                } else {
                  handleBlur('numberOfYears', field.value)
                }
              }}
              value={field.value || '0'}
              required={true}
            />
          )}
        />
        <p className='text-sm text-gray-600 mt-1'>※1年以内切り上げ</p>
      </div>
      <div className='h-px bg-[#eee] my-5'></div>
    </div>
  )
}

export default DefinedBenefit
