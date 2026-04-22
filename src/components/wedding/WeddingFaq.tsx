import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, ChevronDown } from "lucide-react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

const WeddingFaq = ({ weddingId }: { weddingId: string }) => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("faqs")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order");
      setFaqs((data as Faq[]) || []);
      setLoading(false);
    };
    fetch();
  }, [weddingId]);

  if (loading) return <div className="py-24 text-center text-muted-foreground">Cargando...</div>;

  if (faqs.length === 0) return null;

  return (
    <div className="py-24 bg-background">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">Preguntas frecuentes</h2>
          <p className="text-muted-foreground font-light">Todo lo que necesitas saber</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <button
                key={faq.id}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full text-left bg-card border border-border rounded-xl p-5 transition-all hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading text-base text-foreground">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isOpen && (
                  <p className="text-sm text-foreground/70 mt-3 font-light leading-relaxed">{faq.answer}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeddingFaq;
