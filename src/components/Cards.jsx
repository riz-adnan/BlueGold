import React from 'react'
import { Link } from 'react-router-dom'
import { FaEye } from "react-icons/fa6";

export default function Cards({ title, clickEvent, styles, children }) {
    return (
        <div className={`flex justify-center items-center dark:bg-gray-800 h-full w-full ${styles}`}>
            <div className="relative cursor-pointer dark:text-white w-full">
                <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg dark:bg-gray-200"></span>
                <div
                    className="relative p-6 bg-white dark:bg-gray-800 border-2 border-indigo-500 dark:border-gray-300 rounded-lg hover:scale-105 transition duration-500">
                    <div className="flex items-center">
                        <span className="text-xl">😎</span>
                        <h3 className="my-2 ml-3 text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                        {children}
                    </p>

                    <div className="flex flex-row gap-4">
                        <button onClick={clickEvent}
                            className="animate-bounce focus:animate-none hover:animate-none inline-flex text-md font-medium bg-indigo-900 mt-3 px-4 py-2 rounded-lg tracking-wide text-white">
                            <span className="ml-2">Join Now</span>
                        </button>
                        <button onClick={clickEvent} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer my-2">
                            <FaEye />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}