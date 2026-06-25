type AdminSaveBarProps = {
  children: React.ReactNode;
};

/** Fixed save/preview bar scoped to the main admin column (not the sidebar). */
export function AdminSaveBar({ children }: AdminSaveBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-stone-200 bg-white/95 backdrop-blur lg:left-64">
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-14">
        {children}
      </div>
    </div>
  );
}
