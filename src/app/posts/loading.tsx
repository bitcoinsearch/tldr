export default function Loading() {
  return (
    <div className="w-full max-w-[1378px] px-3 xl:px-8 mx-auto min-h-[calc(100vh-113px)] flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-custom-100" />
      <p className="font-gt-walsheim text-sm text-gray-custom-400">Loading posts…</p>
    </div>
  );
}
