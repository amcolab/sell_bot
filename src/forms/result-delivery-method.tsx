import { Controller } from 'react-hook-form'
import Input from '../components/input'
import Radio from '../components/radio'
import { get } from 'japan-postal-code'
import { useState } from 'react'

export default function ResultDeliveryMethod({
  control,
  errors,
  saveDataToLocalStorage,
  setValue,
  setError,
}: any) {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }
  const [postalCode, setPostalCode] = useState('')
  const handleLookup = async () => {
    if (!postalCode) return

    try {
      await get(postalCode, (address: any) => {
        console.log(address)

        const formattedAddress = `${address.prefecture}${address.city}${address.area}${address.street}`
        handleBlur('receiverAddress', formattedAddress)
        setValue('receiverAddress', formattedAddress)
        setError('receiverAddress', null)
      })
    } catch (err) {
      console.error('Failed to fetch address:', err)
    }
  }

  return (
    <div className="mt-2">
      <div>
        <h3 className="text-lg font-semibold mb-3">
          <span className="inline-block w-8 h-8 leading-8 text-center text-white bg-[#0a2e52] rounded-full mr-2">
            2
          </span>
          結果レポート
        </h3>
      </div>
      <div className='mb-5'>
        <label className='block mb-1.5 text-[#0a2e52] text-sm font-medium'>
          レポート受取方法 <span className='text-[#e74c3c]'>*</span>
        </label>
        <div className='flex gap-4'>
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
          <span className='block mt-1 text-sm text-[#e74c3c]'>
            {errors.reportreceiving.message}
          </span>
        )}
      </div>

      <div className='mb-5'>
        <Controller
          name='postalCode'
          control={control}
          render={({ field }) => (
            <Input
              label='郵便番号'
              id='postalCode'
              type='text'
              name='postalCode'
              placeholder='郵便番号を入力してください'
              error={errors.postalCode?.message}
              onchange={(e) => {
                field.onChange(e)
                setPostalCode(e.target.value)
              }}
              onblur={() => {
                handleBlur('postalCode', field.value)
                handleLookup()
              }}
              value={field.value}
            />
          )}
        />
      </div>

      <div className='mb-5'>
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
              error={errors.receiverAddress?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('receiverAddress', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        {' '}
        <label className='block mb-1.5 text-[#0a2e52] text-sm font-medium'>
          ご紹介者
        </label>
        <div className=' flex gap-4'>
          <div className='flex items-center w-1/2'>
            <p className='w-[80px]'>会社名</p>
            <Controller
              name='referrerCompanyName'
              control={control}
              render={({ field }) => (
                <Input
                  id='referrerCompanyName'
                  type='text'
                  name='referrerCompanyName'
                  placeholder='ご紹介者名を入力してください'
                  error={errors.referrerCompanyName?.message}
                  onchange={field.onChange}
                  onblur={() => handleBlur('referrerCompanyName', field.value)}
                  value={field.value}
                />
              )}
            />
          </div>

          <div className='flex items-center w-1/2'>
            <p className='w-[80px]'>氏名</p>
            <Controller
              name='referrerName'
              control={control}
              render={({ field }) => (
                <Input
                  id='referrerName'
                  type='text'
                  name='referrerName'
                  placeholder='ご紹介者名を入力してください'
                  error={errors.referrerName?.message}
                  onchange={field.onChange}
                  onblur={() => handleBlur('referrerName', field.value)}
                  value={field.value}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className='h-px bg-[#eee] my-5'></div>
    </div>
  )
}
