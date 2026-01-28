import React from 'react'
import { IoMdClose } from "react-icons/io";
import { CheckCircle } from 'lucide-react';

interface CustomModalProps {
    message: string;
    modalname: React.RefObject<HTMLDialogElement | null>;
}

function Custommodal({message, modalname}: CustomModalProps) {
    return (
        <dialog id="my_modal_3" className="modal backdrop-blur-sm" ref={modalname}>
            <div className="modal-box bg-white shadow-2xl border-0 rounded-2xl max-w-md mx-auto">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 hover:bg-gray-100 transition-colors duration-200">
                        <IoMdClose className="text-gray-500 hover:text-gray-700" size={18} />
                    </button>
                </form>
                
                <div className="flex flex-col justify-center items-center py-8 px-4">
                    {/* Success Icon with Animation */}
                    <div className="mb-6 relative">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                            <CheckCircle className="text-green-500 w-10 h-10 relative z-10" strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 arabic-font">
                            Success!
                        </h3>
                        <p className='arabic-font text-lg text-gray-600 leading-relaxed'>
                            {message}
                        </p>
                    </div>

                    {/* Action Button */}
                    <form method="dialog" className="mt-8">
                        <button className="btn bg-green-500 hover:bg-green-600 text-white border-0 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 arabic-font">
                            Great!
                        </button>
                    </form>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-t-2xl"></div>
            </div>
        </dialog>
    )
}

export default Custommodal