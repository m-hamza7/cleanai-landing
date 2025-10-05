import React from "react";

export default function ResearchPapers() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
          Research Papers Considered
        </h1>
        <div className="bg-card rounded-lg shadow border border-border p-8">
          <ul className="space-y-6">
            <li>
              <a
                href="https://example.com/paper1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-primary underline hover:text-primary-foreground transition-colors"
              >
                Title of Research Paper 1
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                Short description or authors.
              </p>
            </li>
            <li>
              <a
                href="https://example.com/paper2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-primary underline hover:text-primary-foreground transition-colors"
              >
                Title of Research Paper 2
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                Short description or authors.
              </p>
            </li>
            {/* Add more papers as needed */}
          </ul>
        </div>
      </div>
    </main>
  );
}