import './CardTopBar.css'

export default function CardTopBar({children, cardName, color}) {
    return (
        <div className={`card-top-bar ${cardName ? `top-bar-${cardName}` : ''} color-${color}`}>
            {children}
        </div>
    )
}