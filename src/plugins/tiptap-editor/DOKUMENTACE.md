Jasně, zde je Markdown soubor s dokumentací pro Tiptap rozšíření pro React, vytvořený na základě poskytnutých HTML fragmentů:

```markdown
# Dokumentace Tiptap Extensions pro React

Tento dokument poskytuje přehled a detaily o používání a vytváření rozšíření (extensions) pro Tiptap v React aplikacích.

## Úvod do Rozšíření (Extensions) v Tiptap

Rozšíření vylepšují Tiptap přidáním nových schopností nebo úpravou chování editoru. Ať už jde o přidávání nových typů obsahu, přizpůsobení vzhledu editoru nebo rozšíření jeho funkčnosti, rozšíření jsou základními stavebními kameny Tiptap.

Pro přidání nových typů obsahu do editoru můžete použít [nody (nodes)](#nody-nodes-a-znacky-marks) a [značky (marks)](#nody-nodes-a-znacky-marks), které mohou vykreslovat obsah v editoru.

Volitelný balíček `@tiptap/starter-kit` zahrnuje nejčastěji používaná rozšíření, což zjednodušuje nastavení. Více si přečtěte o [`StarterKit`](https://tiptap.dev/docs/editor/getting-started/configure#default-extensions).

Rozšiřte funkčnost svého editoru pomocí rozšíření vytvořených komunitou Tiptap. Objevte řadu vlastních funkcí a nástrojů v [Awesome Tiptap Repository](https://github.com/ueberdosis/awesome-tiptap#community-extensions). Pro spolupráci a podporu se zapojte s ostatními vývojáři v [diskusním vlákně](https://github.com/ueberdosis/tiptap/discussions/2973) o komunitních rozšířeních.

### Co jsou rozšíření?

Ačkoliv se Tiptap snaží skrýt většinu složitosti ProseMirror, je postaven na jeho API a doporučujeme vám projít si [ProseMirror Guide](https://prosemirror.net/docs/guide/) pro pokročilé použití. Získáte lepší porozumění tomu, jak vše funguje pod kapotou, a seznámíte se s mnoha termíny a žargonem používaným v Tiptap.

Existující [nody](#nody-nodes-a-znacky-marks), [značky](#nody-nodes-a-znacky-marks) a [funkcionality](https://tiptap.dev/docs/editor/extensions/functionality) vám mohou dát dobrou představu o tom, jak přistupovat k vašim vlastním rozšířením. Abychom usnadnili přechod mezi dokumentací a zdrojovým kódem, odkazujeme na soubor na GitHubu z každé stránky dokumentace jednotlivých rozšíření.

Doporučujeme začít s přizpůsobením existujících rozšíření a později, se získanými znalostmi, vytvářet vlastní rozšíření.

### Vytvoření nového rozšíření

Můžete volně vytvářet vlastní rozšíření pro Tiptap. Zde je základní kód potřebný k vytvoření a registraci vlastního rozšíření:

```javascript
import { Extension } from '@tiptap/core'
import { Editor } from '@tiptap/react' // Assuming React environment
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

const CustomExtension = Extension.create({
  name: 'myCustomExtension', // Název je důležitý!
  // Vaše logika rozšíření zde
})

