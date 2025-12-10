// TypeScript declarations for Document Picture-in-Picture API
// Reference: https://wicg.github.io/document-picture-in-picture/

interface DocumentPictureInPicture extends EventTarget {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
  readonly window: Window | null;
}

interface Window {
  documentPictureInPicture?: DocumentPictureInPicture;
}
