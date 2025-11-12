import React from 'react';

interface AdBannerProps {
  src: string;
  alt: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ src, alt, className }) => {
  return (
    <div className={`bg-gray-700 rounded-lg overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};
