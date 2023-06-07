import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Import custom CSS for the underline effect

const App = () => {
  const [empleados, setEmpleados] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const empleadosPerPage = 10;
  const pagesVisited = pageNumber * empleadosPerPage;

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get(
        "http://89.116.25.43:3500/api/empleados/listar"
      );
      console.log("API Response:", response.data);
      setEmpleados(response.data.result || []);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
    }
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const number = Math.ceil(empleados.length / empleadosPerPage);

  const renderEmpleados = empleados
    .slice(pagesVisited, pagesVisited + empleadosPerPage)
    .map((empleado, index) => (
      <tr key={empleado.id}>
        <td className="text-center">{index + 1 + pagesVisited}</td>
        <td className="text-center">{empleado.identificacion}</td>
        <td className="text-center">{empleado.nombres}</td>
        <td className="text-center">{empleado.fecha_nacimiento}</td>
        <td className="text-center">
          <div className="progress">
            <div
              className="progress-bar bg-$blue-700"
              role="progressbar"
              style={{ width: `${empleado.tiempo_contrato + 3}%` }}
              aria-valuenow={empleado.valor_contrato}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span className="progress-value">
                {empleado.tiempo_contrato}%
              </span>
            </div>
          </div>
        </td>
        <td className="text-center">{empleado.valor_contrato}</td>
        <td className="text-center">
          {empleado.estado ? (
            <div className="badge bg-success">Active</div>
          ) : (
            <div className="badge bg-danger">Inactive</div>
          )}
        </td>
      </tr>
    ));

  const renderPageNumbers = () => {
    return (
      <>
        <li>
          <button
            className={`page-link bg-warning text-black rounded ${
              pageNumber === 0 ? "active" : ""
            }`}
            onClick={() => changePage({ selected: pageNumber - 1 })}
            disabled={pageNumber === 0}
          >
            Previous
          </button>
        </li>
        {Array.from({ length: number }, (_, index) => (
          <li key={index}>
            <button
              className={`page-link bg-warning text-black rounded mx-1 ${
                pageNumber === index ? "active" : ""
              }`}
              onClick={() => changePage({ selected: index })}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            className={`page-link bg-warning text-black rounded ${
              pageNumber === number - 1 ? "active" : ""
            }`}
            onClick={() => changePage({ selected: pageNumber + 1 })}
            disabled={pageNumber === number - 1}
          >
            Next
          </button>
        </li>
      </>
    );
  };

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Identificación</th>
            <th className="text-center">Nombres</th>
            <th className="text-center">Fecha de Nacimiento</th>
            <th className="text-center">Tiempo de Contrato</th>
            <th className="text-center">Valor Contrato</th>
            <th className="text-center">Estado</th>
          </tr>
        </thead>
        <tbody>{renderEmpleados}</tbody>
      </table>

      <div className="pagination-container d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {renderPageNumbers()}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default App;
