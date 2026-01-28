import React from 'react'
import { useTranslation } from 'react-i18next'

function CustomtextArea({value,onChange,label,error}:any) {
    const {t,i18n} =useTranslation()
  return (
    <div>
        <label className={`block ${i18n.language === 'ar' ? 'text-right arabic-font' : 'text-left'}`}>{label}</label>
        <textarea rows={3} placeholder={label} className={`textarea textarea-neutral w-full border focus:outline-0  focus:border-orange-600 ${i18n.language === 'ar' ? 'text-right rtl' : 'text-left'} `} onChange={onChange}>{value}</textarea>
        {error && <p className='text-red-600 text-xs'>{error}</p>}
    </div>
  )
}

export default CustomtextArea