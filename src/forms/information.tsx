import { Controller } from 'react-hook-form'
import Input from '../components/input'
import HeaderSection from '../components/header-section'

export default function InformationForm({
  control,
  errors,
  saveDataToLocalStorage,
}: any) {
  // ブラーイベントのハンドラーでローカルストレージにデータを保存
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }

  return (
    <HeaderSection title="基本情報" stepNumber={1}>
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
          name='personChargeFirtName'
          control={control}
          render={({ field }) => (
            <Input
              label='ご担当者名'
              id='personChargeFirtName'
              type='text'
              name='personChargeFirtName'
              placeholder='姓を入力してください'
              error={errors.personChargeFirtName?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('personChargeFirtName', field.value)}
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
          name='personChargeFirtNameKatana'
          control={control}
          render={({ field }) => (
            <Input
              label='ご担当者名フリガナ'
              id='personChargeFirtNameKatana'
              type='text'
              name='personChargeFirtNameKatana'
              placeholder='姓（フリガナ）を入力してください'
              error={errors.personChargeFirtNameKatana?.message}
              onchange={field.onChange}
              onblur={() =>
                handleBlur('personChargeFirtNameKatana', field.value)
              }
              value={field.value}
              required={true}
            />
          )}
        />
        <Controller
          name='personChargeLastNameKatana'
          control={control}
          render={({ field }) => (
            <Input
              label='ご担当者名フリガナ'
              id='personChargeLastNameKatana'
              type='text'
              name='personChargeLastNameKatana'
              placeholder='名（フリガナ）を入力してください'
              error={errors.personChargeLastNameKatana?.message}
              classNameLabel='opacity-0'
              onchange={field.onChange}
              onblur={() =>
                handleBlur('personChargeLastNameKatana', field.value)
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
