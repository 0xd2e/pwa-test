import QrScanner from './qr-scanner.min.js';
window.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  // https://www.npmjs.com/package/qr-scanner
  // https://nimiq.github.io/qr-scanner/demo/

  const videoElement = document.getElementById('qr-video');
  // const canvasElement = document.getElementById('qr-canvas');
  // const canvasContext = canvasElement.getContext('2d', { alpha: false, desynchronized: false, willReadFrequently: true });
  const messageElement = document.getElementById('qr-message');

  if (!(await QrScanner.hasCamera())) {
    messageElement.textContent = 'Unable to access camera (please make sure you have a webcam enabled)';
    return;
  }

  const handleScan = (result) => {
    if (!result?.data) return;
    messageElement.innerText = `QR code" ${result.data}`;
    qrScanner.stop();
    qrScanner.destroy();
  };

  const scannerOptions = {
    onDecodeError: (err) => {
      messageElement.innerText = 'No QR code';
      console.error('' + err);
    },
    preferredCamera: 'environment',
    maxScansPerSecond: 10,
    highlightScanRegion: false,
    highlightCodeOutline: false,
    returnDetailedScanResult: true,
  };

  const qrScanner = new QrScanner(videoElement, handleScan, scannerOptions);
  qrScanner.$video.style.display = 'none';
  qrScanner.$overlay?.style.display = 'none';
  document.getElementById('qr-scan-region').appendChild(qrScanner.$canvas);
  await qrScanner.start();

}, {
  capture: false,
  once: true,
  passive: true
});
