Decisões / padrões de arquitetura em React

Os princípios de desenvolvimento que mais influenciam nas decisões de arquitetura são :

# Implementação, Dry , Especialização, Clean Code, AHA, Quebrantamento & Separação de Concerns

# DRY - Dont Repeat Yourself

CONTRA : Criar códigos repetidos ou funcionalidades similares que poderiam se tornar uma abstração, em geral, causa problemas de mantenibilidade.
SUGERIDO: Procuramos abstrair sempre que o código em questão pode ser usado em outro ponto da aplicação ou de outro produto.

# Clean Code x "Dirty" Code

CENÁRIO: Clean code é uma pratica comum, onde procuramos gerar elegância, legibilidade, previsibilidade, escalonamento dentre outras características de um suposto bom código.
Mas essa prática não é preferida, as vezes.
Um bom código limpo, vem na sequência de uma implementação mais "suja", reforçando a importância de Iteração e refactor.
Separação de Preocupações ( Single Concern / Single responsibility )
A separação de preocupações é não atribuir mais de um comportamento a uma função, objeto, classe, componente, ou o que a linguagem em questão requisita.
Extendemos isso a componentes mais exclusivamente pois falamos aqui de React.
Um componente Button não deve ser responsável por validar o conteúdo do Form, pelo contrário, ele deve apenas gerenciar se o Botão esta ativo ou não, em suma, gerenciar seu estado.
Assim como um componente InputText não deve ser responsável por validar o conteúdo dele, apenas armazenar seu estado e comportamentos ou propagar os eventos.

# Especialização

O processo de especialização, é, aproveitar de uma funcionalidade/comportamento de um componente ( Single Responsibility ) e extender, adicionar a ele, um novo comportamento, propriedade, ou habilidade, gerando um novo Componente.

# Especialização + Single Responsibility

Podemos pensar no Componente de InputText, sua responsabilidade é expor ao usuário um campo de inserção de valores ( e os comportamentos-herança como eventos, tratamento de valor do evento, propagação do evento (event-bubling), implementação de props... ) especializado em um InputPassword, sendo o InputPassword responsável por dispor ao usuário um campo de inserção de valores "secretos" (privados) e no formato de letras e números e símbolos, ou seja, sem uma máscara, e no caso de arquiteturas mais atuais de React, não responsável por garantir força da senha, através de especialização do InputText.
Para que o InputPassword possa ser conectado a um Form, ele precisa ser especializado em FormInputPassword, que se responsabiliza por conectar ao Form e validar a força da senha, mantendo assim uma única responsabilidade para cada componente, porém gerando uma cascata de especializações.
To add behaviours or hability to a component, it is mandatory that we don't break Single Responsiblity.
Composing something that blends within.

# "Comportamento" e efeito colateral :

// single-concern - Mostrar um dialog com titulo e mensagem
const Dialog = (title, message) => ShowDialogWithTitleAndMessage

// concern UX - Orientar o usuário de que essa tela é a de agradecimento por seguir o tutorial

// especialização - mostrar um Dialog com titulo e mensagem do Howdy e agradecimento.

// single-concern - renderizar um dialog com mensagens personaliazdas
const HowdyDialog = Especialize Dialog( title=“Howdy”, message=”Thank you for tasting specialized components with me!” )

# Heritage-Behaviour

Seguindo esta linha, se o Dialog precisa da funcionalidade de fechar, ela é uma sub-funcionalidade ou "comportamento-herança".

Se em alguns lugares o Dialog precisa da funcionalidade de surgir de baixo para cima e em outros de cima pra baixo, devemos especializar o Dialog em DialogFromBehind e DialogFromAbove

# AHA - Avoid Hasty Abstractions and DRY

Não se repetir é um princípio importante nas nossas decisões. Mas e quando devemos esquecer de não se repetir e Evitar abstrações precipitadas ? Troca difícil.

# FeedForward(<<< Golden Rule : Adopt over developerPrinciples reflect(<< :

# Composição ( capacidade da abstração de interagir com o resto do ecossistema, sem prejudicar. )

