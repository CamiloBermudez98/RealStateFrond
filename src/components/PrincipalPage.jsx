import { useFetch } from '../useFetch';
import React, { useState, useEffect } from "react";
import { EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function PrincipalPage() {
  const { data, loading, error, fetchData } = useFetch();
  const [filterName, setFilterName] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filterDescription, setFilterDescription] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const newData = data.filter(item => {
        return (
          item?.name?.toLowerCase()?.includes(filterName.toLowerCase() || '') &&
          item?.description?.toLowerCase()?.includes(filterDescription.toLowerCase() || '') &&
          String(item?.price || '').includes(filterPrice) &&
          item?.location?.country?.toLowerCase()?.includes(filterCountry.toLowerCase() || '') &&
          item?.location?.city?.toLowerCase()?.includes(filterCity.toLowerCase() || '') &&
          item?.location?.address?.toLowerCase()?.includes(filterAddress.toLowerCase() || '')
        );
      });
      setFilteredData(newData);
      setCurrentPage(1);
    }
  }, [data, filterName, filterDescription, filterPrice, filterCountry, filterCity, filterAddress]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const goToFirstPage = () => handlePageChange(1);
  const goToPreviousPage = () => handlePageChange(currentPage - 1);
  const goToNextPage = () => handlePageChange(currentPage + 1);
  const goToLastPage = () => handlePageChange(totalPages);

  if (loading) {
    return <div>Cargando casas...</div>;
  }

  if (error) {
    return <div>Error al cargar las casas: {error}</div>;
  }

  const handleMainFilterSearch = () => {
    fetchData({ filterText });
    setCurrentPage(1);
  };

  const handleOpenDialog = (property) => {
    setSelectedProperty(property);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProperty(null);
  };

  return (
    <div className="ayuda">
      <div className="main-filter-container">
        <input
          className="main-filter-input"
          type="text"
          placeholder="Buscar en todas las propiedades..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleMainFilterSearch();
            }
          }}
        />
        <button className="main-filter-button" onClick={handleMainFilterSearch}>
          <MagnifyingGlassIcon className="icon" style={{ width: '20px', height: '20px' }} />
        </button>
      </div>
      <div className="filters-container">
        <input
          className="filtro-input"
          type="text"
          placeholder="Filtrar por Nombre"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <input
          className="filtro-input"
          type="text"
          placeholder="Filtrar por Precio"
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
        />


        <input
          className="filtro-input"
          type="text"
          placeholder="Filtrar por Dirección"
          value={filterAddress}
          onChange={(e) => setFilterAddress(e.target.value)}
        />
      </div>
      <table>
        <tbody>
          {currentItems?.map((item) => (
            <div key={item.id} className="property-card">
              <div className="property-details">
                <h3 className="property-name">{item?.name}</h3>
                <img src={item?.img} alt="Property Details" className="property-image" />
                <div className="property-price">
                  <span>{item?.price}</span>
                </div>
                <p className="property-description">{item?.description}</p>
                <div className="property-location">
                  <span>Ubicacion:{item?.location?.city}, {item?.location?.country}</span>
                  <span>Direccion:{item?.location?.address}</span>
                </div>

              </div>
              <div className="property-actions">
                <button className="view-button" onClick={() => handleOpenDialog(item)}>
                  <EyeIcon className="icon" style={{ width: '20px', height: '20px' }} /> Ver más
                </button>
              </div>
            </div>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <div className="rows-per-page">
          Rows per page:
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="16">16</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="pagination-info">
          {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems}
        </div>
        <div className="pagination-controls">
          <button onClick={goToFirstPage} disabled={currentPage === 1}>&lt;&lt;</button>
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>&lt;</button>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>&gt;</button>
          <button onClick={goToLastPage} disabled={currentPage === totalPages}>&gt;&gt;</button>
        </div>
      </div>
     
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md" 
            sx={{
           
            top: '10%', 
            left: '50%',
            transform: 'translate(-50%, -10%)', 
        }}
         disableBackdropClick 
            slotProps={{
            backdrop: {
            style: {
                backgroundColor: 'transparent', 
            },
    },
  }}>
        <DialogTitle>{selectedProperty?.name}</DialogTitle>
        <DialogContent>
          {selectedProperty && (
            <div>
              <img src={selectedProperty?.img} alt="Property Details" style={{ width: '100%', marginBottom: '1px' }} />
              <Typography variant="h6" gutterBottom>Precio: {selectedProperty?.price}</Typography>
              <Typography variant="body1" paragraph>Descripción: {selectedProperty?.description}</Typography>
              <Typography variant="subtitle1">Ubicación:</Typography>
              <Typography variant="body2">Ciudad: {selectedProperty?.location?.city}</Typography>
              <Typography variant="body2">País: {selectedProperty?.location?.country}</Typography>
              <Typography variant="body2">Dirección: {selectedProperty?.location?.address}</Typography>
              <Typography variant="subtitle1">Características:</Typography>
                 {selectedProperty?.features && selectedProperty.features.length > 0 ? (
                <ul>
                {selectedProperty.features.map((feature, index) => (
                    <li key={index}>
                    <Typography variant="body2">{feature}</Typography>
                    </li>
                ))}
                </ul>
                ) : (
                    <Typography variant="body2">No hay características disponibles.</Typography>
                )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PrincipalPage;