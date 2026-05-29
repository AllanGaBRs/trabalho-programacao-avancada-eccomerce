// 1. Classe de Banco de Dados Concreta
class BancoDeDadosMySQL {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL...");
    }
}

// 2. Entidade principal de Pedido
class Pedido {
    public valorTotal: number;
    public tipoCliente: string;

    constructor(valorTotal: number, tipoCliente: string) {
        this.valorTotal = valorTotal;
        this.tipoCliente = tipoCliente;
    }
}

// 3. Servicos com responsabilidades especificas
class CalculadoraDescontoPedido {
    calcular(pedido: Pedido): number {
        if (pedido.tipoCliente === "VIP") {
            return pedido.valorTotal * 0.20;
        } else if (pedido.tipoCliente === "ESTUDANTE") {
            return pedido.valorTotal * 0.10;
        }

        return 0;
    }
}

class CalculadoraFretePedidoFisico {
    calcular(): number {
        return 15.0;
    }
}

class PedidoRepository {
    private bancoDeDados: BancoDeDadosMySQL;

    constructor(bancoDeDados: BancoDeDadosMySQL) {
        this.bancoDeDados = bancoDeDados;
    }

    salvar(pedido: Pedido): void {
        this.bancoDeDados.salvar(pedido);
    }
}

class EmailPedidoService {
    enviarConfirmacao(): void {
        console.log("Enviando e-mail de confirmação para o cliente...");
    }
}

// 4. Interface de tarefas do pedido
interface ITarefasPedido {
    processarPagamento(): void;
    gerarNotaFiscal(): void;
    imprimirEtiquetaFisica(): void;
}

// 5. Implementacao para produtos digitais
class PedidoProdutoDigital extends Pedido implements ITarefasPedido {
    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }

    imprimirEtiquetaFisica(): void {
        throw new Error("Erro: Não é possível imprimir etiqueta para produto digital.");
    }
}