# Interoperabilidade (capacidade de agregar comportamentos ou funcionalidades para a code-base )

# Implementabilidade ( capacidade de atender aos casos de uso previstos - necessário prever o máximo possível e sair da casinha até pros não previsíveis ).

ModalCompact - Especialização de Modal
ModalLiquid - Especialização de Modal
ModalRecoverPassword - Extensão de ModalCompact ou Liquid, passando o conteúdo por
children. Suporta tanto implementações de conteudo com Form quanto sem.

Componentes de estilo - emotion
Utilizamos um pacote chamado emotion, que norteia nossas implementações de estilo.
But we also work with tailwind css.
Especializações de componente de estilo são geradas através de styled(Component), em vários casos, especializamos elementos html, que são gerados através de styled.elementName.
Leituras extras necessárias para reforçar o conhecimento e que embasam as decisões

# Implementando Componentes do Design-System em React

Ideal se ambientar com a Naming Convention de nosso design-system aqui antes de prosseguir lendo essa documento.
Componentes definidos no Toolabs norteiam a implementação no código fonte. Conforme mencionado anteriormente, a Implementação de um Componente do Design-System ( ButtonPrimarySmall ) em uma tela esta vínculado ao Figma.

Buttons
Objeto > Contexto
ButtonPrimary

Objeto > Contexto
ButtonCircular

Em nossa code base, as mesmas variações são implementadas como Especializações do componente Button, se tornando parte do resultado final.
ButtonPrimary
ButtonCircular

Especialização
Especialização em desenvolvimento de software eh a extensão de um Objeto.

Tendo como objeto Camisa, Camisa possui estado textura, malha.
Podemos ter uma extensao para o Camisa, chamada CamisaVermelha, onde CamisaVermelha tambem possui estado cor, com propriedade setada para vermelha.
Cabe observar que CamisaVermelha tambem possuira os estados textura e malha, herdados da construcao de Camisa.

Variações de Estilo ( Densidade ) - ButtonPrimary & ButtonCircular

Ao observarmos o Toolabs, é possível identificar duas variações de ButtonPrimary.
Ao implementarmos Densidade, temos uma mudança considerável de estilo, para evitarmos uma implementação por props em um componente ButtonPrimary ( size ), especializamos ele em ButtonPrimaryEstilo.
Avançando nossa implementação para
Objeto -> Contexto -> Estilo ( Densidade )
ButtonPrimarySmall
ButtonPrimaryMedium

Aqui cabe forçar que ButtonCircular e ButtonCircularFilled se tornam duas especializações já que eles implementam diferentes efeitos-colateral de mudança de estilo, então, para evitarmos prop, especializamos.
ButtonCircular possui duas variações de estilo ( Densidade ), Small e Medium, se tornando
ButtonCircularSmall
ButtonCircularMedium

Variação de Estilo - ButtonCircular e ButtonCircularFilled, diferem que ButtonCircularFilled extends ButtonCircular.

Applying variety of density (estilo), while honoring stateSymmetry ( ButtonCircular controls the loading, the disabled/enabled (If filled or not), ButtonCircularFilled to be pure, is only style. ).

Comportamento - ButtonPrimary
ButtonPrimary, em todas suas variações de estilo ( Medium, Small ), contempla um comportamento.

Para respeitaramos as definições de comportamento, basta que criemos as variações ButtonPrimaryVariaçãoLíquid e ButtonPrimaryVariaçãoSolid.
Mas aqui temos algo interessante, ao analisarmos a implementação do ButtonPrimaryMedium em Desktop e Mobile no mesmo formulário, percebemos que eles tem um comportamento específico, a mistura dos dois.

Lidamos com isso na implementação, criando uma especialização para cada variação do ButtonPrimary, chamada de ButtonFluid.

Por sermos mobile first, o ButtonPrimaryMediumFluid renderiza um botão Líquido em dispositivos Mobile e um Compact em dispositivos Desktop.

