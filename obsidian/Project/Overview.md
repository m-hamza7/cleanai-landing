---
tags:
  - cleanai
  - project
  - fyp
aliases:
  - Project Overview
---

# Overview

CleanAI is an **AI-powered urban waste management and flood-prevention platform**, scoped for cities like **Karachi, Pakistan**. It is a **BCS-7E Final Year Project** at **NUCES – FAST** (academic use; not a commercial product).

## Elevator pitch

Citizens photograph illegal dumping with GPS. A **YOLOv8** model classifies waste type and severity. City admins triage reports, schedule pickups, and assign drivers. Drivers upload geotagged completion proof. Citizens confirm or reject the cleanup — closing the feedback loop.

## Goals

1. Make waste reporting fast and location-aware
2. Automate first-pass waste classification with computer vision
3. Give admins a live operational picture (map + statuses)
4. Coordinate field cleanup through a driver workflow
5. Reduce drainage blockage risk linked to monsoon flooding

## What ships today

| Capability | Status |
|------------|--------|
| Landing + research pages | Live |
| Citizen signup/login + report upload | Live |
| Admin dashboard + report management | Live |
| Driver register/login + job completion | Live |
| YOLO classify microservice | Live |
| PostgreSQL / Supabase persistence | Live |
| Satellite verification / rich geospatial zones | Schema only / roadmap |

## System personas

- [[Citizen Portal]] — report & confirm
- [[Admin Dashboard]] — triage & assign
- [[Driver Portal]] — execute & prove

## See also

- [[Problem Statement]]
- [[System Architecture]]
- [[Team]]
- [[Tech Stack]]
