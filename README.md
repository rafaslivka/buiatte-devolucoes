# 📦 Central de Devoluções | Manual do Usuário

**Buiatte Armazéns · Operação Midea Carrier · CD Extrema/MG**

Use a Central para abrir um agendamento, conferir os volumes com o leitor USB e gerar o relatório da devolução.

🔗 **[Abrir a Central de Devoluções](https://rafaslivka.github.io/buiatte-devolucoes/)**

## 1. Entrar no sistema

1. No computador do posto, conecte o leitor de código de barras à porta USB.
2. Abra a **Central de Devoluções** pelo link acima.
3. Na tela de acesso, digite o e-mail da sua conta e a senha fornecida pela administração. Clique em **Entrar**.
4. Se você usa a conta compartilhada da equipe, informe **seu próprio nome** quando o sistema pedir. Esse nome identifica quem fez a conferência.
5. No menu, clique em **Agendamentos** e procure o recebimento pela data e pela transportadora.

**Encontrou o agendamento?** Siga direto para a **etapa 3**. Se o recebimento ainda não estiver na lista e você tiver a planilha da devolução, faça a importação abaixo.

## 2. Importar um novo agendamento

1. Clique em **Importar agendamento**.
2. Selecione a planilha recebida. Se preferir copiar do Excel, copie a tabela **incluindo a linha dos títulos** e cole no campo de importação.
3. Confira se a tabela contém pelo menos **NF de venda, material/SKU e quantidade**. Se a data ou a transportadora estiverem ausentes, preencha esses campos na tela.
4. Clique em **Analisar dados**. Na prévia, compare a NF, o material e a quantidade de volumes com a planilha. Confira também a data e a transportadora.
5. Se os dados estiverem corretos, clique em **Confirmar importação**. O recebimento passa a aparecer em **Agendamentos**.

> [!IMPORTANT]
> Para conferir com o leitor, o item precisa ter **CT-e e EAN válidos** na planilha. A chave do CT-e tem **44 dígitos** e deve estar salva como texto no Excel. Se aparecer um aviso sobre esses campos, confira o arquivo antes de confirmar a importação.

## 3. Abrir e iniciar a conferência

1. Em **Agendamentos**, localize a devolução e clique em **Abrir**.
2. Confira a **transportadora, a data e o total de volumes previstos** para ter certeza de que está na agenda correta.
3. Se estiver na conta da equipe, digite seu nome quando aparecer **Identificar colaborador** e clique em **Assumir operação**.
4. Clique em **Iniciar conferência**. Confira o campo **Iniciado por**.
5. Se a agenda já estiver **Em andamento**, confira o saldo pendente e continue a partir do próximo volume físico.

## 4. Bipar um volume

Clique no primeiro campo, **Chave CT-e / acesso**, e faça as leituras na ordem abaixo. Com o leitor configurado para enviar **Enter** após cada bipagem, o cursor avança sozinho. Se o código aparecer e o cursor continuar no mesmo campo, pressione **Enter** no teclado.

| Ordem | Campo | O que fazer |
| :---: | --- | --- |
| 1 | **CT-e** | Bipe a chave de acesso de 44 dígitos do documento. |
| 2 | **EAN** | Bipe o código de barras do produto. |
| 3 | **Serial** | Bipe o número de série do volume. Se o produto não tiver serial, pressione **Enter** para avançar. |
| 4 | **Serial adicional** | Bipe o segundo serial, se houver. Se não houver, pressione **Enter**. |
| 5 | **Lote indústria** | Bipe ou digite o lote e pressione **Enter** para abrir a revisão. O lote é obrigatório. |

Na tela de revisão, compare a **NF, o material, os seriais e o lote** com o volume que está na sua frente.

- **Tudo certo:** pressione **Enter** novamente ou clique em **Confirmar recebimento**. Aguarde a confirmação na tela antes de pegar o próximo volume.
- **Algum dado está errado:** clique em **Cancelar**, corrija o campo e revise novamente.
- **O volume chegou avariado:** marque **Volume com avaria** antes de confirmar a leitura.

> [!TIP]
> **Exemplo com uma NF de 2 volumes:** após confirmar a primeira caixa, o painel deve mostrar **1 recebido e 1 pendente**. Bipe a segunda caixa com os seriais e o lote dela. Após a segunda confirmação, o painel deve mostrar **2 recebidos e 0 pendentes**. No relatório, cada caixa terá sua própria linha.

## 5. O que fazer quando algo sair do previsto

| Situação | Como proceder |
| --- | --- |
| **Apareceu “serial já registrado”** | Abra **Consulta por código** e pesquise o serial completo. Confira a NF e a agenda antes de tentar registrar o volume novamente. |
| **O produto é diferente ou veio a mais** | Confira a etiqueta e a agenda. Se a diferença for real, use **Receber com divergência** na revisão. O volume fica registrado em **Divergências** e não soma como recebido OK. |
| **A etiqueta está ilegível ou o item está sem referência para bipagem** | Clique em **Lançamento manual**, selecione a NF e o material, informe quantidade, lote e motivo. Se houver seriais, use uma linha por volume. Revise antes de confirmar. |
| **Faltou mercadoria ou preciso registrar uma avaria** | Clique em **Falta / avaria**, selecione o item e o tipo de ocorrência. Informe a quantidade, descreva o ocorrido e confirme. |
| **Preciso apenas anotar serial e lote** | Use **Só coletar serial**. Essa opção guarda os dados da etiqueta e mantém o saldo de recebimento. |
| **Confirmei um volume errado** | Localize o lançamento em **Histórico** e chame Rafael ou Carla. Informe a NF, o serial e o que precisa ser corrigido. |
| **A internet caiu na hora de confirmar** | Quando a conexão voltar, clique em **Atualizar** e confira o **Histórico** antes de repetir a leitura. |

## 6. Finalizar e exportar o relatório

1. Ao terminar a descarga, compare os volumes físicos com os **recebidos, pendentes e divergentes** no painel.
2. Se ainda houver pendência, confira a NF e verifique se ficou algum volume sem bipar. Se a falta for real, registre a ocorrência.
3. Clique em **Finalizar agenda**. Se houver pendências, leia o aviso antes de confirmar o fechamento. Confira o campo **Finalizado por**.
4. Abra **Relatórios**, selecione o agendamento correto e clique em **Exportar Excel**.
5. Abra o arquivo baixado. Use a aba **Resumo** para conferir os totais e a aba **Volumes** para conferir **NF, serial, serial adicional, lote e situação de cada volume**.

**Para consultar depois:** abra **Consulta por código**, bipe ou digite a NF, NFD, CT-e, EAN, SKU, serial ou lote e pressione **Enter**.

**Na troca de turno:** se outra pessoa assumir o mesmo posto com a conta da equipe, clique no nome no canto superior direito e identifique o novo operador. Ao encerrar o uso do computador, clique em **Sair**.

## 💬 Precisa de ajuda?

| Contato | Canal |
| --- | --- |
| **Rafael Slivka** | [Chamar no WhatsApp · (12) 98165-1930](https://wa.me/5512981651930) |
| **Carla Magela** | [Enviar e-mail · ccosta@mideacarrier.com](mailto:ccosta@mideacarrier.com) |

Para facilitar o atendimento, envie o **número da NF ou do agendamento**, diga em qual etapa você estava e, se apareceu uma mensagem, mande um **print da tela**.
