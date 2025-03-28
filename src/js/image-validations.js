import { SplashScreen } from '@capacitor/splash-screen';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
      <style>
        :host {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: block;
          width: 100%;
          height: 100%;
        }
        h1, h2, h3, h4, h5 {
          text-transform: uppercase;
        }
        .button {
          display: inline-block;
          padding: 10px;
          background-color: #73B5F6;
          color: #fff;
          font-size: 0.9em;
          border: 0;
          border-radius: 3px;
          text-decoration: none;
          cursor: pointer;
        }
        main {
          padding: 15px;
        }
        main hr { height: 1px; background-color: #eee; border: 0; }
        main h1 {
          font-size: 1.4em;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        main h2 {
          font-size: 1.1em;
        }
        main p {
          color: #333;
        }
        main img {
          max-width: 100%;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        }
      </style>
      <div>
        <capacitor-welcome-titlebar>
          <h1>Capacitor</h1>
        </capacitor-welcome-titlebar>
        <main>
          <p>
            Capacitor makes it easy to build powerful apps for the app stores, mobile web (PWAs), and desktop, all with a single codebase.
          </p>
          <h2>Getting Started</h2>
          <p>
            Need a UI framework? Check out <a target="_blank" href="http://ionicframework.com/">Ionic</a>.
          </p>
          <p>
            Visit <a href="https://capacitorjs.com">capacitorjs.com</a> for guides on using native features and building plugins.
          </p>
          <a href="https://capacitorjs.com" target="_blank" class="button">Read more</a>
          <h2>Tiny Demo</h2>
          <p>Take a photo or choose from the gallery:</p>
          <p>
            <button class="button" id="take-photo">Take Photo</button>
            <button class="button" id="choose-photo">Choose from Gallery</button>
          </p>
          <p>
            <img id="image" alt="Captured Image">
          </p>
        </main>
      </div>
      `;
    }

    async connectedCallback() {
      try {
        await SplashScreen.hide();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }

      const takePhotoButton = this.shadowRoot?.querySelector('#take-photo');
      const choosePhotoButton = this.shadowRoot?.querySelector('#choose-photo');
      const imageElement = this.shadowRoot?.querySelector('#image');

      if (!takePhotoButton || !choosePhotoButton || !imageElement) {
        console.error('Required elements not found.');
        return;
      }

      takePhotoButton.addEventListener('click', async () => {
        await this.takePhoto(imageElement, CameraSource.Camera);
      });

      choosePhotoButton.addEventListener('click', async () => {
        await this.takePhoto(imageElement, CameraSource.Photos);
      });

      // Check and request permissions on app start
      await this.checkPermissions();
    }

    async checkPermissions() {
      try {
        const permission = await Camera.requestPermissions();
        console.log('Camera permissions:', permission);
      } catch (error) {
        console.warn('Error requesting camera permissions:', error);
      }
    }

    async takePhoto(imageElement, source) {
      try {
        const permission = await Camera.requestPermissions();
        if (permission.camera !== 'granted' && source === CameraSource.Camera) {
          console.warn('Camera permission denied');
          return;
        }

        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: source, // Dynamic source: Camera or Gallery
          quality: 90,
        });

        if (photo.webPath) {
          imageElement.src = photo.webPath;
        } else {
          console.warn('No photo captured.');
        }
      } catch (error) {
        console.warn('Error capturing photo:', error);
      }
    }
  }
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
      <style>
        :host {
          position: relative;
          display: block;
          padding: 15px;
          text-align: center;
          background-color: #73B5F6;
        }
        ::slotted(h1) {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 0.9em;
          font-weight: 600;
          color: #fff;
        }
      </style>
      <slot></slot>
      `;
    }
  }
);
