import Gst from 'gi://Gst';

export class AudioPlayer {
    constructor() {
        Gst.init(null);
        this.pipeline = null;
    };

    /**
     * Starts playing an audio file.
     * @param {string} file - The absolute file path to the audio file to play.
     */
    play(file) {
        this.stop();

        this.pipeline = Gst.ElementFactory.make('playbin', 'player');
        this.pipeline.uri = `file://${file}`;
        this.pipeline.set_state(Gst.State.PLAYING);
    }

    /**
     *  Stops the current playback.
     */
    stop() {
        if (this.pipeline) {
            this.pipeline.set_state(Gst.State.NULL);
            this.pipeline = null;
        }
    }
};