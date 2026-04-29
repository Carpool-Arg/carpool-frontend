interface SectionTabsProps {
  activeSection: string
  setActiveSection: (value: string) => void
}

export default function SectionTabs({
  activeSection,
  setActiveSection,
}: SectionTabsProps) {
  const sections = [
    { key: "general", label: "Generales" },
    { key: "trips", label: "Viajes" },
    { key: "users", label: "Usuarios" },
  ]

  return (
    <div className="inline-flex items-center gap-4 p-1 bg-gray-8 border border-gray-2/50 rounded-xl w-full">
      {sections.map((section) => {
        const isActive = activeSection === section.key

        return (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`
              px-8 py-1.5 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-gray-10 text-white shadow-sm border border-gray-9/40"
                  : "text-gray-11 hover:text-gray-12 hover:bg-gray-9/40"
              }
            `}
          >
            {section.label}
          </button>
        )
      })}
    </div>
  )
}