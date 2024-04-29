import React from 'react';

import './Footer.css'; // Ensure this path is correct relative to this file

function Footer() {
    return (
        <div className="Footer">
            {/* Developed by Todd Goldfarb */}
            {/* https://github.com/Todd-C-Goldfarb */}

            A Mini-Site by <b>Todd Goldfarb</b><br />
            <a href="https://www.github.com/Todd-C-Goldfarb">Github</a> |&nbsp;
            <a href="https://www.linkedin.com/in/todd-goldfarb-5ba432208/">LinkedIn</a> |&nbsp;
            <a href="mailto:tcgoldfarb@gmail.com">Email</a>
        </div>
    );
}

export default Footer;