// Použití v editoru:
// const editor = new Editor({
//   extensions: [
//     Document,
//     Paragraph,
//     Text,
//     CustomExtension,
//     // ... další rozšíření
//   ],
//   content: '<p>Hello World!</p>',
// })
```

Můžete snadno vytvořit nové rozšíření pomocí našeho CLI:
```bash
npm init tiptap-extension
```
Více se dozvíte o vlastních rozšířeních v naší [příručce o vlastních rozšířeních](#vlastni-rozsireni-custom-extensions).

## Základní Koncepty

### Nody (Nodes) a Značky (Marks)

Pokud si představíte dokument jako strom, pak **nody** jsou typy obsahu v tomto stromu. Příklady nodů jsou odstavce, nadpisy nebo bloky kódu. Nody však nemusí být blokové. Mohou být také vykresleny inline s textem, například pro @zmínky. Přemýšlejte o nich jako o jedinečných kouscích obsahu, které lze různě stylovat a manipulovat s nimi.

**Značky** lze aplikovat na specifické části nodu. To je případ **tučného**, *kurzívního* nebo <del>přeškrtnutého</del> textu. [Odkazy](https://tiptap.dev) jsou také značky. Přemýšlejte o nich jako o způsobu, jak stylovat nebo anotovat text.

#### Rozdíly

Nody a značky jsou v některých ohledech podobné, ale mají různé případy použití. Nody jsou stavebními kameny vašeho dokumentu. Definují strukturu a hierarchii vašeho obsahu. Značky se naopak používají ke stylování nebo anotaci textu. Lze je aplikovat na jakoukoli část nodu, ale nemění strukturu dokumentu.

### Schémata v Tiptap (Schemas)

Na rozdíl od mnoha jiných editorů je Tiptap založen na [schématu](https://prosemirror.net/docs/guide/#schema), které definuje, jak je váš obsah strukturován. To vám umožňuje definovat typy nodů, které se mohou v dokumentu vyskytovat, jejich atributy a způsob, jakým mohou být vnořeny.

Toto schéma je *velmi* striktní. Nemůžete použít žádný HTML element nebo atribut, který není definován ve vašem schématu. Například, pokud vložíte něco jako `Toto je <strong>důležité</strong>` do Tiptapu, ale nemáte žádné rozšíření, které by zpracovávalo tagy `<strong>`, uvidíte pouze `Toto je důležité` – bez tagů strong.

Pokud chcete vědět, kdy se to stane, můžete poslouchat událost [`contentError`](https://tiptap.dev/docs/editor/api/events#contenterror) po povolení volby `enableContentCheck`.

#### Jak schéma vypadá

Když budete pracovat pouze s poskytnutými rozšířeními, nemusíte se o schéma příliš starat. Pokud vytváříte vlastní rozšíření, je pravděpodobně užitečné porozumět, jak schéma funguje. Podívejme se na nejjednodušší schéma pro typický ProseMirror editor:

```javascript
// Podkladové ProseMirror schéma
// {
//   nodes: {
//     doc: {
//       content: 'block+',
//     },
//     paragraph: {
//       content: 'inline*',
//       group: 'block',
//       parseDOM: [{ tag: 'p' }],
//       toDOM: () => ['p', 0],
//     },
//     text: {
//       group: 'inline',
//     },
//   },
// }
```

V Tiptapu je každý nod, značka a rozšíření ve vlastním souboru. Toto nám umožňuje rozdělit logiku. Pod kapotou se celé schéma spojí dohromady:

```javascript
// Tiptap API pro schéma
import { Node } from '@tiptap/core'

const DocumentNode = Node.create({ // Přejmenováno z Document, aby se předešlo konfliktu s globálním Document
  name: 'doc',
  topNode: true,
  content: 'block+',
})

const ParagraphNode = Node.create({ // Přejmenováno z Paragraph
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'p' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', HTMLAttributes, 0]
  },
})

