import { Controller } from 'react-hook-form'
import Input from '../components/input'
import { formatNumber } from '../utils/utils'
import HeaderSection from '../components/header-section'
import { useRef, useState, useEffect, CSSProperties } from 'react'

const DefinedBenefit = ({ control, errors, saveDataToLocalStorage }: any) => {
  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value)
  }
  
  const [yearStyle, setYearStyle] = useState<CSSProperties>({
    position: 'absolute',
    top: '40px',
    left: '30px'
  });
  
  const updateYearPosition = (value: string) => {
    const basePosition = 18;
    const digitsCount = String(value || '0').length;
    const digitWidth = 8;
    
    setYearStyle({
      position: 'absolute',
      top: '43px',
      left: `${basePosition + (digitsCount * digitWidth)}px`
    });
  };

  return (
    <HeaderSection title="役員退職金 " stepNumber={5}>
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
                const value = e.target.value.replace(/[^\d]/g, '')
                const cleanValue = value.replace(/^0+/, '') || '0'
                field.onChange(cleanValue)
                handleBlur('currentSalary', cleanValue)
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
      <div className='mb-5 relative'>
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
                  updateYearPosition('0');
                } else {
                  const cleanValue = value.replace(/^0+/, '')
                  field.onChange(cleanValue)
                  updateYearPosition(cleanValue);
                }
              }}
              onblur={() => {
                if (!field.value) {
                  field.onChange('0')
                  handleBlur('numberOfYears', '0')
                  updateYearPosition('0');
                } else {
                  handleBlur('numberOfYears', field.value)
                  updateYearPosition(field.value);
                }
              }}
              value={field.value || '0'}
              required={true}
            />
          )}
        />
        <p className="text-[12px]" style={yearStyle}>年</p>
        <p className='text-sm text-gray-600 mt-1'>※1年以内切り上げ</p>
      </div>
      <div className='h-px bg-[#eee] my-5'></div>
    </HeaderSection>
  )
}

export default DefinedBenefit