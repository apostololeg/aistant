import { useEffect, useState } from 'react';

import { buildURL, loadImgWithTetries } from './Img.helpers';

import S from './Img.styl';

type Props = {
  photoKey?: string;
};

export default function Img({ photoKey }: Props) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (photoKey) {
      const url = buildURL(photoKey);
      loadImgWithTetries(url).then(() => setSrc(url));
    }
  }, [photoKey]);

  if (!src) return null;

  return <img src={src} className={S.root} />;
}
