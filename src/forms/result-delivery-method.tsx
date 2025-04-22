import { Controller, useFormContext } from 'react-hook-form';
import Input from '../components/input';
import Radio from '../components/radio';
import { get } from 'japan-postal-code';
import { useState, useEffect } from 'react';
import HeaderSection from '../components/header-section';

export default function ResultDeliveryMethod({
  control,
  errors,
  saveDataToLocalStorage,
  setValue,
  setError,
  watch
}: any) {
  const reportReceiving = watch('reportReceiving'); 

  const handleBlur = (name: string, value: any) => {
    saveDataToLocalStorage(name, value);
  };

  const [postalCodeReceiver, setpostalCodeReceiver] = useState('');
  const handleLookup = async () => {
    if (!postalCodeReceiver) return;

    try {
      await get(postalCodeReceiver, (address: any) => {
        console.log(address);

        const formattedAddress = `${address.prefecture}${address.city}${address.area}${address.street}`;
        handleBlur('receiverAddress', formattedAddress);
        setValue('receiverAddress', formattedAddress);
        setError('receiverAddress', { type: null, message: null }); // Clear error
      });
    } catch (err) {
      console.error('Failed to fetch address:', err);
    }
  };

  useEffect(() => {
    if (reportReceiving !== '紹介者経由') {
      setError('referrerName', { type: null, message: null });
      setError('referrerCompanyName', { type: null, message: null });
      setError('referrerEmail', { type: null, message: null });
    }
  }, [reportReceiving, setError]);

  return (
    <HeaderSection title="結果レポート" stepNumber={2}>
      <div className="mt-2">
        <div className="mb-5">
          <label className="block mb-1.5 text-[#0a2e52] text-sm font-medium">
            レポート受取方法 <span className="text-[#e74c3c]">*</span>
          </label>
          <div className="flex gap-4">
            <Controller
              name="reportReceiving"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Radio
                    id="reportReceiving-introducer"
                    type="radio"
                    name="reportReceiving"
                    onChange={() => {
                      field.onChange('紹介者経由');
                      handleBlur('reportReceiving', '紹介者経由');
                    }}
                    onBlur={field.onBlur}
                    checked={field.value === '紹介者経由'}
                    title="紹介者経由"
                    required={true}
                  />
                  <Radio
                    id="reportReceiving-mail"
                    type="radio"
                    name="reportReceiving"
                    onChange={() => {
                      field.onChange('上記法人宛郵送');
                      handleBlur('reportReceiving', '上記法人宛郵送');
                    }}
                    onBlur={field.onBlur}
                    checked={field.value === '上記法人宛郵送'}
                    title="上記法人宛郵送"
                  />
                </>
              )}
            />
          </div>
          {errors.reportReceiving && (
            <span className="block mt-1 text-sm text-[#e74c3c]">
              {errors.reportReceiving.message}
            </span>
          )}
        </div>

        <div className="mb-5">
          <Controller
            name="postalCodeReceiver"
            control={control}
            render={({ field }) => (
              <Input
                label="郵便番号"
                id="postalCodeReceiver"
                type="text"
                name="postalCodeReceiver"
                placeholder="郵便番号を入力してください"
                error={errors.postalCodeReceiver?.message}
                onchange={(e) => {
                  field.onChange(e);
                  setpostalCodeReceiver(e.target.value);
                }}
                onblur={() => {
                  handleBlur('postalCodeReceiver', field.value);
                  handleLookup();
                }}
                value={field.value}
              />
            )}
          />
        </div>

        <div className="mb-5">
          <Controller
            name="receiverAddress"
            control={control}
            render={({ field }) => (
              <Input
                label="郵送先住所"
                id="receiverAddress"
                type="text"
                name="receiverAddress"
                placeholder="郵送先住所を入力してください"
                error={errors.receiverAddress?.message}
                onchange={field.onChange}
                onblur={() => handleBlur('receiverAddress', field.value)}
                value={field.value}
                required={true}
              />
            )}
          />
        </div>
        {reportReceiving === '紹介者経由' && <><div className="mb-5">
          <label className="block mb-1.5 text-[#0a2e52] text-sm font-medium">
            ご紹介者
          </label>
          <div className="flex gap-4">
            <div className="flex items-center w-1/2">
              <p className="w-[60px] text-[12px]">会社名</p>
              <Controller
                name="referrerCompanyName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="referrerCompanyName"
                    type="text"
                    name="referrerCompanyName"
                    placeholder="ご紹介者名を入力してください"
                    error={errors.referrerCompanyName?.message}
                    onchange={field.onChange}
                    onblur={() => handleBlur('referrerCompanyName', field.value)}
                    value={field.value}
                  />
                )}
              />
            </div>

            <div className="flex items-center w-1/2">
              <p className="w-[60px] text-[12px]">氏名</p>
              <Controller
                name="referrerName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="referrerName"
                    type="text"
                    name="referrerName"
                    placeholder="ご紹介者名を入力してください"
                    error={errors.referrerName?.message}
                    onchange={field.onChange}
                    onblur={() => handleBlur('referrerName', field.value)}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="mb-5">
          <Controller
            name="referrerEmail"
            control={control}
            render={({ field }) => (
              <Input
                label="メールアドレス"
                id="referrerEmail"
                type="text"
                name="referrerEmail"
                placeholder="メールアドレスを入力してください"
                error={errors.referrerEmail?.message}
                onchange={field.onChange}
                onblur={() => handleBlur('referrerEmail', field.value)}
                value={field.value}
              />
            )}
          />
        </div></>}
        
        <div className="h-px bg-[#eee] my-5"></div>
      </div>
    </HeaderSection>
  );
}
