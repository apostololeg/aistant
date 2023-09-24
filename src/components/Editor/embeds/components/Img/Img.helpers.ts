import fileURL from 'tools/fileURL';

export const FILES_TO_UPLOAD = {}; // [uploadKey]: file

export const buildURL = key => fileURL.build('photos', key, 'l') ?? '';

export const loadImgWithTetries = (src, retries = 5): Promise<void> =>
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
