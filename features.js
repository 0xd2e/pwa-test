const contactsPropeties = ['name', 'email', 'tel', 'address', 'icon'];
const contactsOptions = { multiple: true, };
const contactsSupported = 'contact' in navigator && 'ContactManager' in window;

async function getContacts() {
  if (contactsSupported) {
    const contacts = await navigator.contacts.select(contactsPropeties, contactsOptions);
  }
}


window.navigator.geolocation.getCurrentPosition(console.log);

window.addEventListener('devicemotion', (evt) => {
  console.log(evt);
})


const idleDetectorSupported = 'IdleDetector' in window;

async function runIdleDetection() {
  const state = await IdleDetector.requestPermission();
  const detector = new IdleDetector();
  detector.addEventListener('change', (evt) => {
    const { userState, screenState } = detector;
    // if (userState === 'idle')
  });
  await detector.start({ threshold: 120000, });
}
