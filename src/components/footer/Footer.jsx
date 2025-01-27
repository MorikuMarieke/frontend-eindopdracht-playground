import './Footer.css'
import OuterContainer from '../outerContainer/OuterContainer.jsx';

export default function Footer() {
    return (
        <footer>
            <OuterContainer type="footer">
                <div className="inner-container">
                    <p>I have created this application as my final assignment for NOVI Hogeschool for Frontend</p>
                </div>
            </OuterContainer>
        </footer>
    )
}