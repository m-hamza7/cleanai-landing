"use client"

export function DemoVideoSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            DEMO
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how CleanAI detects, classifies waste in real time
          </p>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-border bg-black aspect-video">
          {/* Replace the src below with your actual video file or YouTube/Vimeo embed URL */}
          {/*<video
            className="w-full h-full object-contain"
            controls
            playsInline
            preload="metadata"
            poster="/IMPORTANCE-OF-WASTE-MANAGEMENT.jpg"
          >
            {/* Local video – place your file at public/demo.mp4 
            <source src="/demo.mp4" type="video/mp4" /> */}

            {/* Fallback message 
            Your browser does not support the video tag.
          </video>*/}


            {/*── Alternative: YouTube embed ──────────────────────────
            Uncomment the iframe below and remove the <video> above
            to embed a YouTube video instead.*/}

            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/3WX7y5AB9eM"
              title="CleanAI Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen/>
          
        </div>
      </div>
    </section>
  )
}
