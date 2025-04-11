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
import Voucher from './forms/voucher'

function App() {
  const [userId, setUserId] = useState<string | null>(null)
  const [currentDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // Initialize with structured objects
      mainCompany: {
        industry: {
          category1: '',
          category2: '',
          category3: '',
          classification: '',
        },
        financial: {
          profit: '',
          dividends: '',
        },
      },
      subsidiaries: [], // Always initialize as an empty array
    }
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getSavedFormData(),
    mode: 'onChange', // Validate on change
    reValidateMode: 'onChange', // Re-validate on change
  })

  // Watch for changes in applicationType and numberOfSubsidiaries
  const applicationType = watch('applicationType')
  const numberOfSubsidiaries = watch('numberOfSubsidiaries')

  // Add effect to clean up subsidiary data when numberOfSubsidiaries decreases
  useEffect(() => {
    if (applicationType === '子会社含む' && numberOfSubsidiaries) {
      const currentFormData = getValues()
      const currentCount = parseInt(numberOfSubsidiaries)

      if (
        Array.isArray(currentFormData.subsidiaries) &&
        currentFormData.subsidiaries.length > currentCount
      ) {
        currentFormData.subsidiaries = currentFormData.subsidiaries.slice(
          0,
          currentCount + 1
        )

        localStorage.setItem('formData', JSON.stringify(currentFormData))

        setValue('subsidiaries', currentFormData.subsidiaries)
      }
    }
  }, [applicationType, numberOfSubsidiaries, getValues, setValue])

  const saveDataToLocalStorage = (fieldName: string, value: any) => {
    const currentFormData = getValues()

    // Handle nested fields with dot notation (e.g., 'mainCompany.industry.category1')
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.')
      let current = currentFormData

      // Navigate to the nested object location
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          // Đặc biệt xử lý cho subsidiaries để đảm bảo nó luôn là object
          if (parts[i] === 'subsidiaries') {
            current[parts[i]] = {}
          } else {
            current[parts[i]] = {}
          }
        }
        current = current[parts[i]]
      }

      // Set the value at the final location
      current[parts[parts.length - 1]] = value
    } else {
      // For top-level fields
      currentFormData[fieldName] = value

      // Special handling for numberOfSubsidiaries
      if (
        fieldName === 'numberOfSubsidiaries' &&
        applicationType === '子会社含む'
      ) {
        const newCount = parseInt(value)

        // If subsidiaries array exists and has more entries than the new count
        if (
          Array.isArray(currentFormData.subsidiaries) &&
          currentFormData.subsidiaries.length > newCount
        ) {
          // Remove data for subsidiaries beyond the new count
          currentFormData.subsidiaries = currentFormData.subsidiaries.slice(
            0,
            newCount + 1
          )
        }
      }
    }

    // Save the entire form data to localStorage
    localStorage.setItem('formData', JSON.stringify(currentFormData))
  }

  // Hàm tiện ích để đảm bảo cấu trúc dữ liệu đúng cho subsidiaries
  // Utility function to ensure proper data structure for subsidiaries
  const ensureSubsidiaryStructure = (index: any) => {
    const currentFormData = getValues()
    const currentCount = parseInt(numberOfSubsidiaries || '0')

    // Make sure subsidiaries is initialized as an array
    if (!Array.isArray(currentFormData.subsidiaries)) {
      currentFormData.subsidiaries = []
    }

    // If the index is greater than the current count, don't create the structure
    if (index > currentCount) {
      return currentFormData
    }

    // Ensure subsidiary[index] exists with proper structure
    if (!currentFormData.subsidiaries[index]) {
      currentFormData.subsidiaries[index] = {
        industry: {
          category1: '',
          category2: '',
          category3: '',
          classification: '',
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
        classification: '',
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
    console.log('Form submitted with data:', data)
    const dataWithUserId = {
      ...data,
      userId: userId,
    }
    console.log(dataWithUserId)

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
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-bold text-gray-800 mb-3 text-center'>
        株価値ドック申し込みフォーム <br></br> 別添ロゴを入れる。
      </h2>

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
        />
        <RegistrationContent
          control={control}
          errors={errors}
          saveDataToLocalStorage={saveDataToLocalStorage}
          watch={watch}
        />
        <BusinessInformation
          control={control}
          errors={errors}
          saveDataToLocalStorage={saveDataToLocalStorage}
          watch={watch}
          ensureSubsidiaryStructure={ensureSubsidiaryStructure}
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
        />
        <Voucher
          control={control}
          errors={errors}
          saveDataToLocalStorage={saveDataToLocalStorage}
        />
        <Button
          type='submit'
          title='申し込む'
          styleBtn='primary'
          className='mt-3'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : '申し込む'}
        </Button>
      </form>
    </div>
  )
}

export default App