const TextNode = Node.create({ // Přejmenováno z Text
  name: 'text',
  group: 'inline',
})
```

#### Schéma Nodu (Node Schema)

-   **`content`**: Definuje, jaký typ obsahu může nod obsahovat. ProseMirror je v tomto velmi striktní. Obsah, který neodpovídá schématu, je zahozen. Očekává název nebo skupinu jako řetězec. Příklady:
    ```javascript
    // Node.create({
    //   // musí mít jeden nebo více bloků
    //   content: 'block+',
    //   // musí mít nula nebo více bloků
    //   content: 'block*',
    //   // povoluje všechny druhy 'inline' obsahu (text nebo pevné zalomení)
    //   content: 'inline*',
    //   // nesmí mít nic jiného než 'text'
    //   content: 'text*',
    //   // může mít jeden nebo více odstavců, nebo seznamy (pokud jsou použity)
    //   content: '(paragraph|list?)+',
    //   // musí mít přesně jeden nadpis nahoře a jeden nebo více bloků pod ním
    //   content: 'heading block+',
    // })
    ```
-   **`marks`**: Můžete definovat, které značky jsou povoleny uvnitř nodu. Přidejte jeden nebo více názvů nebo skupin značek, povolte všechny nebo zakažte všechny značky:
    ```javascript
    // Node.create({
    //   // povoluje pouze značku 'bold'
    //   marks: 'bold',
    //   // povoluje pouze značky 'bold' a 'italic'
    //   marks: 'bold italic',
    //   // povoluje všechny značky
    //   marks: '_',
    //   // zakazuje všechny značky
    //   marks: '',
    // })
    ```
-   **`group`**: Přidá tento nod do skupiny rozšíření, na kterou lze odkazovat v atributu `content` schématu.
    ```javascript
    // Node.create({
    //   // přidá do skupiny 'block'
    //   group: 'block',
    //   // přidá do skupiny 'inline'
    //   group: 'inline',
    // })
    ```
-   **`inline`**: Nody mohou být vykresleny také inline. Nastavením `inline: true` se nody vykreslují v řádku s textem (např. zmínky). Výsledek je spíše jako značka, ale s funkcionalitou nodu.
-   **`atom`**: Nody s `atom: true` nejsou přímo editovatelné a měly by být považovány za jednu jednotku. Příkladem je rozšíření `Mention`. Pro kopírování jako text použijte `renderText`.
-   **`selectable`**: `true` pro umožnění výběru nodu (NodeSelection).
-   **`draggable`**: `true` pro umožnění přetahování nodu.
-   **`code`**: `true` pro nody obsahující kód.
-   **`whitespace`**: Ovládá, jak se analyzují mezery v tomto nodu (např. `'pre'`).
-   **`defining`**: `true`, pokud má být nod zachován při operacích nahrazení celého obsahu (např. Blockquote, Heading).
-   **`isolating`**: `true` pro nody, které by měly ohraničit kurzor pro běžné editační operace (např. TableCell).
-   **`allowGapCursor`**: (z rozšíření `Gapcursor`) `false` pro zakázání gap kurzoru v nodu.
-   **`tableRole`**: (z rozšíření `Table`) Definuje roli nodu v tabulce (`'table'`, `'row'`, `'cell'`, `'header_cell'`).

#### Schéma Značky (Mark Schema)

-   **`inclusive`**: Pokud nechcete, aby značka byla aktivní, když je kurzor na jejím konci, nastavte na `false` (např. Link).
-   **`excludes`**: Definuje, které značky nesmí koexistovat s touto značkou (např. značka `code` vylučuje všechny ostatní). `' '` vylučuje jakoukoli jinou značku.
-   **`exitable`**: Pokud je nastaveno na `true`, značka bude "opustitelná", když je na konci nodu.
-   **`group`**: Přidá tuto značku do skupiny rozšíření.
-   **`code`**: `true` pro značky obsahující kód.
-   **`spanning`**: `false`, pokud značka nesmí přesahovat více nodů při vykreslování jako HTML.

#### Získání podkladového ProseMirror schématu

Existuje několik případů, kdy potřebujete pracovat s podkladovým schématem (např. pro kolaborativní editaci nebo manuální renderování obsahu jako HTML).

-   **S instancí Editoru**:
    ```javascript
    // import { Editor } from '@tiptap/core' // nebo @tiptap/react
    // const editor = new Editor({ extensions: [/* ... */] })
    // const schema = editor.schema
    ```
-   **Bez instance Editoru**:
    ```javascript
    import { getSchema } from '@tiptap/core'
    import Document from '@tiptap/extension-document'
    import Paragraph from '@tiptap/extension-paragraph'
    import Text from '@tiptap/extension-text'

    const schema = getSchema([
      Document,
      Paragraph,
      Text,
      // ... další rozšíření
    ])
    ```

#### Zpracování nevalidního schématu

Pro sledování a reakci na chyby v obsahu Tiptap podporuje kontrolu, zda poskytnutý obsah odpovídá schématu odvozenému z registrovaných rozšíření.
Nastavte volbu `enableContentCheck` na `true`, což aktivuje kontrolu obsahu a emitování událostí `contentError`. Tyto události lze poslouchat pomocí callbacku `onContentError`.

> **Poznámka**: Kontrola obsahu, kterou Tiptap provádí, je 100% přesná pro typy obsahu JSON. Pokud však poskytnete obsah jako HTML, snažili jsme se co nejlépe upozornit na chybějící nody, ale značky mohou být v určitých situacích přehlédnuty, a proto se standardně vrátí k výchozímu chování odstranění nerozpoznaného obsahu.

-   **Událost `contentError`**: Je emitována, když počáteční `content` poskytnutý při nastavení editoru je nekompatibilní se schématem. V kontextu chyby je poskytnuta funkce `disableCollaboration`.
    Lze zpracovat přes `onContentError` v konfiguraci editoru nebo `editor.on('contentError', ...)`.
-   **Doporučené zpracování**:
    -   Bez kolaborativní editace: Výchozí chování (odstranění neznámého obsahu) je obvykle v pořádku.
    -   S kolaborativní editací: Při `contentError` zvažte:
        ```javascript
        // onContentError({ editor, error, disableCollaboration }) {
        //   // Odstraní rozšíření pro kolaboraci.
        //   disableCollaboration()
        //   const emitUpdate = false
        //   // Zakáže editor, aby se zabránilo dalšímu vstupu uživatele
        //   editor.setEditable(false, emitUpdate)
        //   // Možná zobrazit uživateli upozornění, že je třeba obnovit aplikaci
        // }
        ```

## Vlastní Rozšíření (Custom Extensions)

### Rozšíření existujícího rozšíření

Každé rozšíření má metodu `extend()`, která přijímá objekt se vším, co chcete změnit nebo přidat.

Například změna klávesové zkratky pro `BulletList`:
```javascript
import BulletList from '@tiptap/extension-bullet-list'
// import { Editor } from '@tiptap/react'

// 1. Import rozšíření
// 2. Přepsání klávesových zkratek
const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-l': () => this.editor.commands.toggleBulletList(),
    }
  },
})

