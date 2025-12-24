interface TabsProps {
  value: string | undefined;
  onChange: (v: string) => void;
}

const TABS = [
  { label: "Solicitudes", value: "PENDING" },
  { label: "Aceptadas", value: "ACCEPTED" },
];

export function Tab({ value, onChange }: TabsProps) {
  const activeIndex = TABS.findIndex(t => t.value === value);

  return (
    <div className="bg-gray-8 rounded-full w-full p-1">
      <div className="relative flex">
        {/* PILL */}
        <div
          className="absolute inset-y-0 w-1/2 rounded-full bg-black
                     transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {TABS.map(tab => {
          const active = value === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`
                relative z-10 w-1/2 px-4 py-1.5 text-sm
                transition-colors duration-300 cursor-pointer
                ${active ? "text-white" : "text-gray-11 hover:text-white"}
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
