import React from "react";
import { Link } from "react-router-dom";


function Footer() {
    return (
        <>
            <footer>
                <div className="px-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-center items-center h-16">
                    <p className="text-sm font-body text-gray-500 dark:text-gray-400 flex flex-wrap sm:gap-2 justify-center items-center text-center">
                        <span>Copyright © 2025. All Rights Reserved.</span>
                        <Link to="https://www.templaterise.com/" className="text-blue-700" target="_blank">Themes By TemplateRise</Link>
                    </p>
                </div>
            </footer>
        </>
    );
}
export default Footer;
