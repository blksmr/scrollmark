import { SECTIONS } from "@/constants";

type BottomNavProps = {
  activeId: string | null;
  onNavClick: (sectionId: string) => void;
};

export function BottomNav({ activeId, onNavClick }: BottomNavProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    onNavClick(sectionId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none">
      <nav
        className="p-2 px-1.5 bg-background border rounded-full shadow-sm pointer-events-auto"
        style={{ borderColor: "rgba(0, 0, 0, 0.08)" }}
      >
        <ul className="flex gap-1 text-sm">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                  activeId === section.id
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
