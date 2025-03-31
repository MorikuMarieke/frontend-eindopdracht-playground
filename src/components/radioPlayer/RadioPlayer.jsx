export default function RadioPlayer({src, height}) {
    console.log(src)
    return (
    <iframe
        id="spotifyPlayer"
        src={src}
        width="100%"
        height={height}
        frameBorder="0"
        allow="encrypted-media"
    >
    </iframe>
    );
};


