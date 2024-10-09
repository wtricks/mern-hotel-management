import React, { useState } from 'react';
import Button from '../../common/Button';

interface Feedback {
    comment: string;
    rating: number;
}

interface FeedbackFormProps {
    onSubmit: (feedback: Feedback) => void;
    loading: boolean
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, loading }) => {
    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number>(0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Prepare feedback data
        const feedback: Feedback = { comment, rating };

        // Send feedback back to parent
        onSubmit(feedback);

        // Clear form
        setComment('');
        setRating(0);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 rounded">
            <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Comment:
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your comment"
                    required
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                    Rating:
                </label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value={0}>Select a rating</option>
                    <option value={1}>1 - Very bad</option>
                    <option value={2}>2 - Bad</option>
                    <option value={3}>3 - Average</option>
                    <option value={4}>4 - Good</option>
                    <option value={5}>5 - Excellent</option>
                </select>
            </div>

            <Button type="submit" loading={loading}>
                Submit Feedback
            </Button>
        </form>
    );
};

export default FeedbackForm;
