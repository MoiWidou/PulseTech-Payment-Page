import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  CreditCard, Building2, Globe, Store, Wallet, QrCode, 
  Facebook, Instagram, Link2, Banknote,
  type LucideIcon,
  Monitor, Landmark, BanknoteArrowUp,
  Smartphone, MapPinned
} from 'lucide-react';

import { useNavigate } from "react-router-dom";

// --- Types & Interfaces ---
interface PaymentMethod {
    id: string;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
}

interface BankOption {
    id: string;
    name: string;
    logo: string;
    description: string;
}

interface CardOption {
    id: string;
    name: string;
    logo: LucideIcon;
    description: string;
}

interface OnlineOption {
    id: string;
    name: string;
    logo: string;
    description: string;
    fee: string;
}

interface OTCOption {
    id: string;
    name: string;
    logo: LucideIcon;
    description: string;
}

interface DigitalOption {
    id: string;
    name: string;
    logo: string;
    description: string;
}

const PRESET_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard size={14} /> },
  { id: 'bank', label: 'Bank Transfer', icon: <Building2 size={14} /> },
  { id: 'online', label: 'Online Banking', icon: <Globe size={14} /> },
  { id: 'otc', label: 'Over-the-Counter', icon: <Store size={14} /> },
  { id: 'wallet', label: 'Digital Cash/Wallet', icon: <Wallet size={14} /> },
  { id: 'qr', label: 'QRPH', icon: <QrCode size={14}/>, disabled: true },
];

const BANKS: BankOption[] = [
  {
    id: 'bpi',
    name: 'Bank of the Philippine Island',
    logo: 'public/logos/bpilogo.png',
    description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (P10)',
  },
  {
    id: 'ubp',
    name: 'Union Bank of the PH',
    logo: 'public/logos/ubplogo2.png',
    description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (P10)',
  },
];

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

const ONLINE_METHODS: OnlineOption[] = [
  {
    id: 'bdo',
    name: 'Banco de Oro',
    logo: 'public/logos/bdologonobg.png', 
    description: "Use your bank's mobile app to transfer funds. Additional steps required.",
    fee: 'System fee (15)',
  },
  {
    id: 'bpi',
    name: 'Bank of the Philippine Island',
    logo: 'public/logos/bpilogo.png',
    description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (P10)',
    fee: "",
  },
  {
    id: 'landbank',
    name: 'Landbank of the Philippines',
    logo: 'public/logos/landbanknobg.png',
    description: "Use your bank's mobile app to transfer funds. Additional steps required.",
    fee: 'System fee (P10)',
  },
  {
    id: 'metrobank',
    name: 'Metrobank Express Online',
    logo: 'public/logos/metrobank.png',
    description: "Use your bank's mobile app to transfer funds. Additional steps required.",
    fee: 'System fee (P10)',
  },
  {
    id: 'sterling',
    name: 'Sterling Bank of Asia',
    logo: 'public/logos/sterlinglogo.png',
    description: "Use your bank's mobile app to transfer funds. Additional steps required.",
    fee: 'System fee (P10)',
  },
  {
    id: 'ucbp',
    name: 'UCBP Savings',
    logo: 'public/logos/ucbplogo.svg',
    description: "Use your bank's mobile app to transfer funds. Additional steps required.",
    fee: 'System fee (P10)',
  }
];

const OTC_METHODS: OTCOption[] = [
  {
    id: 'nearest',
    name: 'Nearest Partner Outlets & Banks',
    logo: MapPinned, 
    description: "Get directions to the nearest branches where you can to the Over-The-Counter transaction.",
  },
  {
    id: 'banks',
    name: 'Banks',
    logo: Landmark,
    description: 'BDO, Metrobank, BPI, Landbank, PNB, Security Bank, Unionbank, RCBC, etc.',
  },
  {
    id: 'remit',
    name: 'Remittance/Payment Centers',
    logo: BanknoteArrowUp,
    description: "Deposit payment to any Remmittance Centers, Payment Centers, Pawnshops, etc.",
  },
  {
    id: 'convenience',
    name: 'Convenience Stores',
    logo: Store,
    description: "Branches are open 24/7, 7-Eleven, Ministop, Family Mart, Lawson, All Day, etc.",
  }
];

