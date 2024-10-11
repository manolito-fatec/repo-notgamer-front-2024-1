import axios from 'axios';

const BASE_URL_ENDPOINT = 'http://localhost:8080/person'

export const fetchPersons = async () => {
    try {
        const response = await axios.get(BASE_URL_ENDPOINT);
        return response.data.sort((a, b) => {
            if (a.fullName < b.fullName) return -1;
            if (a.fullName > b.fullName) return 1;
            return 0;
        });
    } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
        throw error;
    }
};

export const fetchDevices = async () => {
    try {
        const response = await axios.get(BASE_URL_ENDPOINT);
        const devices = response.data.flatMap(person => {
            return person.codeDevice
                ? [{ label: person.codeDevice,
                    value: person.idPerson }]
                : [];
        });

        return devices.filter((device, index, self) =>
            index === self.findIndex(d => d.label === device.label)
        );
    } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
        throw error;
    }
};