// 3. Přidání vlastního rozšíření do editoru
// new Editor({
//   extensions: [
//     CustomBulletList(), // Nezapomeňte na () pokud je to konfigurovatelné rozšíření
//     // …
//   ],
// })
```

-   **`name`**: Název rozšíření se nemění snadno přes `extend()`. Pokud jej chcete změnit, zkopírujte celé rozšíření. Název je součástí JSON výstupu.
-   **`priority`**: Definuje pořadí registrace rozšíření (výchozí `100`). Vyšší priorita = dřívější načtení. Ovlivňuje pořadí pluginů a pořadí ve schématu (např. `Link` vs `Strong`).
-   **`settings` (`addOptions`)**: Změna výchozích nastavení. Použijte `this.parent?.()` pro zachování původních voleb.
    ```javascript
    // import Heading from '@tiptap/extension-heading'
    // const CustomHeading = Heading.extend({
    //   addOptions() {
    //     return {
    //       ...this.parent?.(),
    //       levels: [1, 2, 3], // Pouze H1, H2, H3
    //     }
    //   },
    // })
    ```
-   **`storage` (`addStorage`)**: Uložení proměnlivých dat v instanci rozšíření (`this.storage`). Přístupné zvenčí přes `editor.storage.extensionName.data`.
-   **`schema`**: Úprava [aspektů schématu](https://tiptap.dev/docs/editor/core-concepts/schema) (např. `content`, `draggable`).
-   **`attributes` (`addAttributes`)**: Uložení dodatečných informací.
    -   `default`: Výchozí hodnota.
    -   `renderHTML`: Funkce pro renderování atributu do HTML.
    -   `parseHTML`: Funkce pro parsování atributu z HTML.
    -   `rendered: false`: Zakáže renderování atributu.
    -   Pro rozšíření existujících atributů: `return { ...this.parent?.(), myNewAttribute: { /* ... */ } }`.
-   **Globální atributy (`addGlobalAttributes`)**: Aplikování atributů na více rozšíření najednou. Vrací pole objektů `{ types: ['nodeName1', 'nodeName2'], attributes: { /* ... */ } }`.
-   **Render HTML (`renderHTML`)**: Ovládá, jak se rozšíření renderuje do HTML. Vrací pole (např. `['strong', HTMLAttributes, 0]`, kde `0` je "díra" pro obsah). Použijte `mergeAttributes` z `@tiptap/core`.
-   **Parse HTML (`parseHTML`)**: Definuje, jak se editor dokument načítá z HTML. Vrací pole pravidel (např. `{ tag: 'strong' }`). `getAttrs` pro složitější logiku.
-   **Commands (`addCommands`)**: Přidání nebo přepsání příkazů.
    ```javascript
    // import Paragraph from '@tiptap/extension-paragraph'
    // const CustomParagraph = Paragraph.extend({
    //   addCommands() {
    //     return {
    //       setParagraph: // Přejmenovaný příkaz, aby nedošlo ke konfliktu s vestavěným
    //         () =>
    //         ({ commands }) => {
    //           return commands.setNode('paragraph') // Použití commands z parametru
    //         },
    //     }
    //   },
    // })
    ```
    > **Poznámka**: Pro přístup k jiným příkazům uvnitř `addCommands` použijte parametr `commands`, který je mu předán.
-   **Klávesové zkratky (`addKeyboardShortcuts`)**: Přepsání mapy klávesových zkratek.
-   **Input Rules (`addInputRules`)**: Regulární výrazy pro naslouchání vstupům uživatele (markdown zkratky). Použijte `markInputRule`, `nodeInputRule`, `textInputRule` z `@tiptap/core`.
-   **Paste Rules (`addPasteRules`)**: Podobné jako input rules, ale pro vkládaný obsah. Použijte `markPasteRule`, `nodePasteRule`, `textPasteRule`.
-   **Events**: `onCreate`, `onUpdate`, `onSelectionUpdate`, `onTransaction`, `onFocus`, `onBlur`, `onDestroy`.
-   **Co je dostupné v `this`?**: `this.name`, `this.editor`, `this.type` (ProseMirror typ), `this.options`, `this.parent` (původní rozšíření).
-   **ProseMirror Plugins (Pokročilé) (`addProseMirrorPlugins`)**: Přímý přístup k ProseMirror plugin API. Lze zabalit existující ProseMirror pluginy nebo vytvořit nové s `props` pro event handlery (`handleClick`, `handleDoubleClick`, `handlePaste` atd.).
-   **Node Views (Pokročilé) (`addNodeView`)**: Pro interaktivní uzly pomocí JavaScriptu. Viz sekce [Node Views s Reactem](#node-views-s-reactem).

### Vytvoření úplně nového rozšíření

Syntaxe je stejná jako pro rozšiřování existujících.

-   **Vytvoření Nodu**: Použijte `Node.create({ name: 'customNode', /* ... */ })`. Nody mohou být blokové nebo inline.
-   **Vytvoření Značky**: Použijte `Mark.create({ name: 'customMark', /* ... */ })`. Pro inline formátování.
-   **Vytvoření Rozšíření (funkcionalita)**: Použijte `Extension.create({ name: 'customExtension', /* ... */ })`. Nemohou přidávat do schématu, ale přidávají funkcionalitu.

#### Publikování samostatných rozšíření
Pro vytvoření a publikování vlastních rozšíření můžete použít CLI nástroj:
```bash
npm init tiptap-extension
```
Tento příkaz vytvoří nový adresář s předkonfigurovaným projektem. Pro lokální testování použijte `npm link`.

#### Sdílení
Podělte se o své rozšíření s komunitou, například v [awesome-tiptap](https://github.com/ueberdosis/awesome-tiptap) repozitáři.

## Node Views s Reactem

### Úvod do Node Views

Node views umožňují přidávat interaktivní uzly do editoru. Mohou to být prakticky cokoliv, co lze napsat v JavaScriptu. Jsou skvělé pro vylepšení uživatelského zážitku v editoru a jsou záměrně oddělené od HTML výstupu.

**Různé typy Node Views:**
-   **Editovatelný text**: Kurzor se chová normálně. Příklad: `TaskItem`.
-   **Needitovatelný text**: Kurzor do nich nemůže skočit. Tiptap přidává `contenteditable="false"`. Příklad: Zmínky.
-   **Smíšený obsah**: Kombinace editovatelného a ne-editovatelného textu. Manuálně přidejte `contenteditable="false"` na ne-editovatelné části.

**Markup (značkování pro HTML výstup):**
Editor *neexportuje* vykreslený JavaScriptový uzel. Musíte Tiptapu říci, jak má být váš uzel serializován do HTML (pomocí `renderHTML`) a jak má být z HTML parsován zpět (pomocí `parseHTML`). Pokud ukládáte jako JSON, toto neplatí.

### Použití React komponent v Node Views

Pro renderování React komponent uvnitř editoru:
1.  Vytvořte rozšíření nodu.
2.  Vytvořte React komponentu.
3.  Předajte tuto komponentu do `ReactNodeViewRenderer` z `@tiptap/react`.
4.  Zaregistrujte ji pomocí `addNodeView()` ve vašem rozšíření nodu.
5.  Nakonfigurujte Tiptap, aby používal vaše nové rozšíření.

**Příklad rozšíření nodu:**
```javascript
// Vaše rozšíření nodu (např. MyCustomNode.js)
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import MyReactComponent from './MyReactComponent.jsx' // Vaše React komponenta