const DIGITAL: DigitalOption[] = [
  {
    id: 'gcash',
    name: 'Gcash',
    logo: 'public/logos/gcash.png',
    description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (2.25%))',
  },
  {
    id: 'maya',
    name: 'Maya',
    logo: 'public/logos/maya.png',
    description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (2.25%)',
  },
];

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [ amount, setAmount] = useState<number>(100);
    const [ method, setMethod] = useState<string>('');
    const [ selectedBank, setSelectedBank] = useState<string>('bpi');
    const [ selectedCard, setSelectedCard] = useState<string>('credit-card');
    const [ selectedOnlineBank, setSelectedOnlineBank] = useState<string>('bdo');
    const [ selectedOnlineOTC, setSelectedOnlineOTC] = useState<string>('bdo');
    const [ selectedOnlineWallet, setSelectedOnlineWallet] = useState<string>('bdo');

    // const [ creditCardName, setCreditCardName] = useState("");
    // const [ creditCardNumber, setCreditCardNumber] = useState("");
    // const [ creditCardExpire, setCreditCardExpire] = useState("");
    // const [ creditCardCVV, setCreditCardCVV] = useState("");

    const [ onlineSelectedDevice, setOnlineSelectedDevice] = useState("");

    // const [debitCardName, setDebitCardName] = useState("");
    // const [debitCardNumber, setDebitCardNumber] = useState("");
    // const [debitCardExpire, setDebitCardExpire] = useState("");
    // const [debitCardCVV, setDebitCardCVV] = useState("");


    // const [prepaidCardName, setPrepaidCardName] = useState("");
    // const [prepaidCardNumber, setPrepaidCardNumber] = useState("");
    // const [prepaidCardExpire, setPrepaidCardExpire] = useState("");
    // const [prepaidCardCVV, setPrepaidCardCVV] = useState("");

    const [summaryHeight, setSummaryHeight] = useState<number | undefined>(undefined);
    
    const PROCESSING_FEE = 10;
    const SYSTEM_FEE = 10;

    const totalAmount = useMemo(() => amount + PROCESSING_FEE + SYSTEM_FEE, [amount]);

    const handleAmountChange = (val: string) => {
        const num = parseInt(val.replace(/\D/g, '')) || 0;
        setAmount(num);
    };

    // When selecting a payment method, initialize its nested selection
    const handleMethodSelect = (methodId: string) => {
        setMethod(methodId);

        switch (methodId) {
            case 'wallet':
                setSelectedOnlineWallet(DIGITAL[0].id);
                break;
            case 'card':
                setSelectedCard(CARDS[0].id);
                break;
            case 'bank':
                setSelectedBank(BANKS[0].id);
                break;
            case 'online':
                setSelectedOnlineBank(ONLINE_METHODS[0].id);
                break;
            case 'otc':
                setSelectedOnlineOTC(OTC_METHODS[0].id);
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

    const selectedMethodId = (() => {
        switch (method) {
            case 'wallet':
                return DIGITAL.find(w => w.id === selectedOnlineWallet)?.id || '';
            case 'card':
                return CARDS.find(c => c.id === selectedCard)?.id || '';
            case 'bank':
                return BANKS.find(b => b.id === selectedBank)?.id || '';
            case 'online':
                return ONLINE_METHODS.find(o => o.id === selectedOnlineBank)?.id || '';
            case 'otc':
                return OTC_METHODS.find(o => o.id === selectedOnlineOTC)?.id || '';
            default:
                return PAYMENT_METHODS.find(m => m.id === method)?.id || '';
        }
    })();

    const selectedMethodLabel = (() => {
        switch (method) {
            case 'wallet':
                return DIGITAL.find(w => w.id === selectedOnlineWallet)?.name || '';
            case 'card':
                return CARDS.find(c => c.id === selectedCard)?.name || '';
            case 'bank':
                return BANKS.find(b => b.id === selectedBank)?.name || '';
            case 'online':
                return ONLINE_METHODS.find(o => o.id === selectedOnlineBank)?.name || '';
            case 'otc':
                return OTC_METHODS.find(o => o.id === selectedOnlineOTC)?.name || '';
            default:
                return PAYMENT_METHODS.find(m => m.id === method)?.label || '';
        }
    })();

    const handlePaymentSuccess = () => {

        // Build full summary object
        const paymentSummary = {
            subTotal: amount,
            processingFee: PROCESSING_FEE,
            systemFee: SYSTEM_FEE,
            totalAmount,
            method: selectedMethodLabel,
            methodId: selectedMethodId, 
        };

        // Navigate to /success and pass full summary
        navigate("/status/success", { state: { paymentSummary } });
    };


    return (
        <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-2 sm:p-4 font-sans text-slate-700">
        
        {/* Condensed Header */}
        <header className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 bg-[#D9D9D9] rounded-full mb-2" />
            <h1 className="text-xl font-bold text-[#312B5B]">Business Name</h1>
            <div className="flex gap-4 mt-1 text-[#312B5B]">
            <Facebook size={16} className="cursor-pointer hover:text-blue-600 transition-colors" />
            <Instagram size={16} className="cursor-pointer hover:text-pink-600 transition-colors" />
            <Link2 size={16} className="cursor-pointer hover:text-gray-600 transition-colors" />
            </div>
        </header>

        {/* Main Container */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form Controls */}
            <div className="lg:col-span-2 space-y-5 space-x-8">
                <div ref={formRef}>
                <section className='mb-5'>
                <h2 className="text-md font-bold text-[#312B5B]">Enter Amount</h2>
                <p className="text-[11px] text-[#37416C] mb-2">How much would you like to pay?</p>
                
                <div className="relative mb-2">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-[#312B5B]">₱</span>
                    <input 
                    type="text"
                    value={amount.toLocaleString()}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-[40%] py-1.5 border border-slate-200 rounded-lg text-center font-bold focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.map((val) => (
                    <button
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`py-2 border rounded-lg text-xs font-semibold transition-all ${
                        amount === val 
                            ? 'bg-[#312B5B] border-[#312B5B] text-white' 
                            : 'border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        ₱{val.toLocaleString()}
                    </button>
                    ))}
                </div>
                </section>

                <section >
                <h2 className="text-md font-bold text-[#312B5B]">Payment Method</h2>
                <p className="text-[11px] text-[#37416C] mb-2">Select how you want to pay</p>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                    {PAYMENT_METHODS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            if (!item.disabled) handleMethodSelect(item.id);
                        }}
                        className={`flex flex-col items-center justify-center gap-1 py-2 px-1 border font-semibold rounded-lg transition-all ${
                        
                            item.disabled
                                ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                                :
                            method === item.id 
                            ? 'bg-[#312B5B] border-[#312B5B] text-white' 
                            : 'border-slate-100 text-slate-500 hover:border-slate-300' 
                        }`}
                    >
                        
                        <span className="flex text-[10px] text-center justify-center whitespace-nowrap leading-tight">
                            <span className='mr-1'>
                                {item.icon}
                            </span>
                                {item.label}
                        </span>
                    </button>
                    ))}
                </div>
                </section>
                </div>
                
                {/* Extra Selections */}
                {method === 'bank' && (
                    <div className="p-2 rounded space-y-2">
                        <p className="text-[11px] font-bold text-[#312B5B]">
                        What bank will you use?
                        </p>

                        {BANKS.map((bank) => (
                        <label
                            key={bank.id}
                            className="flex text-[#312B5B] items-center gap-3 p-1.5 cursor-pointer rounded hover:bg-white group transition-colors"
                        >
                            <input
                            type="radio"
                            checked={selectedBank === bank.id}
                            onChange={() => setSelectedBank(bank.id)}
                            className="accent-[#312B5B] scale-75"
                            />

                            <img src={bank.logo} alt="" className="w-10 h-10 rounded" />

                            <div>
                            <p className="text-[12px] font-bold leading-none text-[#312B5B]">
                                {bank.name}
                            </p>
                            <p className="text-[10px] leading-tight text-[#312B5B]">
                                {bank.description}
                            </p>
                            </div>
                        </label>
                        ))}
                    </div>
                )}

                {method === 'card' && (
                <div className="rounded space-y-2">
                    <p className="text-[11px] font-bold text-[#312B5B]">
                    How would you like to send money?
                    </p>

                    {CARDS.map((card) => {
                    const isSelected = selectedCard === card.id;
                    const Icon = card.logo;

                    return (
                        <div
                        key={card.id}
                        className={`text-[11px] rounded-md transition-all border border-[#312B5B] w-[95%] mx-auto ${
                            isSelected
                            ? "border-[#312B5B] bg-[#F7F8FA]"
                            : "border-transparent"
                        }`}
                        >
                        <label className="flex items-center gap-4 p-2 cursor-pointer">
                            <input
                            type="radio"
                            name="paymentMethod"
                            checked={isSelected}
                            onChange={() => setSelectedCard(card.id)}
                            className="mt-1.5 w-4 h-4 accent-[#312B5B]"
                            />

                            <Icon
                            className="w-5 h-5 text-[#312B5B] shrink-0"
                            strokeWidth={1.5}
                            />

                            <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-[#312B5B]">
                                {card.name}
                            </span>
                            <span className="text-[10px] text-[#312B5B]">
                                {card.description}
                            </span>
                            </div>
                        </label>
                        </div>
                    );
                    })}
                </div>
                )}

                {method === 'online' && (
                <div>
                    <div className="flex gap-2 mb-3 w-[70%] mx-auto">
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
                        className={`flex items-center justify-center gap-3 py-3 px-4 rounded-md transition-all duration-200 ${
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
                            <span className="text-[12px] font-bold leading-none">
                            Desktop
                            </span>
                            <span className="text-[10px]">
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
                        className={`flex items-center justify-center gap-3 py-3 px-4 rounded-md transition-all duration-200 ${
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
                            <span className="text-[12px] font-bold leading-none">
                            Mobile
                            </span>
                            <span className="text-[10px]">
                            Bank's mobile app
                            </span>
                        </div>
                        </div>
                    </label>
                    </div>

                    {ONLINE_METHODS.map((bank) => {
                    const isSelected = selectedOnlineBank === bank.id;

                    return (
                        <div
                        key={bank.id}
                        className={`rounded-md text-[11px] transition-all duration-300 w-full lg:w-[98%] mx-auto overflow-hidden ${
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
                            onChange={() => setSelectedOnlineBank(bank.id)}
                            className="w-4 h-4 accent-[#312B5B] cursor-pointer"
                            />

                            <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                                src={bank.logo}
                                alt={bank.name}
                                className="w-full h-full object-contain"
                            />
                            </div>

                            <div className="flex flex-col leading-tight">
                            <span className="text-[12px] font-bold text-[#312B5B]">
                                {bank.name}
                            </span>

                            <span className="text-[10px] text-[#312B5B] mt-0.5">
                                {bank.description}
                            </span>

                            {bank.fee && (
                                <span className="text-[10px] text-[#312B5B]">
                                {bank.fee}
                                </span>
                            )}
                            </div>
                        </label>
                        </div>
                    );
                    })}
                </div>
                )}

                {method === 'otc' && (
                    <div>

                    {OTC_METHODS.map((otc) => {
                    const isSelected = selectedOnlineOTC === otc.id;
                    const Icon = otc.logo;
                    return (
                        <div
                        key={otc.id}
                        className={`rounded-md text-[11px] transition-all duration-300 w-full lg:w-[98%] mx-auto overflow-hidden ${
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
                            onChange={() => setSelectedOnlineOTC(otc.id)}
                            className="w-4 h-4 accent-[#312B5B] cursor-pointer"
                            />

                            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                <Icon/>
                            </div>

                            <div className="flex flex-col leading-tight">
                            <span className="text-[12px] font-bold text-[#312B5B]">
                                {otc.name}
                            </span>

                            <span className="text-[10px] text-[#312B5B] mt-0.5">
                                {otc.description}
                            </span>

                            </div>
                        </label>
                        </div>
                    );
                    })}
                </div>
                )}

                {method === 'wallet' && (
                    <div>

                    {DIGITAL.map((wallet) => {
                    const isSelected = selectedOnlineWallet === wallet.id;

                    return (
                        <div
                        key={wallet.id}
                        className={`rounded-md text-[11px] transition-all duration-300 w-full lg:w-[98%] mx-auto overflow-hidden ${
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
                            onChange={() => setSelectedOnlineWallet(wallet.id)}
                            className="w-4 h-4 accent-[#312B5B] cursor-pointer"
                            />

                            <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={wallet.logo}
                                    alt={wallet.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="flex flex-col leading-tight">
                            <span className="text-[12px] font-bold text-[#312B5B]">
                                {wallet.name}
                            </span>

                            <span className="text-[10px] text-[#312B5B] mt-0.5">
                                {wallet.description}
                            </span>

                            </div>
                        </label>
                        </div>
                    );
                    })}
                </div>
                )}

                <div className="flex justify-end">
                    <button 
                        className="w-1/2 bg-linear-to-r from-[#2B3565] to-[#0171A3] hover:bg-[#0a4669] text-white py-2 rounded font-bold text-sm transition-all shadow-md active:scale-97"
                        onClick={handlePaymentSuccess}
                        >
                            Pay Now
                    </button>
                </div>
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1" style={{ height: summaryHeight }}>
                <div className="bg-[#F4F6F8] rounded-tr-xl rounded-tl-xl p-4 border border-gray-100 flex flex-col shadow-md"
                    
                >
                    <h3 className="text-center text-base font-bold tracking-wider text-[#312B5B] mb-4">Payment Summary</h3>
                
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
                            <span className="text-lg font-medium text-[#312B5B] whitespace-nowrap">You are sending</span>
                            <span className="text-lg font-bold text-[#312B5B]">₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="border-t border-dashed border-[#6F7282] mt-4"/>
                    
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px]">
                        <span className="text-[#312B5B]">Payment Method</span>
                        <span className="font-bold text-[#312B5B]">{PAYMENT_METHODS.find(m => m.id === method)?.label}</span>
                        </div>
                    
                    </div>

                </div>

                <div className='bg-white shadow-lg rounded-bl-lg rounded-br-lg p-5'>
                    <p className="text-[9px] text-[#312B5B] text-center">Make sure the browser bar displays <span className='text-[#312B5B] font-bold'>PulseTech</span></p>
                </div>
            </div>
                
            </div>
        </div>
        </div>
    );
};

export default PaymentPage;