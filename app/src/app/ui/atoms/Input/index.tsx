import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "mb-2 h-10 bg-neutral-300/10 outline-0 focus:bg-neutral-300/20 w-full rounded-full px-4 py-2 border-b-2 border-b-neutral-300/20 text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
