/* eslint-disable react/prop-types */
import Pagination from 'react-bootstrap/Pagination';

const PaginationComponent = ({ totalItems, itemsPerPage, activePage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const items = [];

  // Determine the range of pages to show based on the active page
  let startPage, endPage;
  if(totalPages <=5){
    startPage = 1 ; endPage=totalPages;
  }else {
    if(activePage <= 3){
        startPage = 1 ; endPage = 5;
    }else if(activePage+1 >= totalPages){
        startPage = totalPages-4;
        endPage = totalPages;
    }else {
        startPage = activePage-2;
        endPage = activePage+2;
    }
  }
  

  for (let number = startPage; number <= endPage; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        onClick={() => handlePageClick(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.Prev onClick={() => handlePageClick(activePage - 1)} disabled={activePage === 1} />
      {startPage > 1 && <Pagination.Ellipsis />}
      {items}
      {endPage < totalPages && <Pagination.Ellipsis />}
      <Pagination.Next onClick={() => handlePageClick(activePage + 1)} disabled={activePage === totalPages} />
    </Pagination>
  );
};



export default PaginationComponent;
