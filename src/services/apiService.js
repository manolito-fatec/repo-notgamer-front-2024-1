import axios from 'axios';

const BASE_URL = 'https://gist.githubusercontent.com/pauloarantesmachado/e1dae04eaf471fcf13e76488c1b9051d/raw/6addd4c29581aa372e8fa8df1670c99104816d9f/gistfile1.json';

export const fetchPersons = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data.map(person => ({
            label: person.person.fullname,
            value: person.person.idPerson
        })).filter((person, index, self) =>
            index === self.findIndex(p => p.label === person.label)
        );
    } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
        throw error;
    }
};

export const fetchDevices = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data.map(person => ({
            label: person.person.codeDevice,
            value: person.person.idPerson
        })).filter((person, index, self) =>
            index === self.findIndex(p => p.label === person.label)
        );
    } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
        throw error;
    }
};
