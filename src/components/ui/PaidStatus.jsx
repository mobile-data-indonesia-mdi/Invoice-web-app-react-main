import React from 'react'

function PaidStatus({type}) {
  const classNames = {
    paid :  ['text-[#33d69f] bg-[#33d69f0f]' , 'bg-[#33d69f]' ],
    unpaid : ['text-[#ff8f00] bg-[#ff8f000f]' , 'bg-[#ff8f00]'],
    partial : ['text-[#dfe3fa] bg-[#f0cc3d0f]' , 'bg-[#f0cc3d]'],
    void: ['text-[#f1efec] bg-[#f3f4f6] dark:bg-[#d4c9be0f]', 'bg-[#d4c9be]'],
    not_void: ['text-[#03396c] bg-[#005b960f] dark:bg-[#005b960f]', 'bg-[#005b96]'],
    outstanding: ['text-[#ff0000] bg-[#ff00000f]', 'bg-[#ff0000]'],
  }

  return (
    <div className={
      `${type.toLowerCase() === 'paid' || type.toLowerCase() === 'cleared' ? classNames.paid[0] : 
          type.toLowerCase() === 'unpaid' ? classNames.unpaid[0] : 
          type.toLowerCase() === 'partial' ? classNames.partial[0] :
          type.toLowerCase() === 'outstanding' ? classNames.outstanding[0] :
          type.toLowerCase() === 'not-void' ? classNames.not_void[0] :
          classNames.void[0]} 
          flex justify-center space-x-2 rounded-lg items-center px-4 py-2`
    }>
      <div className= {
        `h-3 w-3 rounded-full
          ${type.toLowerCase() === 'paid' || type.toLowerCase() === 'cleared' ? classNames.paid[1] : 
          type.toLowerCase() === 'unpaid' ? classNames.unpaid[1] : 
          type.toLowerCase() === 'partial' ? classNames.partial[1] : 
          type.toLowerCase() === 'outstanding' ? classNames.outstanding[1] :
          type.toLowerCase() === 'not-void' ? classNames.not_void[1] :
          classNames.void[1]}`
      }/>
      <p className= {`text-black dark:text-white`}>
        {type}
      </p>
    </div>
  )
}

export default PaidStatus