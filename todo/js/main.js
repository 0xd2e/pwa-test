window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const previewContainer = document.getElementById('image-preview-container');
  const expoInput = document.getElementById('expo-img');

  const clearPreview = (previewContainer) => {
      const images = previewContainer.querySelectorAll('img');
      for (const img of images) {
          URL.revokeObjectURL(img.src);
      }
      previewContainer.innerHTML = '';
  };

  const showPreview = (imageFile, previewContainer) => {
      const figure = document.createElement('figure');

      const imageSource = URL.createObjectURL(imageFile);
      const imageElement = document.createElement('img');
      imageElement.src = imageSource;
      imageElement.classList.add('img-fluid')
      const anchorElement = document.createElement('a');
      anchorElement.href = imageSource;
      anchorElement.append(imageElement);
      figure.append(anchorElement);

      const figcaption = document.createElement('figcaption');
      figcaption.innerText = `FILE NAME: ${imageFile.name}, FILE SIZE: ${Math.ceil(imageFile.size / 1000)} kilobytes`;
      figure.append(figcaption);

      previewContainer.append(figure);
  };

  // https://img.ly/blog/how-to-compress-an-image-before-uploading-it-in-javascript/
  // https://pqina.nl/blog/compress-image-before-upload/
  const processImageWithCanvas = () => {
      const inputImageFiles = expoInput.files;
      // if (!inputImageFiles || inputImageFiles.length === 0) return;
      if (!inputImageFiles?.length) return;

      clearPreview(previewContainer);

      // const event = new Event('change');
      const resultImages = new DataTransfer();

      const eventListenerOptions = {
          capture: false,
          once: true,
          passive: true
      };

      for (const imageFile of inputImageFiles) {
          if (!imageFile.type.match(/image.*/)) continue;

          const reduceImageSize = (evt) => {
              const temporaryImage = evt.target;
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              const limit = 1900;
              const quality = 0.75;
              const mimeType = 'image/jpeg';

              // Resize
              let width = temporaryImage.width;
              let height = temporaryImage.height;
              if (width > height && width > limit) {
                  height *= limit / width;
                  width = limit;
              } else if (height > limit) {
                  width *= limit / height;
                  height = limit;
              }

              canvas.width = width;
              canvas.height = height;
              // context.fillStyle = '#fff';
              // context.fillRect(0, 0, width, height);
              context.drawImage(temporaryImage, 0, 0, width, height);

              // Compress
              canvas.toBlob((imageBlob) => {
                  if (!imageBlob) return;
                  URL.revokeObjectURL(temporaryImage.src); // Release memory
                  const filename = imageFile.name.replace(/\.[^/.]+$/, '') + '.jpeg' // Change file extension
                  const options = { type: mimeType };
                  const newImageFile = new File([imageBlob], filename, options);
                  resultImages.items.add(newImageFile);
                  expoInput.files = resultImages.files; // Save results back to the file input
                  // expoInput.dispatchEvent(event); // Update preview
                  showPreview(newImageFile, previewContainer);
              }, mimeType, quality);
          };

          const reader = new FileReader();
          reader.addEventListener('load', (evt) => {
              const img = document.createElement('img');
              img.addEventListener('load', reduceImageSize, eventListenerOptions);
              img.src = URL.createObjectURL(new Blob([evt.target.result]));
          }, eventListenerOptions);
          reader.readAsArrayBuffer(imageFile);
      }
  };

  expoInput.addEventListener('change', processImageWithCanvas, false);

}, {
  capture: false,
  once: true,
  passive: true
});
