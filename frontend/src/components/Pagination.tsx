import React from "react";
import ReactPaginate from "react-paginate";

interface PaginationButtonsProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  totalPages: number;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  setCurrentPage,
  currentPage,
  totalPages,
}) => {
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <ReactPaginate
        breakLabel="..."
      //  nextLabel="Avançar"
     //   previousLabel="Voltar"
        onPageChange={handlePageClick}
        //pageRangeDisplayed={3}
        pageRangeDisplayed={3}  // Mostra 2 páginas centrais ao redor da atual
        marginPagesDisplayed={1} // Mostra 1 página nas extremidades
        
        
        pageCount={totalPages}       // 🔹 totalPages do backend
        forcePage={currentPage}      // 🔹 mantém a página correta destacada
        containerClassName="flex items-center space-x-2"
        pageClassName="cursor-pointer  border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        pageLinkClassName="px-3 py-2 block w-full h-full text-center" // <a>
        activeClassName="bg-purple-600 text-white border-none"
        previousClassName="cursor-pointer   border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        nextClassName="cursor-pointer  border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        previousLabel={
            currentPage > 0 ? (
            <span className="px-3 py-2 border border-gray-300   rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                Voltar
            </span>
            ) : null
        }
        nextLabel={
            currentPage < totalPages - 1 ? (
            <span className="px-3 py-2 border border-gray-300   rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                Avançar
            </span>
            ) : null
        }
     
        />
  );
};

export default PaginationButtons;
