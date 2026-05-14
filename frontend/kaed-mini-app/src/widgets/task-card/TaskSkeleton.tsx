export default function TaskSkeleton() {
  return (
    <div className="bg-card border border-border rounded-3xl p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-7 h-7 rounded-full bg-background shrink-0" />

          <div className="min-w-0">
            <div className="w-40 max-w-full h-5 rounded bg-background" />

            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-background" />

              <div className="w-20 h-4 rounded bg-background" />
            </div>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-background shrink-0" />
      </div>
    </div>
  )
}