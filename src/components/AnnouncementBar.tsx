import { useEffect, useState } from 'react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-600 overflow-hidden whitespace-nowrap relative h-10">
      <div className="animate-marquee inline-block">
        <span className="text-white font-medium px-4 py-2 inline-block">
          ✨ Make Your Dreams Come True ✨
        </span>
        <span className="text-white font-medium px-4 py-2 inline-block">
          ✨ Make Your Dreams Come True ✨
        </span>
        <span className="text-white font-medium px-4 py-2 inline-block">
          ✨ Make Your Dreams Come True ✨
        </span>
        <span className="text-white font-medium px-4 py-2 inline-block">
          ✨ Make Your Dreams Come True ✨
        </span>
      </div>
      <div className="animate-marquee2 inline-block absolute top-0">
        <span className="text-white font-medium px-4 py-2 inline-block">
          ✨ Make Your Dreams Come True ✨
        </span>
        <span className="text-white font-medium px-4 py-2 inline-block">
          ✨ Make Your Dreams Come True ✨
        </span>
        <span className="text-white font-medium px-4 py-2 inline-block">
          ✨ Make Your Dreams Come True ✨
        </span>
        <span className="text-white font-medium px-4 py-2 inline-block">
          ✨ Make Your Dreams Come True ✨
        </span>
      </div>
    </div>
  );
}
