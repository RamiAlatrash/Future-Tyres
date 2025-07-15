import useAuth from '@/hooks/useAuth';

const ReviewsSection = () => {
  const { user } = useAuth();

  // This is a placeholder component to resolve a build error.
  // Replace with your actual reviews implementation.

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 font-orbitron">Customer Reviews</h2>
      <div className="text-center">
        <p>Reviews are not available at the moment.</p>
        {user && <p>You are logged in as {user.name}.</p>}
      </div>
    </div>
  );
};

export default ReviewsSection;
