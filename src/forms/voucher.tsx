import { Controller } from 'react-hook-form'
import Input from '../components/input'

const Voucher = ({ control, errors, saveDataToLocalStorage }: any) => {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }

  return (
    <>
      <div className='h1 text-center text-[25px]'>クーポン</div>
      <div className='mt-3'>
        <Controller
          name='voucher'
          control={control}
          render={({ field }) => (
            <Input
              label='クーポン'
              id='voucher'
              type='text'
              name='voucher'
              placeholder='クーポンを入力してください'
              className='form-input'
              error={errors.voucher?.message}
              onchange={field.onChange}
              onblur={() => handleBlur('voucher', field.value)}
              value={field.value}
            />
          )}
        />
      </div>
    </>
  )
}

export default Voucher
