import Card from "../../Components/Card";
import { Navbar } from "../../Components/Navbar";
import { useEffect, useState, useCallback } from "react";
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
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchExperiences = useCallback(async () => {
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
      setAllExperiences(formattedExperiences);
      setFilteredExperiences(formattedExperiences);
    } catch (error) {
      setError("Failed to load experiences. Please try again later.");
      setAllExperiences([]);
      setFilteredExperiences([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterExperiences = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setFilteredExperiences(allExperiences);
        return;
      }

      const filtered = allExperiences.filter((experience) => {
        const searchTerm = query.toLowerCase();
        return experience.title.toLowerCase().includes(searchTerm);
      });

      setFilteredExperiences(filtered);
    },
    [allExperiences]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      filterExperiences(query);
    },
    [filterExperiences]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setFilteredExperiences(allExperiences);
  }, [allExperiences]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);
  return (
    <div className="min-h-screen">
      <Navbar onSearch={handleSearch} onClearSearch={handleClearSearch} />
      <main className="w-full grid grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:gap-6 sm:px-8 sm:py-8 md:grid-cols-3 md:px-12 lg:grid-cols-4 lg:gap-8 lg:px-16 xl:px-24 xl:py-10">
        {searchQuery && (
          <div className="col-span-full mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <span>Searching for: "{searchQuery}"</span>
              <button
                onClick={handleClearSearch}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Clear search
              </button>
            </div>
          </div>
        )}
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="col-span-full flex flex-col justify-center items-center py-20">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button
              onClick={() => fetchExperiences()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="col-span-full flex flex-col justify-center items-center py-20">
            <div className="text-gray-600 text-lg mb-4">
              {searchQuery
                ? `No experiences found for "${searchQuery}"`
                : "No experiences available"}
            </div>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Show All Experiences
              </button>
            )}
          </div>
        ) : (
          filteredExperiences.map((experience, index) => (
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
