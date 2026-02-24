import { useState } from 'react';
import './JobCard.css';

/**
 * Componente que representa una tarjeta de puesto individual.
 * Maneja su propio estado para el input de GitHub y la validación.
 * 
 * @param {Object} props
 * @param {Object} props.job - Datos del puesto (id, title).
 * @param {Function} props.onSubmit - Función para manejar el envío de la postulación.
 * @param {boolean} props.isSubmitting - Estado de envío global o por tarjeta.
 */
const JobCard = ({ job, onSubmit, isSubmitting }) => {
    const [repoUrl, setRepoUrl] = useState('');
    const [localError, setLocalError] = useState('');

    // Validación básica de URL de GitHub
    const validateUrl = (url) => {
        if (!url) return "La URL es obligatoria";
        if (!url.toLowerCase().includes('github.com')) return "Debe ser una URL válida de GitHub";
        return "";
    };

    const handleAction = () => {
        const error = validateUrl(repoUrl);
        if (error) {
            setLocalError(error);
            return;
        }
        setLocalError('');
        onSubmit(job.id, job.title, repoUrl, () => setRepoUrl(''));
    };

    return (
        <div className="job-card">
            <div className="job-info">
                <h3 className="job-name">{job.title}</h3>
                <span className="job-id">Referencia: {job.id}</span>
            </div>
            <div className="job-actions">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="https://github.com/usuario/repo"
                        className={`job-input ${localError ? 'input-error' : ''}`}
                        disabled={isSubmitting}
                        value={repoUrl}
                        onChange={(e) => {
                            setRepoUrl(e.target.value);
                            if (localError) setLocalError('');
                        }}
                    />
                    {localError && <span className="error-text">{localError}</span>}
                </div>
                <button
                    className="job-submit-btn"
                    disabled={isSubmitting}
                    onClick={handleAction}
                >
                    {isSubmitting ? 'Enviando...' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default JobCard;
