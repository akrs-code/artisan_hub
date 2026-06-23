import { Star } from 'lucide-react';


const getMockReviews = (productId) => [
  {
    id: `${productId}_r1`,
    name: 'Maria Santos',
    date: 'May 28, 2026',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    text: 'Absolutely beautiful! The speckled glaze is even more stunning in person. I love that each one is unique.',
  },
  {
    id: `${productId}_r2`,
    name: 'James Reyes',
    date: 'May 14, 2026',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    text: 'Great quality and fast shipping. The packaging was also thoughtful — no damage at all. Will definitely order again.',
  },
  {
    id: `${productId}_r3`,
    name: 'Ana Cruz',
    date: 'Apr 30, 2026',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
    text: 'Love the craftsmanship. Slightly smaller than I expected but still a great buy.',
  },
];

export const ProductReviews = ({ product }) => {
  const reviews = getMockReviews(product._id);

  return (
    <div className="mb-8">
      <h2 className="page-title mb-4">Customer Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="ec-card p-5 flex flex-col gap-3"
          >
            {/* Reviewer info */}
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs font-sans font-bold text-foreground leading-tight">{review.name}</p>
                <p className="text-[10px] text-muted-foreground font-sans">{review.date}</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted/30'}`}
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-xs font-body text-muted-foreground leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
