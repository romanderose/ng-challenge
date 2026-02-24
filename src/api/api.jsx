export const BASE_URL = `https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net`;

/**
 * Obtiene los datos de un candidato a partir de su email.
 * Esta función realiza una petición GET a la API y devuelve el objeto 
 * del candidato.
 * 
 * @param {string} email - El email del candidato a buscar.
 * @returns {Promise<Object>} - Los datos del candidato.
 */
export const getCandidateByEmail = async (email) => {
    try {
        // Hacemos el fetch agregando el email como parámetro en la query string
        const response = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${email}`);

        // Verificamos si la respuesta es exitosa (status 200)
        if (!response.ok) {
            throw new Error(`Error al obtener el candidato: ${response.statusText}`);
        }

        // Parseamos el JSON y lo devolvemos
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Hubo un error al realizar la consulta:", error);
        throw error;
    }
};

/**
 * Obtiene la lista de posiciones abiertas (jobs).
 * Realiza una petición GET a la API y devuelve un array con los puestos disponibles.
 * 
 * @returns {Promise<Array>} - Lista de posiciones disponibles.
 */
export const getJobs = async () => {
    try {
        // Hacemos el fetch para obtener la lista de posiciones
        const response = await fetch(`${BASE_URL}/api/jobs/get-list`);

        // Verificamos si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error al obtener las posiciones: ${response.statusText}`);
        }

        // Parseamos el JSON con los jobs y lo devolvemos
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Hubo un error al obtener la lista de puestos:", error);
        throw error;
    }
};

/**
 * Envía la postulación del candidato a un puesto específico.
 * Realiza una petición POST a la API con los datos del candidato y el puesto.
 * 
 * @param {Object} applicationData - Datos de la postulación (uuid, jobId, candidateId, repoUrl).
 * @returns {Promise<Object>} - Resultado de la operación { ok: true }.
 */
export const applyToJob = async (applicationData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicationData),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorBody || response.statusText);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
