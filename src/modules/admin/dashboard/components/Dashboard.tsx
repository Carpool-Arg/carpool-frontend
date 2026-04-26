'use client'

import { useState } from "react"
import TripSection from "./trips/TripSection"
import SectionTabs from "./SectionsTabs"
import UserSection from "./users/UserSection"



export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("trips")

  return (
    <div className="space-y-6">
       
      <SectionTabs
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div>
        {activeSection === "trips" && <TripSection />}
        {activeSection === "general" && (
          <div>Sección de estadísticas generales</div>
        )}
        {activeSection === "users" && (
          <UserSection/>
        )}
      </div>
    </div>
  )
}