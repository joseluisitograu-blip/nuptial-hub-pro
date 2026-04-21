import { UtensilsCrossed } from "lucide-react";

interface Props {
  starters: string;
  mains: string;
  desserts: string;
}

const WeddingMenu = ({ starters, mains, desserts }: Props) => {
  if (!starters && !mains && !desserts) {
    return (
      <div className="py-24 bg-secondary text-center">
        <UtensilsCrossed className="w-10 h-10 text-sand-dark mx-auto mb-4 opacity-30" />
        <p className="text-muted-foreground font-light">El menú aún no está disponible.</p>
      </div>
    );
  }

  const sections = [
    { title: "Entrantes", items: starters },
    { title: "Platos principales", items: mains },
    { title: "Postres", items: desserts },
  ].filter((s) => s.items);

  return (
    <div className="py-24 bg-secondary">
      <div className="container max-w-2xl">
        <div className="text-center mb-16">
          <UtensilsCrossed className="w-8 h-8 text-sand-accent mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">Menú</h2>
        </div>
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="text-center">
              <h3 className="font-heading text-2xl text-foreground mb-4">{section.title}</h3>
              <div className="space-y-2">
                {section.items.split("\n").filter(Boolean).map((item, i) => (
                  <p key={i} className="text-muted-foreground font-light">{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeddingMenu;
