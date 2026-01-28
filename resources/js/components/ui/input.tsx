import * as React from "react"

import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const { t,i18n } = useTranslation();

  return (
    <input
      type={type}
      data-slot="input"
      className={`input input-neutral h-12 border focus:border-orange-600 focus:outline-0 w-full ${i18n.language === 'ar' ? 'text-right rtl' : 'text-left'} `}
      {...props}
    />
  )
}

export { Input }
