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
  classification: yup.string().required('業種分類の例外は必須です'),
})

// Define financial schema to reuse
const financialSchema = yup.object().shape({
  profit: yup
    .string()
    .required('利益は必須です')
    .matches(/^[\d,]+$/, '利益は数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  dividends: yup
    .string()
    .required('配当金は必須です')
    .matches(/^[\d,]+$/, '配当金は数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
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
  receiverAddress: yup.string().required('レポート送付先住所は必須です'),
  referrerName: yup.string().required('紹介者名は必須です'),

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

            if (!subsidiary.industry?.classification) {
              return this.createError({
                message: `子会社${i}の業種分類の例外は必須です`,
                path: `subsidiaries[${i}].industry.classification`,
              })
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
    .required('現在の給与は必須です')
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  numberOfYears: yup
    .string()
    .required('勤続年数は必須です')
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な数値を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  maritalStatus: yup.string().required('婚姻状況は必須です'),
  numberOfChildren: yup
    .string()
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な数値を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  cashAndDeposits: yup
    .string()
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  retirementBenefits: yup
    .string()
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  realEstate: yup
    .string()
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  securities: yup
    .string()
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  amountOfLifeInsurance: yup
    .string()
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  otherAssets: yup
    .string()
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  debts: yup
    .string()
    .matches(/^[\d,]+$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true
      const numericValue = value.replace(/,/g, '')
      return !isNaN(Number(numericValue)) && Number(numericValue) >= 0
    }),
  voucher: yup.string(),
})