export default Node.create({
  name: 'myReactNode',
  group: 'block', // nebo 'inline'
  // ... další konfigurace nodu (atom, draggable, attributes atd.)

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="my-react-node"]', // Jak parsovat z HTML
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'my-react-node', ...HTMLAttributes }, 0] // Jak renderovat do HTML
  },

  addNodeView() {
    return ReactNodeViewRenderer(MyReactComponent)
  },
})
```

Pro správné fungování je potřeba ve vaší React komponentě použít wrapper `NodeViewWrapper` z `@tiptap/react`.

```jsx
// Vaše React komponenta (např. MyReactComponent.jsx)
import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

export default (props) => {
  // props zde obsahují editor, node, getPos, updateAttributes, atd.

  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  return (
    <NodeViewWrapper className="my-react-component-wrapper">
      <div className="label" contentEditable={false}>
        React Node View
      </div>
      <p>
        Počet: <span>{props.node.attrs.count}</span>
      </p>
      <button onClick={increase}>Zvýšit</button>

      {/* Pokud váš uzel má obsah (např. text), použijte NodeViewContent */}
      {/* <NodeViewContent className="content-area" /> */}
    </NodeViewWrapper>
  )
}
```

Tato komponenta zatím neinteraguje s editorem. Pojďme to propojit.

### Přístup k atributům nodu

`ReactNodeViewRenderer` předává vaší React komponentě několik užitečných props. Jedním z nich je `node`. Pokud jste přidali atribut `count` do vašeho rozšíření nodu (jako v příkladu výše), můžete k němu přistupovat takto:

```javascript
props.node.attrs.count
```

### Aktualizace atributů nodu

Atributy nodu můžete dokonce aktualizovat přímo z vaší komponenty pomocí prop `updateAttributes`. Předáte jí objekt s aktualizovanými atributy:

```javascript
// Uvnitř vaší React komponenty
const increase = () => {
  props.updateAttributes({
    count: props.node.attrs.count + 1,
  })
}
```
Toto je plně reaktivní.

### Přidání editovatelného obsahu (`NodeViewContent`)

Komponenta `NodeViewContent` vám pomůže přidat editovatelný obsah do vašeho node view.

```jsx
import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

