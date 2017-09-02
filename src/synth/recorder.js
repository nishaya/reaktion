// @flow

const ctx: AudioContext = new window.AudioContext()

type RecordingOptions = {
  mimeType: string,
  audioBitsPerSecond: number,
}

const defaultRecordingOptions: RecordingOptions = {
  mimeType: 'video/webm;codecs=vp8',
  audioBitsPerSecond: 128000,
}

export default class Recorder {
  chunks: Array<any> = []
  options: RecordingOptions
  mediaRecorder: MediaRecorder
  stream: MediaStream
  monitor: MediaStreamAudioSourceNode
  onAudioBufferCaptured: (buffer: AudioBuffer) => void = buffer => console.log('onAudioBufferCaptured', buffer)

  constructor() {
    this.options = { ...defaultRecordingOptions }
    const { mimeType } = this.options
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      throw new Error(`MIME Type ${mimeType} is not supported by Recorder`)
    }
  }

  prepare() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream: MediaStream) => this.initMediaRecorder(stream))
  }

  startRecording(enableMonitor: boolean = false) {
    if (enableMonitor) {
      this.monitor = ctx.createMediaStreamSource(this.stream)
      this.monitor.connect(ctx.destination)
    }
    this.chunks = []
    this.mediaRecorder.start()
  }

  stopRecording() {
    if (this.monitor) {
      this.monitor.disconnect(ctx.destination)
      delete this.monitor
    }
    this.mediaRecorder.stop()
  }

  destroy() {
    delete this.mediaRecorder
    if (this.stream) {
      this.stream.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.stop()
      })
    }
  }

  initMediaRecorder(stream: MediaStream) {
    this.stream = stream

    this.mediaRecorder = new MediaRecorder(this.stream, this.options)
    this.mediaRecorder.addEventListener('dataavailable', (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data)
      }
    })

    this.mediaRecorder.addEventListener('stop', () => {
      const blob: Blob = this.chunks.length === 1 ? this.chunks[0] : new Blob(this.chunks)

      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        const arrayBuffer = e.target.result
        ctx.decodeAudioData(arrayBuffer)
          .then((decodeAudioBuffer: AudioBuffer) => {
            this.onAudioBufferCaptured(decodeAudioBuffer)
          })
      }

      fileReader.readAsArrayBuffer(blob)
    })

    this.startRecording()
  }
}
