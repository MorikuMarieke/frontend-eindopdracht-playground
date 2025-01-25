import './CardTopBar.css'

export default function CardTopBar({children, cardName}) {
    return (
        <div className={`card-top-bar top-bar-${cardName}`}>
            {children}
        </div>
    )
}