import { Howl } from 'howler'

class ChaosWindow {
    private overlay: HTMLElement;
    private peaceWindow: HTMLElement;
    private readonly chaosAudio: Howl | null = null;
    private readonly peaceAudio: Howl | null = null;
    private readonly chaosVideo: HTMLVideoElement | null = null;

    constructor() {
        this.peaceWindow = document.querySelector('.peace-window') as HTMLElement;
        this.overlay = document.querySelector('.start-overlay') as HTMLElement;
        this.chaosVideo = document.querySelector('.chaos-video') as HTMLVideoElement | null;

        if (this.chaosVideo) {
            this.chaosVideo.playbackRate = 0.6; // Play chaos video at 60% speed
        }

        this.chaosAudio = new Howl({
            src: ['/src/assets/media/static.mp3'],
            loop: true,
            preload: true,
            volume: 1
        });

        this.peaceAudio = new Howl({
            src: ['/src/assets/media/nature.mp3'],
            loop: true,
            preload: true,
            volume: 0
        })

        // Force a reflow
        void this.peaceWindow.offsetWidth;
        window.requestAnimationFrame(() => {
            this.peaceWindow.classList.add('loaded');
        });
    }

    init(): void {
        this.overlay.addEventListener('click', () => this.start());
        this.peaceWindow.addEventListener('click', () => this.expandPeaceWindow());
    }

    private start(): void {
        this.overlay.style.display = 'none';

        this.chaosAudio.play();
        this.peaceAudio.play();

        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    private expandPeaceWindow(): void {
        this.peaceWindow.classList.toggle('expanded');
        if (this.peaceWindow.classList.contains('expanded')) {
            this.chaosAudio.volume(0);
            this.peaceAudio.volume(1);
        }
    }

    private handleMouseMove(e: MouseEvent): void {
        if (!this.chaosAudio || !this.peaceAudio) return;
        if (this.peaceWindow.classList.contains('expanded')) return;

        const rect = this.peaceWindow.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );

        // Calculate the diagonal of the peace window
        const windowDiagonal = Math.sqrt(
            Math.pow(rect.width, 2) + Math.pow(rect.height, 2)
        ) / 2;

        // Normalize the distance
        let normalizedDistance = distance / windowDiagonal;

        // Apply a power function to create a steeper curve
        // Adjust the power (4 in this case) to make the transition more or less aggressive
        normalizedDistance = Math.pow(normalizedDistance, 4);

        // Clamp the value between 0 and 1
        normalizedDistance = Math.min(Math.max(normalizedDistance, 0), 1);

        const peaceVolume = 1 - normalizedDistance;
        const chaosVolume = normalizedDistance;

        this.peaceAudio.volume(peaceVolume);
        this.chaosAudio.volume(chaosVolume);
    }
}

export default ChaosWindow;