Vale ressaltar que a especialização Fluid, deve se preocupar apenas se o Dispositivo é mobile ou Desktop e não se ele é fluído ou não, e um ButtonPrimaryMedium deve se preocupar apenas em controlar estado e especializar um ButtonPrimary.

Outra observação importante é que devemos especializar em nossa code-base apenas aquilo que esta implementado no Figma.
Estados

O estado em geral é controlado por propriedades, sendo sugerido que uma especialização do componente de estilo seja gerada para cada um dos estados, partindo do Normal, e um Componente Especializado controle uma espécie de state machine, controlando o estado atual.

const ButtonPrimaryStyle = styled.button`
 const ButtonPrimaryMediumStyle = styled(ButtonPrimaryStyle)`
const ButtonPrimaryMediumLoadingStyle = styled(ButtonPrimaryStyle)`
 const ButtonPrimaryMediumDisabledStyle = styled(ButtonPrimaryStyle)`

const ButtonPrimaryMedium = ({ disabled, loading, content }) => {
if (loading === true) {
return <ButtonPrimaryMediumLoadingStyle />
}

if (disabled === true) {
return <ButtonPrimaryMediumDisabledStyle>
{content}
</ButtonPrimaryMediumDisabledStyle>
}

}

O botão, então, possui derivados de um estado maior ( tela ou aplicação ), através de hierarquicos.

# Estado por tela -

Consider ApplicationState as ErrorBoundary e LoadingBoundary extends anyStateContext.

https://kentcdodds.com/blog/stop-using-isloading-booleans

A cascata de componentes resulta em várias declarações de componentes de estilo, espalhadas por toda aplicação, permitindo decoplamento.
I.E Se o estado do botão da folha mudar, o do pai não muda e reage junto.

Dessa forma, reforçamos o princípio de Pure Functional Component, renderizando igual toda vez, e sendo estado puro imperativo ( Mesma entrada, mesma saída, atómico ).

Inputs
Idealmente, densidade gera variação.

Um InputText por exemplo, não deve se preocupar com mostrar ou esconder seu conteúdo, nem o tipo de entrada (Honor single responsibility), an InputPassword otherwise, would.

Objeto > Contexto (Tipo)
InputText

Objeto > Contexto (Tipo)
InputPassword

Objeto > Contexto (Tipo)
InputSelect

FormInput
No caso de um InputPassword adicionado a um Form :
Contexto (Implementação) > Objeto > Contexto ( Tipo )
FormInputPassword

Estados
Estados em inputs são controlados de forma similar a em um componente Button, com parte deles sendo controlado por dentro do próprio Input, através de reação a eventos ( OnFocus, OnBlur ... ).
Por questões de Separação de preocupações, nos queremos que um InputText controle o estado, já que é a partir dele que especializamos
No grupo de Inputs, a maioria compartilha estados de sendo também tratados por props por enquanto, para sake of breviety, não vamos explicar novamente a lógica de evitar booleanos para estados e utilizar máquinas de estado declarativas.

Modal
Mais exemplos de Variações
Text

Implementando Composição
Implementando Comportamentos
Implementando Navegação Agentica

# Interesting extra material

https://reactjs.org/docs/thinking-in-react.html - algumas dicas do React para como pensar em arquitetura de componentes
https://reactjs.org/docs/error-boundaries.html
https://medium.com/@eltocino/specialization-in-reactjs-a24a45b4bd4f - Especialização em React
https://kentcdodds.com/blog/how-to-write-a-react-component-in-typescript - algumas dicas sobre como escrever um component em TS
https://kentcdodds.com/blog/javascript-pass-by-value-function-parameters - porque funções JS são executadas com valores e não com índices
https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase - DRY x WET
https://kentcdodds.com/blog/aha-programming - DRY X WET X AHA Prefira duplicidade de código ao invés de abstrações erradas - Sandi Metz
https://americanexpress.io/clean-code-dirty-code/ - Clean Code x Dirty Code in React by American Express
https://kentcdodds.com/blog/common-mistakes-with-react-testing-library - erros comuns com react-testing-library
https://testing-library.com/docs/queries/about/#priority - que queries devo usar?
