import {useToast} from "vue-toastification";

const toast = useToast();

export function handleAxiosError(error) {
    if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.message || "Erro ao processar a solicitação.";
        switch (status) {
            case 400:
                toast.error(`Requisição inválida: ${errorMessage}`);
                break;
            case 404:
                toast.error(`Não encontrado: ${errorMessage}`);
                break;
            case 500:
                toast.error(`Erro interno do servidor: ${errorMessage}`);
                break;
            default:
                toast.error(`Erro: ${errorMessage}`);
        }
    } else if (error.request) {
        toast.error("Sem resposta do servidor. Verifique sua conexão.");
    } else {
        toast.error("Erro ao configurar a requisição.");
    }
    console.error(error);
}
export function handleTypeError(e) {
    return null;
}
