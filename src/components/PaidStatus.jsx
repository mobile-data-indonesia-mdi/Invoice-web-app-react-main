import React from 'react'

function PaidStatus({type}) {
    const classNames = {
        paid :  ['text-[#33d69f] bg-[#33d69f0f]' , 'bg-[#33d69f]' ],
        unpaid : ['text-[#ff8f00] bg-[#ff8f000f]' , 'bg-[#ff8f00]'],
        partial : ['text-[#dfe3fa] bg-[#dfe3fa0f]' , 'bg-[#dfe3fa]'],
        void: ['text-[#F1EFEC] bg-[#f3f4f6] dark:bg-[#d4c9be0f]', 'bg-[#d4c9be]']
    }
  return (
    <div className={
      `${type === 'paid' ? classNames.paid[0] : 
          type === 'unpaid' ? classNames.unpaid[0] : 
          type === 'partial' ? classNames.partial[0] : 
          classNames.void[0]} 
          flex justify-center space-x-2 rounded-lg items-center px-4 py-2`
    }>
      <div className= {
        `h-3 w-3 rounded-full
          ${type === 'paid' ? classNames.paid[1] : 
          type === 'unpaid' ? classNames.unpaid[1] : 
          type === 'partial' ? classNames.partial[1] : 
          classNames.void[1]}`
      }/>
      <p className= {`text-black dark:text-white`}>
        {type}
      </p>
    </div>
  )
}

export default PaidStatus