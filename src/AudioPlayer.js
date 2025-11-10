import Gst from 'gi://Gst';

export class AudioPlayer {
    constructor() {
        this.pipeline = null;
    };

    /**
     * Starts playing an audio file.
     * @param {string} file - The absolute file path to the audio file to play.
     */
    play(file) {
        if (!Gst.is_initialized()) {
            try {
                Gst.init(null);
            } catch(e) {
                console.error('Failed to initialize Gst!', e);
                return;
            }
        }

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