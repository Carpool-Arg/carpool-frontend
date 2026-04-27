'use client'

import { useState } from "react"
import TripSection from "./trips/TripSection"
import SectionTabs from "./SectionsTabs"
import UserSection from "./users/UserSection"
import GeneralSection from "./generals/GeneralSection"



export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("general")

  return (
    <div className="space-y-6">
       
      <SectionTabs
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div>
        {activeSection === "trips" && <TripSection />}
        {activeSection === "general" && (
          <GeneralSection/>
        )}
        {activeSection === "users" && (
          <UserSection/>
        )}
      </div>
    </div>
  )
}