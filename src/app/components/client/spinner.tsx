export default function Spinner({
  isPending,
  size,
}: {
  isPending: boolean;
  size?: "medium" | "large";
}) {
  if (!isPending) return null;
  const spinnerSize = !size
    ? "h-6 w-6"
    : size === "medium"
    ? "h-6 w-6"
    : "h-12 w-12";
  return (
    <>
      <div className="flex justify-center items-center">
        <div
          className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 border-orange-400`}
        ></div>
      </div>
    </>
  );
}
