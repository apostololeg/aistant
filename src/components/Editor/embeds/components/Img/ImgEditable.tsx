import { useCallback, useEffect, useRef, useState } from 'react';

import { bus } from '../../../Editor.helpers';

import Img from './Img';
import { FILES_TO_UPLOAD } from './Img.helpers';
import S from './ImgEditable.styl';

const loadImgWithTetries = (src, retries = 5): Promise<void> =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      if (retries) {
        setTimeout(() => {
          loadImgWithTetries(src, retries - 1).then(resolve);
        }, 1000);
      } else {
        resolve();
      }
    };
    img.src = src;
  });

type Props = {
  photoKey?: string;
  uploadKey?: string;
};

export default function ImgEditable({ photoKey, uploadKey = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const [progress, setProgress] = useState(0);
  const [key, setKey] = useState(photoKey ?? '');

  const onProgress = useCallback(e => setProgress(e.loaded / e.total), []);

  const updateKey = useCallback(key => {
    const wrapper = ref.current?.closest('[data-props]');
    const propsAttr = wrapper?.getAttribute('data-props');
    const propsObj = propsAttr ? JSON.parse(propsAttr) : {};

    propsObj.photoKey = key;
    wrapper?.setAttribute('data-props', JSON.stringify(propsObj));

    setKey(key);
  }, []);

  const isEmpty = !key;

  return (
    // @ts-ignore
    <div className={S.root} ref={ref}>
      {isEmpty ? 'Select image' : <Img photoKey={key} />}
      <div className={S.progress} style={{ width: `${progress * 100}%` }} />
      <input
        type="file"
        accept="image/*,video/*"
        maxLength={1}
        title={isEmpty ? 'Select' : 'Change'}
      />
    </div>
  );
}
