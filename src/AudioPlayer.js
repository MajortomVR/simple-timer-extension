import Gst from 'gi://Gst';

export class AudioPlayer {
    constructor() {
        this.pipeline = null;
        this.busMessageID = null;
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

        const bus = this.pipeline.get_bus();
        bus.add_signal_watch();
        this.busMessageID = bus.connect('message', (_bus, message) => {
            if (message.type === Gst.MessageType.EOS) {
                this.stop();
            } else if (message.type === Gst.MessageType.ERROR) {
                const [error] = message.parse_error();
                console.error('Failed to play alert sound!', error);
                this.stop();
            }
        });

        this.pipeline.set_state(Gst.State.PLAYING);
    }

    /**
     *  Stops the current playback.
     */
    stop() {
        if (this.pipeline) {
            const bus = this.pipeline.get_bus();
            bus.disconnect(this.busMessageID);
            bus.remove_signal_watch();
            this.busMessageID = null;

            this.pipeline.set_state(Gst.State.NULL);
            this.pipeline = null;
        }
    }
};
