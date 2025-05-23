import React, { useState } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface CustomImageProps extends Omit<NextImageProps, 'src'> {
  src?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

const CustomImage: React.FC<CustomImageProps> = React.memo(
  ({ src, alt, fallbackSrc = '/default-image.png', width = 64, height = 64, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src && src.trim() !== '' ? src : fallbackSrc);

    return (
      <NextImage
        src={imgSrc || fallbackSrc}
        alt={alt || ''}
        width={width}
        height={height}
        onError={() => setImgSrc(fallbackSrc)}
        {...props}
      />
    );
  }
);

CustomImage.displayName = 'CustomImage';

export default CustomImage;
