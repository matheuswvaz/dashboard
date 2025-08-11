import React from "react";
import { useCandidaturas } from "../../../hooks/useCandidaturas";
import { FaAddressCard } from "react-icons/fa";
import { Button } from "../ui/Button";

// O modal pode ser extraído para seu próprio arquivo de UI também
const ResponderCandidatoModal = ({
  modalState,
  setModalState,
  onSend,
  isSending,
}) => {
  if (!modalState.isOpen) return null;

  return (
    <div className="app-modal-overlay">
      <div className="app-modal">
        <h3 className="app-modal-title">
          Responder a {modalState.candidato?.nome}
        </h3>
        <form onSubmit={onSend}>
          <div className="app-input-group">
            <label htmlFor="emailSubject">Assunto</label>
            <input
              id="emailSubject"
              type="text"
              value={modalState.subject}
              onChange={(e) =>
                setModalState((s) => ({ ...s, subject: e.target.value }))
              }
              required
            />
          </div>
          <div className="app-input-group">
            <label htmlFor="emailBody">Mensagem</label>
            <textarea
              id="emailBody"
              rows="10"
              value={modalState.body}
              onChange={(e) =>
                setModalState((s) => ({ ...s, body: e.target.value }))
              }
              required
            ></textarea>
          </div>
          <div className="app-modal-actions">
            <Button
              variant="secondary"
              onClick={() => setModalState((s) => ({ ...s, isOpen: false }))}
              disabled={isSending}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSending}>
              Enviar E-mail
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CandidaturasSection = ({ showFeedback }) => {
  const {
    candidaturas,
    loading,
    isProcessing,
    modalState,
    setModalState,
    handleOpenModal,
    handleSendEmail,
  } = useCandidaturas(showFeedback);

  if (loading) return <div className="app-spinner large"></div>;

  return (
    <div className="app-dashboard-section">
      <h2 className="app-section-title">
        <span>
          <FaAddressCard />
        </span>{" "}
        Gerenciamento de Candidaturas ({candidaturas.length})
      </h2>
      <div className="app-table-container">
        <table className="app-data-table">
          <thead>
            <tr>
              <th>Candidato</th>
              <th>Contato</th>
              <th>Vaga</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidaturas.length > 0 ? (
              candidaturas.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.nome}</strong>
                    <br />
                    <small>Enviado em: {c.data_envio_formatada}</small>
                  </td>
                  <td>
                    {c.email}
                    <br />
                    <small>{c.telefone}</small>
                  </td>
                  <td>{c.vaga}</td>
                  <td>
                    <span
                      className={`app-tag status-${c.status?.toLowerCase().replace(" ", "-")}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="app-table-actions">
                    <a
                      href={c.url_anexo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-button link small"
                    >
                      Ver CV
                    </a>
                    <button
                      onClick={() => handleOpenModal(c, "aprovar")}
                      className="app-button success small"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleOpenModal(c, "rejeitar")}
                      className="app-button danger small"
                    >
                      Rejeitar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="app-no-data-row">
                  Nenhuma candidatura recebida.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ResponderCandidatoModal
        modalState={modalState}
        setModalState={setModalState}
        onSend={handleSendEmail}
        isSending={isProcessing}
      />
    </div>
  );
};

export default CandidaturasSection;
