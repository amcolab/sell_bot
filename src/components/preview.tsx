import React from 'react';
import { formatNumber } from '../utils/utils';
import Button from './button';
import { getIndustryById } from '../utils/industryUtils';
import industryData from '../data/data.json';

interface PreviewProps {
  data: any;
  userId: string | null;
  onConfirm: () => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

const Preview: React.FC<PreviewProps> = ({ data, userId, onConfirm, onBack, isSubmitting }) => {
  const formatCurrency = (value: string) => {
    return value ? `¥${formatNumber(value)}` : '¥0';
  };

  // Helper function to transform industry fields
  const transformIndustry = (industry: any) => {
    const fields = [
      'category1',
      'category2',
      'category3',
      'category1_2',
      'category2_2',
      'category3_2',
      'category1_3',
      'category2_3',
      'category3_3',
    ];

    const transformed = { ...industry };
    fields.forEach((field) => {
      const value = industry[field];
      if (!value) {
        transformed[field] = '';
        return;
      }

      // Try parsing as a numeric ID
      const numericId = Number(value);
      if (!isNaN(numericId)) {
        const industryDataEntry = getIndustryById(numericId);
        if (industryDataEntry && industryDataEntry.value) {
          transformed[field] = industryDataEntry.value;
          return;
        }
      }

      // Check if the value matches an industry value or id in industryData
      const matchingIndustry = industryData.find(
        (item: any) => item.value === value || item.id.toString() === value
      );
      transformed[field] = matchingIndustry && matchingIndustry.value ? matchingIndustry.value : '';
    });
    return transformed;
  };

  // Transform data for display
  const transformedData = {
    ...data,
    mainCompany: {
      ...data.mainCompany,
      industry: transformIndustry(data.mainCompany.industry),
    },
    subsidiaries: data.subsidiaries
      ? data.subsidiaries.map((subsidiary: any) => ({
          ...subsidiary,
          industry: transformIndustry(subsidiary.industry),
        }))
      : [],
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-2 sm:p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">基本情報</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px]  ">登録日: </p>
            <p className="">{transformedData.registrationDate}</p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">法人名:</p>
            <p className="">{transformedData.legalName}</p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">法人名フリガナ:</p>
            <p className="">{transformedData.katakanaName}</p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">ご担当者名:</p>
            <p className="">
              {transformedData.personChargeFirstName} {transformedData.personChargeLastName}
            </p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">ご担当者名フリガナ:</p>
            <p className="">
              {transformedData.personChargeFirstNameKatakana} {transformedData.personChargeLastNameKatakana}
            </p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">役職名:</p>
            <p className="">{transformedData.position}</p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">メールアドレス:</p>
            <p className="">{transformedData.email}</p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">電話番号:</p>
            <p className="">{transformedData.phone}</p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">郵便番号: </p>
            <p className="">{transformedData.postalCode}</p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">住所:</p>
            <p className="">{transformedData.address}</p>
          </div>
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">レポート受信方法:</p>
            <p className="">{transformedData.reportReceiving}</p>
          </div>
          {transformedData.reportReceiving === '紹介者経由' && (
            <>
            <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">会社名:</p>
                <p className="">{transformedData.referrerCompanyName}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">紹介者名:</p>
                <p className="">{transformedData.referrerName}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">紹介者メールアドレス:</p>
                <p className="">{transformedData.referrerEmail}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">郵便番号:</p>
                <p className="">{transformedData.postalCodeReceiver}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">レポート郵送先 :</p>
                <p className="">{transformedData.receiverAddress}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Application Information */}
      <div className="bg-white p-2 sm:p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">申請情報</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">申請種別:</p>
            <p className="">{transformedData.applicationType}</p>
          </div>
          {transformedData.applicationType === '子会社含む' && (
            <div className="flex">
              <p className="text-back font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">子会社数:</p>
              <p className="">{transformedData.numberOfSubsidiaries}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Company Information */}
      <div className="bg-white p-2 sm:p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">本社情報</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">業種情報</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">業種目大分類:</p>
                <p className="">{transformedData.mainCompany.industry.category1 || '-'}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">業種目中分類:</p>
                <p className="">{transformedData.mainCompany.industry.category2 || '-'}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">業種目小分類:</p>
                <p className="">{transformedData.mainCompany.industry.category3 || '-'}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">業種区分特例:</p>
                <p className="">{transformedData.mainCompany.industry.specialCase || '-'}</p>
              </div>
              {transformedData.mainCompany.industry.specialCase === 'under50' && (
                <>
                  <div className="flex">
                    <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">主たる事業の売上:</p>
                    <p className="">
                      {transformedData.mainCompany.industry.revenuePercentage1
                        ? `${transformedData.mainCompany.industry.revenuePercentage1}%`
                        : '-'}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">2位の売上:</p>
                    <p className="">
                      {transformedData.mainCompany.industry.revenuePercentage2
                        ? `${transformedData.mainCompany.industry.revenuePercentage2}%`
                        : '-'}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">2位の業種目大分類:</p>
                    <p className="">
                      {transformedData.mainCompany.industry.category1_2 || '-'}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">2位の業種目中分類:</p>
                    <p className="">
                      {transformedData.mainCompany.industry.category2_2 || '-'}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">2位の業種目小分類:</p>
                    <p className="">
                      {transformedData.mainCompany.industry.category3_2 || '-'}
                    </p>
                  </div>
                  {transformedData.mainCompany.industry.revenuePercentage3 && (
                    <>
                      <div className="flex">
                        <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">3位の売上:</p>
                        <p className="">
                          {transformedData.mainCompany.industry.revenuePercentage3
                            ? `${transformedData.mainCompany.industry.revenuePercentage3}%`
                            : '-'}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">3位の業種目大分類:</p>
                        <p className="">
                          {transformedData.mainCompany.industry.category1_3 || '-'}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">3位の業種目中分類:</p>
                        <p className="">
                          {transformedData.mainCompany.industry.category2_3 || '-'}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">3位の業種目小分類:</p>
                        <p className="">
                          {transformedData.mainCompany.industry.category3_3 || '-'}
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">財務情報</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">利益:</p>
                <p className="">{formatCurrency(transformedData.mainCompany.financial.profit)}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">配当:</p>
                <p className="">{formatCurrency(transformedData.mainCompany.financial.dividends)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subsidiaries Information */}
      {transformedData.applicationType === '子会社含む' &&
        transformedData.subsidiaries &&
        transformedData.subsidiaries.length > 0 && (
          <div className="bg-white p-2 sm:p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">子会社情報</h2>
            {transformedData.subsidiaries.map((subsidiary: any, index: number) => (
              <div key={index + 1} className="mb-6">
                <h3 className="font-semibold mb-2">子会社 {index + 1}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className=" mb-2">業種情報</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
                      <div className="flex">
                        <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">業種目大分類:</p>
                        <p className="">{subsidiary.industry.category1 || '-'}</p>
                      </div>
                      <div className="flex">
                        <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">業種目中分類:</p>
                        <p className="">{subsidiary.industry.category2 || '-'}</p>
                      </div>
                      <div className="flex">
                        <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">業種目小分類:</p>
                        <p className="">{subsidiary.industry.category3 || '-'}</p>
                      </div>
                      {subsidiary.industry.specialCase === 'under50' && (
                        <>
                          <div className="flex">
                            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">主たる事業の売上:</p>
                            <p className="">
                              {subsidiary.industry.revenuePercentage1
                                ? `${subsidiary.industry.revenuePercentage1}%`
                                : '-'}
                            </p>
                          </div>
                          <div className="flex">
                            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">2位の売上:</p>
                            <p className="">
                              {subsidiary.industry.revenuePercentage2
                                ? `${subsidiary.industry.revenuePercentage2}%`
                                : '-'}
                            </p>
                          </div>
                          <div className="flex">
                            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">2位の業種目大分類:</p>
                            <p className="">{subsidiary.industry.category1_2 || '-'}</p>
                          </div>
                          <div className="flex">
                            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">2位の業種目中分類:</p>
                            <p className="">{subsidiary.industry.category2_2 || '-'}</p>
                          </div>
                          <div className="flex">
                            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">2位の業種目小分類:</p>
                            <p className="">{subsidiary.industry.category3_2 || '-'}</p>
                          </div>
                          {subsidiary.industry.revenuePercentage3 && (
                            <>
                              <div className="flex">
                                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">3位の売上:</p>
                                <p className="">
                                  {subsidiary.industry.revenuePercentage3
                                    ? `${subsidiary.industry.revenuePercentage3}%`
                                    : '-'}
                                </p>
                              </div>
                              <div className="flex">
                                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">3位の業種目大分類:</p>
                                <p className="">{subsidiary.industry.category1_3 || '-'}</p>
                              </div>
                              <div className="flex">
                                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">3位の業種目中分類:</p>
                                <p className="">{subsidiary.industry.category2_3 || '-'}</p>
                              </div>
                              <div className="flex">
                                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">3位の業種目小分類:</p>
                                <p className="">{subsidiary.industry.category3_3 || '-'}</p>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className=" mb-2">財務情報</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
                      <div className="flex">
                        <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">利益:</p>
                        <p className="">{formatCurrency(subsidiary.financial.profit)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      <div className="bg-white p-2 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">役員退職金</h2>
          <div>
            <div className="">
              <div className="flex">
                <p className="text-back font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">現在の月額役員報酬:</p>
                <p className="">{formatCurrency(transformedData.currentSalary)}</p>
              </div>
              <div className="flex">
                <p className="text-back font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">取締役勤続年数:</p>
                <p className="">{transformedData.numberOfYears}</p>
              </div>
            </div>
        </div>
      </div>

      {/* Inheritance Information */}
      <div className="bg-white p-2 sm:p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">相続情報</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">法定相続人</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">配偶者の有無:</p>
                <p className="">{transformedData.maritalStatus}</p>
              </div>
              {transformedData.maritalStatus === 'はい' && (
                <>
                  <div className="flex">
                    <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">現在の配偶者との間のお子様の人数:</p>
                    <p className="">{transformedData.numberOfChildrenWithSpouse || '0'}</p>
                  </div>
                  <div className="flex">
                    <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">上記以外のお子様の人数:</p>
                    <p className="">{transformedData.numberOfOtherChildren || '0'}</p>
                  </div>
                </>
              )}
              {(!transformedData.numberOfChildrenWithSpouse ||
                transformedData.numberOfChildrenWithSpouse === '0') &&
                (!transformedData.numberOfOtherChildren ||
                  transformedData.numberOfOtherChildren === '0') && (
                  <>
                    <div className="flex">
                      <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">ご存命のご両親:</p>
                      <p className="">{transformedData.numberOfLivingParents || '0'}</p>
                    </div>
                    <div className="flex">
                      <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">ご存命のご兄弟:</p>
                      <p className="">{transformedData.numberOfLivingSiblings || '0'}</p>
                    </div>
                  </>
                )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">オーナーの財産</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">オーナー氏名:</p>
                <p className="">{transformedData.ownerName}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">現預金:</p>
                <p className="">{formatCurrency(transformedData.cashAndDeposits)}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">退職金（支給予定額）:</p>
                <p className="">{formatCurrency(transformedData.retirementBenefits)}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">不動産:</p>
                <p className="">{formatCurrency(transformedData.realEstate)}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">有価証券等の金融資産（自社株以外）:</p>
                <p className="">{formatCurrency(transformedData.securities)}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">生命保険の額:</p>
                <p className="">{formatCurrency(transformedData.amountOfLifeInsurance)}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">その他財産（貸付金等）:</p>
                <p className="">{formatCurrency(transformedData.otherAssets)}</p>
              </div>
              <div className="flex">
                <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">債務:</p>
                <p className="">{formatCurrency(transformedData.debts)}</p>
              </div>
            </div>
          </div>

          {transformedData.includeSpouseAssets === 'はい' && (
            <div>
              <h3 className="font-semibold mb-2">配偶者の財産</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
                <div className="flex">
                  <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">配偶者氏名:</p>
                  <p className="">{transformedData.spouseName}</p>
                </div>
                <div className="flex">
                  <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">現預金:</p>
                  <p className="">{formatCurrency(transformedData.spouseCashAndDeposits)}</p>
                </div>
                <div className="flex">
                  <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">退職金（支給予定額）:</p>
                  <p className="">
                    {formatCurrency(transformedData.spouseRetirementBenefits)}
                  </p>
                </div>
                <div className="flex">
                  <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">不動産:</p>
                  <p className="">{formatCurrency(transformedData.spouseRealEstate)}</p>
                </div>
                <div className="flex">
                  <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">有価証券等の金融資産（自社株以外）:</p>
                  <p className="">{formatCurrency(transformedData.spouseSecurities)}</p>
                </div>
                <div className="flex">
                  <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">生命保険の額:</p>
                  <p className="">
                    {formatCurrency(transformedData.spouseAmountOfLifeInsurance)}
                  </p>
                </div>
                <div className="flex">
                  <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">その他財産（貸付金等）:</p>
                  <p className="">{formatCurrency(transformedData.spouseOtherAssets)}</p>
                </div>
                <div className="flex">
                  <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">債務:</p>
                  <p className="">{formatCurrency(transformedData.spouseDebts)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white p-2 sm:p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">支払情報に修正</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] sm:text-[16px]">
          <div className="flex">
            <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">金額:</p>
            <p className="">{formatCurrency(transformedData.price.toString())}</p>
          </div>
          {transformedData.voucher && (
            <div className="flex">
              <p className="text-back  font-medium sm:w-[180px] min-w-[165px] max-w-[165px] ">クーポンコード:</p>
              <p className="">{transformedData.voucher}</p>
            </div>
          )}
        </div>
      </div>

      <div className="button-group mt-8 flex justify-between gap-10">
        <Button
          type="button"
          title="戻る"
          styleBtn="danger"
          onClick={onBack}
          disabled={isSubmitting}
        >
          戻る
        </Button>
        <Button
          type="button"
          title="送信"
          styleBtn="primary"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : '送信'}
        </Button>
      </div>
    </div>
  );
};

export default Preview;
