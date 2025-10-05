"use client"

import ResearchPapers from "@/components/research-papers"

export default function Page() {
  return (
    <div className="landing-theme grid-pattern">
      {/* optional: subtle container padding to mirror landing spacing */}
      <ResearchPapers />
    </div>
  )
}
