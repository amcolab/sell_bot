import { Controller } from 'react-hook-form'
import Input from '../components/input'
import Radio from '../components/radio'

export default function ResultDeliveryMethod({
  control,
  errors,
  saveDataToLocalStorage,
}: any) {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }

  return (
    <>
      <div className='h1 text-center text-[25px]'>結果レポート受取方法</div>
      <div className='mt-3'>
        <label className='block font-medium text-[12px]'>
          結果レポート受取方法 <span className='text-red-500'>※</span>
        </label>
        <div className='flex gap-4 items-center'>
          <Controller
            name='reportreceiving'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <>
                <Radio
                  id='reportreceiving-introducer'
                  type='radio'
                  name='reportreceiving'
                  className='form-radio'
                  onChange={() => {
                    field.onChange('紹介者経由')
                    handleBlur('reportreceiving', '紹介者経由')
                  }}
                  onBlur={field.onBlur}
                  checked={field.value === '紹介者経由'}
                  title='紹介者経由'
                  required={true}
                />
                <Radio
                  id='reportreceiving-mail'
                  type='radio'
                  name='reportreceiving'
                  className='form-radio'
                  onChange={() => {
                    field.onChange('郵送')
                    handleBlur('reportreceiving', '郵送')
                  }}
                  onBlur={field.onBlur}
                  checked={field.value === '郵送'}
                  title='郵送'
                />
              </>
            )}
          />
        </div>
        {errors.reportreceiving && (
          <span className='text-red-500 text-[12px] mt-1'>
            {errors.reportreceiving.message}
          </span>
        )}
      </div>

      <div className='mt-3'>
        <Controller
          name='receiverAddress'
          control={control}
          render={({ field }) => (
            <Input
              label='郵送先（紹介者経由でない場合）'
              id='receiverAddress'
              type='text'
              name='receiverAddress'
              placeholder='郵送先を入力してください'
              className='form-input'
              error={errors.receiverAddress?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('receiverAddress', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
      </div>
      <div className='mt-3'>
        <Controller
          name='referrerName'
          control={control}
          render={({ field }) => (
            <Input
              label='ご紹介者名'
              id='referrerName'
              type='text'
              name='referrerName'
              placeholder='ご紹介者名を入力してください'
              className='form-input'
              error={errors.referrerName?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('referrerName', field.value)}
              value={field.value}
            />
          )}
        />
      </div>
    </>
  )
}
