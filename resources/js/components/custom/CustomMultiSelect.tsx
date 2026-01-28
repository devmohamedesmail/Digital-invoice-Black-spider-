import Select from 'react-select';
import { useTranslation } from 'react-i18next';

interface CustomMultiSelectProps {
  label: string;
  items: any[];
  value: string[];
  onChange: (value: string[]) => void;
  valueKey: string;
  labelKey: string;
  error?: string;
}

const CustomMultiSelect = ({
  label,
  items,
  value,
  onChange,
  valueKey,
  labelKey,
  error
}: CustomMultiSelectProps) => {
  const { t, i18n } = useTranslation();

  const options = items.map(item => ({
    value: item[valueKey],
    label: item[labelKey],
  }));

  const selectedValues = options.filter(opt => value.includes(opt.value));

  return (
    <div className="my-3">
      <label className={`block mb-1 text-sm ${i18n.language === 'ar' ? 'text-right arabic-font' : 'text-left'}`}>
        {label}
      </label>
      <Select
        isMulti
        options={options}
        value={selectedValues}
        onChange={(selected: any) => onChange(selected.map((opt: any) => opt.value))}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: error ? 'red' : (state.isFocused ? '#f97316' : '#000'),
            boxShadow: 'none',
            '&:hover': {
              borderColor: error ? 'red' : '#f97316',
            },
            minHeight: '50px'
          }),
          multiValue: base => ({
            ...base,
            backgroundColor: '#e5f4e3',
          }),
          multiValueLabel: base => ({
            ...base,
            color: '#166534',
          }),
          multiValueRemove: base => ({
            ...base,
            color: '#166534',
            ':hover': {
              backgroundColor: '#bbf7d0',
              color: '#14532d',
            },
          }),
        }}
      />
      <p className="text-red-600 text-xs">{error}</p>
    </div>
  );
};

export default CustomMultiSelect;
