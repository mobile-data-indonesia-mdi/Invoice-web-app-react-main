import React from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { validateItemCount, validateItemName, validateItemPrice } from '../functions/createInvoiceValidator'

function AddItem({ itemDetails, setItem, isValidatorActive, onDelete, handleOnChange }) {

    
    const handleChange = (id, e) => {
        
        handleOnChange(id, e);
    }

    return (
        <div>
            <div className='flex dark:text-white justify-between items-center'>
                <div className='flex flex-wrap'>

                    {/* Item Name */}
                    <div className='flex px-2 py-2 flex-col items-start'>
                        <h1>Item Name</h1>
                        <input
                            name="name"
                            type="text"
                            value={itemDetails.name}
                            onChange={(e) => handleChange(itemDetails.id, e)} 
                            className={`dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none ${
                                isValidatorActive && !validateItemName(itemDetails.name) && 'border-red-500 dark:border-red-500 outline-red-500 border-2'
                            } dark:border-gray-800`}
                        />
                    </div>

                    {/* Quantity */}
                    <div className='flex px-2 py-2 flex-col items-start'>
                        <h1>Qty.</h1>
                        <input
                            name="quantity"
                            type="number"
                            min={0}
                            value={itemDetails.quantity}
                            onChange={(e) => handleChange(itemDetails.id, e)} 
                            className={`dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 max-w-[60px] border-gray-300 focus:outline-none ${
                                isValidatorActive && !validateItemCount(itemDetails.quantity) && 'border-red-500 dark:border-red-500 outline-red-500 border-2'
                            } dark:border-gray-800`}
                        />
                    </div>
                    
                    {/* Usage */}
                    <div className='flex px-2 py-2 flex-col items-start'>
                        <h1>Usage</h1>
                        <input
                            name="usage"
                            type="number"
                            min={0}
                            value={itemDetails.usage}
                            onChange={(e) => handleChange(itemDetails.id, e)}
                            className={`dark:bg-[#1e2139] py-2 max-w-[100px] px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none dark:border-gray-800`}
                        />
                    </div>


                    {/* Price */}
                    <div className='flex px-2 py-2 flex-col items-start'>
                        <h1>Price</h1>
                        <input
                            name="price"
                            type="number"
                            min={0}
                            value={itemDetails.price}
                            onChange={(e) => handleChange(itemDetails.id, e)} 
                            className={`dark:bg-[#1e2139] py-2 max-w-[100px] px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none ${
                                isValidatorActive && !validateItemPrice(itemDetails.price) && 'border-red-500 dark:border-red-500 outline-red-500 border-2'
                            } dark:border-gray-800`}
                        />
                    </div>

                    {/* Total */}
                    <div className='max-w-[100px] dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-none focus:outline-purple-400 border-gray-300 dark:border-gray-800 dark:text-white'>
                        {(itemDetails.usage * itemDetails.price).toFixed(2)} {/* Perhitungan Total */}
                    </div>
                </div>

                {/* Delete Button */}
                <button onClick={() => onDelete(itemDetails.id)}>
                    <TrashIcon className='text-gray-500 hover:text-red-500 cursor-pointer mt-4 h-6 w-6' />
                </button>
            </div>
        </div>
    )
}

export default AddItem
