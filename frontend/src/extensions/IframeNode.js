import { Node, mergeAttributes } from "@tiptap/core";

// Função utilitária para sanitizar URLs
function sanitizeUrl(url) {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol;
    // Permitir apenas protocolos seguros
    if (protocol === "http:" || protocol === "https:") {
      return url;
    }
    // Para embeds de e-mail ou FTP, você pode adicionar outras lógicas, mas para iframes, HTTP/S é o principal.
    return null; // Retorna nulo se o protocolo não for permitido
  } catch (error) {
    return null; // Retorna nulo se não for um URL válido
  }
}

// Função para verificar se é um embed do YouTube
function isYouTubeEmbed(src) {
  return (
    src &&
    (src.includes("youtube.com/embed/") ||
      src.includes("youtube-nocookie.com/embed/"))
  );
}

// Permissões de sandbox necessárias para o YouTube funcionar
const YOUTUBE_SANDBOX_PERMISSIONS =
  "allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"; // allow-same-origin é necessário para o player do YouTube funcionar internamente.

// =================================================================
// 1. NÓ PARA IFRAME GENÉRICO (Estável)
// =================================================================
export const IframeNode = Node.create({
  name: "iframe",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => sanitizeUrl(element.getAttribute("src")),
        renderHTML: (attributes) => {
          const sanitizedSrc = sanitizeUrl(attributes.src);
          return sanitizedSrc ? { src: sanitizedSrc } : {};
        },
      },
      frameborder: { default: "0" },
      allowfullscreen: { default: true },
      allow: {
        default:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      },
      width: { default: "100%" },
      height: { default: "450" },
      style: { default: "border:0;" },
      title: {
        default: "Embedded content",
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          return { title: attributes.title || "Embedded content" };
        },
      },
      loading: {
        default: "lazy",
        parseHTML: (element) => element.getAttribute("loading"),
        renderHTML: (attributes) => ({ loading: attributes.loading || "lazy" }),
      },
      sandbox: {
        // Se o src for do YouTube, use as permissões específicas.
        // Caso contrário, use um padrão seguro que não inclua 'allow-same-origin'.
        default: "allow-popups allow-forms allow-scripts", // Padrão seguro para não-YouTube
        parseHTML: (element) => element.getAttribute("sandbox"),
        renderHTML: (attributes) => {
          if (isYouTubeEmbed(attributes.src)) {
            return { sandbox: YOUTUBE_SANDBOX_PERMISSIONS };
          }
          // Fallback para o padrão seguro para outros iframes
          return {
            sandbox:
              attributes.sandbox || "allow-popups allow-forms allow-scripts",
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    // Certifica-se que o wrapper está lá e o iframe mescla os atributos
    return [
      "div",
      { class: "content-iframe-wrapper" }, // Este wrapper será usado para centralizar via CSS
      ["iframe", mergeAttributes(HTMLAttributes)],
    ];
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          const sanitizedSrc = sanitizeUrl(options.src);
          if (!sanitizedSrc) {
            console.warn(
              "Tentativa de definir iframe com URL inválido ou inseguro:",
              options.src
            );
            return false;
          }

          // Determina as permissões de sandbox com base no URL
          let finalSandbox = options.sandbox; // Permite que o usuário sobrescreva se quiser
          if (!finalSandbox) {
            // Se o sandbox não foi explicitamente fornecido
            if (isYouTubeEmbed(sanitizedSrc)) {
              finalSandbox = YOUTUBE_SANDBOX_PERMISSIONS;
            } else {
              finalSandbox = "allow-popups allow-forms allow-scripts"; // Padrão seguro
            }
          }

          return commands.insertContent({
            type: this.name,
            attrs: {
              src: sanitizedSrc,
              sandbox: finalSandbox,
              ...options, // Garante que outras opções personalizadas ainda funcionem
            },
          });
        },
    };
  },
});

// =================================================================
// 2. NÓ DO INSTAGRAM COM NODEVIEW E RENDERHTML (COMPLETO)
// =================================================================
export const InstagramNode = Node.create({
  name: "instagram",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      permalink: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-instgrm-permalink"),
      },
    };
  },

  parseHTML() {
    return [{ tag: "blockquote.instagram-media[data-instgrm-permalink]" }];
  },

  // **PARTE 1: RENDERHTML PARA SALVAR CORRETAMENTE**
  // Esta função é usada pelo editor.getHTML() para gerar o HTML final.

  renderHTML({ HTMLAttributes }) {
    const attrs = {
      class: "instagram-media",
      "data-instgrm-permalink": HTMLAttributes.permalink,
      "data-instgrm-version": "14",
      "data-instgrm-captioned": "",
    };
    return ["div", { class: "instagram-embed-wrapper" }, ["blockquote", attrs]];
  },

  // **PARTE 2: NODEVIEW PARA EXIBIR CORRETAMENTE NO EDITOR**
  // Esta função controla como o nó aparece e se comporta DENTRO do editor.
  addNodeView() {
    return (props) => {
      const { node } = props;

      const dom = document.createElement("div");
      const blockquote = document.createElement("blockquote");
      blockquote.classList.add("instagram-media");
      blockquote.setAttribute("data-instgrm-permalink", node.attrs.permalink);
      dom.appendChild(blockquote);

      return {
        dom,
        // A função update também fica simples
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false;
          blockquote.setAttribute(
            "data-instgrm-permalink",
            updatedNode.attrs.permalink
          );
          return true;
        },
      };
    };
  },

  addCommands() {
    return {
      setInstagram:
        (options) =>
        ({ commands }) => {
          if (!options.permalink) return false;
          return commands.insertContent({
            type: this.name,
            attrs: { permalink: options.permalink },
          });
        },
    };
  },
});
