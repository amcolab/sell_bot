import { Controller } from 'react-hook-form'
import Input from '../components/input'
import HeaderSection from '../components/header-section'
import { useState } from 'react'
import { get } from 'japan-postal-code'

export default function InformationForm({
  control,
  errors,
  saveDataToLocalStorage,
  setValue,
  setError,
}: any) {
  // ブラーイベントのハンドラーでローカルストレージにデータを保存
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }
  const [postalCode, setPostalCode] = useState('')
  const handleLookup = async () => {
    if (!postalCode) return

    try {
      await get(postalCode, (address: any) => {
        const formattedAddress = `${address.prefecture}${address.city}${address.area}${address.street}`
        handleBlur('address', formattedAddress)
        setValue('address', formattedAddress)
        setError('address', { type: null, message: null }) // Clear error
      })
    } catch (err) {
      console.error('Failed to fetch address:', err)
    }
  }

  return (
    <HeaderSection title='基本情報' stepNumber={1}>
      <div className='mb-5'>
        <Controller
          name='registrationDate'
          control={control}
          render={({ field }) => (
            <Input
              label='申込日'
              id='registrationDate'
              type='date'
              name='registrationDate'
              placeholder='YYYY-MM-DD'
              error={errors.registrationDate?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('registrationDate', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='legalName'
          control={control}
          render={({ field }) => (
            <Input
              label='法人名'
              id='legalName'
              type='text'
              name='legalName'
              placeholder='法人名を入力してください'
              error={errors.legalName?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('legalName', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='katakanaName'
          control={control}
          render={({ field }) => (
            <Input
              label='法人名フリガナ'
              id='katakanaName'
              type='text'
              name='katakanaName'
              placeholder='法人名フリガナを入力してください'
              error={errors.katakanaName?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('katakanaName', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='position'
          control={control}
          render={({ field }) => (
            <Input
              label='役職名'
              id='position'
              type='text'
              name='position'
              placeholder='役職名を入力してください'
              error={errors.position?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('position', field.value)}
              value={field.value}
            />
          )}
        />
      </div>
      <div className='mb-5 flex gap-4'>
        <Controller
          name='personChargeFirstName'
          control={control}
          render={({ field }) => (
            <Input
              label='ご担当者名'
              id='personChargeFirstName'
              type='text'
              name='personChargeFirstName'
              placeholder='姓を入力してください'
              error={errors.personChargeFirstName?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('personChargeFirstName', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
        <Controller
          name='personChargeLastName'
          control={control}
          render={({ field }) => (
            <Input
              label='ご担当者名'
              id='personChargeLastName'
              type='text'
              name='personChargeLastName'
              placeholder='名を入力してください'
              error={errors.personChargeLastName?.message}
              classNameLabel='opacity-0'
              onchange={field.onChange}
              onblur={() => handleBlur('personChargeLastName', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
      </div>
      <div className='mb-5 flex gap-4'>
        <Controller
          name='personChargeFirstNameKatakana'
          control={control}
          render={({ field }) => (
            <Input
              label='ご担当者名フリガナ'
              id='personChargeFirstNameKatakana'
              type='text'
              name='personChargeFirstNameKatakana'
              placeholder='姓（フリガナ）を入力してください'
              error={errors.personChargeFirstNameKatakana?.message}
              onchange={field.onChange}
              onblur={() =>
                handleBlur('personChargeFirstNameKatakana', field.value)
              }
              value={field.value}
              required={true}
            />
          )}
        />
        <Controller
          name='personChargeLastNameKatakana'
          control={control}
          render={({ field }) => (
            <Input
              label='ご担当者名フリガナ'
              id='personChargeLastNameKatakana'
              type='text'
              name='personChargeLastNameKatakana'
              placeholder='名（フリガナ）を入力してください'
              error={errors.personChargeLastNameKatakana?.message}
              classNameLabel='opacity-0'
              onchange={field.onChange}
              onblur={() =>
                handleBlur('personChargeLastNameKatakana', field.value)
              }
              value={field.value}
              required={true}
            />
          )}
        />
      </div>

      <div className='mb-5'>
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <Input
              label='メールアドレス'
              id='email'
              type='text'
              name='email'
              placeholder='メールアドレスを入力してください'
              error={errors.email?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('email', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <Input
              label='電話番号'
              id='phone'
              type='text'
              name='phone'
              placeholder='電話番号を入力してください'
              error={errors.phone?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('phone', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
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
              required={true}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='address'
          control={control}
          render={({ field }) => (
            <Input
              label='住所'
              id='address'
              type='text'
              name='address'
              placeholder='住所を入力してください'
              error={errors.address?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('address', field.value)}
              value={field.value}
              required={true}
            />
          )}
        />
      </div>
      <div className='mb-5'>
        <Controller
          name='voucher'
          control={control}
          render={({ field }) => (
            <Input
              label='割引コード'
              id='voucher'
              type='text'
              name='voucher'
              placeholder='割引コードを入力してください'
              error={errors.voucher?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('voucher', field.value)}
              value={field.value}
            />
          )}
        />
      </div>
    </HeaderSection>
  )
}
