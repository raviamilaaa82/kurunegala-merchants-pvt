
"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      {...props}
      data-size={size}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full transition-colors outline-none",

        // size
        "data-[size=default]:h-6 data-[size=default]:w-11",
        "data-[size=sm]:h-5 data-[size=sm]:w-9",

        // colors
        "data-[state=checked]:bg-green-500",
        "data-[state=unchecked]:bg-zinc-700",

        "disabled:opacity-50 disabled:cursor-not-allowed",

        className
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block rounded-full bg-white shadow-md transition-transform",

          // fixed size (IMPORTANT)
          "h-5 w-5",

          // position (IMPORTANT FIX)
          "translate-x-[2px] data-[state=checked]:translate-x-[22px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }











// "use client"

// import * as React from "react"
// import * as SwitchPrimitive from "@radix-ui/react-switch"
// import { cn } from "@/lib/utils"

// function Switch({
//   className,
//   size = "default",
//   ...props
// }: React.ComponentProps<typeof SwitchPrimitive.Root> & {
//   size?: "sm" | "default"
// }) {
//   return (
//     <SwitchPrimitive.Root
//       {...props}
//       data-size={size}
//       className={cn(
//         // base
//         "relative inline-flex shrink-0 items-center rounded-full transition-colors outline-none",

//         // size
//         "data-[size=default]:h-6 data-[size=default]:w-11",
//         "data-[size=sm]:h-5 data-[size=sm]:w-9",

//         // colors (THIS IS THE IMPORTANT PART)
//         "data-[state=checked]:bg-green-500",
//         "data-[state=unchecked]:bg-gray-600",

//         // disabled
//         "disabled:opacity-50 disabled:cursor-not-allowed",

//         className
//       )}
//     >
//       <SwitchPrimitive.Thumb
//         className={cn(
//           "block rounded-full bg-white shadow-md transition-transform",

//           // size
//           "data-[size=default]:h-5 data-[size=default]:w-5",
//           "data-[size=sm]:h-4 data-[size=sm]:w-4",

//           // movement
//           "translate-x-0 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
//         )}
//       />
//     </SwitchPrimitive.Root>
//   )
// }

// export { Switch }










// "use client"

// import * as React from "react"
// import * as SwitchPrimitive from "@radix-ui/react-switch"
// import { cn } from "@/lib/utils"

// function Switch({
//   className,
//   size = "default",
//   ...props
// }: React.ComponentProps<typeof SwitchPrimitive.Root> & {
//   size?: "sm" | "default"
// }) {
//   return (
//     <SwitchPrimitive.Root
//       {...props}
//       defaultChecked={false}   // 🔥 IMPORTANT FIX
//       data-size={size}
//       className={cn(
//         "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
//         "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]",
//         "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
//         "data-[state=checked]:bg-primary",
//         "data-[state=unchecked]:bg-input",
//         className
//       )}
//     >
//       <SwitchPrimitive.Thumb
//         className={cn(
//           "pointer-events-none block rounded-full bg-background shadow transition-transform",
//           "h-4 w-4",
//           "data-[state=checked]:translate-x-[14px]",
//           "data-[state=unchecked]:translate-x-[2px]"
//         )}
//       />
//     </SwitchPrimitive.Root>
//   )
// }

// export { Switch }
















// import * as React from "react";
// // import { Switch as SwitchPrimitive } from "radix-ui"
// import * as SwitchPrimitive from "@radix-ui/react-switch";

// import { cn } from "@/lib/utils";

// function Switch({
//   className,
//   size = "default",
//   ...props
// }: React.ComponentProps<typeof SwitchPrimitive.Root> & {
//   size?: "sm" | "default"
// }) {
//   return (
//     <SwitchPrimitive.Root
//       data-slot="switch"
//       data-size={size}
//       className={cn(
//         "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
//         "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]",
//         "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
//         "data-[state=checked]:bg-primary",
//         "data-[state=unchecked]:bg-input",
//         className
//       )}
//     // className={cn(
//     //   "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
//     //   className
//     // )}
//     // {...props}
//     >
//       <SwitchPrimitive.Thumb
//         data-slot="switch-thumb"
//         className="pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-[state=checked]:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground"
//       />
//     </SwitchPrimitive.Root>
//   )
// }

// export { Switch }