export default (props) => {
  return (
    <NodeViewWrapper className="react-component">
      <span className="label" contentEditable={false}> {/* Needitovatelný label */}
        React Komponenta s obsahem
      </span>

      {/* Oblast, kam může uživatel psát, pokud je povoleno ve schématu nodu */}
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  )
}
```
Mějte na paměti, že tento obsah je renderován Tiptapem. To znamená, že musíte definovat, jaký typ obsahu je povolen (např. `content: 'inline*'` ve vašem rozšíření nodu).

Komponenty `NodeViewWrapper` a `NodeViewContent` standardně renderují HTML tag `<div>` (nebo `<span>` pro inline nody), ale to můžete změnit pomocí prop `as`. Například `<NodeViewContent as="p">` by renderovalo odstavec. Jedno omezení: tento tag se nesmí měnit za běhu.

### Změna výchozího tagu pro *obalový* DOM element Node View
Pro změnu HTML tagu, který obaluje celou vaši React Node View komponentu (standardně `div` nebo `span` v závislosti na `inline` nastavení nodu), můžete použít volbu `tag` v `ReactNodeViewRendererOptions`.

```javascript
// Ve vašem rozšíření nodu
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import MyReactComponent from './MyReactComponent.jsx'

export default Node.create({
  name: 'myCustomReactNode',
  // ... konfigurace
  inline: false, // Pro blokový uzel

  addNodeView() {
    return ReactNodeViewRenderer(MyReactComponent, {
      tag: 'article', // NodeViewWrapper bude renderován jako <article>
    })
  },
})
```

### Změna výchozího tagu pro *obsahový* DOM element (`contentDOMElementTag`)
Pokud váš React Node View používá `NodeViewContent` pro zobrazení editovatelného obsahu, Tiptap interně vytvoří DOM element, do kterého se tento obsah renderuje. Standardně je to `div`. Pokud chcete změnit typ tohoto interního elementu, můžete použít volbu `contentDOMElementTag` v `ReactNodeViewRendererOptions`:

```javascript
// Ve vašem rozšíření nodu
// ...
addNodeView() {
  return ReactNodeViewRenderer(MyReactComponent, {
    // NodeViewContent bude renderovat svůj obsah do <main> elementu
    // POZNÁMKA: Toto neovlivní tag, který renderuje samotná komponenta NodeViewContent,
    // ale element, který ProseMirror použije pro obsah nodu.
    contentDOMElementTag: 'main',
  })
}
// ...
```
Toto je užitečné, pokud potřebujete specifickou sémantickou strukturu pro obsah vašeho nodu, který je spravován ProseMirror.

### Všechny dostupné props pro React Node View komponentu

| Prop               | Popis                                                                       |
| ------------------ | --------------------------------------------------------------------------- |
| `editor`           | Instance editoru                                                            |
| `node`             | Aktuální ProseMirror uzel                                                     |
| `decorations`      | Pole dekorací aplikovaných na uzel                                          |
| `selected`         | `true`, pokud je na aktuálním node view `NodeSelection`                   |
| `extension`        | Přístup k rozšíření nodu (např. pro získání voleb)                         |
| `getPos()`         | Funkce vracející pozici aktuálního nodu v dokumentu                         |
| `updateAttributes()` | Funkce pro aktualizaci atributů aktuálního nodu                             |
| `deleteNode()`     | Funkce pro smazání aktuálního nodu                                          |

### Přetahování (Dragging)

Aby vaše React node views byly přetahovatelné:
1.  Nastavte `draggable: true` ve schématu vašeho rozšíření nodu.
2.  Přidejte atribut `data-drag-handle` na DOM element uvnitř vaší React komponenty, který má fungovat jako úchyt pro přetažení. `NodeViewWrapper` toto podporuje automaticky, pokud `draggable` je `true` na nodu.

```jsx
// Uvnitř vaší React komponenty
// ...
return (
  <NodeViewWrapper className="my-draggable-node" data-drag-handle>
    {/* Úchyt pro přetažení bude tento wrapper */}
    <p>Přetáhni mě!</p>
    {/* ... zbytek komponenty ... */}
  </NodeViewWrapper>
)
// ...
```

---

## Konkrétní Rozšíření (Příklady z Dokumentace)

### TextStyle extension (`@tiptap/extension-text-style`)

Toto rozšíření (mark) renderuje HTML tag `<span>` a umožňuje přidávat seznam atributů souvisejících se stylováním, například `font-family`, `font-size` nebo `color`. Rozšíření samo o sobě nepřidává žádné stylovací atributy, ale jiná rozšíření jej používají jako základ, například [`FontFamily`](#fontfamily-extension-tiptapextension-font-family) nebo [`Color`](https://tiptap.dev/docs/editor/extensions/functionality/color).

[![Version](https://img.shields.io/npm/v/@tiptap/extension-text-style.svg?label=version)](https://www.npmjs.com/package/@tiptap/extension-text-style)
[![Downloads](https://img.shields.io/npm/dm/@tiptap/extension-text-style.svg)](https://npmcharts.com/compare/@tiptap/extension-text-style?minimal=true)

#### Instalace

```bash
npm install @tiptap/extension-text-style
```

#### Příkazy

-   **`removeEmptyTextStyle()`**: Odstraní tagy `<span>` bez inline stylu.
    ```javascript
    editor.chain().focus().removeEmptyTextStyle().run()
    ```

#### Zdrojový kód

[packages/extension-text-style/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-style/)

---

### FontFamily extension (`@tiptap/extension-font-family`)

Toto rozšíření umožňuje nastavit rodinu písma (font family) v editoru. Používá značku [`TextStyle`](#textstyle-extension-tiptapextension-text-style), která renderuje tag `<span>`. Rodina písma je aplikována jako inline styl, například `<span style="font-family: Arial">`.

[![Version](https://img.shields.io/npm/v/@tiptap/extension-font-family.svg?label=version)](https://www.npmjs.com/package/@tiptap/extension-font-family)
[![Downloads](https://img.shields.io/npm/dm/@tiptap/extension-font-family.svg)](https://npmcharts.com/compare/@tiptap/extension-font-family?minimal=true)

> **Pozor!**
> Mějte na paměti, že `editor.isActive('textStyle', { fontFamily: 'Font Family' })` vrátí rodinu písma tak, jak je nastavena [pravidly CSS prohlížeče](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#family-name), a ne tak, jak byste očekávali při nastavování rodiny písma.

#### Instalace

Toto rozšíření vyžaduje značku `TextStyle`.

```bash
npm install @tiptap/extension-text-style @tiptap/extension-font-family
```

#### Nastavení (Settings)

-   **`types`**: Seznam značek, na které by měl být aplikován atribut rodiny písma.
    -   Výchozí: `['textStyle']`
    ```javascript
    import FontFamily from '@tiptap/extension-font-family'
    import TextStyle from '@tiptap/extension-text-style'
    // ...
    // extensions: [
    //   TextStyle.configure({ types: [FontFamily.name] }), // Příklad, jak by to mohlo být potřeba nakonfigurovat
    //   FontFamily.configure({
    //     types: ['textStyle'],
    //   }),
    // ]
    ```
    Správnější konfigurace pro `TextStyle` a `FontFamily` by měla zajistit, že `FontFamily` může aplikovat své styly na `TextStyle` mark. Typická konfigurace:
    ```javascript
    // extensions: [
    //   TextStyle, // TextStyle samotný nepotřebuje konfiguraci typů pro FontFamily
    //   FontFamily, // FontFamily implicitně používá textStyle
    // ]
    // Pokud potřebujete rozšířit, na které typy značek se fontFamily aplikuje:
    // extensions: [
    //   MyCustomMark,
    //   TextStyle,
    //   FontFamily.configure({
    //     types: ['textStyle', 'myCustomMark'], // Aplikuj fontFamily i na MyCustomMark
    //   })
    // ]
    ```
    Většinou postačí základní import bez `configure`, pokud používáte jen `TextStyle`.

#### Příkazy

-   **`setFontFamily()`**: Aplikuje danou rodinu písma jako inline styl.
    ```javascript
    editor.chain().focus().setFontFamily('Inter').run()
    ```
-   **`unsetFontFamily()`**: Odstraní jakoukoli rodinu písma.
    ```javascript
    editor.chain().focus().unsetFontFamily().run()
    ```

#### Zdrojový kód

[packages/extension-font-family/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-font-family/)

---

Tento dokument by měl poskytnout komplexní základ pro práci s Tiptap rozšířeními v Reactu. Pro další specifické případy a pokročilé techniky se vždy odkazujte na oficiální dokumentaci Tiptap a zdrojové kódy jednotlivých rozšíření.


## `FontFamily` a `Color`

následující sekce popisuje Tiptap rozšíření `FontFamily` a `Color`, jejich instalaci, konfiguraci a použití v React aplikacích s editorem Tiptap.

**Navigace:** [Editor](/docs/editor/getting-started/overview) / [Extensions](/docs/editor/extensions/overview) / [Functionality](/docs/editor/extensions/functionality)

---

## FontFamily extension

[![Version](https://img.shields.io/npm/v/@tiptap/extension-font-family.svg?label=version)](https://www.npmjs.com/package/@tiptap/extension-font-family)
[![Downloads](https://img.shields.io/npm/dm/@tiptap/extension-font-family.svg)](https://npmcharts.com/compare/@tiptap/extension-font-family?minimal=true)

Toto rozšíření umožňuje nastavit rodinu písma v editoru. Používá značku [`TextStyle`](/docs/editor/extensions/marks/text-style), která renderuje tag `<span>`. Rodina písma je aplikována jako inline styl, například `<span style="font-family: Arial">`.

### Ukázka

<iframe title="Tiptap FontFamily Extension Preview" src="https://embed.tiptap.dev/preview/Extensions/FontFamily" style="width: 100%; height: 450px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;"></iframe>

> **Pozor!**
> Mějte na paměti, že `editor.isActive('textStyle', { fontFamily: 'Font Family' })` vrátí rodinu písma tak, jak je nastavena [CSS pravidly prohlížeče](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#family-name), a ne tak, jak byste očekávali při nastavování rodiny písma.

### Instalace

Pro instalaci tohoto rozšíření a jeho závislosti `TextStyle` spusťte následující příkaz:

```bash
npm install @tiptap/extension-text-style @tiptap/extension-font-family
```

Toto rozšíření vyžaduje, aby byla v editoru také zaregistrována značka [`TextStyle`](/docs/editor/extensions/marks/text-style).

### Nastavení

#### `types`

Určuje seznam typů značek (marks), na které se má atribut `fontFamily` aplikovat.

-   **Výchozí hodnota:** `['textStyle']`
-   **Příklad konfigurace:**

    ```javascript
    import FontFamily from '@tiptap/extension-font-family';
    import TextStyle from '@tiptap/extension-text-style';

    // V konfiguraci vašeho Tiptap editoru:
    // extensions: [
    //   TextStyle.configure(), // TextStyle musí být zahrnuto
    //   FontFamily.configure({
    //     types: ['textStyle'], // Můžete přidat další typy, pokud je to potřeba
    //   }),
    //   // ... další rozšíření
    // ],
    ```

### Příkazy

#### `setFontFamily(fontFamily: string)`

Aplikuje zadanou rodinu písma na aktuální výběr nebo na pozici kurzoru.

-   **Parametry:**
    -   `fontFamily` (string): Název rodiny písma (např. `'Arial'`, `'Times New Roman'`).
-   **Příklad použití:**

    ```javascript
    editor.commands.setFontFamily('Inter');
    ```

#### `unsetFontFamily()`

Odstraní jakékoli explicitně nastavené rodiny písma z aktuálního výběru nebo pozice kurzoru, čímž se vrátí k výchozímu písmu.

-   **Příklad použití:**

    ```javascript
    editor.commands.unsetFontFamily();
    ```

### Zdrojový kód

Kompletní zdrojový kód rozšíření naleznete na GitHubu:
[packages/extension-font-family/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-font-family/)

---

## Color extension

[![Version](https://img.shields.io/npm/v/@tiptap/extension-color.svg?label=version)](https://www.npmjs.com/package/@tiptap/extension-color)
[![Downloads](https://img.shields.io/npm/dm/@tiptap/extension-color.svg)](https://npmcharts.com/compare/@tiptap/extension-color?minimal=true)

Toto rozšíření umožňuje nastavit barvu písma v editoru. Používá značku [`TextStyle`](/docs/editor/extensions/marks/text-style), která renderuje tag `<span>`. Barva písma je poté aplikována jako inline styl, například `<span style="color: #958DF1">`.

### Ukázka

<iframe title="Tiptap Color Extension Preview" src="https://embed.tiptap.dev/preview/Extensions/Color" style="width: 100%; height: 450px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;"></iframe>

### Instalace

Pro instalaci tohoto rozšíření a jeho závislosti `TextStyle` spusťte následující příkaz:

```bash
npm install @tiptap/extension-text-style @tiptap/extension-color
```

Toto rozšíření vyžaduje, aby byla v editoru také zaregistrována značka [`TextStyle`](/docs/editor/extensions/marks/text-style).

### Nastavení

#### `types`

Určuje seznam typů značek (marks), na které se má atribut `color` aplikovat.

-   **Výchozí hodnota:** `['textStyle']`
-   **Příklad konfigurace:**

    ```javascript
    import Color from '@tiptap/extension-color';
    import TextStyle from '@tiptap/extension-text-style';

    // V konfiguraci vašeho Tiptap editoru:
    // extensions: [
    //   TextStyle.configure(), // TextStyle musí být zahrnuto
    //   Color.configure({
    //     types: ['textStyle'], // Můžete přidat další typy, pokud je to potřeba
    //   }),
    //   // ... další rozšíření
    // ],
    ```

### Příkazy

#### `setColor(color: string)`

Aplikuje zadanou barvu písma na aktuální výběr nebo na pozici kurzoru.

-   **Parametry:**
    -   `color` (string): Hodnota barvy (např. `'#ff0000'`, `'rgb(255,0,0)'`, `'red'`).
-   **Příklad použití:**

    ```javascript
    editor.commands.setColor('#ff0000');
    ```

#### `unsetColor()`

Odstraní jakoukoli explicitně nastavenou barvu písma z aktuálního výběru nebo pozice kurzoru, čímž se vrátí k výchozí barvě.

-   **Příklad použití:**

    ```javascript
    editor.commands.unsetColor();
    ```

### Zdrojový kód

Kompletní zdrojový kód rozšíření naleznete na GitHubu:
[packages/extension-color/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-color/)