// @flow

type RecordingOptions = {
  mimeType: string,
  audioBitsPerSecond: number,
}

const defaultRecordingOptions: RecordingOptions = {
  mimeType: 'video/webm;codecs=vp8',
  audioBitsPerSecond: 128000,
}

export default class Recorder {
  chunks: Array<any>
  options: RecordingOptions
  mediaRecorder: MediaRecorder

  constructor(options: RecordingOptions = {}) {
    this.options = { ...defaultRecordingOptions, ...options }
    console.log('Recorder initialized', this.options)
    const { mimeType } = this.options
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      throw new Error(`MIME Type ${mimeType} is not supported by Recorder`)
    }
  }

  prepare() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream: MediaStream) => this.initMediaRecorder(stream))
  }

  initMediaRecorder(stream: MediaStream) {
    console.log('initMediaRecorder', stream)
    this.mediaRecorder = new MediaRecorder(stream, this.options)
  }
}
