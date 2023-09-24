window.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  const videoElement = document.createElement("video");
  const canvasElement = document.getElementById("qr-canvas");
  const canvasContext = canvasElement.getContext("2d");
  const messageElement = document.getElementById("qr-message");
  let cameraStream = undefined;

  try {
    const cameraOptions = {
      video: {
        facingMode: 'environment',
      },
    };
    cameraStream = await navigator.mediaDevices.getUserMedia(cameraOptions);
    if (!cameraStream) {
      throw new Error('TODO');
    }
  } catch (err) {
    messageElement.textContent = 'Unable to access video stream (please make sure you have a webcam enabled)';
    console.error(`${err.name}\: ${err.message}`);
    return;
  }

  const drawBoundingBox = (coordinates, color) => {
    canvasContext.beginPath();
    canvasContext.moveTo(coordinates.topLeftCorner.x, coordinates.topLeftCorner.y);
    canvasContext.lineTo(coordinates.topRightCorner.x, coordinates.topRightCorner.y);
    canvasContext.lineTo(coordinates.bottomRightCorner.x, coordinates.bottomRightCorner.y);
    canvasContext.lineTo(coordinates.bottomLeftCorner.x, coordinates.bottomLeftCorner.y);
    canvasContext.lineTo(coordinates.topLeftCorner.x, coordinates.topLeftCorner.y);
    canvasContext.lineWidth = 4;
    canvasContext.strokeStyle = color;
    canvasContext.stroke();
  };

  const tick = () => {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      canvasElement.hidden = false;
      canvasElement.height = videoElement.videoHeight;
      canvasElement.width = videoElement.videoWidth;
      canvasElement.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (qrCode) {
        drawBoundingBox(code.location, '#FF3B58');
        messageElement.innerText = qrCode.data;
      } else {
        messageElement.innerText = 'No QR code';
      }
    } else {
      messageElement.innerText = 'Loading video...';
    }
    requestAnimationFrame(tick);
  }

  videoElement.srcObject = cameraStream;
  videoElement.setAttribute('playsinline', true); // Required to tell iOS Safari we don't want fullscreen
  videoElement.play();
  requestAnimationFrame(tick);

}, {
  capture: false,
  once: true,
  passive: true
});
