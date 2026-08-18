/**
 * Importa (por efeito colateral) todos os módulos de serviço que registram
 * coleções no user-data-registry, garantindo que "Exportar meus dados" e
 * "Excluir minha conta" alcancem todos os domínios mesmo que o usuário nunca
 * tenha navegado até a página correspondente nesta sessão. Importado uma
 * única vez no layout raiz.
 */
import "./checkins";
import "./body-monitor";
import "./plan";
import "./hyperfocus";
import "./game-progress";
import "./coloring";
import "./community";
