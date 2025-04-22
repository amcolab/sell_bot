import * as yup from 'yup';
import { formatNumber } from '../utils/utils';

// Helper function to transform number values
const numberTransform = (value: string) => {
  if (!value) return '0';
  const cleanValue = value.replace(/^0+/, '') || '0';
  return cleanValue;
};

// Define industry schema
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
    then: (schema) =>
      schema
        .required('主たる事業の売上は必須です')
        .test('is-valid-percentage', '有効なパーセンテージを入力してください', (value) => {
          if (!value) return false;
          const numValue = Number(value);
          return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  revenuePercentage2: yup.string().when('specialCase', {
    is: 'under50',
    then: (schema) =>
      schema
        .required('2位の売上は必須です')
        .test('is-valid-percentage', '有効なパーセンテージを入力してください', (value) => {
          if (!value) return false;
          const numValue = Number(value);
          return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  category2_2: yup.string().when(['specialCase', 'revenuePercentage2'], {
    is: (specialCase: string, rev2: string) => 
      specialCase === 'under50' && rev2 && rev2 !== '',
    then: (schema) => schema.required('２位の売上 - 業種カテゴリー2は必須です'),
    otherwise: (schema) => schema.notRequired(),
  }),
  category3_2: yup.string().when(['specialCase', 'category2_2'], {
    is: (specialCase: string, cat2: string) => 
      specialCase === 'under50' && cat2 && cat2 !== '',
    then: (schema) => schema.required('２位の売上 - 業種カテゴリー3は必須です'),
    otherwise: (schema) => schema.notRequired(),
  }),
  revenuePercentage3: yup.string().when(['specialCase', 'revenuePercentage1', 'revenuePercentage2'], {
    is: (specialCase: string, rev1: string, rev2: string) =>
      specialCase === 'under50' && rev1 && rev2 && Number(rev1) + Number(rev2) < 50,
    then: (schema) =>
      schema
        .required('3位の売上は必須です')
        .test('is-valid-percentage', '有効なパーセンテージを入力してください', (value) => {
          if (!value) return false;
          const numValue = Number(value);
          return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  category2_3: yup.string().when(['specialCase', 'revenuePercentage3'], {
    is: (specialCase: string, rev3: string) => 
      specialCase === 'under50' && rev3 && rev3 !== '',
    then: (schema) => schema.required('３位の売上 - 業種カテゴリー2は必須です'),
    otherwise: (schema) => schema.notRequired(),
  }),
  category3_3: yup.string().when(['specialCase', 'category2_3'], {
    is: (specialCase: string, cat2: string) => 
      specialCase === 'under50' && cat2 && cat2 !== '',
    then: (schema) => schema.required('３位の売上 - 業種カテゴリー3は必須です'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Define financial schema
const financialSchema = yup.object().shape({
  profit: yup
    .string()
    .transform((value) => (value ? value.replace(/,/g, '') : '0'))
    .matches(/^\d*$/, '利益は数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value || value === '0') return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    }),
  dividends: yup
    .string()
    .transform((value) => (value ? value.replace(/,/g, '') : '0'))
    .matches(/^\d*$/, '配当は数字のみ入力してください')
    .notRequired()
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value || value === '0') return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    }),
});

// Define subsidiary schema
const subsidiarySchema = yup.object().shape({
  industry: yup.object().shape({
    specialCase: yup.string().required('業種区分特例は必須です'),
    revenuePercentage1: yup.string().when('specialCase', {
      is: 'under50',
      then: (schema) =>
        schema
          .required('主たる事業の売上は必須です')
          .test('is-valid-percentage', '有効なパーセンテージを入力してください', (value) => {
            if (!value) return false;
            const numValue = Number(value);
            return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),
    revenuePercentage2: yup.string().when('specialCase', {
      is: 'under50',
      then: (schema) =>
        schema
          .required('2位の売上は必須です')
          .test('is-valid-percentage', '有効なパーセンテージを入力してください', (value) => {
            if (!value) return false;
            const numValue = Number(value);
            return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),
    category2_2: yup.string().when(['specialCase', 'revenuePercentage2'], {
      is: (specialCase: string, rev2: string) => 
        specialCase === 'under50' && rev2 && rev2 !== '',
      then: (schema) => schema.required('２位の売上 - 業種カテゴリー2は必須です'),
      otherwise: (schema) => schema.notRequired(),
    }),
    category3_2: yup.string().when(['specialCase', 'category2_2'], {
      is: (specialCase: string, cat2: string) => 
        specialCase === 'under50' && cat2 && cat2 !== '',
      then: (schema) => schema.required('２位の売上 - 業種カテゴリー3は必須です'),
      otherwise: (schema) => schema.notRequired(),
    }),
    revenuePercentage3: yup.string().when(['specialCase', 'revenuePercentage1', 'revenuePercentage2'], {
      is: (specialCase: string, rev1: string, rev2: string) =>
        specialCase === 'under50' && rev1 && rev2 && Number(rev1) + Number(rev2) < 50,
      then: (schema) =>
        schema
          .required('3位の売上は必須です')
          .test('is-valid-percentage', '有効なパーセンテージを入力してください', (value) => {
            if (!value) return false;
            const numValue = Number(value);
            return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),
    category2_3: yup.string().when(['specialCase', 'revenuePercentage3'], {
      is: (specialCase: string, rev3: string) => 
        specialCase === 'under50' && rev3 && rev3 !== '',
      then: (schema) => schema.required('３位の売上 - 業種カテゴリー2は必須です'),
      otherwise: (schema) => schema.notRequired(),
    }),
    category3_3: yup.string().when(['specialCase', 'category2_3'], {
      is: (specialCase: string, cat2: string) => 
        specialCase === 'under50' && cat2 && cat2 !== '',
      then: (schema) => schema.required('３位の売上 - 業種カテゴリー3は必須です'),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  financial: financialSchema,
});

// Katakana validation regex
const katakanaRegex = /^[\u30A0-\u30FF\uFF65-\uFF9F\s]+$/;

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
    .required('メールアドレスを入力してください')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'このメールアドレスは無効です'),
  phone: yup
    .string()
    .required('電話番号は必須です')
    .matches(/^\d{10,11}$/, '電話番号は10桁または11桁で入力してください'),
  position: yup.string(),
  address: yup.string().required('住所は必須です'),
  reportReceiving: yup.string().required('レポート受信方法は必須です'),
  postalCode: yup.string(),
  receiverAddress: yup.string().required('レポート送付先住所は必須です'),
  referrerName: yup.string().when('reportReceiving', {
    is: '紹介者経由',
    then: (schema) => schema.required('紹介者名を入力してください').min(1, '紹介者名は空にできません'),
    otherwise: (schema) => schema.notRequired(),
  }),
  referrerCompanyName: yup.string().when('reportReceiving', {
    is: '紹介者経由',
    then: (schema) => schema.required('会社名を入力してください').min(1, '会社名は空にできません'),
    otherwise: (schema) => schema.notRequired(),
  }),
  referrerAddress: yup.string().when('reportReceiving', {
    is: '紹介者経由',
    then: (schema) => schema.required('住所を入力してください').min(1, '住所は空にできません'),
    otherwise: (schema) => schema.notRequired(),
  }),
  referrerEmail: yup.string().when('reportReceiving', {
    is: '紹介者経由',
    then: (schema) =>
      schema
        .required('メールアドレスを入力してください')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'このメールアドレスは無効です'),
    otherwise: (schema) => schema.notRequired(),
  }),
  applicationType: yup.string().required('申請種別は必須です'),
  numberOfSubsidiaries: yup.string().when('applicationType', {
    is: '子会社含む',
    then: (schema) => schema.required('子会社数を選択してください'),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainCompany: yup.object().shape({
    industry: industrySchema,
    financial: financialSchema,
  }),
  subsidiaries: yup.array().of(subsidiarySchema).when('applicationType', {
    is: '子会社含む',
    then: (schema) => schema.required('子会社情報は必須です'),
    otherwise: (schema) => schema.notRequired(),
  }),
  currentSalary: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue > 0 && numValue <= 999999999999;
    }),
  numberOfYears: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な数値を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue > 0 && numValue <= 100;
    }),
  maritalStatus: yup.string().required('配偶者の有無は必須です'),
  numberOfChildrenWithSpouse: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-number', '有効な数値を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0;
    })
    .when('maritalStatus', {
      is: 'はい',
      then: (schema) => schema.required('現在の配偶者との子どもの人数は必須です'),
      otherwise: (schema) => schema.notRequired(),
    }),
  numberOfOtherChildren: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-number', '有効な数値を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0;
    })
    .when('maritalStatus', {
      is: 'はい',
      then: (schema) => schema.required('その他の子どもの人数は必須です'),
      otherwise: (schema) => schema.notRequired(),
    }),
  numberOfLivingParents: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-number', '有効な数値を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
    })
    .when(['numberOfChildrenWithSpouse', 'numberOfOtherChildren'], {
      is: (childrenWithSpouse: string, otherChildren: string) =>
        Number(childrenWithSpouse || 0) + Number(otherChildren || 0) === 0,
      then: (schema) => schema.required('ご存命のご両親の人数は必須です'),
      otherwise: (schema) => schema.notRequired(),
    }),
  numberOfLivingSiblings: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-number', '有効な数値を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0;
    })
    .when(['numberOfChildrenWithSpouse', 'numberOfOtherChildren'], {
      is: (childrenWithSpouse: string, otherChildren: string) =>
        Number(childrenWithSpouse || 0) + Number(otherChildren || 0) === 0,
      then: (schema) => schema.required('ご存命のご兄弟の人数は必須です'),
      otherwise: (schema) => schema.notRequired(),
    }),
  ownerName: yup.string().required('オーナー氏名は必須です'),
  cashAndDeposits: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    }),
  retirementBenefits: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    }),
  realEstate: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    }),
  securities: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    }),
  amountOfLifeInsurance: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    }),
  otherAssets: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    }),
  debts: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    }),
  includeSpouseAssets: yup.string().required('配偶者の財産を加えるかどうかは必須です'),
  spouseName: yup.string().when('includeSpouseAssets', {
    is: 'はい',
    then: (schema) => schema.required('配偶者氏名は必須です'),
    otherwise: (schema) => schema.notRequired(),
  }),
  spouseCashAndDeposits: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    })
    .notRequired(),
  spouseRetirementBenefits: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    })
    .notRequired(),
  spouseRealEstate: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    })
    .notRequired(),
  spouseSecurities: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    })
    .notRequired(),
  spouseAmountOfLifeInsurance: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    })
    .notRequired(),
  spouseOtherAssets: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    })
    .notRequired(),
  spouseDebts: yup
    .string()
    .transform(numberTransform)
    .matches(/^\d*$/, '数字のみ入力してください')
    .test('is-valid-yen', '有効な金額を入力してください', (value) => {
      if (!value) return true;
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 && numValue <= 999999999999;
    })
    .notRequired(),
  voucher: yup.string(),
});
