import React from 'react';

function DeleteModal({ invoiceId, onDeleteButtonClick, setIsDeleteModalOpen }) {
    const user = JSON.parse(localStorage.getItem("user"));

    // Kalau bukan admin, jangan render modal
    if (user?.role !== "admin") {
        return null;
    }

    return (
        <div
            onClick={(e) => {
                if (e.target !== e.currentTarget) {
                    return;
                }
                setIsDeleteModalOpen(false);
            }}
            className="fixed inset-0 flex justify-center items-center z-50 bg-[#000005be] transition-opacity duration-300"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
        >
            <div className="bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl animate__animated animate__fadeIn">
                <h3 id="delete-modal-title" className="font-bold text-red-500 text-xl">Confirm Deletion</h3>

                <p id="delete-modal-description" className="text-gray-500 font-semibold tracking-wide text-xs pt-6">
                    Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
                </p>

                <div className="flex w-full mt-4 items-center justify-center space-x-4">
                    <button
                        onClick={onDeleteButtonClick}
                        className="w-full items-center text-white bg-red-500 py-2 rounded-full hover:bg-red-600 transition-all duration-300"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="w-full items-center text-[#635fc7] bg-[#635fc71a] py-2 rounded-full hover:bg-[#635fc71a] hover:opacity-75 transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
