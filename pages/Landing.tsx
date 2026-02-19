import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  CreditCard, Building2, Globe, Store, Wallet, QrCode, 
//   Facebook, Instagram, Link2, 
  Banknote,
  type LucideIcon,
  Monitor, 
//   Landmark, 
//   BanknoteArrowUp,
//   MapPinned,
  Smartphone
} from 'lucide-react';

import { useNavigate, useParams} from "react-router-dom";
// import generateReference from '../components/reference_generator/reference_generator';

// --- Types & Interfaces ---
interface PaymentMethod {
    id: string;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
}

interface CardOption {
    id: string;
    name: string;
    logo: LucideIcon;
    description: string;
}

// interface OnlineOption {
//     id: string;
//     name: string;
//     logo: string;
//     description: string;
//     fee: string;
// }

// interface OTCOption {
//     id: string;
//     name: string;
//     logo: LucideIcon;
//     description: string;
// }

// interface DigitalOption {
//     id: string;
//     name: string;
//     logo: string;
//     description: string;
// }

interface BankTransfer {
    provider_code: string;
    name         : string;
    short_name   : string
    main_logo_url: string;
    status       : string;
    country_code : string;
    fee_value    : string | null;
    fee_type     : string | null;
    method_code  : string;
    category     : string;
}

type OnlineBanks    = BankTransfer;
type CardTransfer   = BankTransfer;
type WalletTransfer = BankTransfer;
type OTCTransfer    = BankTransfer;

type apiResponse = {
    mastercard_visa   : CardTransfer[];
    bank_fund_transfer: BankTransfer[];
    e_wallet          : WalletTransfer[];
    online_banking    : OnlineBanks[];
    over_the_counter  : OTCTransfer[];
}

type paymentResponse = {
    transaction_id: string;
    currency      : string;
    created_at    : string;
    status        : string;
    reference_id  : string;
    type          : string;
    error         : string | null;
    amount        : string;
    redirect_url  : string | null;
}

const PRESET_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard size={14} />, disabled: true },
  { id: 'bank', label: 'Bank Transfer', icon: <Building2 size={14} />, disabled: true },
  { id: 'online', label: 'Online Banking', icon: <Globe size={14} />, disabled: true },
  { id: 'otc', label: 'Over-the-Counter', icon: <Store size={14} />, disabled: true  },
  { id: 'wallet', label: 'Digital Cash/Wallet', icon: <Wallet size={14} />, disabled: true },
  { id: 'qr', label: 'QRPH', icon: <QrCode size={14}/>, disabled: true },
];

const METHOD_API_MAP: Record<string, string> = {
  card: "mastercard_visa",
  bank: "bank_fund_transfer",
  online: "online_banking",
  otc: "over_the_counter",
  wallet: "e_wallet",
  qr: "qrph",
};

const CARDS: CardOption[] = [
  {
    id:     'credit-card',
    name: 'Credit Card',
    logo: CreditCard,
    description: 'Use any credit card with a Visa or Mastercard Logo',
  },
  {
    id: 'debit-card',
    name: 'Debit Card',
    logo: Banknote,
    description: 'Use any debit card with a Visa or Mastercard Logo',
  },
  {
    id: 'prepaid-credit-card',
    name: 'Prepaid Credit Card',
    logo: Wallet,
    description: 'Use any prepaid card with a Visa or Mastercard Logo (Amore, Yazz, EON, etc.)',
  }
];

// const ONLINE_METHODS: OnlineOption[] = [
//   {
//     id: 'bdo',
//     name: 'Banco de Oro',
//     logo: '/logos/bdologonobg.png', 
//     description: "Use your bank's mobile app to transfer funds. Additional steps required.",
//     fee: 'System fee (15)',
//   },
//   {
//     id: 'bpi',
//     name: 'Bank of the Philippine Island',
//     logo: '/logos/bpilogo.png',
//     description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (P10)',
//     fee: "",
//   },
//   {
//     id: 'landbank',
//     name: 'Landbank of the Philippines',
//     logo: '/logos/landbanknobg.png',
//     description: "Use your bank's mobile app to transfer funds. Additional steps required.",
//     fee: 'System fee (P10)',
//   },
//   {
//     id: 'metrobank',
//     name: 'Metrobank Express Online',
//     logo: '/logos/metrobank.png',
//     description: "Use your bank's mobile app to transfer funds. Additional steps required.",
//     fee: 'System fee (P10)',
//   },
//   {
//     id: 'sterling',
//     name: 'Sterling Bank of Asia',
//     logo: '/logos/sterlinglogo.png',
//     description: "Use your bank's mobile app to transfer funds. Additional steps required.",
//     fee: 'System fee (P10)',
//   },
//   {
//     id: 'ucbp',
//     name: 'UCBP Savings',
//     logo: '/logos/ucbplogo.svg',
//     description: "Use your bank's mobile app to transfer funds. Additional steps required.",
//     fee: 'System fee (P10)',
//   }
// ];

