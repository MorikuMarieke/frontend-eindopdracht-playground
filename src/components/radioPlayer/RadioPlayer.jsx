

export default function RadioPlayer({src}) {
    console.log(src)
    return (
    <iframe
        id="spotifyPlayer"
        src={src}
        width="100%"
        height="80px"
        frameBorder="0"
        allow="encrypted-media">
    </iframe>
    );
};


