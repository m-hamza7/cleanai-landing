import React from "react";

export default function ResearchPapers() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Research Papers Considered</h1>
      <ul className="list-disc pl-6 space-y-4">
        <li>
          <a href="https://example.com/paper1" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            Title of Research Paper 1
          </a>
          <p className="text-sm text-muted-foreground">Short description or authors.</p>
        </li>
        <li>
          <a href="https://example.com/paper2" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            Title of Research Paper 2
          </a>
          <p className="text-sm text-muted-foreground">Short description or authors.</p>
        </li>
        {/* Add more papers as needed */}
      </ul>
    </div>
  );
}