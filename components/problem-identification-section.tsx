export function ProblemIdentificationSection() {
  return (
    <section className="py-16 bg-card border-b border-border">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary text-center">
          Problem Identification
        </h2>
        <p className="text-lg text-muted-foreground mb-6 text-center">
          Karachi generates over <span className="font-semibold text-foreground">16,000 tons of waste daily</span>, but current systems rely on manual reporting and lack real-time monitoring.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-base text-foreground">
          <li>Garbage piles are often left uncollected, causing health and environmental issues.</li>
          <li>Illegal dumping blocks drains, increasing flood risks during monsoon.</li>
          <li>Truck dispatching is inefficient, wasting time and resources.</li>
          <li>No real-time, AI-driven waste detection or flood prevention system exists.</li>
        </ul>
      </div>
    </section>
  );
}