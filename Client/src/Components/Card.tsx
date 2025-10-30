import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type CardProps = {
  title: string;
  location: string;
  description: string;
  priceLabel: string;
  ctaLabel?: string;
  imageUrl: string;
  id: string;
};

const Card: FC<CardProps> = ({
  title,
  location,
  description,
  priceLabel,
  ctaLabel = "View Details",
  imageUrl,
  id,
}) => {
  const navigate = useNavigate();
  return (
    <article className="w-full overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-4 bg-[#F0F0F0] p-6">
        <header className="flex items-center justify-between gap-3">
          <h3 className="text-[16px] font-medium text-gray-900">{title}</h3>
          <span className="rounded-sm bg-[#D6D6D6] px-3 py-1 text-sm font-medium text-gray-700">
            {location}
          </span>
        </header>

        <p className="text-[12px] font-normal  text-gray-700">{description}</p>

        <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <div className="w-full text-sm text-gray-600 flex flex-col md:flex-row md:items-center md:justify-between gap-1.5">
            <div className="price">
              <span className="block text-xs uppercase tracking-wide text-gray-500">
                From
              </span>
              <span className="text-[20px] font-medium text-gray-900">
                {priceLabel}
              </span>
            </div>
            <button
              onClick={() => navigate(`/experience/${id}`)}
              type="button"
              className="rounded-sm bg-[#fbc02d] px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-[#f5b400] w-full sm:w-auto sm:px-3 sm:text-xs md:px-4 md:text-sm lg:px-6"
            >
              {ctaLabel}
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default Card;