// const OTC_METHODS: OTCOption[] = [
//   {
//     id: 'nearest',
//     name: 'Nearest Partner Outlets & Banks',
//     logo: MapPinned, 
//     description: "Get directions to the nearest branches where you can to the Over-The-Counter transaction.",
//   },
//   {
//     id: 'banks',
//     name: 'Banks',
//     logo: Landmark,
//     description: 'BDO, Metrobank, BPI, Landbank, PNB, Security Bank, Unionbank, RCBC, etc.',
//   },
//   {
//     id: 'remit',
//     name: 'Remittance/Payment Centers',
//     logo: BanknoteArrowUp,
//     description: "Deposit payment to any Remmittance Centers, Payment Centers, Pawnshops, etc.",
//   },
//   {
//     id: 'convenience',
//     name: 'Convenience Stores',
//     logo: Store,
//     description: "Branches are open 24/7, 7-Eleven, Ministop, Family Mart, Lawson, All Day, etc.",
//   }
// ];

// const DIGITAL: DigitalOption[] = [
//   {
//     id: 'gcash',
//     name: 'Gcash',
//     logo: '/logos/gcash.png',
//     description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (2.25%))',
//   },
//   {
//     id: 'maya',
//     name: 'Maya',
//     logo: '/logos/maya.png',
//     description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (2.25%)',
//   },
// ];

