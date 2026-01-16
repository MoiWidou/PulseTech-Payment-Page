import { NavLink, useNavigate } from "react-router-dom";
import { PiSignOutBold } from "react-icons/pi";
import { LuBlocks } from "react-icons/lu";
import { PiHandWithdrawBold } from "react-icons/pi";
import { RiArrowLeftRightLine } from "react-icons/ri";
import { HiOutlineMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";

export default function Sidebar() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { name: "Overview", path: "/landing", icon: LuBlocks },
        { name: "Transactions", path: "/transactions", icon: PiHandWithdrawBold },
        { name: "Withdrawal", path: "/withdrawal", icon: RiArrowLeftRightLine },
    ];
    
    const handleSignOut = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include", // important: sends cookies to the server
            });

            if (!res.ok) throw new Error("Logout failed");

            navigate("/login"); // redirect after successful logout
        } catch (err) {
            console.error(err);
            alert("Logout failed. Please try again.");
        }
    };


    const clientName = "Client Name";
    const nameParts = clientName.trim().split(" ");
    const initials =
        nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
            : nameParts[0][0];
    const clientInitials = initials.toUpperCase();

    const [showChangePass, setShowChangePass] = useState(false);
    const clientRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (
            clientRef.current &&
            !clientRef.current.contains(event.target as Node)
        ) {
            setShowChangePass(false);
        }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleToggleChangePass = () => {
        setShowChangePass((prev) => !prev);
    };
    
    return (
        <>
            {/* Hamburger Button on small screens */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="text-gray-700 bg-white p-2 rounded-lg shadow"
                >
                    {mobileOpen ? <IoClose size={24} /> : <HiOutlineMenu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`
                    h-full w-64 bg-white text-white flex flex-col p-4
                    fixed top-0 left-0 z-40 md:relative md:translate-x-0
                    transition-transform duration-300 ease-in-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <img
                        src="/PulseTechLogoV1-nobg.png"
                        alt="PulseTech Logo"
                        className="w-32 h-32 object-contain"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-4 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                                        isActive || (item.path === "/landing" && window.location.pathname === "/")
                                            ? "bg-sky-200 font-semibold text-black"
                                            : "text-gray-700 hover:bg-sky-50"
                                    }`
                                }
                                onClick={() => setMobileOpen(false)} // close sidebar on mobile click
                            >
                                <Icon
                                    className={`text-4xl transition-colors rounded ${
                                        item.path === window.location.pathname
                                            ? "text-white bg-blue-400 p-1"
                                            : "bg-gray-100 text-gray-400 group-hover:text-sky-500"
                                    }`}
                                />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Client Info */}

                {showChangePass && (
                    <button
                        onClick={() => alert("Redirect to change password")}
                        className="bg-white text-gray-800 px-4 py-3 rounded-xl 
                        shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]
                        border border-gray-300/50
                        hover:bg-gray-50 hover:border-gray-400 transition-all duration-200
                        text-sm font-semibold w-full text-left flex items-center gap-2 mb-5"
                    >
                        Change Password
                    </button>
                )}

                <div ref={clientRef} className="mt-auto bg-[#132440] rounded-lg p-5">
                    
                    <div className="flex items-center gap-3 px-3 mb-3" >
                        <div 
                            onClick={handleToggleChangePass}
                            className="cursor-pointer w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm"
                        >
                            {clientInitials}
                        </div>
                        <h5 className="text-white text-sm font-medium truncate">{clientName}</h5>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 p-1 rounded-lg text-white hover:bg-gray-500 transition w-full hover:font-semibold"
                    >
                        <PiSignOutBold size={18} /> Sign Out
                    </button>
                </div>
                
            </div>
        </>
    );
}
