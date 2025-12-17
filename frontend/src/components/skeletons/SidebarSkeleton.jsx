
const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div>
              <div className="skeleton h-5 w-24 mb-1" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
          <div className="skeleton w-10 h-10 rounded-lg" />
        </div>
        
        <div className="skeleton h-12 w-full rounded-xl" />
        
        <div className="flex items-center justify-between mt-4">
          <div className="skeleton h-9 w-32 rounded-lg" />
          <div className="skeleton h-5 w-20" />
        </div>
      </div>

      {/* Contacts Skeleton */}
      <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-100/50 dark:bg-gray-800/50">
            {/* Avatar skeleton */}
            <div className="relative">
              <div className="skeleton w-14 h-14 rounded-full" />
            </div>

            {/* User info skeleton */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="skeleton h-5 w-32" />
                <div className="skeleton w-4 h-4 rounded" />
              </div>
              <div className="skeleton h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;