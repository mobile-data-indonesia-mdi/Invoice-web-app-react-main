import React from 'react';
import {useSelector} from "react-redux";

function VoidModal({ itemToVoid, status, onVoidButtonClick, setIsVoidModalOpen }) {
    const isUnvoiding = status !== 'void'; // status yang akan DITUJU

    // Redux Selector
    const invoice = itemToVoid === "invoice" ? useSelector(state => state.invoices.invoiceById) : {};

    // Text Modal
    const titleModal = () => {
        if (itemToVoid === "invoice") {
            return isUnvoiding ? "Unvoid Invoice?" : "Void Invoice?"
        } else {
            return isUnvoiding ? "Unvoid Payment?" : "Void Payment?"
        }
    };

    const confirmationMessage = () => {
        if (itemToVoid === "invoice") {
            return isUnvoiding
                ? `Are you sure you want to unvoid invoice ${invoice?.invoice_number}?`
                : `Are you sure you want to void invoice ${invoice?.invoice_number}?`;
        } else {
            return isUnvoiding
                ? `Are you sure you want to unvoid this payment`
                : `Are you sure you want to void this payment`;
        }
    }

    return (
        <div
            onClick={(e) => {
                if (e.target !== e.currentTarget) return;
                setIsVoidModalOpen(false);
            }}
            className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex bg-[#000005be]"
        >
            <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
                <h3 className="font-bold text-gray-700 dark:text-white text-xl">
                    {titleModal()}
                </h3>

                <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
                    {confirmationMessage()}
                </p>

                <div className="flex w-full mt-4 items-center justify-center space-x-4">
                    <button
                        onClick={onVoidButtonClick}
                        className="w-full items-center text-white hover:opacity-75 bg-gray-500 py-2 rounded-full"
                    >
                        {isUnvoiding ? 'Yes, Unvoid' : 'Yes, Void'}
                    </button>
                    <button
                        onClick={() => setIsVoidModalOpen(false)}
                        className="w-full items-center text-[#635fc7] dark:bg-white hover:opacity-75 bg-[#635fc71a] py-2 rounded-full"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VoidModal;
