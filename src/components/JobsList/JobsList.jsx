import { useState, useEffect } from 'react';
import { getJobs, getCandidateByEmail, applyToJob } from '../../api/api';
import JobCard from '../JobCard/JobCard';
import './JobsList.css';

/**
 * Componente principal que maneja la carga de datos y la lista de puestos.
 * Orquestador del flujo de postulación.
 */
const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [candidateInfo, setCandidateInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState(null);
    const [error, setError] = useState(null);

    const USER_EMAIL = 'romandealdobonzi@gmail.com';

    // Carga inicial de datos: Puestos y Candidato
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [jobsData, candidateData] = await Promise.all([
                    getJobs(),
                    getCandidateByEmail(USER_EMAIL)
                ]);

                setJobs(jobsData);
                setCandidateInfo(candidateData);
                setError(null);
            } catch (err) {
                console.error("Error al inicializar la aplicación:", err);
                setError("Ocurrió un error al cargar la información. Por favor, reintenta más tarde.");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    /**
     * Procesa la solicitud de postulación enviada por un JobCard.
     */
    const onApplySubmit = async (jobId, title, repoUrl, resetForm) => {
        if (!candidateInfo) {
            alert("No se cargó la información del candidato. Reintenta recargar.");
            return;
        }

        try {
            setSubmittingId(jobId);

            const payload = {
                uuid: candidateInfo.uuid,
                jobId: jobId,
                candidateId: candidateInfo.candidateId,
                applicationId: candidateInfo.applicationId,
                repoUrl: repoUrl
            };

            await applyToJob(payload);

            alert(`¡Éxito! Te has postulado a: ${title}`);
            if (resetForm) resetForm();
        } catch (err) {
            console.error("API Error detailed:", err.message);
            alert(`Fallo en la postulación: ${err.message}`);
        } finally {
            setSubmittingId(null);
        }
    };

    if (loading) return (
        <div className="jobs-status">
            <div className="spinner"></div>
            <p>Preparando posiciones para ti...</p>
        </div>
    );

    if (error) return (
        <div className="jobs-status error">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">Reintentar</button>
        </div>
    );

    return (
        <div className="jobs-container">
            {candidateInfo && (
                <div className="candidate-welcome">
                    <span>Bienvenido, <strong>{candidateInfo.firstName} {candidateInfo.lastName}</strong></span>
                    <p>Postúlate a las vacantes disponibles ingresando tu repositorio de GitHub.</p>
                </div>
            )}

            <h2 className="jobs-title">Vacantes Abiertas</h2>

            <div className="jobs-list">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onSubmit={onApplySubmit}
                            isSubmitting={submittingId === job.id}
                        />
                    ))
                ) : (
                    <p className="no-jobs">No hay vacantes disponibles actualmente.</p>
                )}
            </div>
        </div>
    );
};

export default JobsList;
