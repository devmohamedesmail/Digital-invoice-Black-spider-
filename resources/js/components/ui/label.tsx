import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { t, i18n } = useTranslation()

  return (
    <LabelPrimitive.Root
      data-slot="label"
      // className={cn(
      //   `
      //   ${i18n.language === "en" ? "text-left" : "text-right arabic-font"}
      //   text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none peer-disabled:opacity-50`,
      //   className
      // )}
      className={`text-xs block ${i18n.language === "en" ? "text-left" : "text-right arabic-font"}`}
      {...props}
    />
  )
}

export { Label }
