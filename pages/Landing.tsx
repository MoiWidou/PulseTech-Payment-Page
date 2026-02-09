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
    logo: '/logos/bpilogo.png',
    description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (P10)',
  },
  {
    id: 'ubp',
    name: 'Union Bank of the PH',
    logo: '/logos/ubplogo2.png',
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
    logo: '/logos/bdologonobg.png', 
    description: "Use your bank's mobile app to transfer funds. Additional steps required.",
    fee: 'System fee (15)',
  },
  {
    id: 'bpi',
    name: 'Bank of the Philippine Island',
    logo: '/logos/bpilogo.png',
    description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (P10)',
    fee: "",
  },
  {
    id: 'landbank',
    name: 'Landbank of the Philippines',
    logo: '/logos/landbanknobg.png',
    description: "Use your bank's mobile app to transfer funds. Additional steps required.",
    fee: 'System fee (P10)',
  },
  {
    id: 'metrobank',
    name: 'Metrobank Express Online',
    logo: '/logos/metrobank.png',
    description: "Use your bank's mobile app to transfer funds. Additional steps required.",
    fee: 'System fee (P10)',
  },
  {
    id: 'sterling',
    name: 'Sterling Bank of Asia',
    logo: '/logos/sterlinglogo.png',
    description: "Use your bank's mobile app to transfer funds. Additional steps required.",
    fee: 'System fee (P10)',
  },
  {
    id: 'ucbp',
    name: 'UCBP Savings',
    logo: '/logos/ucbplogo.svg',
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
    logo: '/logos/gcash.png',
    description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (2.25%))',
  },
  {
    id: 'maya',
    name: 'Maya',
    logo: '/logos/maya.png',
    description: 'Sending is FREE. Recipients pays for the system fee (P10) + bank fee (2.25%)',
  },
];

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [ amount, setAmount] = useState<number>(0);
    const [ method, setMethod] = useState<string>('bank');
    const [ selectedBank, setSelectedBank] = useState<string>('bpi');
    const [ selectedCard, setSelectedCard] = useState<string>('credit-card');
    const [ selectedOnlineBank, setSelectedOnlineBank] = useState<string>('bdo');
    const [ selectedOnlineOTC, setSelectedOnlineOTC] = useState<string>('bdo');
    const [ selectedOnlineWallet, setSelectedOnlineWallet] = useState<string>('bdo');

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

    const [testStatus, setTestStatus] = useState<"pending" | "success" | "failed">("pending");

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
        // navigate("/status/pending", { state: { paymentSummary } });
        navigate(`/status/${testStatus}`, { state: { paymentSummary } });
    };


    return (
        <div className="min-h-screen bg-linear-to-br from-[#FFFFFF] to-[#D0BBE6] flex flex-col items-center justify-center p-2 sm:p-4 font-sans text-slate-700">
        
        {/* Condensed Header */}
        <header className="flex flex-col items-center mb-4 pt-10">
            <div className="w-20 h-20 bg-[#D9D9D9] rounded-full mb-2" />
            <h2 className="text-lg font-bold text-[#312B5B]">Business Name</h2>
            <div className="flex gap-4 mt-1 text-[#312B5B]">
            <Facebook size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                            <Instagram size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                            <Link2 size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
            </div>
        </header>

        {/* Main Container */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
            
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
                            {PAYMENT_METHODS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (!item.disabled) handleMethodSelect(item.id);
                                }}
                                className={`w-full flex flex-col items-center justify-center gap-1 py-2 px-1 border font-semibold rounded-lg transition-all ${
                                
                                    item.disabled
                                        ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                                        :
                                    method === item.id 
                                    ? 'bg-[#312B5B] border-[#312B5B] text-white' 
                                    : 'border-slate-300 text-slate-500 hover:border-slate-300 cursor-pointer' 
                                    }`}
                            >
                                
                                <span className="flex text-xs text-center justify-center whitespace-nowrap leading-tight">
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
                            {BANKS.map((bank) => {
                            const isSelected = selectedBank === bank.id;

                            return (
                                <div
                                key={bank.id}
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
                                    onChange={() => setSelectedBank(bank.id)}
                                    className="w-4 h-4 accent-[#312B5B] shrink-0"
                                    />

                                    <img
                                    src={bank.logo}
                                    alt=""
                                    className="w-5 h-5 object-contain shrink-0"
                                    />

                                    <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#312B5B]">
                                        {bank.name}
                                    </span>
                                    <span className="text-xs text-[#312B5B]">
                                        {bank.description}
                                    </span>
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
                        <div className="flex mb-3 w-[70%] mx-auto">
                            
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
                            className={`flex items-center justify-center gap-3 py-3 px-4 rounded-tl rounded-bl transition-all duration-200 ${
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
                            className={`flex items-center justify-center gap-3 py-3 px-4 rounded-tr rounded-br transition-all duration-200 ${
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

                        {ONLINE_METHODS.map((bank) => {
                        const isSelected = selectedOnlineBank === bank.id;

                        return (
                            <div
                            key={bank.id}
                            className={`flex rounded-md text-xs transition-all duration-300 w-full lg:w-[100%] mx-auto overflow-hidden ${
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
                                onChange={() => setSelectedOnlineBank(bank.id)}
                                className="w-4 h-4 accent-[#312B5B] shrink-0"
                                />

                                <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={bank.logo}
                                    alt={bank.name}
                                    className="w-full h-full object-contain p-1"
                                />
                                </div>

                                <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold text-[#312B5B]">
                                    {bank.name}
                                </span>

                                <span className="text-[10px] text-[#312B5B]">
                                    {bank.description}
                                    {bank.fee && (
                                    <span className="ml-2 text-[10px] text-[#312B5B]">
                                    {bank.fee}
                                    </span>
                                    )}
                                </span>

                                
                                </div>
                            </label>
                            </div>
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

                        {OTC_METHODS.map((otc) => {
                        const isSelected = selectedOnlineOTC === otc.id;
                        const Icon = otc.logo;
                        return (
                            <div
                            key={otc.id}
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
                                onChange={() => setSelectedOnlineOTC(otc.id)}
                                className="w-4 h-4 accent-[#312B5B] shrink-0"
                                />

                                <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                    <Icon/>
                                </div>

                                <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold text-[#312B5B]">
                                    {otc.name}
                                </span>

                                <span className="text-xs text-[#312B5B] mt-0.5">
                                    {otc.description}
                                </span>

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

                        {DIGITAL.map((wallet) => {
                        const isSelected = selectedOnlineWallet === wallet.id;

                        return (
                            <div
                            key={wallet.id}
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
                                onChange={() => setSelectedOnlineWallet(wallet.id)}
                                className="w-4 h-4 accent-[#312B5B] shrink-0"
                                />

                                <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                        src={wallet.logo}
                                        alt={wallet.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold text-[#312B5B]">
                                    {wallet.name}
                                </span>

                                <span className="text-xs text-[#312B5B] mt-0.5">
                                    {wallet.description}
                                </span>

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
                <div className="lg:col-span-1 flex justify-center mb-4 mt-20 md:mt-0" style={{ height: summaryHeight }}>
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
            <div className="mt-4 lg:mt-6 w-full flex justify-center items-center">
                <button
                    disabled={amount <= 99}
                    className={`w-1/2 md:w-1/2 lg:w-1/3 py-2 rounded font-bold text-sm transition-all duration-300 shadow-md transform
                    ${amount > 99
                        ? 'bg-linear-to-r from-[#2B3565] to-[#0171A3] text-white cursor-pointer hover:from-[#312B5B] hover:to-[#0182B5] hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={handlePaymentSuccess}
                >
                    Pay Now
                </button>
            </div>
            <div className="flex justify-center gap-2 mb-4">
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
        </div>

        </div>
        </div>
    );
};

export default PaymentPage;