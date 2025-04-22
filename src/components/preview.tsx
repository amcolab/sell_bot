import React from 'react';
import { formatNumber } from '../utils/utils';
import Button from './button';

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

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">基本情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">登録日</p>
            <p className="font-medium">{data.registrationDate}</p>
          </div>
          <div>
            <p className="text-gray-600">法人名</p>
            <p className="font-medium">{data.legalName}</p>
          </div>
          <div>
            <p className="text-gray-600">カタカナ名</p>
            <p className="font-medium">{data.katakanaName}</p>
          </div>
          <div>
            <p className="text-gray-600">担当者名</p>
            <p className="font-medium">{data.personChargeFirtName} {data.personChargeLastName}</p>
          </div>
          <div>
            <p className="text-gray-600">担当者名（カタカナ）</p>
            <p className="font-medium">{data.personChargeFirtNameKatana} {data.personChargeLastNameKatana}</p>
          </div>
          <div>
            <p className="text-gray-600">役職</p>
            <p className="font-medium">{data.position}</p>
          </div>
          <div>
            <p className="text-gray-600">メールアドレス</p>
            <p className="font-medium">{data.email}</p>
          </div>
          <div>
            <p className="text-gray-600">電話番号</p>
            <p className="font-medium">{data.phone}</p>
          </div>
          <div>
            <p className="text-gray-600">住所</p>
            <p className="font-medium">{data.address}</p>
          </div>
          <div>
            <p className="text-gray-600">郵便番号</p>
            <p className="font-medium">{data.postalCode}</p>
          </div>
          <div>
            <p className="text-gray-600">レポート受信方法</p>
            <p className="font-medium">{data.reportReceiving}</p>
          </div>
          <div>
            <p className="text-gray-600">レポート送付先住所</p>
            <p className="font-medium">{data.receiverAddress}</p>
          </div>
          {data.reportReceiving === '紹介者経由' && (
            <>
              <div>
                <p className="text-gray-600">紹介者名</p>
                <p className="font-medium">{data.referrerName}</p>
              </div>
              <div>
                <p className="text-gray-600">紹介者メールアドレス</p>
                <p className="font-medium">{data.referrerEmail}</p>
              </div>
              <div>
                <p className="text-gray-600">紹介者住所</p>
                <p className="font-medium">{data.referrerAddress}</p>
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
            <p className="font-medium">{data.applicationType}</p>
          </div>
          {data.applicationType === '子会社含む' && (
            <div>
              <p className="text-gray-600">子会社数</p>
              <p className="font-medium">{data.numberOfSubsidiaries}</p>
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
                <p className="font-medium">{data.mainCompany.industry.category1}</p>
              </div>
              <div>
                <p className="text-gray-600">業種カテゴリー2</p>
                <p className="font-medium">{data.mainCompany.industry.category2}</p>
              </div>
              <div>
                <p className="text-gray-600">業種カテゴリー3</p>
                <p className="font-medium">{data.mainCompany.industry.category3}</p>
              </div>
              <div>
                <p className="text-gray-600">業種区分特例</p>
                <p className="font-medium">{data.mainCompany.industry.specialCase}</p>
              </div>
              {data.mainCompany.industry.specialCase === 'under50' && (
                <>
                  <div>
                    <p className="text-gray-600">主たる事業の売上</p>
                    <p className="font-medium">{data.mainCompany.industry.revenuePercentage1}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">2位の売上</p>
                    <p className="font-medium">{data.mainCompany.industry.revenuePercentage2}%</p>
                  </div>
                  {data.mainCompany.industry.revenuePercentage3 && (
                    <div>
                      <p className="text-gray-600">3位の売上</p>
                      <p className="font-medium">{data.mainCompany.industry.revenuePercentage3}%</p>
                    </div>
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
                <p className="font-medium">{formatCurrency(data.mainCompany.financial.profit)}</p>
              </div>
              <div>
                <p className="text-gray-600">配当</p>
                <p className="font-medium">{formatCurrency(data.mainCompany.financial.dividends)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subsidiaries Information */}
      {data.applicationType === '子会社含む' && data.subsidiaries && data.subsidiaries.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">子会社情報</h2>
          {data.subsidiaries.map((subsidiary: any, index: number) => (
            <div key={subsidiary.id} className="mb-6">
              <h3 className="font-semibold mb-2">子会社 {index + 1}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">業種情報</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">業種区分特例</p>
                      <p className="font-medium">{subsidiary.industry.specialCase}</p>
                    </div>
                    {subsidiary.industry.specialCase === 'under50' && (
                      <>
                        <div>
                          <p className="text-gray-600">主たる事業の売上</p>
                          <p className="font-medium">{subsidiary.industry.revenuePercentage1}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">2位の売上</p>
                          <p className="font-medium">{subsidiary.industry.revenuePercentage2}%</p>
                        </div>
                        {subsidiary.industry.revenuePercentage3 && (
                          <div>
                            <p className="text-gray-600">3位の売上</p>
                            <p className="font-medium">{subsidiary.industry.revenuePercentage3}%</p>
                          </div>
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
                      <p className="font-medium">{formatCurrency(subsidiary.financial.dividends)}</p>
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
                <p className="font-medium">{data.maritalStatus}</p>
              </div>
              {data.maritalStatus === 'はい' && (
                <>
                  <div>
                    <p className="text-gray-600">現在の配偶者との間のお子様の人数</p>
                    <p className="font-medium">{data.numberOfChildrenWithSpouse || '0'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">上記以外のお子様の人数</p>
                    <p className="font-medium">{data.numberOfOtherChildren || '0'}</p>
                  </div>
                </>
              )}
              {(!data.numberOfChildrenWithSpouse || data.numberOfChildrenWithSpouse === '0') && 
               (!data.numberOfOtherChildren || data.numberOfOtherChildren === '0') && (
                <>
                  <div>
                    <p className="text-gray-600">ご存命のご両親</p>
                    <p className="font-medium">{data.numberOfLivingParents || '0'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ご存命のご兄弟</p>
                    <p className="font-medium">{data.numberOfLivingSiblings || '0'}</p>
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
                <p className="font-medium">{data.ownerName}</p>
              </div>
              <div>
                <p className="text-gray-600">現預金</p>
                <p className="font-medium">{formatCurrency(data.cashAndDeposits)}</p>
              </div>
              <div>
                <p className="text-gray-600">退職金（支給予定額）</p>
                <p className="font-medium">{formatCurrency(data.retirementBenefits)}</p>
              </div>
              <div>
                <p className="text-gray-600">不動産</p>
                <p className="font-medium">{formatCurrency(data.realEstate)}</p>
              </div>
              <div>
                <p className="text-gray-600">有価証券（自社株以外）</p>
                <p className="font-medium">{formatCurrency(data.securities)}</p>
              </div>
              <div>
                <p className="text-gray-600">生命保険等の額</p>
                <p className="font-medium">{formatCurrency(data.amountOfLifeInsurance)}</p>
              </div>
              <div>
                <p className="text-gray-600">その他財産（貸付金等）</p>
                <p className="font-medium">{formatCurrency(data.otherAssets)}</p>
              </div>
              <div>
                <p className="text-gray-600">債務</p>
                <p className="font-medium">{formatCurrency(data.debts)}</p>
              </div>
            </div>
          </div>

          {data.includeSpouseAssets === 'はい' && (
            <div>
              <h3 className="font-semibold mb-2">配偶者の財産</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">配偶者氏名</p>
                  <p className="font-medium">{data.spouseName}</p>
                </div>
                <div>
                  <p className="text-gray-600">現預金</p>
                  <p className="font-medium">{formatCurrency(data.spouseCashAndDeposits)}</p>
                </div>
                <div>
                  <p className="text-gray-600">退職金（支給予定額）</p>
                  <p className="font-medium">{formatCurrency(data.spouseRetirementBenefits)}</p>
                </div>
                <div>
                  <p className="text-gray-600">不動産</p>
                  <p className="font-medium">{formatCurrency(data.spouseRealEstate)}</p>
                </div>
                <div>
                  <p className="text-gray-600">有価証券（自社株以外）</p>
                  <p className="font-medium">{formatCurrency(data.spouseSecurities)}</p>
                </div>
                <div>
                  <p className="text-gray-600">生命保険等の額</p>
                  <p className="font-medium">{formatCurrency(data.spouseAmountOfLifeInsurance)}</p>
                </div>
                <div>
                  <p className="text-gray-600">その他財産（貸付金等）</p>
                  <p className="font-medium">{formatCurrency(data.spouseOtherAssets)}</p>
                </div>
                <div>
                  <p className="text-gray-600">債務</p>
                  <p className="font-medium">{formatCurrency(data.spouseDebts)}</p>
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
            <p className="font-medium">{formatCurrency(data.price.toString())}</p>
          </div>
          {data.voucher && (
            <div>
              <p className="text-gray-600">クーポンコード</p>
              <p className="font-medium">{data.voucher}</p>
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