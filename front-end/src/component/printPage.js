import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrintPage = ({ content }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Command Details',
    });

    return (
        <div>
            <button
                onClick={handlePrint}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-700 focus:outline-none"
            >
                Imprimer cette page
            </button>

          
            <div ref={componentRef}>
                {content}
            </div>
        </div>
    );
};

export default PrintPage;
