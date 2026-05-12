"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"

type MapMarker = {
	id: string
	lat: number
	lng: number
	title: string
	description?: string
}

const defaultMarkers: MapMarker[] = [
	{
		id: "karachi-center",
		lat: 24.8607,
		lng: 67.0011,
		title: "Karachi, Pakistan",
		description: "OpenStreetMap live view",
	},
]

export default function LiveMap({ markers = defaultMarkers }: { markers?: MapMarker[] }) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const mapRef = useRef<L.Map | null>(null)
	const markersLayerRef = useRef<L.LayerGroup | null>(null)

	useEffect(() => {
		if (typeof window === "undefined") return
		if (!containerRef.current || mapRef.current) return

		L.Icon.Default.mergeOptions({
			iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
			iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
			shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
		})

		const map = L.map(containerRef.current).setView([24.8607, 67.0011], 13)

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "&copy; OpenStreetMap contributors",
		}).addTo(map)

		markersLayerRef.current = L.layerGroup().addTo(map)
		mapRef.current = map

		return () => {
			map.remove()
			mapRef.current = null
			markersLayerRef.current = null
		}
	}, [])

	useEffect(() => {
		if (!mapRef.current || !markersLayerRef.current) return

		markersLayerRef.current.clearLayers()

		markers.forEach((marker) => {
			const popupContent = `
				<div>
					<p style="font-weight:600;font-size:0.875rem;margin:0 0 4px 0;">${marker.title}</p>
					${marker.description ? `<p style="font-size:0.75rem;color:#6b7280;margin:0;">${marker.description}</p>` : ""}
				</div>
			`

			L.marker([marker.lat, marker.lng])
				.bindPopup(popupContent)
				.addTo(markersLayerRef.current as L.LayerGroup)
		})
	}, [markers])

	return <div ref={containerRef} className="h-full w-full" />
}
