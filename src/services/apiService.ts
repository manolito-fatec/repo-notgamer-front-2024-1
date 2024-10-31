import axios from 'axios';

const BASE_URL_MOCKED = 'https://gist.githubusercontent.com/pauloarantesmachado/e1dae04eaf471fcf13e76488c1b9051d/raw/6addd4c29581aa372e8fa8df1670c99104816d9f/gistfile1.json';
const BASE_URL_ENDPOINT = 'http://localhost:8080/person';

interface Person {
    idPerson: number;
    fullName: string;
    codeDevice?: string;
}

interface Device {
    label: string;
    value: number;
}
export const fetchPersonById  = async (id: number): Promise<Person> => {
    try{
        const response = await axios.get<Person>(BASE_URL_ENDPOINT + '/' + id);
        return response.data;
    }catch (error){
        console.log("Pessoa não encontrada: ",error);
        throw error;
    }

}

export const fetchPersons = async (): Promise<Person[]> => {
    try {
        const response = await axios.get<Person[]>(BASE_URL_ENDPOINT);
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

export const fetchDevices = async (): Promise<Device[]> => {
    try {
        const response = await axios.get<Person[]>(BASE_URL_ENDPOINT);
        const devices: Device[] = response.data.flatMap(person => {
            return person.codeDevice
                ? [{ label: person.codeDevice, value: person.idPerson }]
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

export const fetchHistory = async ( person, startDate, endDate)=>{
    let urlHistory = "http://localhost:8080/tracker/history"
    try {
        const body = {
            personId: person,
            init: `${startDate}T23:59:59`,
            end: `${endDate}T23:59:59`
        }
        const response = await axios.post(urlHistory, body);
        return response.data.content;
    } catch (error) {
        console.error("Erro ao buscar dispositivos:",error);
        throw error;
    }
}

export const fetchGeomData = async ( person, startDate, endDate, page: number)=>{
    let getUrl = `http://localhost:8080/tracker/period/${person}/${startDate}T00:00:00.000/${endDate}T00:00:00.000?page=${page}&size=500`;
    try {
        const response = await axios.get(getUrl);

        if (response.data && response.data.content.length === 0) {
            toast.info("Nenhum ponto encontrado para o filtro selecionado.");
            return [];
        }

        return response.data.content;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message ||
                "Erro desconhecido ao buscar pontos.";
        } if(error.code == 'ERR_BAD_RESPONSE'){
            toast.info("Nenhum ponto encontrado para o filtro selecionado.");
        }
        else {
            toast.error("Erro na conexão. Tente novamente mais tarde.");
        }
        return [];
    }

}
