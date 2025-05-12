const canvas = document.getElementById('canvas');
const processed = document.getElementById('processed');
const context = canvas.getContext('2d');

let videoStream;

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    // video elementi kullanmayacağımız için doğrudan stream içinden frame alacağız
    videoStream = document.createElement('video');
    videoStream.srcObject = stream;
    videoStream.play();

    videoStream.onloadedmetadata = () => {
      setInterval(captureAndSend, 100);
    };
  });

function captureAndSend() {
  if (!videoStream.videoWidth) return;

  canvas.width = videoStream.videoWidth;
  canvas.height = videoStream.videoHeight;
  context.drawImage(videoStream, 0, 0);

  const imageData = canvas.toDataURL('image/jpeg');

  fetch('/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData })
  })
    .then(response => response.json())
    .then(data => {
      processed.src = data.image; // sadece işlenmiş görüntüyü gösteriyoruz
    });
}
