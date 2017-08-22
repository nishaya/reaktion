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

  startRecording(enableMonitor: boolean = false) {
    if (enableMonitor) {
      this.monitor = ctx.createMediaStreamSource(this.stream)
      this.monitor.connect(ctx.destination)
    }
    this.mediaRecorder.start()
  }

  stopRecording() {
    console.log('stop recording')
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
    console.log('initMediaRecorder', stream)

    this.mediaRecorder = new MediaRecorder(this.stream, this.options)
    this.mediaRecorder.addEventListener('dataavailable', (e) => {
      if (e.data.size > 0) {
        console.log('recoring', e.data.size, e.data)
        this.chunks.push(e.data)
      }
    })

    this.mediaRecorder.addEventListener('stop', () => {
      console.log('recorder stopped.')
      const url = new Blob(this.chunks)
      console.log(this.chunks)

      const source = ctx.createBufferSource()
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        const arrayBuffer = e.target.result
        console.log('arrayBuffer', arrayBuffer)
        ctx.decodeAudioData(arrayBuffer)
          .then((decodedData) => {
            console.log('decoded', decodedData)
            this.onAudioBufferCaptured(decodedData)
            source.buffer = decodedData
            source.connect(ctx.destination)
            source.start(0)
          })
      }

      fileReader.readAsArrayBuffer(url)
    })

    this.startRecording()
  }
}
