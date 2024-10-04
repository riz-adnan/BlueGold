import React from 'react'

export default function ModalComp({ setModalVisible, children }) {
    return (
        <div className="absolute top-[12vh] left-[15vw] z-[500] justify-center items-center h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg w-[70vw] h-[70vh] overflow-scroll shadow dark:bg-gray-700 shadow-[rgba(0,0,15,0.5)_0px_0px_20px_3px]">
                    <button onClick={() => setModalVisible()} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    {children}
                </div>
            </div>
        </div>
    )
}