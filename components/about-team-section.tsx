"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Mail, Sparkles } from "lucide-react"
import Image from "next/image"

const teamMembers = [
  {
    name: "Dr. Farrukh Shahid",
    role: "Supervisor | AI & Data Science Expert",
    affiliation: "Assistant Professor @ NUCES - FAST",
    email: "mfarrukh.shahid@nu.edu.pk",
    linkedin: "https://www.linkedin.com/in/muhammad-farrukh-syed-2599b618/",
    image: "/images/team/dr-farrukh-shahid.jpg",
    isSupervisor: true,
  },
  {
    name: "Muhammad Hamza",
    role: "Full-Stack Web Developer",
    affiliation: "CS Student @ NUCES - FAST",
    email: "muhmd.hamza0@gmail.com",
    linkedin: "https://www.linkedin.com/in/m-hamza7/",
    image: "/images/team/muhammad-hamza.jpg",
  },
  {
    name: "Muhammad Saad Arshad",
    role: "Software Engineer - AI & Data Science",
    affiliation: "CS Student @ NUCES - FAST",
    email: "saadarshad12123@gmail.com",
    linkedin: "https://www.linkedin.com/in/muhammad-saad-arshad9503/",
    image: "/images/team/muhammad-saad-arshad.jpg",
  },
  {
    name: "Waniya Badar",
    role: "Software Engineer - AI & Data Science",
    affiliation: "CS Student @ NUCES - FAST",
    email: "waniyabadar2003@gmail.com",
    linkedin: "https://www.linkedin.com/in/waniya-badar",
    image: "/images/team/waniya-badar.jpg",
  },
]

export function AboutTeamSection() {
  return (
    <section id="our-team" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-chart-2/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15">About Us</Badge>
          <h2 className="text-4xl font-bold mb-4 text-primary">Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            CleanAI is built by a focused team combining academic research, practical engineering, and AI expertise to
            solve real urban sustainability challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card
              key={member.name}
              className={`overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                member.isSupervisor
                  ? "bg-primary text-primary-foreground border-primary/40"
                  : "bg-card/80 border-border/70"
              }`}
            >
              <div className="relative h-65 w-full border-b border-primary/20 bg-muted/40">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 300px) 100vw, 33vw"
                  className="object-cover object-top"
                  onError={(event) => {
                    event.currentTarget.src = member.image
                  }}
                />
              </div>

              <div className="flex flex-col h-70 p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className={`text-xl font-semibold ${member.isSupervisor ? "text-primary-foreground" : "text-foreground"}`}>
                      {member.name}
                    </h3>
                    <p className={`mt-1 text-sm ${member.isSupervisor ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                      {member.affiliation}
                    </p>
                  </div>
                  {member.isSupervisor && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium text-primary-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                      Supervisor
                    </span>
                  )}
                </div>

                <p className={`mb-6 font-small ${member.isSupervisor ? "text-primary-foreground" : "text-foreground"}`}>
                  {member.role}
                </p>

                <div className="mt-auto flex flex-col gap-1">
                  <a
                    href={`mailto:${member.email}`}
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                      member.isSupervisor
                        ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                        : "bg-primary/10 text-primary hover:bg-primary/15"
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </a>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                      member.isSupervisor
                        ? "border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <Linkedin className="h-4 w-4" />
                    Linked Profile
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
