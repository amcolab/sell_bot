import { Controller } from 'react-hook-form'
import Input from '../components/input'
import Radio from '../components/radio'
import Select from '../components/select'

export default function RegistrationContent({
  control,
  errors,
  saveDataToLocalStorage,
  watch,
  price,
  setValue
}: any) {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }
  const applicationType = watch('applicationType')
  const numberOfSubsidiaries = watch('numberOfSubsidiaries')

  // Calculate total amount based on subsidiaries and discount
  const calculateTotalAmount = () => {
    if (applicationType) {
      const paymentPrice = parseInt(price?.mainCompanyPrice || '0') + (parseInt(numberOfSubsidiaries || '0') * parseInt(price?.childCompanyPrice || '0'))
      saveDataToLocalStorage('price', paymentPrice)
      setValue('price', paymentPrice)
      return paymentPrice
    }
    else {
      saveDataToLocalStorage('price', 0)
      setValue('price', 0)
      return 0
    }
  }

  return (
    <div className="mt-2">
      <div>
        <h3 className="text-lg font-semibold mb-3">
          <span className="inline-block w-8 h-8 leading-8 text-center text-white bg-[#0a2e52] rounded-full mr-2">
            3
          </span>
          申込内容
        </h3>
        <div className='mb-5'>
          <label className='block mb-1.5 text-[#0a2e52] text-sm font-medium'>
            申込法人数 <span className='text-[#e74c3c]'>*</span>
          </label>
          <div className='flex gap-4'>
            <Controller
              name='applicationType'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <>
                  <Radio
                    id='applicationType-main'
                    type='radio'
                    name='applicationType'
                    onChange={() => {
                      field.onChange('主たる法人のみ')
                      handleBlur('applicationType', '主たる法人のみ')
                      handleBlur('numberOfSubsidiaries', '0')
                      handleBlur('subsidiaries', [])
                      setValue('numberOfSubsidiaries', '0')
                    }}
                    onBlur={field.onBlur}
                    checked={field.value === '主たる法人のみ'}
                    title='主たる法人のみ'
                    required={true}
                  />
                  <Radio
                    id='applicationType-only'
                    type='radio'
                    name='applicationType'
                    onChange={() => {
                      field.onChange('子会社含む')
                      handleBlur('applicationType', '子会社含む')
                    }}
                    onBlur={field.onBlur}
                    checked={field.value === '子会社含む'}
                    title='子会社含む'
                  />
                </>
              )}
            />
          </div>
          {applicationType === '子会社含む' && (
            <div className='mt-2 text-sm text-gray-600'>
              <p>※出資額より評価額が大幅に高く、親会社の株価に影響する子会社があれば、その数を選択してください。該当がなければ「0」を選択してください。</p>
              <p>※子会社があるが、「0」とされている場合には出資額＝子会社株価として親会社の株価を算定します。</p>
            </div>
          )}
          {errors.applicationType && (
            <span className='block mt-1 text-sm text-[#e74c3c]'>
              {errors.applicationType.message}
            </span>
          )}
        </div>

        {/* "子会社含む"を選択した場合のみ表示 */}
        {applicationType === '子会社含む' && (
          <div className='mb-5'>
            <Controller
              name='numberOfSubsidiaries'
              control={control}
              rules={{
                required: '子会社数を選択してください',
              }}
              render={({ field }) => (
                <Select
                  label='子会社数'
                  id='numberOfSubsidiaries'
                  options={[
                    { value: '0', label: '0' },
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                  ]}
                  parentClass='w-full'
                  name='numberOfSubsidiaries'
                  error={errors.numberOfSubsidiaries?.message}
                  onchange={(e: any) => {
                    field.onChange(e.target.value)
                    handleBlur('numberOfSubsidiaries', e.target.value)
                  }}
                  value={field.value || ''}
                  required={true}
                />
              )}
            />
          </div>
        )}

        {/* 申込金額の合計表示 */}
        <div className='mb-5 p-4 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-medium mb-2'>申込金額の合計</h3>
          <p className='text-2xl font-bold text-[#0a2e52]'>
            ¥{calculateTotalAmount().toLocaleString()}
          </p>
          <p className='text-sm text-gray-600 mt-2'>
            ※子会社の数が増えると価格が上がりますのでご注意ください。
          </p>
        </div>

        <div className='h-px bg-[#eee] my-5'></div>
      </div>
    </div>
  )
}
