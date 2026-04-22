import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";

interface Story {
  id: string;
  title: string;
  description: string;
  story_date: string;
  sort_order: number;
}

const WeddingStory = ({ weddingId }: { weddingId: string }) => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    supabase
      .from("wedding_stories")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("sort_order")
      .then(({ data }) => setStories((data as Story[]) || []));
  }, [weddingId]);

  if (stories.length === 0) return null;

  return (
    <div className="py-24 bg-background">
      <div className="container max-w-3xl">
        <h2 className="font-heading text-4xl md:text-5xl text-foreground text-center mb-16">
          Nuestra Historia
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border" />

          {stories.map((story, i) => (
            <div
              key={story.id}
              className={`relative flex items-start gap-6 mb-12 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-sand-accent border-2 border-background z-10 mt-2" />

              {/* Content */}
              <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                {story.story_date && (
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">
                    {story.story_date}
                  </span>
                )}
                <h3 className="font-heading text-xl text-foreground mt-1">{story.title}</h3>
                {story.description && (
                  <p className="text-muted-foreground font-light mt-2 leading-relaxed">
                    {story.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeddingStory;
