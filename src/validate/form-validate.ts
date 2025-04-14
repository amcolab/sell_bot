import * as yup from 'yup'

// Define industry schema to reuse
const industrySchema = yup.object().shape({
  category1: yup.string().required('業種カテゴリー1は必須です'),
  category2: yup.string().when('category1', {
    is: (val: any) => val && val !== '',
    then: (schema) => schema.required('業種カテゴリー2は必須です'),
    otherwise: (schema) => schema.notRequired(),
  }),
  category3: yup.string().when('category2', {
    is: (val: any) => val && val !== '',
    then: (schema) => schema.required('業種カテゴリー3は必須です'),
    otherwise: (schema) => schema.notRequired(),
  }),
  specialCase: yup.string().required('業種区分特例は必須です'),
  revenuePercentage1: yup.string().when('specialCase', {
    is: 'under50',
    then: (schema) => schema
      .required('主たる事業の売上は必須です')
      .test('is-valid-percentage', '有効なパーセンテージを入力してください', (value) => {
        if (!value) return false
        const numValue = Number(value)
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
  revenuePercentage2: yup.string().when('specialCase', {
    is: 'under50',
    then: (schema) => schema
      .required('2位の売上は必須です')
      .test('is-valid-percentage', '有効なパーセンテージを入力してください', (value) => {
        if (!value) return false
        const numValue = Number(value)
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
  revenuePercentage3: yup.string().when(['specialCase', 'revenuePercentage1', 'revenuePercentage2'], {
    is: (specialCase: string, rev1: string, rev2: string) => 
      specialCase === 'under50' && 
      rev1 && rev2 && 
      (Number(rev1) + Number(rev2)) < 50,
    then: (schema) => schema
      .required('3位の売上は必須です')
      .test('is-valid-percentage', '有効なパーセンテージを入力してください', (value) => {
        if (!value) return false
        const numValue = Number(value)
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
})

// Define financial schema to reuse
const financialSchema = yup.object().shape({
  profit: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '利益は数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value || value === '0') return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
  dividends: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '配当は数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value || value === '0') return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
})

// Katakana validation regex
const katakanaRegex = /^[\u30A0-\u30FF\uFF65-\uFF9F\s]+$/

export const schema = yup.object().shape({
  // Basic information validation
  registrationDate: yup.string().required('登録日は必須です'),
  legalName: yup.string().required('法人名は必須です'),
  katakanaName: yup
    .string()
    .required('カタカナ名は必須です')
    .matches(katakanaRegex, 'カタカナで入力してください'),
  personChargeFirtName: yup.string().required('担当者姓は必須です'),
  personChargeLastName: yup.string().required('担当者名は必須です'),
  personChargeFirtNameKatana: yup
    .string()
    .required('担当者姓（カタカナ）は必須です')
    .matches(katakanaRegex, 'カタカナで入力してください'),
  personChargeLastNameKatana: yup
    .string()
    .required('担当者名（カタカナ）は必須です')
    .matches(katakanaRegex, 'カタカナで入力してください'),
  email: yup
    .string()
    .required('メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),
  phone: yup
    .string()
    .required('電話番号は必須です')
    .matches(/^\d{10,11}$/, '電話番号は10桁または11桁で入力してください'),
  position: yup.string(),

  // Report delivery information
  reportreceiving: yup.string().required('レポート受信方法は必須です'),
  postalCode: yup.string(),
  receiverAddress: yup.string().required('レポート送付先住所は必須です'),
  referrerName: yup.string(),
  referreCompanyName: yup.string(),

  // Registration information
  applicationType: yup.string().required('申請種別は必須です'),
  numberOfSubsidiaries: yup.string().when('applicationType', {
    is: (val: any) => val === '子会社含む',
    then: (schema) => schema.required('子会社数を選択してください'),
    otherwise: (schema) => schema.notRequired(),
  }),

  mainCompany: yup.object().shape({
    industry: industrySchema,
    financial: financialSchema,
  }),

  subsidiaries: yup.array().when(['applicationType', 'numberOfSubsidiaries'], {
    is: (applicationType: any, numberOfSubsidiaries: any) => {
      return applicationType === '子会社含む' && numberOfSubsidiaries > 0
    },
    then: (schema) =>
      schema.test(
        'subsidiaries-validation',
        '子会社情報は必須です',
        function (subsidiaries) {
          const numberOfSubsidiaries = Number(
            this.parent.numberOfSubsidiaries || 0
          )

          if (numberOfSubsidiaries === 0) return true

          if (!subsidiaries || !Array.isArray(subsidiaries)) {
            return this.createError({
              message: '子会社情報は必須です',
              path: 'subsidiaries',
            })
          }

          for (let i = 1; i <= numberOfSubsidiaries; i++) {
            const subsidiary = subsidiaries[i]

            if (!subsidiary) {
              return this.createError({
                message: `子会社${i}の情報は必須です`,
                path: `subsidiaries[${i}]`,
              })
            }

            if (!subsidiary.industry?.category1) {
              return this.createError({
                message: `子会社${i}の業種カテゴリー1は必須です`,
                path: `subsidiaries[${i}].industry.category1`,
              })
            }

            // Only validate category2 if category1 is selected
            if (
              subsidiary.industry?.category1 &&
              !subsidiary.industry?.category2
            ) {
              return this.createError({
                message: `子会社${i}の業種カテゴリー2は必須です`,
                path: `subsidiaries[${i}].industry.category2`,
              })
            }

            // Only validate category3 if category2 is selected
            if (
              subsidiary.industry?.category2 &&
              !subsidiary.industry?.category3
            ) {
              return this.createError({
                message: `子会社${i}の業種カテゴリー3は必須です`,
                path: `subsidiaries[${i}].industry.category3`,
              })
            }

            // Validate revenue percentages if specialCase is under50
            if (subsidiary.industry?.specialCase === 'under50') {
              // Validate revenuePercentage1
              if (!subsidiary.industry.revenuePercentage1) {
                return this.createError({
                  message: `子会社${i}の主たる事業の売上は必須です`,
                  path: `subsidiaries[${i}].industry.revenuePercentage1`,
                })
              }
              const rev1 = Number(subsidiary.industry.revenuePercentage1)
              if (isNaN(rev1) || rev1 < 0 || rev1 > 100) {
                return this.createError({
                  message: `子会社${i}の主たる事業の売上は有効なパーセンテージを入力してください`,
                  path: `subsidiaries[${i}].industry.revenuePercentage1`,
                })
              }

              // Validate revenuePercentage2
              if (!subsidiary.industry.revenuePercentage2) {
                return this.createError({
                  message: `子会社${i}の2位の売上は必須です`,
                  path: `subsidiaries[${i}].industry.revenuePercentage2`,
                })
              }
              const rev2 = Number(subsidiary.industry.revenuePercentage2)
              if (isNaN(rev2) || rev2 < 0 || rev2 > 100) {
                return this.createError({
                  message: `子会社${i}の2位の売上は有効なパーセンテージを入力してください`,
                  path: `subsidiaries[${i}].industry.revenuePercentage2`,
                })
              }

              // Validate revenuePercentage3 if sum of rev1 and rev2 is less than 50
              if (rev1 + rev2 < 50) {
                if (!subsidiary.industry.revenuePercentage3) {
                  return this.createError({
                    message: `子会社${i}の3位の売上は必須です`,
                    path: `subsidiaries[${i}].industry.revenuePercentage3`,
                  })
                }
                const rev3 = Number(subsidiary.industry.revenuePercentage3)
                if (isNaN(rev3) || rev3 < 0 || rev3 > 100) {
                  return this.createError({
                    message: `子会社${i}の3位の売上は有効なパーセンテージを入力してください`,
                    path: `subsidiaries[${i}].industry.revenuePercentage3`,
                  })
                }
              }
            }

            if (!subsidiary.financial?.profit) {
              return this.createError({
                message: `子会社${i}の利益は必須です`,
                path: `subsidiaries[${i}].financial.profit`,
              })
            }

            if (!subsidiary.financial?.dividends) {
              return this.createError({
                message: `子会社${i}の配当金は必須です`,
                path: `subsidiaries[${i}].financial.dividends`,
              })
            }
          }

          return true
        }
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
  currentSalary: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
  numberOfYears: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な数値を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 100
    }),
  maritalStatus: yup.string().required('婚姻状況は必須です'),
  numberOfChildren: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な数値を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue)
    }),
  cashAndDeposits: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
  retirementBenefits: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
  realEstate: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
  securities: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
  amountOfLifeInsurance: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
  otherAssets: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
  debts: yup
    .string()
    .transform((value) => {
      if (!value) return '0'
      return value.replace(/,/g, '')
    })
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999
    }),
  voucher: yup.string(),
})
