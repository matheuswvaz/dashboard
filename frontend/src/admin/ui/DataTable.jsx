import React, { useState } from "react";

const DataTable = ({ headers, data, renderRow }) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const showMore = () =>
    setVisibleCount((prev) => Math.min(prev + 10, data.length));

  // No React 18, useMemo pode ser útil aqui se 'data' for grande
  const currentData = data.slice(0, visibleCount);

  return (
    <div className="app-table-container">
      <div className="app-table-wrapper">
        <table className="app-data-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => renderRow(item, index))
            ) : (
              <tr>
                <td colSpan={headers.length} className="app-no-data-row">
                  Nenhum dado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {visibleCount < data.length && (
        <div className="app-table-actions">
          <button className="app-button link show-more" onClick={showMore}>
            Ver Mais ({data.length - visibleCount})
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
