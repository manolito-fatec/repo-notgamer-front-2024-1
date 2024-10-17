import axios from 'axios';

const BASE_URL_MOCKED = 'https://gist.githubusercontent.com/pauloarantesmachado/e1dae04eaf471fcf13e76488c1b9051d/raw/6addd4c29581aa372e8fa8df1670c99104816d9f/gistfile1.json';
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
