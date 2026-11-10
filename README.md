# 📦 Central de Devoluções

**Buiatte Armazéns · Operação Midea Carrier · CD Extrema/MG**

Use a Central para conferir os volumes recebidos, consultar uma etiqueta e exportar o relatório de cada agendamento.

[**Abrir a Central de Devoluções ↗**](https://rafaslivka.github.io/buiatte-devolucoes/)

## Como conferir uma devolução

| Etapa | O que fazer |
| :--- | :--- |
| **1 · Importar** | Entre com sua conta e clique em **Importar agendamento**. Selecione a planilha ou cole os dados do Excel. Clique em **Analisar dados**, confira a NF, o material e a quantidade e confirme a importação. |
| **2 · Abrir a agenda** | Em **Agendamentos**, abra o recebimento. Se estiver usando a conta da equipe, informe seu nome para que as leituras fiquem registradas em seu nome. Clique em **Iniciar conferência**. |
| **3 · Bipar cada volume** | Siga a ordem **CT-e → EAN → Serial → Serial adicional → Lote**. Com o leitor USB configurado para enviar Enter, o cursor avança a cada leitura. Use Enter para pular um serial opcional. |
| **4 · Revisar e confirmar** | O Enter após o lote abre a revisão. Confira os códigos e pressione **Enter novamente** para registrar **um volume**. Se precisar corrigir a leitura, clique em **Cancelar**. |
| **5 · Finalizar e exportar** | Confira o saldo pendente e clique em **Finalizar agenda**. Em **Relatórios**, selecione a agenda e clique em **Exportar Excel**. A aba **Volumes** mostra uma linha por volume, com o respectivo serial adicional e lote. |

> [!TIP]
> **Só coletar serial** registra a etiqueta e o lote sem baixar o saldo pendente. Para contar o volume como recebido, use a conferência e confirme a leitura.

### Consultar uma etiqueta

Em **Consulta por código**, bipe o serial principal ou adicional e pressione **Enter** para localizar a NF e o agendamento. Você também pode pesquisar pelo CT-e, EAN, SKU, NFD ou lote.

<details>
<summary><strong>🛠️ Rodar no VS Code e atualizar o site</strong></summary>

1. Abra a pasta que contém o arquivo `package.json`.
2. No terminal, execute `npm run dev` e acesse **http://localhost:3000**.
3. Após editar e testar, execute `npm run pages` e envie a pasta `docs` atualizada para a branch `main` no GitHub.

</details>
