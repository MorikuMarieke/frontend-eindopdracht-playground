import './CardTopBar.css'

export default function CardTopBar({children, cardName, color}) {
    return (
        <div className={`card-top-bar top-bar-${cardName} color-${color}`}>
            {children}
        </div>
    )
}