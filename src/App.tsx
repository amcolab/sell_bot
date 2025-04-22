import { useEffect, useState } from 'react'
import liff from '@line/liff'
import './App.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import InformationForm from './forms/information'
import ResultDeliveryMethod from './forms/result-delivery-method'
import RegistrationContent from './forms/registration-content'
import BusinessInformation from './forms/business-information'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validate/form-validate'
import Button from './components/button'
import DefinedBenefit from './forms/defined-benefit'
import InheritedAssets from './forms/inherited-assets'
import { useDebounce } from 'use-debounce'
import Preview from './components/preview'

function App() {
  const [userId, setUserId] = useState<string | null>(null)
  const [currentDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [price, setPrice] = useState<any>()
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const getSavedFormData = () => {
    const savedData = localStorage.getItem('formData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)

        // Ensure subsidiaries is always an array
        if (!parsedData.subsidiaries) {
          parsedData.subsidiaries = []
        } else if (!Array.isArray(parsedData.subsidiaries)) {
          const objSubsidiaries = parsedData.subsidiaries
          const arrSubsidiaries: any = []

          // Convert object to array
          Object.keys(objSubsidiaries).forEach((key) => {
            const index = parseInt(key)
            if (!isNaN(index)) {
              arrSubsidiaries[index] = objSubsidiaries[key]
            }
          })

          parsedData.subsidiaries = arrSubsidiaries
        }

        return parsedData
      } catch (error) {
        console.error('Error parsing saved form data:', error)
      }
    }

    // Return default values with new object structure
    return {
      registrationDate: currentDate,
      legalName: '',
      katakanaName: '',
      personChargeFirtName: '',
      personChargeLastName: '',
      personChargeFirtNameKatana: '',
      personChargeLastNameKatana: '',
      position: '',
      email: '',
      phone: '',
      reportreceiving: '',
      receiverAddress: '',
      referrerName: '',
      applicationType: '',
      numberOfSubsidiaries: '4', // Set default to 4
      price: 0, // Add price to default values
      // Initialize with structured objects
      mainCompany: {
        industry: {
          category1: '',
          category2: '',
          category3: '',
        },
        financial: {
          profit: '',
          dividends: '',
        },
      },
      subsidiaries: [],
    }
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    setError,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getSavedFormData(),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  console.log(errors);
  
  // Only trigger validation once on mount
  useEffect(() => {
    trigger()
  }, []) // Empty dependency array to run only once on mount

  const applicationType = watch('applicationType')
  const numberOfSubsidiaries = watch('numberOfSubsidiaries')
  useEffect(() => {
    if (applicationType === '子会社含む' && numberOfSubsidiaries) {
      const currentFormData = getValues()
      const currentCount = parseInt(numberOfSubsidiaries)

      if (!Array.isArray(currentFormData.subsidiaries)) {
        currentFormData.subsidiaries = []
      }

      if (currentFormData.subsidiaries.length > currentCount) {
        // If reducing count, keep the first N subsidiaries
        currentFormData.subsidiaries = currentFormData.subsidiaries.slice(0, currentCount)
      } else if (currentFormData.subsidiaries.length < currentCount) {
        // If increasing count, add new empty subsidiaries while preserving existing ones
        const newSubsidiaries = Array(currentCount - currentFormData.subsidiaries.length)
          .fill(null)
          .map(() => ({
            industry: {
              category1: '',
              category2: '',
              category3: '',
              specialCase: '',
              revenuePercentage1: '',
              revenuePercentage2: '',
              revenuePercentage3: ''
            },
            financial: {
              profit: '0',
              dividends: '0'
            }
          }))
        currentFormData.subsidiaries = [...currentFormData.subsidiaries, ...newSubsidiaries]
      }

      // Save to localStorage and update form state
      localStorage.setItem('formData', JSON.stringify(currentFormData))
      setValue('subsidiaries', currentFormData.subsidiaries)
    } else if (applicationType === '主たる法人のみ') {
      // Clear subsidiaries when switching to main company only
      const currentFormData = getValues()
      currentFormData.subsidiaries = []
      localStorage.setItem('formData', JSON.stringify(currentFormData))
      setValue('subsidiaries', [])
    }
  }, [applicationType, numberOfSubsidiaries, getValues, setValue])

  const saveDataToLocalStorage = (fieldName: string, value: any) => {
    const currentFormData = getValues()

    if (fieldName.includes('.')) {
      const parts = fieldName.split('.')
      let current = currentFormData

      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          if (parts[i] === 'subsidiaries') {
            current[parts[i]] = {}
          } else {
            current[parts[i]] = {}
          }
        }
        current = current[parts[i]]
      }

      current[parts[parts.length - 1]] = value
    } else {
      currentFormData[fieldName] = value

      if (
        fieldName === 'numberOfSubsidiaries' &&
        applicationType === '子会社含む'
      ) {
        const newCount = parseInt(value)

        if (
          Array.isArray(currentFormData.subsidiaries) &&
          currentFormData.subsidiaries.length > newCount
        ) {
          currentFormData.subsidiaries = currentFormData.subsidiaries.slice(
            0,
            newCount + 1
          )
        }
      }
    }

    localStorage.setItem('formData', JSON.stringify(currentFormData))
  }

  const ensureSubsidiaryStructure = (index: any) => {
    const currentFormData = getValues()
    const currentCount = parseInt(numberOfSubsidiaries || '0')

    if (!Array.isArray(currentFormData.subsidiaries)) {
      currentFormData.subsidiaries = []
    }

    if (index > currentCount) {
      return currentFormData
    }

    if (!currentFormData.subsidiaries[index]) {
      currentFormData.subsidiaries[index] = {
        industry: {
          category1: '',
          category2: '',
          category3: '',
        },
        financial: {
          profit: '',
          dividends: '',
        },
      }
    }

    // Ensure child structures exist
    if (!currentFormData.subsidiaries[index].industry) {
      currentFormData.subsidiaries[index].industry = {
        category1: '',
        category2: '',
        category3: '',
      }
    }

    if (!currentFormData.subsidiaries[index].financial) {
      currentFormData.subsidiaries[index].financial = {
        profit: '',
        dividends: '',
      }
    }

    // Save to localStorage
    localStorage.setItem('formData', JSON.stringify(currentFormData))

    return currentFormData
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const status = queryParams.get('status')
    if (status === '200') {
      toast.success('お支払いが成功しました', {
        position: 'top-center',
        className: 'custom-toast',
        autoClose: 3000,
      })
    }

    const liffId = import.meta.env.VITE_LIFF_ID
    if (!liffId) {
      console.error(
        'LIFF ID is not defined. Please set VITE_LIFF_ID in your .env file.'
      )
      return
    }

    liff
      .init({ liffId })
      .then(() => {
        if (!liff.isLoggedIn()) {
          liff.login()
        } else {
          return Promise.resolve()
        }
      })
      .then(() => {
        if (liff.isLoggedIn()) {
          return liff.getProfile()
        }
        return null
      })
      .then((profile) => {
        if (profile) {
          setUserId(profile.userId)
          localStorage.setItem('userId', profile.userId)
        }
      })
      .catch((err) => {
        console.error('LIFF initialization or profile retrieval failed', err)
      })

    // Load saved form data from localStorage when component mounts
    const savedData = getSavedFormData()
   
    // Set values for all fields including nested ones
    const setNestedValues = (obj: any, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullPath = prefix ? `${prefix}.${key}` : key

        if (value !== null && typeof value === 'object') {
          setNestedValues(value, fullPath)
        } else {
          setValue(fullPath, value)
        }
      })
    }

    setNestedValues(savedData)
  }, [setValue])
  console.log(errors);
  const scrollToFirstError = () => {
    // First scroll to top of the form
    const formElement = document.querySelector('form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Then after a short delay, scroll to the first error
    setTimeout(() => {
      const errorElements = document.querySelectorAll('.text-red-500')
      if (errorElements.length > 0) {
        const firstError = errorElements[0]
        const formField = firstError.closest('.form-input, .form-radio, select')
        if (formField) {
          formField.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, 500) // Wait 500ms before scrolling to error
  }

  const onSubmit = async (data: any) => {
    if (isSubmittingForm) return;
    setIsSubmittingForm(true);
    try {
      const dataWithUserId = {
        ...data,
        userId: userId,
      }
      setFormData(dataWithUserId)
      setShowPreview(true)
    } finally {
      setIsSubmittingForm(false);
    }
  }

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true)
    const dataWithUserId = {
      ...formData,
      userId: userId,
    }

    localStorage.setItem('formData', JSON.stringify(dataWithUserId))

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
        body: JSON.stringify(dataWithUserId),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.code === 200) {
        toast.success(result.message, {
          position: 'top-center',
          className: 'custom-toast',
          autoClose: 3000,
        })
        if (result.paymentLink) {
          window.location.href = result.paymentLink
        }
      } else {
        toast.error(result.message, {
          position: 'top-center',
          className: 'custom-toast',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('API Error:', error)
      toast.error('データの送信に失敗しました', {
        position: 'top-center',
        className: 'custom-toast',
        autoClose: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    setShowPreview(false)
  }

  const handleFetchVoucher = async (voucher: string) => {
    setIsLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}?voucher=${encodeURIComponent(voucher)}`
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    
      const result = await response.json()
      setPrice(result.data)
      return result
    } catch (error) {
      console.error('Error fetching voucher:', error)
      toast.error('割引コードの確認に失敗しました', {
        position: 'top-center',
        className: 'custom-toast',
        autoClose: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const voucher = watch('voucher')
  const [debouncedVoucher] = useDebounce(voucher, 800)
  
  useEffect(() => {
    handleFetchVoucher(debouncedVoucher)
  }, [debouncedVoucher])
  

  return (
    <>
      {price && (
        <div className='min-h-screen bg-[#f5f5f5] flex justify-center items-center'>
          <div className='w-full bg-white rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(0,0,20,0.1)]'>
            <div className='bg-gradient-to-r from-[#0a2e52] to-[#1a4980] text-white p-5 text-center'>
              <h1 className='text-xl font-semibold mb-1'>
                株価値ドック申し込みフォーム
              </h1>
              <p className='text-sm opacity-90'>別添ロゴを入れる。</p>
            </div>

            <div className='p-3'>
              {showPreview ? (
                <Preview
                  data={formData}
                  userId={userId}
                  onConfirm={handleConfirm}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)}>
                  <InformationForm
                    control={control}
                    errors={errors}
                    saveDataToLocalStorage={saveDataToLocalStorage}
                  />
                  <ResultDeliveryMethod
                    control={control}
                    errors={errors}
                    saveDataToLocalStorage={saveDataToLocalStorage}
                    setValue={setValue}
                    setError={setError}
                    watch={watch}
                  />
                  <RegistrationContent
                    control={control}
                    errors={errors}
                    saveDataToLocalStorage={saveDataToLocalStorage}
                    watch={watch}
                    price={price}
                    setValue={setValue}
                    getValues={getValues}
                  />
                  <BusinessInformation
                    control={control}
                    errors={errors}
                    saveDataToLocalStorage={saveDataToLocalStorage}
                    ensureSubsidiaryStructure={ensureSubsidiaryStructure}
                    setValue={setValue}
                  />
                  <DefinedBenefit
                    control={control}
                    errors={errors}
                    saveDataToLocalStorage={saveDataToLocalStorage}
                    watch={watch}
                  />
                  <InheritedAssets
                    control={control}
                    errors={errors}
                    saveDataToLocalStorage={saveDataToLocalStorage}
                    watch={watch}
                    setValue={setValue}
                  />
                  <Button
                    type='submit'
                    title='確認画面へ'
                    styleBtn='primary'
                    className='mt-2.5'
                    disabled={isSubmittingForm || isLoading}
                  >
                    {isSubmittingForm ? '送信中...' : '確認画面へ'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
