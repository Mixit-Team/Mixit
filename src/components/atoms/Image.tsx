import React, { useState } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface CustomImageProps extends Omit<NextImageProps, 'src'> {
  src?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

const CustomImage: React.FC<CustomImageProps> = React.memo(
  ({
    src,
    alt,
    fallbackSrc = '/default-image.png',
    width = 64,
    height = 64,
    fill,
    className,
    ...props
  }) => {
    const [imgSrc, setImgSrc] = useState(src && src.trim() !== '' ? src : fallbackSrc);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
      setImgSrc(fallbackSrc);
      setIsLoading(false);
    };

    const handleLoad = () => {
      setIsLoading(false);
    };

    const imageProps = fill ? { fill: true } : { width, height };

    if (fill) {
      return (
        <NextImage
          src={imgSrc || fallbackSrc}
          alt={alt || ''}
          onError={handleError}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className || ''}`}
          {...imageProps}
          {...props}
        />
      );
    }

    return (
      <div className={className || ''}>
        <NextImage
          src={imgSrc || fallbackSrc}
          alt={alt || ''}
          width={width}
          height={height}
          onError={handleError}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          {...props}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          </div>
        )}
      </div>
    );
  }
);

CustomImage.displayName = 'CustomImage';

export default CustomImage;
