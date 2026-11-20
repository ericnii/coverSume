export function PageIntro({ kicker, title, children }) {
  return (
    <header className="mb-10 max-w-2xl">
      <p className="kicker">{kicker}</p>
      <h1 className="display mt-2 text-4xl leading-tight md:text-[2.75rem]">{title}</h1>
      {children && (
        <p className="mt-4 text-[15px] leading-relaxed text-[#5e574f]">{children}</p>
      )}
    </header>
  );
}

export function Section({ index, title, action, children }) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#ddd6cb] pb-3">
        <div>
          <p className="kicker">{index}</p>
          <h2 className="display mt-1 text-[1.7rem] leading-none">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({ label, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-[#7a7268]">{hint}</span>}
    </label>
  );
}

export function TextInput(props) {
  return <input className="input" {...props} />;
}

export function TextArea(props) {
  return <textarea className="input" {...props} />;
}

export function Entry({ title, onRemove, children }) {
  return (
    <div className="entry">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-[13px] text-[#8f3d32] hover:underline"
          >
            Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
