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
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">基本情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">登録日</p>
            <p className="font-medium">{transformedData.registrationDate}</p>
          </div>
          <div>
            <p className="text-gray-600">法人名</p>
            <p className="font-medium">{transformedData.legalName}</p>
          </div>
          <div>
            <p className="text-gray-600">カタカナ名</p>
            <p className="font-medium">{transformedData.katakanaName}</p>
          </div>
          <div>
            <p className="text-gray-600">担当者名</p>
            <p className="font-medium">
              {transformedData.personChargeFirtName} {transformedData.personChargeLastName}
            </p>
          </div>
          <div>
            <p className="text-gray-600">担当者名（カタカナ）</p>
            <p className="font-medium">
              {transformedData.personChargeFirtNameKatana} {transformedData.personChargeLastNameKatana}
            </p>
          </div>
          <div>
            <p className="text-gray-600">役職</p>
            <p className="font-medium">{transformedData.position}</p>
          </div>
          <div>
            <p className="text-gray-600">メールアドレス</p>
            <p className="font-medium">{transformedData.email}</p>
          </div>
          <div>
            <p className="text-gray-600">電話番号</p>
            <p className="font-medium">{transformedData.phone}</p>
          </div>
          <div>
            <p className="text-gray-600">住所</p>
            <p className="font-medium">{transformedData.address}</p>
          </div>
          <div>
            <p className="text-gray-600">郵便番号</p>
            <p className="font-medium">{transformedData.postalCode}</p>
          </div>
          <div>
            <p className="text-gray-600">レポート受信方法</p>
            <p className="font-medium">{transformedData.reportReceiving}</p>
          </div>
          <div>
            <p className="text-gray-600">レポート送付先住所</p>
            <p className="font-medium">{transformedData.receiverAddress}</p>
          </div>
          {transformedData.reportReceiving === '紹介者経由' && (
            <>
              <div>
                <p className="text-gray-600">紹介者名</p>
                <p className="font-medium">{transformedData.referrerName}</p>
              </div>
              <div>
                <p className="text-gray-600">紹介者メールアドレス</p>
                <p className="font-medium">{transformedData.referrerEmail}</p>
              </div>
              <div>
                <p className="text-gray-600">紹介者住所</p>
                <p className="font-medium">{transformedData.referrerAddress}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Application Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">申請情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">申請種別</p>
            <p className="font-medium">{transformedData.applicationType}</p>
          </div>
          {transformedData.applicationType === '子会社含む' && (
            <div>
              <p className="text-gray-600">子会社数</p>
              <p className="font-medium">{transformedData.numberOfSubsidiaries}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Company Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">本社情報</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">業種情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">業種カテゴリー1</p>
                <p className="font-medium">{transformedData.mainCompany.industry.category1 || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">業種カテゴリー2</p>
                <p className="font-medium">{transformedData.mainCompany.industry.category2 || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">業種カテゴリー3</p>
                <p className="font-medium">{transformedData.mainCompany.industry.category3 || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">業種区分特例</p>
                <p className="font-medium">{transformedData.mainCompany.industry.specialCase || '-'}</p>
              </div>
              {transformedData.mainCompany.industry.specialCase === 'under50' && (
                <>
                  <div>
                    <p className="text-gray-600">主たる事業の売上</p>
                    <p className="font-medium">
                      {transformedData.mainCompany.industry.revenuePercentage1
                        ? `${transformedData.mainCompany.industry.revenuePercentage1}%`
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">2位の売上</p>
                    <p className="font-medium">
                      {transformedData.mainCompany.industry.revenuePercentage2
                        ? `${transformedData.mainCompany.industry.revenuePercentage2}%`
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">2位の業種カテゴリー1</p>
                    <p className="font-medium">
                      {transformedData.mainCompany.industry.category1_2 || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">2位の業種カテゴリー2</p>
                    <p className="font-medium">
                      {transformedData.mainCompany.industry.category2_2 || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">2位の業種カテゴリー3</p>
                    <p className="font-medium">
                      {transformedData.mainCompany.industry.category3_2 || '-'}
                    </p>
                  </div>
                  {transformedData.mainCompany.industry.revenuePercentage3 && (
                    <>
                      <div>
                        <p className="text-gray-600">3位の売上</p>
                        <p className="font-medium">
                          {transformedData.mainCompany.industry.revenuePercentage3
                            ? `${transformedData.mainCompany.industry.revenuePercentage3}%`
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">3位の業種カテゴリー1</p>
                        <p className="font-medium">
                          {transformedData.mainCompany.industry.category1_3 || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">3位の業種カテゴリー2</p>
                        <p className="font-medium">
                          {transformedData.mainCompany.industry.category2_3 || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">3位の業種カテゴリー3</p>
                        <p className="font-medium">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">利益</p>
                <p className="font-medium">{formatCurrency(transformedData.mainCompany.financial.profit)}</p>
              </div>
              <div>
                <p className="text-gray-600">配当</p>
                <p className="font-medium">{formatCurrency(transformedData.mainCompany.financial.dividends)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subsidiaries Information */}
      {transformedData.applicationType === '子会社含む' &&
        transformedData.subsidiaries &&
        transformedData.subsidiaries.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">子会社情報</h2>
            {transformedData.subsidiaries.map((subsidiary: any, index: number) => (
              <div key={index + 1} className="mb-6">
                <h3 className="font-semibold mb-2">子会社 {index + 1}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">業種情報</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">業種カテゴリー1</p>
                        <p className="font-medium">{subsidiary.industry.category1 || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">業種カテゴリー2</p>
                        <p className="font-medium">{subsidiary.industry.category2 || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">業種カテゴリー3</p>
                        <p className="font-medium">{subsidiary.industry.category3 || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">業種区分特例</p>
                        <p className="font-medium">{subsidiary.industry.specialCase || '-'}</p>
                      </div>
                      {subsidiary.industry.specialCase === 'under50' && (
                        <>
                          <div>
                            <p className="text-gray-600">主たる事業の売上</p>
                            <p className="font-medium">
                              {subsidiary.industry.revenuePercentage1
                                ? `${subsidiary.industry.revenuePercentage1}%`
                                : '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">2位の売上</p>
                            <p className="font-medium">
                              {subsidiary.industry.revenuePercentage2
                                ? `${subsidiary.industry.revenuePercentage2}%`
                                : '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">2位の業種カテゴリー1</p>
                            <p className="font-medium">{subsidiary.industry.category1_2 || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">2位の業種カテゴリー2</p>
                            <p className="font-medium">{subsidiary.industry.category2_2 || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">2位の業種カテゴリー3</p>
                            <p className="font-medium">{subsidiary.industry.category3_2 || '-'}</p>
                          </div>
                          {subsidiary.industry.revenuePercentage3 && (
                            <>
                              <div>
                                <p className="text-gray-600">3位の売上</p>
                                <p className="font-medium">
                                  {subsidiary.industry.revenuePercentage3
                                    ? `${subsidiary.industry.revenuePercentage3}%`
                                    : '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">3位の業種カテゴリー1</p>
                                <p className="font-medium">{subsidiary.industry.category1_3 || '-'}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">3位の業種カテゴリー2</p>
                                <p className="font-medium">{subsidiary.industry.category2_3 || '-'}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">3位の業種カテゴリー3</p>
                                <p className="font-medium">{subsidiary.industry.category3_3 || '-'}</p>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">財務情報</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">利益</p>
                        <p className="font-medium">{formatCurrency(subsidiary.financial.profit)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">配当</p>
                        <p className="font-medium">
                          {formatCurrency(subsidiary.financial.dividends || '0')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Inheritance Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">相続情報</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">法定相続人</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">配偶者の有無</p>
                <p className="font-medium">{transformedData.maritalStatus}</p>
              </div>
              {transformedData.maritalStatus === 'はい' && (
                <>
                  <div>
                    <p className="text-gray-600">現在の配偶者との間のお子様の人数</p>
                    <p className="font-medium">{transformedData.numberOfChildrenWithSpouse || '0'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">上記以外のお子様の人数</p>
                    <p className="font-medium">{transformedData.numberOfOtherChildren || '0'}</p>
                  </div>
                </>
              )}
              {(!transformedData.numberOfChildrenWithSpouse ||
                transformedData.numberOfChildrenWithSpouse === '0') &&
                (!transformedData.numberOfOtherChildren ||
                  transformedData.numberOfOtherChildren === '0') && (
                  <>
                    <div>
                      <p className="text-gray-600">ご存命のご両親</p>
                      <p className="font-medium">{transformedData.numberOfLivingParents || '0'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ご存命のご兄弟</p>
                      <p className="font-medium">{transformedData.numberOfLivingSiblings || '0'}</p>
                    </div>
                  </>
                )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">オーナーの財産</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">オーナー氏名</p>
                <p className="font-medium">{transformedData.ownerName}</p>
              </div>
              <div>
                <p className="text-gray-600">現預金</p>
                <p className="font-medium">{formatCurrency(transformedData.cashAndDeposits)}</p>
              </div>
              <div>
                <p className="text-gray-600">退職金（支給予定額）</p>
                <p className="font-medium">{formatCurrency(transformedData.retirementBenefits)}</p>
              </div>
              <div>
                <p className="text-gray-600">不動産</p>
                <p className="font-medium">{formatCurrency(transformedData.realEstate)}</p>
              </div>
              <div>
                <p className="text-gray-600">有価証券（自社株以外）</p>
                <p className="font-medium">{formatCurrency(transformedData.securities)}</p>
              </div>
              <div>
                <p className="text-gray-600">生命保険等の額</p>
                <p className="font-medium">{formatCurrency(transformedData.amountOfLifeInsurance)}</p>
              </div>
              <div>
                <p className="text-gray-600">その他財産（貸付金等）</p>
                <p className="font-medium">{formatCurrency(transformedData.otherAssets)}</p>
              </div>
              <div>
                <p className="text-gray-600">債務</p>
                <p className="font-medium">{formatCurrency(transformedData.debts)}</p>
              </div>
            </div>
          </div>

          {transformedData.includeSpouseAssets === 'はい' && (
            <div>
              <h3 className="font-semibold mb-2">配偶者の財産</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">配偶者氏名</p>
                  <p className="font-medium">{transformedData.spouseName}</p>
                </div>
                <div>
                  <p className="text-gray-600">現預金</p>
                  <p className="font-medium">{formatCurrency(transformedData.spouseCashAndDeposits)}</p>
                </div>
                <div>
                  <p className="text-gray-600">退職金（支給予定額）</p>
                  <p className="font-medium">
                    {formatCurrency(transformedData.spouseRetirementBenefits)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">不動産</p>
                  <p className="font-medium">{formatCurrency(transformedData.spouseRealEstate)}</p>
                </div>
                <div>
                  <p className="text-gray-600">有価証券（自社株以外）</p>
                  <p className="font-medium">{formatCurrency(transformedData.spouseSecurities)}</p>
                </div>
                <div>
                  <p className="text-gray-600">生命保険等の額</p>
                  <p className="font-medium">
                    {formatCurrency(transformedData.spouseAmountOfLifeInsurance)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">その他財産（貸付金等）</p>
                  <p className="font-medium">{formatCurrency(transformedData.spouseOtherAssets)}</p>
                </div>
                <div>
                  <p className="text-gray-600">債務</p>
                  <p className="font-medium">{formatCurrency(transformedData.spouseDebts)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">支払い情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">金額</p>
            <p className="font-medium">{formatCurrency(transformedData.price.toString())}</p>
          </div>
          {transformedData.voucher && (
            <div>
              <p className="text-gray-600">クーポンコード</p>
              <p className="font-medium">{transformedData.voucher}</p>
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
