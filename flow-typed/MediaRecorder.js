// @flow

declare export class MediaRecorder {
  static isTypeSupported: (mimeType: string) => boolean;

  start: () => void;
  stop: () => void;
  addEventListener: (event: string, any => any) => void;
}
