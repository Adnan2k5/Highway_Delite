import Card from "../../Components/Card";
import { Navbar } from "../../Components/Navbar";

const experiences = [
  {
    title: "Kayaking",
    location: "Udupi",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    priceLabel: "₹999",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Kayaking",
    location: "Udupi",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    priceLabel: "₹999",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Kayaking",
    location: "Udupi",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    priceLabel: "₹999",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Kayaking",
    location: "Udupi",
    description:
      "Curated small-group experience. Certified guide. Safety first with gear included.",
    priceLabel: "₹999",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
];

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full grid grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:gap-6 sm:px-8 sm:py-8 md:grid-cols-3 md:px-12 lg:grid-cols-4 lg:gap-8 lg:px-16 xl:px-24 xl:py-10">
        {experiences.map((experience, index) => (
          <Card
            key={`${experience.title}-${index}`}
            title={experience.title}
            location={experience.location}
            description={experience.description}
            priceLabel={experience.priceLabel}
            imageUrl={experience.imageUrl}
          />
        ))}
      </main>
    </div>
  );
};
