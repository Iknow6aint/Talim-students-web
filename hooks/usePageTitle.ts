import { useEffect } from "react";

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const fullTitle = `${title} | Talim Student Portal`;
    document.title = fullTitle;

    // Update meta description dynamically if needed
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `${title} - Talim Student Portal`
      );
    }

    // Cleanup: Reset to default title when component unmounts
    return () => {
      document.title = "Talim Student Portal";
    };
  }, [title]);
};
