const DressCodeSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container max-w-2xl text-center">
        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
          Código de vestimenta
        </h2>
        <p className="text-muted-foreground font-light mb-8">
          Elegante / Cóctel
        </p>
        <div className="flex justify-center gap-4">
          {["#f0ebe3", "#c9b99a", "#8b7355", "#3d2e1f", "#1a1510"].map((color) => (
            <div
              key={color}
              className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-border shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <p className="text-muted-foreground text-sm font-light mt-6 max-w-md mx-auto">
          Os sugerimos tonos tierra y neutros para mantener la armonía del día.
        </p>
      </div>
    </section>
  );
};

export default DressCodeSection;
