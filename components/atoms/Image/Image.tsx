import NextImage from 'next/image';

interface Props {
  src: string;
  alt: string;
  priority?: boolean;
  height: number;
  width: number;
  className?: string;
}

const Image = ({ src, alt, height, width, priority, className }: Props) => {
  const imageProps = {
    src,
    alt,
    height,
    width,
    layout: 'responsive',
  };

  return (
    <NextImage {...imageProps} priority={priority} className={className} />
  );
};

export default Image;
