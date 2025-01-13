import React from "react";

export default function Wrapper({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={`w-full max-w-[1378px] px-4 xl:px-8 mx-auto ${className}`} {...props} />;
}
