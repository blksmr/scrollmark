import { useRef } from "react";
import { useScrowl } from "scrowl";

const DEMO_SECTIONS = ["section-1", "section-2", "section-3", "section-4"];

export function Demo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeId, registerRef, scrollToSection } = useScrowl(DEMO_SECTIONS, containerRef);

  return (
    <div className="demo">
      <div className="flex h-full gap-6">
        <aside className="flex-shrink-0 w-48">
          <nav className="flex flex-col gap-2">
            {DEMO_SECTIONS.map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`px-4 py-2 rounded text-sm text-left transition-colors ${
                  activeId === id
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {id.replace("section-", "Section ")}
                {activeId === id && " ✓"}
              </button>
            ))}
          </nav>
        </aside>

        <div ref={containerRef} className="flex-1 overflow-y-auto">
          <section
            id="section-1"
            ref={registerRef("section-1")}
            className="py-12 px-6 bg-blue-50 rounded mb-4"
          >
            <h3 className="text-lg font-medium mb-2">Section 1</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Scroll pour voir la section active changer dans le menu.
            </p>
            <p className="text-sm mb-4">
              Cette section est relativement courte pour démontrer que chaque section peut avoir une
              hauteur différente.
            </p>
            <p className="text-sm">Le hook scrowl fonctionne avec des sections de toutes tailles.</p>
          </section>

          <section
            id="section-2"
            ref={registerRef("section-2")}
            className="py-12 px-6 bg-green-50 rounded mb-4"
          >
            <h3 className="text-lg font-medium mb-2">Section 2</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Section active : <strong>{activeId || "aucune"}</strong>
            </p>
            <p className="text-sm mb-4">
              Cette section est beaucoup plus longue que la première. Elle contient plus de contenu
              pour montrer comment scrowl gère les sections avec des hauteurs variables.
            </p>
            <div className="space-y-3 mb-4">
              <p className="text-sm">• Point 1 : Détection automatique de la section visible</p>
              <p className="text-sm">• Point 2 : Mise à jour en temps réel du menu</p>
              <p className="text-sm">• Point 3 : Support des hauteurs variables</p>
              <p className="text-sm">• Point 4 : Performance optimisée avec RAF</p>
              <p className="text-sm">• Point 5 : Hysteresis pour éviter les changements brusques</p>
            </div>
            <p className="text-sm mb-4">
              Même avec beaucoup de contenu, le hook scrowl reste performant et réactif. Vous pouvez
              scroller ou cliquer sur les boutons du menu pour naviguer.
            </p>
            <p className="text-sm">
              Chaque section peut avoir sa propre hauteur, et scrowl s'adapte automatiquement.
            </p>
          </section>

          <section
            id="section-3"
            ref={registerRef("section-3")}
            className="py-12 px-6 bg-purple-50 rounded mb-4"
          >
            <h3 className="text-lg font-medium mb-2">Section 3</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cliquez sur les boutons du menu à gauche pour faire défiler vers chaque section.
            </p>
            <p className="text-sm mb-4">
              Cette section a une hauteur moyenne, entre la première (courte) et la deuxième
              (longue).
            </p>
            <p className="text-sm mb-4">
              Le hook scrowl détecte automatiquement quelle section est visible et met à jour le menu
              en conséquence, peu importe la taille de chaque section.
            </p>
            <p className="text-sm">
              C'est parfait pour créer des interfaces avec des sections de contenu de longueurs
              différentes.
            </p>
          </section>

          <section
            id="section-4"
            ref={registerRef("section-4")}
            className="py-12 px-6 bg-orange-50 rounded"
          >
            <h3 className="text-lg font-medium mb-2">Section 4</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Une quatrième section pour montrer que le système fonctionne avec plusieurs sections.
            </p>
            <p className="text-sm">
              Cette section est également de taille variable et s'intègre parfaitement dans le
              système de scroll spy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
