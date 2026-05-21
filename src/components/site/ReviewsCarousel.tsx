import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

const SAMPLE_REVIEWS: Review[] = [
  {
    author: "Erik Svensson",
    rating: 5,
    text: "Fantastisk service och mycket bra produkter. KJK levererade exakt vad vi behövde för vårt lager. Rekommenderas varmt!",
    date: "2 veckor sedan",
  },
  {
    author: "Sofia Andersson",
    rating: 5,
    text: "Professionell installation och mycket kunnig personal. Högt arbetade och säker lagerinstallation. Mycket nöjd!",
    date: "1 månad sedan",
  },
  {
    author: "Magnus Johansson",
    rating: 5,
    text: "Vi har arbetat med KJK i flera år. Deras kompetens inom lagerinredning är oslagbar. Alltid pålitliga!",
    date: "1 månad sedan",
  },
  {
    author: "Anna Bergström",
    rating: 5,
    text: "Bra priser på begagnad lagerinredning. Snabba leveranser och bra kvalitet. Mycket rekommenderat!",
    date: "2 månader sedan",
  },
  {
    author: "Per Lindqvist",
    rating: 5,
    text: "Utmärkt kundservice. De hjälpte oss med projektering från A till Z. Väl värt pengarna!",
    date: "2 månader sedan",
  },
];

export function ReviewsCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
      >
        {SAMPLE_REVIEWS.map((review, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full sm:w-96 snap-start bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{review.author}</h3>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-charcoal text-bone hover:bg-charcoal/80 rounded-full p-2 transition-colors z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-charcoal text-bone hover:bg-charcoal/80 rounded-full p-2 transition-colors z-10"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
