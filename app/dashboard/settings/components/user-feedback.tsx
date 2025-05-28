"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function UserFeedBack() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // TODO: Implement actual feedback submission logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setSubmitStatus("success");
      setFeedback("");
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-start justify-start w-full lg:w-[534px] p-5 space-y-5 shadow-xl rounded-xl border-2">
        <p className="text-xl font-medium mt-[2rem] text-start">
          Feedback and Help
        </p>

        <div className="w-full p-4 border-b-2">
          <p className="font-medium">Contact Support</p>
          <p className="text-gray-600">snrdev@gmail.com</p>
        </div>

        <div className="w-full p-4">
          <p className="font-medium mb-4">Provide Feedback</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report any issues..."
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none "
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
            {submitStatus === "success" && (
              <p className="text-green-600">Thank you for your feedback!</p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-600">
                Failed to submit feedback. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default UserFeedBack;
