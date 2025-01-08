import React from "react";

export default function Wrapper({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={`w-full max-w-[1312px] mx-auto ${className}`} {...props} />;
}
