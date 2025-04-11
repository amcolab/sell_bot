import { Controller } from 'react-hook-form'
import Input from '../components/input'
import Radio from '../components/radio'
import Select from '../components/select'

export default function RegistrationContent({
  control,
  errors,
  saveDataToLocalStorage,
  watch,
}: any) {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }
  const applicationType = watch('applicationType')

  return (
    <>
      <div className='h1 text-center text-[25px]'>申込内容</div>
      <div className='mt-3'>
        <label className='block font-medium text-[12px]'>
          申込種別<span className='text-red-500'>※</span>
        </label>
        <div className='flex gap-4 items-center'>
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
                  className='form-radio'
                  onChange={() => {
                    field.onChange('主たる法人のみ')
                    handleBlur('applicationType', '主たる法人のみ')
                    handleBlur('numberOfSubsidiaries', '')
                    handleBlur('subsidiaries', [])
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
                  className='form-radio'
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
        {errors.applicationType && (
          <span className='text-red-500 text-[12px] mt-1'>
            {errors.applicationType.message}
          </span>
        )}
      </div>

      {/* "子会社含む"を選択した場合のみ表示 */}
      {applicationType === '子会社含む' && (
        <div className='mt-3'>
          <Controller
            name='numberOfSubsidiaries'
            control={control}
            rules={{
              required: '子会社数を選択してください', // 必須バリデーションを追加
            }}
            render={({ field }) => (
              <Select
                label='子会社数'
                id='numberOfSubsidiaries'
                options={[
                  { value: '', label: '選択してください' }, // デフォルトオプションを追加
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                ]}
                parentClass='w-full'
                name='numberOfSubsidiaries'
                className='form-input w-full'
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
    </>
  )
}
