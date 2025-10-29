import Card from "../../Components/Card";
import { Navbar } from "../../Components/Navbar";
import { useEffect, useState } from "react";
import { experienceService } from "../../api";

type Experience = {
  title: string;
  location: string;
  description: string;
  priceLabel: string;
  imageUrl: string;
  dates: string[];
  slots: string[];
  id: string;
};

export const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await experienceService.getAll();
      const formattedExperiences = response.map((exp) => ({
        title: exp.title,
        location: exp.location,
        description: exp.description,
        priceLabel: exp.price === 0 ? "Free" : `$${exp.price}`,
        imageUrl: exp.imageUrl,
        dates: exp.dates.map((date) => date.toString()),
        slots: exp.slots,
        id: exp._id || "",
      }));
      setExperiences(formattedExperiences);
    } catch (error) {
      setError("Failed to load experiences. Please try again later.");
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full grid grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:gap-6 sm:px-8 sm:py-8 md:grid-cols-3 md:px-12 lg:grid-cols-4 lg:gap-8 lg:px-16 xl:px-24 xl:py-10">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="col-span-full flex flex-col justify-center items-center py-20">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button
              onClick={fetchExperiences}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          experiences.map((experience, index) => (
            <Card
              key={`${experience.id}-${index}`}
              title={experience.title}
              location={experience.location}
              description={experience.description}
              priceLabel={experience.priceLabel}
              imageUrl={experience.imageUrl}
              id={experience.id}
            />
          ))
        )}
      </main>
    </div>
  );
};
