import React from 'react';



const Preloader = ({ visible }: { visible: string }) => {
    return (
        <div id="preloader" className={visible}>
            <div id="status-preloader">
                
            </div>
        </div>
    );
};

export default Preloader;