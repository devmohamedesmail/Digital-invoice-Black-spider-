import { useTranslation } from "react-i18next"


function Customselect({ error ,label,onChange , items , titleKey, valueKey }: any) {
    const { t, i18n } = useTranslation()
    return (
        <div className='my-3'>
            <label className={`block mb-1 text-xs ${i18n.language === 'ar' ? 'text-right arabic-font' : 'text-left'}`}>{label}</label>
            <select defaultValue="Pick a text editor" onChange={onChange} className="select select-neutral focus:border-orange-600 h-12 focus:outline-0 w-full border ">
                <option >{t('select-payment-type')}</option>
                {items && items.map((item:any)=>(
                    <option key={item[valueKey]} value={item[valueKey]}> {item[titleKey]} </option> 
                ))}

            </select>
            <p className='text-red-600 text-xs'>{error}</p>
        </div>
    )
}

export default Customselect