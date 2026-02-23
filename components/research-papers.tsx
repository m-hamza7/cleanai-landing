export default function ResearchPapers() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Research Papers Considered</h1>
        <div className="bg-card rounded-lg shadow border border-border p-8">
          <ul className="space-y-6">
            <li>
              <a
                href="https://www.researchgate.net/publication/371490458_Improved_flood_mapping_for_efficient_policy_design_by_fusion_of_Sentinel-1_Sentinel-2_and_Landsat-9_imagery_to_identify_population_and_infrastructure_exposed_to_floods"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-primary underline hover:text-black transition-colors"
              >
                Improved flood mapping for efficient policy design by fusion of Sentinel-1, Sentinel-2, and Landsat-9
                imagery to identify population and infrastructure exposed to floods
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                By Usman NazirZubair KhalidMomin Uppal Muhammad Waleed Tahir
              </p>
            </li>
            <li>
              <a
                href="https://nhess.copernicus.org/articles/23/3305/2023/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-primary underline hover:text-black transition-colors"
              >
                Sentinel-1-based analysis of the severe flood over Pakistan 2022
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                By Florian Roth, Bernhard Bauer-Marschallinger, Mark Edwin Tupas, Christoph Reimer, Peter Salamon, and
                Wolfgang Wagner
              </p>
            </li>
            <li>
              <a
                href="https://www.researchgate.net/publication/395871475_Extreme_Flooding_in_Pakistan_An_AI-Powered_Framework_for_Enhanced_Urban_Flood_Management_System"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-primary underline hover:text-black transition-colors"
              >
                Extreme Flooding in Pakistan: An AI-Powered Framework for Enhanced Urban Flood Management System
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                By Muhammad Yasir Zaheen, Dure Jabeen, Ali Akbar Siddiqui, and Muhammad Aamir
              </p>
            </li>
            <li>
              <a
                href="https://www.nature.com/articles/s41598-025-08461-w"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-primary underline hover:text-black transition-colors"
              >
                Intelligent waste sorting for urban sustainability using deep learning
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                By Gulzar Ahmad, Fizza Muhammad Aleem, Tahir Alyas, Qaiser Abbas, Waqas Nawaz, Taher M. Ghazal, Abdul Aziz, Saira Aleem, Nadia Tabassum & Aidarus Mohamed Ibrahim
              </p>
            </li>
            {/* Add more papers as needed */}
          </ul>
        </div>
      </div>
    </main>
  )
}
