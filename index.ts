// DIP: a persistencia depende desta abstracao, nao de um banco concreto.
interface IBancoDeDados {
    salvar(dados: any): void;
}

// Implementacao concreta que pode ser trocada sem alterar o repositorio.
class BancoDeDadosMySQL implements IBancoDeDados {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL...");
    }
}

// Exemplo de outra implementacao da mesma abstracao.
class BancoDeDadosPostgreSQL implements IBancoDeDados {
    salvar(dados: any): void {
        console.log("Salvando dados no PostgreSQL...");
    }
}

// SRP: Pedido representa apenas os dados essenciais do pedido.
class Pedido {
    public valorTotal: number;
    public tipoCliente: string;

    constructor(valorTotal: number, tipoCliente: string) {
        this.valorTotal = valorTotal;
        this.tipoCliente = tipoCliente;
    }
}

// OCP: novas regras de desconto podem ser criadas implementando esta interface.
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

// SRP/OCP: a calculadora apenas escolhe e executa uma estrategia de desconto.
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

// DIP: o repositorio recebe uma abstracao por injecao de dependencia.
class PedidoRepository {
    private bancoDeDados: IBancoDeDados;

    constructor(bancoDeDados: IBancoDeDados) {
        this.bancoDeDados = bancoDeDados;
    }

    salvar(pedido: Pedido): void {
        this.bancoDeDados.salvar(pedido);
    }
}

// SRP: o envio de e-mail fica isolado em um servico proprio.
class EmailPedidoService {
    enviarConfirmacao(): void {
        console.log("Enviando e-mail de confirmação para o cliente...");
    }
}

// ISP: cada interface representa uma capacidade pequena e coesa.
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

// LSP/ISP: pedido digital implementa somente capacidades que fazem sentido para ele.
class PedidoProdutoDigital extends Pedido implements IPedidoComPagamento, IPedidoComNotaFiscal {
    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }
}

// LSP/ISP: pedido fisico pode substituir Pedido e tambem oferece capacidades fisicas.
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

const pedido = new PedidoProdutoFisico(100, "VIP");

const calculadora = new CalculadoraDescontoPedido([
    new DescontoClienteVip(),
    new DescontoClienteEstudante(),
    new DescontoClientePremium(),
    new SemDesconto()
]);

//exemplos de uso
console.log("Desconto:", calculadora.calcular(pedido));
console.log("Frete:", pedido.calcularFrete());

pedido.processarPagamento();
pedido.gerarNotaFiscal();
pedido.imprimirEtiquetaFisica();

const repository = new PedidoRepository(new BancoDeDadosMySQL());
repository.salvar(pedido);

const emailService = new EmailPedidoService();
emailService.enviarConfirmacao();

/*
As mudanças aplicam os cinco princípios SOLID: em SRP, Pedido deixou de calcular desconto,
salvar no banco e enviar e-mail, ficando apenas com os dados da entidade; em OCP, os descontos
foram movidos para estratégias polimórficas, permitindo adicionar novos tipos de cliente sem
alterar a calculadora; em LSP, pedidos digitais não herdam nem implementam operações físicas que
causariam exceções; em ISP, as capacidades foram separadas em interfaces pequenas como pagamento,
nota fiscal, frete e etiqueta; em DIP, PedidoRepository passou a depender da abstração
IBancoDeDados, recebida por injeção, permitindo trocar o banco ou usar implementações falsas em
testes sem modificar a classe de persistência.
*/