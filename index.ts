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

// 3. Estrategias de desconto
interface IEstrategiaDesconto {
    aplicaPara(tipoCliente: string): boolean;
    calcular(pedido: Pedido): number;
}

class DescontoClienteVip implements IEstrategiaDesconto {
    aplicaPara(tipoCliente: string): boolean {
        return tipoCliente === "VIP";
    }

    calcular(pedido: Pedido): number {
        return pedido.valorTotal * 0.20;
    }
}

class DescontoClienteEstudante implements IEstrategiaDesconto {
    aplicaPara(tipoCliente: string): boolean {
        return tipoCliente === "ESTUDANTE";
    }

    calcular(pedido: Pedido): number {
        return pedido.valorTotal * 0.10;
    }
}

class DescontoClientePremium implements IEstrategiaDesconto {
    aplicaPara(tipoCliente: string): boolean {
        return tipoCliente === "PREMIUM";
    }

    calcular(pedido: Pedido): number {
        return pedido.valorTotal * 0.15;
    }
}

class SemDesconto implements IEstrategiaDesconto {
    aplicaPara(): boolean {
        return true;
    }

    calcular(): number {
        return 0;
    }
}

// 4. Servicos com responsabilidades especificas
class CalculadoraDescontoPedido {
    private estrategias: IEstrategiaDesconto[];

    constructor(estrategias: IEstrategiaDesconto[]) {
        this.estrategias = estrategias;
    }

    calcular(pedido: Pedido): number {
        const estrategia = this.estrategias.find((item) => item.aplicaPara(pedido.tipoCliente));

        if (!estrategia) {
            return 0;
        }

        return estrategia.calcular(pedido);
    }
}

class CalculadoraFretePedidoFisico {
    calcular(pedido: IPedidoComFrete): number {
        return pedido.calcularFrete();
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

// 5. Interfaces de capacidades do pedido
interface IPedidoComPagamento {
    processarPagamento(): void;
}

interface IPedidoComNotaFiscal {
    gerarNotaFiscal(): void;
}

interface IPedidoComFrete {
    calcularFrete(): number;
}

interface IPedidoComEtiquetaFisica {
    imprimirEtiquetaFisica(): void;
}

// 6. Implementacoes especificas de pedidos
class PedidoProdutoDigital extends Pedido implements IPedidoComPagamento, IPedidoComNotaFiscal {
    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }
}

class PedidoProdutoFisico extends Pedido implements IPedidoComPagamento, IPedidoComNotaFiscal, IPedidoComFrete, IPedidoComEtiquetaFisica {
    calcularFrete(): number {
        return 15.0;
    }

    processarPagamento(): void {
        console.log("Pagamento processado.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal gerada.");
    }

    imprimirEtiquetaFisica(): void {
        console.log("Etiqueta física impressa.");
    }
}