const PaymentPage: React.FC = () => {

    const navigate = useNavigate();
    const [ amount, setAmount] = useState<number>(0);
    const [ method, setMethod] = useState<string>('card');
    const [ selectedBank, setSelectedBank] = useState<string>('');
    const [ selectedCard, setSelectedCard] = useState<string>('credit-card');
    const [ selectedOnlineBank, setSelectedOnlineBank] = useState<string>('');
    const [ selectedOnlineOTC, setSelectedOnlineOTC] = useState<string>('');
    const [ selectedOnlineWallet, setSelectedOnlineWallet] = useState<string>('');
    const [ processingFee, _setProcessingFee] = useState<string | null>('');
    const { merchant_username } = useParams();

    // const [ creditCardName, setCreditCardName] = useState("");
    // const [ creditCardNumber, setCreditCardNumber] = useState("");
    // const [ creditCardExpire, setCreditCardExpire] = useState("");
    // const [ creditCardCVV, setCreditCardCVV] = useState("");

    const [ onlineSelectedDevice, setOnlineSelectedDevice] = useState("desktop");

    // const [debitCardName, setDebitCardName] = useState("");
    // const [debitCardNumber, setDebitCardNumber] = useState("");
    // const [debitCardExpire, setDebitCardExpire] = useState("");
    // const [debitCardCVV, setDebitCardCVV] = useState("");


    // const [prepaidCardName, setPrepaidCardName] = useState("");
    // const [prepaidCardNumber, setPrepaidCardNumber] = useState("");
    // const [prepaidCardExpire, setPrepaidCardExpire] = useState("");
    // const [prepaidCardCVV, setPrepaidCardCVV] = useState("");

    const [summaryHeight, setSummaryHeight] = useState<number | undefined>(undefined);
    
    // const PROCESSING_FEE = 10;
    const SYSTEM_FEE = amount >= 100 ? 10 : 0;

    const PROCESSING_FEE = Number(processingFee ?? 0);

    const totalAmount = useMemo(() => amount + PROCESSING_FEE + SYSTEM_FEE, [amount, PROCESSING_FEE]);

    const success_url         = import.meta.env.VITE_SUCCESS_REDIRECT_URL;
    const failed_url          = import.meta.env.VITE_FAILED_REDIRECT_URL;
    const base_url            = import.meta.env.VITE_API_BASE_URL;
    const username            = import.meta.env.VITE_USERNAME;
    const payment_methods_url = import.meta.env.VITE_PAYMENT_METHODS_URL;
    const merchant_name_url   = import.meta.env.VITE_MERCHANT_URL;

    const handleAmountChange = (val: string) => {
        const num = parseInt(val.replace(/\D/g, '')) || 0;
        setAmount(num);
    };

    // When selecting a payment method, initialize its nested selection
    const handleMethodSelect = (methodId: string) => {
        setMethod(methodId);
        switch (methodId) {
            case 'wallet':
                setSelectedOnlineWallet(availableWalletBanks[0].name);
                break;
            case 'card':
                setSelectedCard(CARDS[0].id);
                break;
            case 'bank':
                setSelectedBank(availableBanks[0].name);
                break;
            case 'online':
                setSelectedOnlineBank(availableOnlineBanks[0].name);
                break;
            case 'otc':
                setSelectedOnlineOTC(availableOTCBanks[0].name);
                break;
        }
    };


    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!formRef.current) return;
        const observer = new ResizeObserver(() => {
            setSummaryHeight(formRef.current!.offsetHeight);
        });
        observer.observe(formRef.current);

        return () => observer.disconnect();
    }, []);

    // const [_data, setData] = useState(null);
    const [ _error, setError] = useState <string | null >(null);
    const [ paymentmethods, setPaymentMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);
    const [ loadingPaymentMethod, setLoadingPaymentMethod ] = useState (true);
    const [ availableBanks, setAvailableBanks ] = useState<BankTransfer[]>([]);
    const [ availableOnlineBanks, setAvailableOnlineBanks ] = useState<OnlineBanks[]>([]);
    const [ availableOTCBanks, setAvailableOTCBanks ] = useState<OTCTransfer[]>([]);
    const [ availableWalletBanks, setAvailableWalletBanks] = useState<WalletTransfer[]>([]);
    // function sleep(ms: number) {
    //     return new Promise((resolve) => setTimeout(resolve, ms));
    // }
    const [ apiResponse, setApiResponse] = useState<apiResponse>();
    const [ paymentResponse, setPaymentResponse] = useState<paymentResponse>();
    const [ methodCodePayload, setMethodCodePayload] = useState("bank_card_2");
    const [ providerCodePayload, setProviderCodePayload] = useState("mastercard_visa");
    const [ paymentLoading, setPaymentLoading ] = useState (false);
    const [ merchantName, setMerchantName] = useState ("");
    const [ loadingMerchant, setLoadingMerchant] = useState(false);
    const [ merchantError, setMerchantError] = useState<string | null>(null);

    // UseEffect for fetching payment methods
    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            
            try {
            setLoadingPaymentMethod (true)            
            setError(null);

            // await sleep(5000);

            const response = await fetch(payment_methods_url, {
                headers: {
                username,
                Accept: "application/json",
                },
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const apiData = await response.json();
            
            // Set available banks
            setAvailableBanks(apiData.bank_fund_transfer || [])
            setAvailableOnlineBanks(apiData.online_banking || [])
            setAvailableOTCBanks(apiData.over_the_counter || [])
            setAvailableWalletBanks(apiData.e_wallet || [])
            setApiResponse(apiData)
            
            // console.log("response", apiData)

            const updatedMethods = PAYMENT_METHODS.map((method) => {
                const apiKey = METHOD_API_MAP[method.id];
                const apiGroup = apiData?.[apiKey];

                const isEnabled =
                Array.isArray(apiGroup) &&
                apiGroup.some((entry: { status: string }) => entry.status === "on");

                return {
                ...method,
                disabled: !isEnabled,
                };
            });

            setPaymentMethods(updatedMethods);
            // console.log("updatedMethods = ", updatedMethods)
            } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("Something went wrong");
            } finally {
            setLoadingPaymentMethod(false);
            }
        }

        fetchData();

        return () => controller.abort();
    }, [username]);

    // const sleep = (ms: number) =>
    //     new Promise<void>((resolve) => setTimeout(resolve, ms));

    // UseEffect to fetch Merchant Name (Business Name)
    useEffect(() => {
      
        if (!merchant_username) return;
        const controller = new AbortController();

        async function fetchMerchantName() {
            try {
                setLoadingMerchant(true);
                setMerchantError(null);

                const response = await fetch(`${merchant_name_url.replace(/\/$/, "")}/${merchant_username}`, {
                    headers: { username, Accept: "application/json" },
                    signal: controller.signal,
                });

                
                if (!response.ok) {
                    // If server returns 500 or 404, navigate to 404 page
                    if (response.status >= 400 && response.status < 600) {
                        navigate("/404", { replace: true });
                        return;
                    }
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();

                if (data.merchant_name) {
                    setMerchantName(data.merchant_name);
                } else {
                    navigate("/404", { replace: true });
                }

                

            } catch (err) {
                console.error("Merchant fetch error:", err);
                navigate("/404", { replace: true });
            } finally {
                // await sleep(5000);
                setLoadingMerchant(false);
            }
        }

        fetchMerchantName();

        return () => controller.abort();
    }, [merchant_username, username, merchant_name_url, navigate]);


    // UseEffect for console logging the error
    useEffect(() => {
        if (merchantError) {
            console.error("Merchant Fetch Error:", merchantError);
        }
    }, [merchantError]);

    // UseEffect for setting the method code and provider code to be sent on create payment endpoint
    useEffect(() => {
        let methodCode = "";
        let providerCode = "";

        switch (method) {
            case "card":
                {
                    const cardData = apiResponse?.mastercard_visa?.[0];
                    // console.log("cardData",cardData)
                if (cardData) {
                    methodCode      = cardData.method_code;
                    providerCode    = cardData.provider_code;
                    // processing_fee = cardData.

                }
                break;
            }
            case "bank": {
                const selectedBankData = availableBanks.find(
                    (item: BankTransfer) => item.name === selectedBank
                );

                if (selectedBankData) {
                    methodCode   = selectedBankData.method_code;
                    providerCode = selectedBankData.provider_code;
                } else {
                    console.warn("Selected bank not found in API response:", selectedBank);
                }
                break;
            }

            case "online":{
                const selectedOnlineBankData = availableOnlineBanks.find(
                    (item: OnlineBanks) => item.name === selectedOnlineBank
                );

                if (selectedOnlineBankData) {
                    methodCode   = selectedOnlineBankData.method_code;
                    providerCode = selectedOnlineBankData.provider_code;
                } else {
                    console.warn("Selected online bank not found in API response:", selectedOnlineBank);
                }
                break;
            }

            case "otc":{
                const selectedOTCBankData = availableOTCBanks.find(
                    (item: OTCTransfer) => item.name === selectedOnlineOTC
                );

                if (selectedOTCBankData) {
                    methodCode   = selectedOTCBankData.method_code;
                    providerCode = selectedOTCBankData.provider_code;
                } else {
                    console.warn("Selected otc bank not found in API response:", selectedOnlineOTC);
                }
                break;
            }

            case "wallet":{
                const selectedWalletData = availableWalletBanks.find(
                    (item: WalletTransfer) => item.name === selectedOnlineWallet
                );

                if (selectedWalletData) {
                    methodCode   = selectedWalletData.method_code;
                    providerCode = selectedWalletData.provider_code;
                } else {
                    console.warn("Selected wallet bank not found in API response:", selectedOnlineWallet);
                }
                break;
            }
            case "qr":
                providerCode = "qrph"; // if no sub-selection
                break;
        }

        setMethodCodePayload(methodCode);
        setProviderCodePayload(providerCode);

        // console.log("methodCode:", methodCode, "providerCode:", providerCode);
    }, [username, method, selectedBank, selectedOnlineBank, selectedOnlineOTC, selectedOnlineWallet, paymentResponse]);

    const selectedMethodId = (() => {
        switch (method) {
            case 'wallet':
                return availableWalletBanks.find(w => w.name === selectedOnlineWallet)?.name || '';
            case 'card':
                return CARDS.find(c => c.id === selectedCard)?.id || '';
            case 'bank':
                return availableBanks.find(b => b.name === selectedBank)?.name || '';
            case 'online':
                return availableOnlineBanks.find(o => o.name === selectedOnlineBank)?.name || '';
            case 'otc':
                return availableOTCBanks.find(o => o.name === selectedOnlineOTC)?.name || '';
            default:
                return PAYMENT_METHODS.find(m => m.id === method)?.id || '';
        }
    })();

    const selectedMethodLabel = (() => {
        switch (method) {
            case 'wallet':
                return availableWalletBanks.find(w => w.name === selectedOnlineWallet)?.name || '';
            case 'card':
                return CARDS.find(c => c.id === selectedCard)?.name || '';
            case 'bank':
                return availableBanks.find(b => b.name === selectedBank)?.name || '';
            case 'online':
                return availableOnlineBanks.find(o => o.name === selectedOnlineBank)?.name || '';
            case 'otc':
                return availableOTCBanks.find(o => o.name === selectedOnlineOTC)?.name || '';
            default:
                return PAYMENT_METHODS.find(m => m.id === method)?.label || '';
        }
    })();

    // const [testStatus, setTestStatus] = useState<"pending" | "success" | "failed">("pending");

    const handlePaymentSuccess = async() => {
        // console.log(success_url)
        // console.log(failed_url)
        try{
            setPaymentLoading(true)
            const payload = {
                amount              : amount,
                method_code         : methodCodePayload,
                provider_code       : providerCodePayload,
                success_redirect_url: success_url,
                failed_redirect_url : failed_url
            }

            const payment_response = await fetch(`${base_url}/payment-page/payment`, {
                method: "POST",
                headers: {
                    "username": username,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!payment_response.ok) {
                throw new Error("Payment request failed");
            }

            const data = await payment_response.json()
            // console.log("API response:", data);

            
            const subTotal = Number(amount); // from your state/input
            const processingFee = Number(data.fees.processing_fee);
            const systemFee = Number(data.fees.system_fee);

            const totalAmount = subTotal + processingFee + systemFee;

            // Build full summary object
                const paymentSummary = {
                    subTotal,
                    processingFee,
                    systemFee,
                    totalAmount,
                    method: selectedMethodLabel,
                    methodId: selectedMethodId, 
                    referenceNo: data.reference_id, 
                    dateTime: new Date().toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }),
                    merchantName,
                };

            setPaymentResponse(data);

            switch (data.status) {
                case "SUCCESS":
                    navigate(`/${merchant_username}/status/success`, { state: { paymentSummary } });
                    break;

                case "PENDING":
                    navigate(`/${merchant_username}/status/pending`, { state: { paymentSummary } });
                    break;

                case "FAILED":
                    navigate(`/${merchant_username}/status/failed`, { state: { paymentSummary } });
                    break;

                default:
                    console.warn("Unknown payment status:", data.status);
                    navigate("/status/failed", { state: { paymentSummary } });
            }
        }catch (error){
            console.error("Payment error:", error);
            // fallback navigation
            navigate("/status/failed");
        }finally{
            setPaymentLoading(false);
        }
    };

    // async function generatePaymentLink() {
    //     const payload = {
    //         amount          : amount,
    //         method_code     : "",
    //         provider_code   : "",
    //         success_redirect_url: success_url,
    //         failed_redirect_url: failed_url
    //     }

    //     const payment_response = await fetch(`${base_url}/payment-page/payment`, {
    //         method: "POST",
    //         body: JSON.stringify(payload)
    //     });

    //     const data = await payment_response.json()
    //     console.log(data);
    // }

    const Spinner = () => (
        <span className="inline-block w-8 h-8 border-4 border-white/30 border-t-blue-300 rounded-full animate-spin" />
    );

    useEffect(() => {
        if (availableBanks.length > 0 && !selectedBank) {
            // Default to first enabled bank
            const firstBank = availableBanks.find(b => b.status === "on");
            if (firstBank) setSelectedBank(firstBank.name); 
        }

    }, [availableBanks, methodCodePayload, providerCodePayload, method]);

    useEffect(() => {
        // console.log("Selected bank changed:", selectedBank);
    }, [selectedBank]);

    // UseEffect for setting the processsing Fee, hardcoded for now while not fixed in API
    // useEffect(() => {
    // // Lookup table for fees
    // const processingFees: Record<string, Record<string, string>> = {
    //     card: { default: "3.50" },
    //     bank: {
    //         "UnionBank of the Philippines"  : "10.00",
    //         "Bank of the Philippine Islands": "15.00",
    //     },
    //     online: {
    //         "Metrobank"                     : "5.00",
    //         "Land Bank of the Philippines"  : "5.00",
    //         "Sterling Bank of Asia"         : "5.00",
    //         "UCPB Savings"                  : "5.00",
    //         "Bank of the Philippine Islands": "5.00",
    //         "UnionBank of the Philippines"  : "5.00",
    //         "BDO Unibank Inc."              : "5.00",
    //     },
    //     otc: {
    //         "Land Bank of the Philippines"  : "5.00",
    //         "Bank of the Philippine Islands": "5.00",
    //     },
    //     wallet: {
    //         "Shopee Pay": "2.50",
    //         "Grab Pay": "2.50",
    //     },
    // };

    // let fee = "0.00"; // default fallback

    // if (method === "card") {
    //     fee = processingFees.card.default;
    // } else if (method === "bank" && selectedBank in processingFees.bank) {
    //     fee = processingFees.bank[selectedBank];
    // } else if (method === "online" && selectedOnlineBank in processingFees.online) {
    //     fee = processingFees.online[selectedOnlineBank];
    // } else if (method === "otc" && selectedOnlineOTC in processingFees.otc) {
    //     fee = processingFees.otc[selectedOnlineOTC]
    // } else if (method === "wallet" && selectedOnlineWallet in processingFees.wallet) {
    //     fee = processingFees.wallet[selectedOnlineWallet]
    // }

    // _setProcessingFee(fee);

    // }, [selectedBank, selectedOnlineBank, selectedOnlineOTC, selectedOnlineWallet, method]);

    return (
    <>
        {loadingMerchant && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-[#312B5B] rounded-full animate-spin" />
                    {/* <p className="text-sm font-semibold text-[#312B5B]">
                        
                    </p> */}
                </div>
            </div>
        )}

        <div className="min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#D0BBE6] flex flex-col items-center justify-center p-2 sm:p-4 font-sans text-slate-700">
        
        {/* Condensed Header */}
        <header className="flex flex-col items-center mb-4 pt-10">
            <div className="w-20 h-20 bg-[#D9D9D9] rounded-full mb-2" />
            <h2 className="text-lg font-bold text-[#312B5B]">{merchantName}</h2>
            <div className="flex gap-4 mt-1 text-[#312B5B]">
            {/* <Facebook size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                            <Instagram size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                            <Link2 size={16} className="cursor-pointer hover:opacity-70 transition-opacity" /> */}
            </div>
        </header>

        {/* Main Container */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8 mb-10 md:mb-5">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-6">
            
                {/* Form Controls */}
                <div className="lg:col-span-2 space-y-5 md:space-x-8">
                    <div ref={formRef}>
                        <section className='mb-5'>
                            <h2 className="text-center font-bold text-[#312B5B] md:text-start">Enter Amount</h2>
                            <p className="text-xs text-center text-[#37416C] mb-2 md:text-start ">How much would you like to pay?</p>
                            
                            <div className="mb-2 flex justify-center md:justify-start">
                                <div className="flex items-center w-[70%] md:w-1/2 border border-slate-300 rounded-lg px-2 py-1.5">
                                    <span className="font-bold text-[#312B5B] mr-1">₱</span>
                                    <input
                                    type="text"
                                    value={amount.toLocaleString()}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    className="w-full text-center py-1 md:text-center font-bold outline-none"
                                    placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {PRESET_AMOUNTS.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val)}
                                    className={`w-full py-2 border rounded-lg text-xs font-semibold transition-all ${
                                    amount === val 
                                        ? 'bg-[#312B5B] border-[#312B5B] text-white' 
                                        : 'border-slate-300 text-slate-500 hover:border-slate-300 cursor-pointer'
                                    }`}
                                >
                                    ₱{val.toLocaleString()}
                                </button>
                                ))}
                            </div>
                        </section>

                        <section >
                        <h2 className="text-center md:text-start font-bold text-[#312B5B]">Payment Method</h2>
                        <p className="text-xs text-center md:text-start text-[#37416C] mb-2">Select how you want to pay</p>
                        
                        <div className="md:grid md:grid-cols-3 grid grid-cols-2 gap-2 mb-3">
                            {paymentmethods.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (!item.disabled) handleMethodSelect(item.id);
                                }}
                                className={`w-full flex flex-col items-center justify-center gap-1 py-2 px-1 border font-semibold rounded-lg transition-all ${
                                
                                    loadingPaymentMethod || item.disabled
                                        ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                                        :
                                    method === item.id 
                                    ? 'bg-[#312B5B] border-[#312B5B] text-white' 
                                    : 'border-slate-300 text-slate-500 hover:border-slate-300 cursor-pointer' 
                                    }`}
                            >
                                
                                <span className="flex text-xs text-center justify-center whitespace-nowrap leading-tight">
                                    {loadingPaymentMethod ? (
                                            <Spinner />
                                        ) : (
                                            <>

                                            <span className='mr-1'>
                                        {item.icon}
                                    </span>

                                            {item.label}
                                            </>
                                        )}                 
                                </span>
                            </button>
                            ))}
                        </div>
                        </section>
                    </div>
                    
                    {/* Extra Selections */}
                    {method === 'card' && (

                    <div >
                        <p className="p-2 text-xs font-bold text-[#312B5B]">
                            What type of card are you using?
                        </p>
                        
                        <div
                        className="space-y-2 overflow-y-auto"
                        style={{
                            minHeight: `${3 * 56}px`, // assuming each bank row is ~56px tall
                            maxHeight: '16rem' // optional: limit overall height
                        }}
                        >
                    
                        {CARDS.map((card) => {
                        const isSelected = selectedCard === card.id;
                        const Icon = card.logo;
                    
                        return (
                            <div
                            key={card.id}
                            className={`rounded-md text-xs transition-all duration-300 w-full lg:w-[98%] mx-auto overflow-hidden ${
                                isSelected
                                ? "border-[#312B5B] bg-[#F7F8FA] shadow-sm"
                                : "border-transparent hover:bg-gray-50"
                            }`}
                            >
                            <label className="flex items-center gap-4 p-2 cursor-pointer">
                                <input
                                type="radio"
                                name="paymentMethod"
                                checked={isSelected}
                                onChange={() => setSelectedCard(card.id)}
                                className="w-4 h-4 accent-[#312B5B] shrink-0"
                                />
                    
                                <Icon
                                className="w-5 h-5 text-[#312B5B] shrink-0"
                                strokeWidth={1.5}
                                />
                    
                                <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#312B5B]">
                                    {card.name}
                                </span>
                                <span className="text-xs text-[#312B5B]">
                                    {card.description}
                                </span>
                                </div>
                            </label>
                            </div>
                        );
                        })}
                        </div>
                    </div>
                    )}

                    {method === 'bank' && (
                        
                        <div>
                            <p className="p-2 text-xs font-bold text-[#312B5B]">
                                What bank will you use?
                            </p>
                            <div
                            className="space-y-2 overflow-y-auto"
                            style={{
                                minHeight: `${3 * 56}px`, 
                                maxHeight: '16rem'
                            }}
                            >
                            {availableBanks.map((bank) => {
                            const isSelected = selectedBank === bank.name;
                            
                            return (
                                <div
                                key={bank.name}
                                className={`rounded-md text-xs transition-all duration-300 w-full lg:w-[98%] mx-auto overflow-hidden ${
                                    isSelected
                                    ? "border-[#312B5B] bg-[#F7F8FA] shadow-sm"
                                    : "border-transparent hover:bg-gray-50"
                                }`}
                                >
                                <label className="flex items-center gap-4 p-2 cursor-pointer">
                                    <input
                                    type="radio"
                                    name="bank"
                                    checked={isSelected}
                                    onChange={() => setSelectedBank(bank.name)}
                                    className="w-4 h-4 accent-[#312B5B] shrink-0"
                                    />

                                    <img
                                        src={bank.main_logo_url}
                                        alt=""
                                        className="w-9 h-9 object-contain shrink-0"
                                    />

                                    <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#312B5B]">
                                        {bank.name}
                                    </span>
                                    {/* <span className="text-xs text-[#312B5B]">
                                        {bank.description}
                                    </span> */}
                                    </div>
                                </label>
                                </div>
                            );
                            })}

                            </div>
                        </div>
                    )}


                    {method === 'online' && (
                    <div>
                        <p className="p-2 text-xs font-bold text-[#312B5B]">
                            What type of online banking would you use?
                        </p>
                        <div className="flex mb-3 w-[60%] md:w-[70%] mx-auto items-center justify-center">
                            
                        <label className="relative flex-1 cursor-pointer">
                            <input
                            type="radio"
                            name="device-type"
                            value="desktop"
                            className="sr-only"
                            checked={onlineSelectedDevice === "desktop"}
                            onChange={(e) => setOnlineSelectedDevice(e.target.value)}
                            />

                            <div
                            className={`flex items-center justify-center whitespace-nowrap gap-3 py-3 px-4 rounded-tl rounded-bl transition-all duration-200 ${
                                onlineSelectedDevice === "desktop"
                                ? "bg-[#312B5B] text-white shadow-md"
                                : "text-[#312B5B] hover:bg-gray-200"
                            }`}
                            >
                            <Monitor
                                size={20}
                                strokeWidth={onlineSelectedDevice === "desktop" ? 2.5 : 1.5}
                            />

                            <div className="flex flex-col items-start">
                                <span className="text-sm font-bold leading-none">
                                Desktop
                                </span>
                                <span className="text-xs">
                                Bank's web portal
                                </span>
                            </div>
                            </div>
                        </label>

                        <label className="relative flex-1 cursor-pointer">
                            <input
                            type="radio"
                            name="device-type"
                            value="mobile"
                            className="sr-only"
                            checked={onlineSelectedDevice === "mobile"}
                            onChange={(e) => setOnlineSelectedDevice(e.target.value)}
                            />

                            <div
                            className={`flex items-center justify-center whitespace-nowrap  gap-3 py-3 px-4 rounded-tr rounded-br transition-all duration-200 ${
                                onlineSelectedDevice === "mobile"
                                ? "bg-[#312B5B] text-white shadow-md"
                                : "text-[#312B5B] hover:bg-gray-200"
                            }`}
                            >
                            <Smartphone
                                size={20}
                                strokeWidth={onlineSelectedDevice === "mobile" ? 2.5 : 1.5}
                            />

                            <div className="flex flex-col items-start">
                                <span className="text-sm font-bold leading-none">
                                Mobile
                                </span>
                                <span className="text-xs">
                                Bank's mobile app
                                </span>
                            </div>
                            </div>
                        </label>
                        </div>
                        
                        <div
                        className="space-y-2 overflow-y-auto"
                        style={{
                            minHeight: `${3 * 56}px`, // assuming each bank row is ~56px tall
                            maxHeight: '16rem' // optional: limit overall height
                        }}
                        >

                        {availableOnlineBanks.map((bank) => {
                            const isSelected = selectedOnlineBank === bank.name;

                            return (
                                <label
                                key={bank.name}
                                className={`flex items-center gap-4 p-2 rounded-md text-xs transition-all duration-300 w-full lg:w-full mx-auto cursor-pointer overflow-hidden ${
                                    isSelected
                                    ? "border-[#312B5B] bg-[#F7F8FA] shadow-sm"
                                    : "border-transparent hover:bg-gray-50"
                                }`}
                                >
                                <input
                                    type="radio"
                                    name="onlineMethod"
                                    checked={isSelected}
                                    onChange={() => setSelectedOnlineBank(bank.name)}
                                    className="w-4 h-4 accent-[#312B5B] shrink-0"
                                />

                                <div className="w-9 h-9 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                    src={bank.main_logo_url}
                                    alt={bank.name}
                                    className="w-full h-full object-contain p-1"
                                    />
                                </div>

                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-bold text-[#312B5B]">{bank.name}</span>
                                    {/* Optional description */}
                                </div>
                                </label>
                            );
                        })}

                        </div>
                    </div>
                    )}

                    {method === 'otc' && (
                        <div>
                        
                            <p className="p-2 text-xs font-bold text-[#312B5B]">
                                What kind of OTC do you prefer?
                            </p>

                        <div
                        className="space-y-2 overflow-y-auto"
                        style={{
                            minHeight: `${3 * 56}px`, // assuming each bank row is ~56px tall
                            maxHeight: '16rem' // optional: limit overall height
                        }}
                        >

                        {availableOTCBanks.map((otc) => {
                        const isSelected = selectedOnlineOTC === otc.name;
                        // const Icon = otc.logo;
                        return (
                            <div
                            key={otc.name}
                            className={`rounded-md text-xs transition-all duration-300 w-full lg:w-[98%] mx-auto overflow-hidden ${
                                isSelected
                                ? "border-[#312B5B] bg-[#F7F8FA] shadow-sm"
                                : "border-transparent hover:bg-gray-50"
                            }`}
                            >
                            <label className="flex items-center gap-4 p-3 cursor-pointer">
                                <input
                                type="radio"
                                name="onlineMethod"
                                checked={isSelected}
                                onChange={() => setSelectedOnlineOTC(otc.name)}
                                className="w-4 h-4 accent-[#312B5B] shrink-0"
                                />

                                {/* <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                    <Icon/>
                                </div> */}

                                <img
                                    src={otc.main_logo_url}
                                    alt={otc.name}
                                    className="w-7 h-7 object-contain p-1"
                                />

                                <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold text-[#312B5B]">
                                    {otc.name}
                                </span>

                                {/* <span className="text-xs text-[#312B5B] mt-0.5">
                                    {otc.description}
                                </span> */}

                                </div>
                            </label>
                            </div>
                        );
                        })}
                        </div>
                    </div>
                    )}

                    {method === 'wallet' && (
                        <div>
                        
                            <p className="p-2 text-xs font-bold text-[#312B5B]">
                                What will you use?
                            </p>
                        <div
                        className="space-y-2 overflow-y-auto"
                        style={{
                            minHeight: `${3 * 56}px`, // assuming each bank row is ~56px tall
                            maxHeight: '16rem' // optional: limit overall height
                        }}
                        >

                        {availableWalletBanks.map((wallet) => {
                        const isSelected = selectedOnlineWallet === wallet.name;

                        return (
                            <div
                            key={wallet.name}
                            className={`rounded-md text-xs transition-all duration-300 w-full lg:w-[98%] mx-auto overflow-hidden ${
                                isSelected
                                ? "border-[#312B5B] bg-[#F7F8FA] shadow-sm"
                                : "border-transparent hover:bg-gray-50"
                            }`}
                            >
                            <label className="flex items-center gap-4 p-2 cursor-pointer">
                                <input
                                type="radio"
                                name="onlineMethod"
                                checked={isSelected}
                                onChange={() => setSelectedOnlineWallet(wallet.name)}
                                className="w-4 h-4 accent-[#312B5B] shrink-0"
                                />

                                <div className="w-9 h-9 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                        src={wallet.main_logo_url}
                                        alt={wallet.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold text-[#312B5B]">
                                    {wallet.name}
                                </span>
                                {/* 
                                <span className="text-xs text-[#312B5B] mt-0.5">
                                    {wallet.description}
                                </span> */}

                                </div>
                            </label>
                            </div>
                        );
                        })}
                        </div>
                    </div>
                    )}

                </div>

                {/* Summary Card */}    
                <div className="lg:col-span-1 flex justify-center mb-0 md:mb-4 mt-20 md:mt-0" style={{ height: summaryHeight }}>
                    <div className="w-full max-w-sm" style={{ height: summaryHeight }}>
                    <div className="bg-[#F4F6F8] rounded-tr-xl rounded-tl-xl p-4 border border-gray-100 flex flex-col shadow-md"
                        
                    >
                        <h3 className="text-center text-base font-bold tracking-wider text-[#312B5B] mb-8">Payment Summary</h3>
                    
                        <div className="space-y-2 text-xs mb-4">
                            <div className="flex justify-between text-[#312B5B]">
                                <span>Sub Total</span>
                                <span className="font-medium">{amount}</span>
                            </div>
                            <div className="flex justify-between text-[#312B5B]">
                                <span>Processing Fee</span>
                                <span className="font-medium">₱{(PROCESSING_FEE).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#312B5B]">
                                <span>System Fee</span>
                                <span className="font-medium">₱{(SYSTEM_FEE).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-[#6F7282] pt-3 mb-4">
                            <div className={`flex justify-between items-center ${
                                totalAmount >= 100_000 ? 'flex-col gap-1' : 'flex-row'}`}>
                                <span className="text-base font-bold text-[#312B5B] whitespace-nowrap">You are sending</span>
                                <span className="text-base font-bold text-[#312B5B]">₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="border-t border-dashed border-[#6F7282] mt-4"/>
                        
                        </div>

                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between text-xs">
                            <span className="text-[#312B5B]">Payment Method</span>
                            <span className="font-bold text-[#312B5B]">{PAYMENT_METHODS.find(m => m.id === method)?.label}</span>
                            </div>
                        
                        </div>

                    </div>

                    <div className='bg-white shadow-lg rounded-bl-lg rounded-br-lg p-5'>
                        <p className="text-[11px] text-[#312B5B] text-center md:whitespace-nowrap">Make sure the browser bar displays <span className='text-[#312B5B] font-bold'>PulseTech</span></p>
                    </div>
                    </div>
                </div>
            
            </div>
            <div className="mt-0 md:mt-4 lg:mt-6 w-full flex justify-center items-center">
                <button
                    disabled={amount <= 99 || paymentLoading}
                    onClick={handlePaymentSuccess}
                    className={`w-1/2 md:w-1/2 lg:w-1/3 py-2 rounded font-bold text-sm transition-all duration-300 shadow-md transform flex justify-center items-center
                    ${amount > 99 && !paymentLoading
                        ? 'bg-linear-to-r from-[#2B3565] to-[#0171A3] text-white cursor-pointer hover:from-[#312B5B] hover:to-[#0182B5] hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {paymentLoading ? <Spinner /> : "Pay Now"}
                </button>
            </div>
            {/* <div className="flex justify-center gap-2 mb-4">
            {["pending", "success", "failed"].map((status) => (
                <button
                    key={status}
                    onClick={() => setTestStatus(status as any)}
                    className={`px-3 py-1 rounded text-xs font-semibold border transition ${
                        testStatus === status
                            ? "bg-[#312B5B] text-white border-[#312B5B]"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    {status}
                </button>
            ))}
        </div> */}

        </div>
        </div>
        </>
    );
};

export default PaymentPage;