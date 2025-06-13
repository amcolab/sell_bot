interface BankTransferDetails {
  accountNumber: string
  bankName: string
  branchName: string
  bankCode: string
  branchCode: string
  accountHolderName: string
  accountType: string
}

interface PaymentResultProps {
  bankTransferDetails: BankTransferDetails | null
}

const PaymentResult: React.FC<PaymentResultProps> = ({
  bankTransferDetails,
}) => {
  if (!bankTransferDetails) {
    return (
      <div className='max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8'>
        <p className='text-red-600 text-center'>銀行振込の詳細がありません</p>
      </div>
    )
  }

  return (
    <div className='p-2 h-full rounded-lg mt-9'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
        銀行振込の詳細
      </h2>
      <div className="p-4 text-[12px] text-red-500">
        <div className="relative right-[7px]">【お振込先について】</div>
        <div>弊社が決済処理を委託している決済代行会社の専用口座です。</div>

        <div>
          ※この後お送りする決済案内メールを確認してからお振込みをお願いします
        </div>
        <div>※決済案内メールでも同じ口座情報をお送りします</div>
      </div>
      <div className='grid grid-cols-1 gap-4 bg-white p-4 shadow-lg rounded-md'>
        <div className='flex'>
          <span className='font-semibold text-gray-600 min-w-[110px]'>
            銀行名　　：
          </span>
          <p className='text-gray-800'>{bankTransferDetails.bankName}</p>
        </div>
        <div className='flex'>
          <span className='font-semibold text-gray-600 min-w-[110px]'>
            銀行コード：
          </span>
          <p className='text-gray-800'>{bankTransferDetails.bankCode}</p>
        </div>
        <div className='flex'>
          <span className='font-semibold text-gray-600 min-w-[110px]'>
            支店名　　：
          </span>
          <p className='text-gray-800'>{bankTransferDetails.branchName}</p>
        </div>
        <div className='flex'>
          <span className='font-semibold text-gray-600 min-w-[110px]'>
            支店コード：
          </span>
          <p className='text-gray-800'>{bankTransferDetails.branchCode}</p>
        </div>
        <div className='flex'>
          <span className='font-semibold text-gray-600 min-w-[110px]'>
            口座種別　：
          </span>
          <p className='text-gray-800'>{bankTransferDetails.accountType}</p>
        </div>
        <div className='flex'>
          <span className='font-semibold text-gray-600 min-w-[110px]'>
            口座番号　：
          </span>
          <p className='text-gray-800'>{bankTransferDetails.accountNumber}</p>
        </div>
        <div className='flex'>
          <span className='font-semibold text-gray-600 min-w-[110px]'>
            口座名義　：
          </span>
          <p className='text-gray-800'>{bankTransferDetails.accountHolderName}</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentResult
