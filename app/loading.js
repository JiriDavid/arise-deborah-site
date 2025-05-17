export default function Loading() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="text-primary text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
