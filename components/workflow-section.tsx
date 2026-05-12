const workflowSteps = [
  {
    key: "upload",
    title: "Image Upload",
    description: "Citizens upload waste images on CleanAI with GPS location.",
  },
  {
    key: "ai",
    title: "AI Classification",
    description: "AI models analyze the uploaded image to detect and classify waste types.",
  },
  {
    key: "result",
    title: "Result Generation",
    description: "The system generates prediction results along with location and report details.",
  },
  {
    key: "dashboard",
    title: "Dashboard View",
    description: "Municipal authorities monitor reports, waste hotspots, and analytics in real time.",
  },
  {
    key: "schedule",
    title: "Scheduling",
    description: "Cleanup tasks are scheduled based on report priority and affected locations.",
  },
  {
    key: "assign",
    title: "Waste Truck Assignment",
    description: "The nearest available waste collection team or truck is assigned.",
  },
  {
    key: "verify",
    title: "Verification of Cleanup",
    description: "After collection, cleanup status is updated and the user is notified.",
  },
]

function renderWorkflowIcon(key: string) {
  switch (key) {
    case "upload":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="workflow-svg">
          <rect x="18" y="8" width="28" height="48" rx="6" className="workflow-stroke" />
          <path d="M32 20v18" className="workflow-stroke workflow-animate-stroke" />
          <path d="M26 26l6-6 6 6" className="workflow-stroke" />
          <rect x="26" y="44" width="12" height="4" rx="2" className="workflow-stroke" />
        </svg>
      )
    case "ai":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="workflow-svg">
          <circle cx="32" cy="32" r="12" className="workflow-stroke" />
          <circle cx="12" cy="20" r="4" className="workflow-stroke" />
          <circle cx="52" cy="20" r="4" className="workflow-stroke" />
          <circle cx="12" cy="44" r="4" className="workflow-stroke" />
          <circle cx="52" cy="44" r="4" className="workflow-stroke" />
          <path d="M16 22l8 4" className="workflow-stroke" />
          <path d="M48 22l-8 4" className="workflow-stroke" />
          <path d="M16 42l8-4" className="workflow-stroke" />
          <path d="M48 42l-8-4" className="workflow-stroke" />
          <path d="M28 32h8" className="workflow-stroke workflow-animate-stroke" />
        </svg>
      )
    case "result":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="workflow-svg">
          <ellipse cx="30" cy="16" rx="14" ry="6" className="workflow-stroke" />
          <path d="M16 16v18c0 4 6 8 14 8s14-4 14-8V16" className="workflow-stroke" />
          <path d="M46 30h12" className="workflow-stroke" />
          <path d="M52 24v12" className="workflow-stroke workflow-animate-stroke" />
          <circle cx="52" cy="30" r="6" className="workflow-stroke" />
        </svg>
      )
    case "dashboard":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="workflow-svg">
          <rect x="12" y="12" width="40" height="32" rx="4" className="workflow-stroke" />
          <path d="M20 36V26" className="workflow-stroke" />
          <path d="M28 36V22" className="workflow-stroke workflow-animate-stroke" />
          <path d="M36 36V28" className="workflow-stroke" />
          <path d="M44 36V20" className="workflow-stroke" />
          <path d="M18 48h28" className="workflow-stroke" />
        </svg>
      )
    case "schedule":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="workflow-svg">
          <rect x="12" y="16" width="40" height="32" rx="4" className="workflow-stroke" />
          <path d="M20 12v8M44 12v8" className="workflow-stroke" />
          <path d="M12 24h40" className="workflow-stroke" />
          <circle cx="44" cy="44" r="8" className="workflow-stroke" />
          <path d="M44 40v4l3 3" className="workflow-stroke workflow-animate-stroke" />
        </svg>
      )
    case "assign":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="workflow-svg">
          <rect x="10" y="26" width="26" height="14" rx="2" className="workflow-stroke" />
          <path d="M36 30h10l6 6v4H36z" className="workflow-stroke" />
          <circle cx="22" cy="44" r="4" className="workflow-stroke" />
          <circle cx="44" cy="44" r="4" className="workflow-stroke" />
          <path d="M14 30h10" className="workflow-stroke workflow-animate-stroke" />
        </svg>
      )
    case "verify":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="workflow-svg">
          <circle cx="32" cy="32" r="18" className="workflow-stroke" />
          <path d="M24 32l6 6 12-12" className="workflow-stroke workflow-animate-stroke" />
          <circle cx="32" cy="32" r="24" className="workflow-ring" />
        </svg>
      )
    default:
      return null
  }
}

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-primary">System Workflow</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From citizen reporting to waste clearance - see how CleanAI transforms urban waste management
          </p>
        </div>

        <div className="mb-16">
          <div className="workflow-strip" role="list" aria-label="CleanAI workflow">
            {workflowSteps.map((step, index) => (
              <div key={step.key} className="workflow-item" role="listitem">
                <div className="workflow-icon" aria-hidden="true">
                  {renderWorkflowIcon(step.key)}
                </div>
                <h3 className="workflow-title">{step.title}</h3>
                <p className="workflow-description">{step.description}</p>
                {index < workflowSteps.length - 1 && (
                  <div className="workflow-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 80">
                      <path d="M8 0v68" className="workflow-arrow-path" />
                      <path d="M2 68l6 10 6-10" className="workflow-arrow-head" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
