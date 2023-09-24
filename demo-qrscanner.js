// import QrScanner from './qr-scanner.min.js';
window.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  // https://www.npmjs.com/package/qr-scanner

  const videoElement = document.getElementById('qr-video');
  // const canvasElement = document.getElementById('qr-canvas');
  // const canvasContext = canvasElement.getContext('2d', { alpha: false, desynchronized: false, willReadFrequently: true });
  const messageElement = document.getElementById('qr-message');

  if (!(await QrScanner.hasCamera())) {
    messageElement.textContent = 'Unable to access camera (please make sure you have a webcam enabled)';
    return;
  }

  const handleScan = (result) => {
    if (result.data) {
      messageElement.innerText = `QR code" ${result.data}`;
      qrScanner.stop();
      qrScanner.destroy();
    } else {
      messageElement.innerText = 'No QR code';
    }
  };

  const scannerOptions = {
    // onDecodeError: () => {},
    preferredCamera: 'environment',
    maxScansPerSecond: 10,
    highlightScanRegion: true,
    highlightCodeOutline: true,
    returnDetailedScanResult: true,
  };

  const qrScanner = new QrScanner(videoElement, handleScan, scannerOptions);
  await qrScanner.start();

}, {
  capture: false,
  once: true,
  passive: true
});
