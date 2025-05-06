import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const Image: React.FC<ImageProps> = React.memo(
  ({ src, alt, fallbackSrc = '/default-image.png', ...props }) => (
    <img
      src={src && src.trim() !== '' ? src : fallbackSrc}
      alt={alt}
      onError={e => {
        const target = e.target as HTMLImageElement;
        if (target.src !== fallbackSrc && !target.src.endsWith(fallbackSrc)) {
          target.src = fallbackSrc;
        }
      }}
      {...props}
    />
  )
);

Image.displayName = 'Image';

export default Image;
