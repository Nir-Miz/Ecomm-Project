import styles from './Footer.module.css';

// Functional component for the website footer section
const Footer = () => {
    return (
        <footer className={styles.footer}>
            {/* Copyright information with dynamic current year */}
            <p>
                &copy; {new Date().getFullYear()} GadgetGear Shop. All rights reserved.
            </p>

            {/* Navigation links to important informational pages */}
            <div className={styles.links}>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a href="/privacy">Privacy</a>
            </div>
        </footer>
    );
};

export default Footer;
