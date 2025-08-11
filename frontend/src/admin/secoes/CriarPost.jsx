import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "tiptap-extension-font-size";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Cropper from "react-easy-crop";
import PropTypes from "prop-types";
import { IframeNode, InstagramNode } from "../../extensions/IframeNode";
import {
  FaBold,
  FaItalic,
  FaHeading,
  FaListUl,
  FaListOl,
  FaLink,
  FaUnlink,
  FaImage,
  FaVideo,
  FaCheck,
  FaTimes,
  FaTrashAlt,
  FaSave,
  FaFont,
  FaTextHeight,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaCalendarAlt,
  FaPaperPlane,
} from "react-icons/fa";
import "../../styles/CriarPost.css";
import CustomSelect from "../ui/CustomSelect";
import "../../styles/CustomSelect.css";

const MAX_INLINE_IMAGE_SIZE_MB = 5;
const MAX_FEATURE_IMAGE_SIZE_MB = 5;
const AUTOSAVE_DELAY = 10000; // 10 segundos

const FONT_FAMILY_OPTIONS = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "Times New Roman, Times, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];
const FONT_SIZE_OPTIONS = [
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "24", value: "24px" },
  { label: "30", value: "30px" },
];

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const i = new window.Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.crossOrigin = "anonymous";
    i.src = url;
  });
async function getCroppedImgUtil(imageSrc, pixelCrop) {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    });
  } catch (e) {
    return null;
  }
}

const TiptapToolbar = React.memo(
  ({ editor, onSetLink, onAddImageFromFile, onInsertEmbed }) => {
    // CORREÇÃO: Força a re-renderização do componente em QUALQUER atualização do editor.
    // Isso garante que os botões e seletores sempre reflitam o estado atual.
    const [_, forceUpdate] = useState(0);
    useEffect(() => {
      if (!editor) return;

      const handleUpdate = () => {
        forceUpdate((prev) => prev + 1); // Apenas incrementa para forçar a renderização
      };

      // O evento 'update' é disparado para cada transação (mudança de atributo, conteúdo, etc.)
      // Manter ambos 'update' e 'selectionUpdate' é a abordagem mais segura para cobrir todos os casos.
      editor.on("update", handleUpdate);
      editor.on("selectionUpdate", handleUpdate);

      return () => {
        editor.off("update", handleUpdate);
        editor.off("selectionUpdate", handleUpdate);
      };
    }, [editor]);

    // O 'if' abaixo previne erros caso o editor ainda não tenha sido inicializado.
    if (!editor) {
      return null;
    }

    // Funções auxiliares para legibilidade
    const toggleMark = (mark) => editor.chain().focus().toggleMark(mark).run();
    const toggleBlock = (block, options) =>
      editor.chain().focus()[`toggle${block}`](options).run();
    const isActive = (name, options) => editor.isActive(name, options);
    const setTextAlign = (alignment) =>
      editor.chain().focus().setTextAlign(alignment).run();

    // Graças ao 'forceUpdate', estas variáveis sempre terão os valores mais recentes do editor.
    const currentFontFamily =
      editor.getAttributes("textStyle").fontFamily || "";
    const currentFontSize = editor.getAttributes("textStyle").fontSize || "";

    return (
      <div className="tiptap-toolbar">
        <button
          type="button"
          onClick={() => toggleMark("bold")}
          className={isActive("bold") ? "is-active" : ""}
          title="Negrito"
        >
          <FaBold />
        </button>
        <button
          type="button"
          onClick={() => toggleMark("italic")}
          className={isActive("italic") ? "is-active" : ""}
          title="Itálico"
        >
          <FaItalic />
        </button>
        <div className="tiptap-toolbar-group">
          <FaFont className="toolbar-icon-label" />
          <CustomSelect
            options={[{ label: "Padrão", value: "" }, ...FONT_FAMILY_OPTIONS]}
            selectedValue={currentFontFamily}
            onChange={(value) =>
              editor.chain().focus().setFontFamily(value).run()
            }
          />
        </div>
        <div className="tiptap-toolbar-group">
          <FaTextHeight className="toolbar-icon-label" />
          <CustomSelect
            options={[{ label: "Padrão", value: "" }, ...FONT_SIZE_OPTIONS]}
            selectedValue={currentFontSize}
            onChange={(value) =>
              editor.chain().focus().setFontSize(value).run()
            }
          />
        </div>
        <button
          type="button"
          onClick={() => toggleBlock("Heading", { level: 2 })}
          className={isActive("heading", { level: 2 }) ? "is-active" : ""}
          title="H2"
        >
          <FaHeading />2
        </button>
        <button
          type="button"
          onClick={() => toggleBlock("Heading", { level: 3 })}
          className={isActive("heading", { level: 3 }) ? "is-active" : ""}
          title="H3"
        >
          <FaHeading />3
        </button>
        <button
          type="button"
          onClick={() => toggleBlock("BulletList")}
          className={isActive("bulletList") ? "is-active" : ""}
          title="Lista"
        >
          <FaListUl />
        </button>
        <button
          type="button"
          onClick={() => toggleBlock("OrderedList")}
          className={isActive("orderedList") ? "is-active" : ""}
          title="Lista Numerada"
        >
          <FaListOl />
        </button>
        <button
          type="button"
          onClick={onSetLink}
          className={isActive("link") ? "is-active" : ""}
          title="Adicionar/Editar Link"
        >
          <FaLink />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!isActive("link")}
          title="Remover Link"
        >
          <FaUnlink />
        </button>
        <button
          type="button"
          onClick={() => setTextAlign("left")}
          className={isActive({ textAlign: "left" }) ? "is-active" : ""}
          title="Alinhar à Esquerda"
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          onClick={() => setTextAlign("center")}
          className={isActive({ textAlign: "center" }) ? "is-active" : ""}
          title="Alinhar ao Centro"
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          onClick={() => setTextAlign("right")}
          className={isActive({ textAlign: "right" }) ? "is-active" : ""}
          title="Alinhar à Direita"
        >
          <FaAlignRight />
        </button>
        <button
          type="button"
          onClick={() => setTextAlign("justify")}
          className={isActive({ textAlign: "justify" }) ? "is-active" : ""}
          title="Justificar"
        >
          <FaAlignJustify />
        </button>
        <button
          type="button"
          title="Adicionar Imagem ao Conteúdo"
          onClick={onAddImageFromFile}
        >
          <FaImage />
        </button>
        <button
          type="button"
          title="Inserir vídeo/embed"
          onClick={onInsertEmbed}
        >
          <FaVideo />
        </button>
      </div>
    );
  }
);

TiptapToolbar.displayName = "TiptapToolbar";

const CriarPost = ({
  onPostCreated = () => {},
  onPostUpdated = () => {},
  onCancelEdit = () => {},
  apiClient,
  authorName = "Admin",
  postToEdit = null,
  showFeedback = () => {},
}) => {
  const isEditMode = Boolean(postToEdit);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [categoria, setCategoria] = useState("noticias");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalCroppedImage, setFinalCroppedImage] = useState(null);
  const [finalCroppedImageUrl, setFinalCroppedImageUrl] = useState("");
  const [featureImageCaption, setFeatureImageCaption] = useState("");
  const [removeFeatureImage, setRemoveFeatureImage] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const fileInputRef = useRef(null);
  const tiptapImageInputRef = useRef(null);

  const [draftId, setDraftId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle");
  const autoSaveTimer = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({
        placeholder: "Comece a escrever sua publicação...",
      }),
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      IframeNode,
      InstagramNode,
    ],
    content: "",
    editorProps: {
      attributes: { class: "prose-editor" },
    },
    onUpdate: () => {
      setIsDirty(true);
      // Toda vez que o editor for atualizado, chamamos nossa função debounced.
      debouncedProcessEmbeds();
    },
  });

  const resetForm = useCallback(() => {
    setTitulo("");
    setSubtitulo("");
    setCategoria("noticias");
    if (editor) {
      editor.commands.clearContent(true);
    }
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setFinalCroppedImage(null);
    setFinalCroppedImageUrl("");
    setFeatureImageCaption("");
    setRemoveFeatureImage(false);
    setScheduledDate("");
    setScheduledTime("");
    setError(null);
    setIsDirty(false);
    setAutoSaveStatus("idle");
    setDraftId(null);
    clearTimeout(autoSaveTimer.current);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showFeedback("info", "Formulário limpo para a próxima postagem.");
  }, [editor, showFeedback]);

  const debouncedProcessEmbeds = useDebouncedCallback(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, 300);

  // 3. O useEffect agora só se preocupa em CARREGAR o script.
  useEffect(() => {
    const scriptId = "instagram-embed-script";
    if (document.getElementById(scriptId)) {
      // Se o script já existe, o onUpdate cuidará do resto.
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setTitulo(postToEdit.titulo || "");
      setSubtitulo(postToEdit.subtitulo || "");
      setCategoria(postToEdit.categoria || "noticias");
      setFeatureImageCaption(postToEdit.legendaImagemDestaque || "");
      if (postToEdit.imagem) setFinalCroppedImageUrl(postToEdit.imagem);
      if (postToEdit.data_agendamento) {
        const d = new Date(postToEdit.data_agendamento);
        setScheduledDate(d.toISOString().split("T")[0]);
        setScheduledTime(d.toTimeString().split(" ")[0].substring(0, 5));
      }
      if (postToEdit.status === "draft" || isEditMode) {
        setDraftId(postToEdit.id);
      }
      setIsDirty(false);
    }
  }, [postToEdit, isEditMode, editor, resetForm]);

  useEffect(() => {
    if (
      isEditMode &&
      editor &&
      postToEdit?.conteudo &&
      editor.getHTML() !== postToEdit.conteudo
    ) {
      editor.commands.setContent(postToEdit.conteudo);
    }
  }, [isEditMode, editor, postToEdit?.conteudo]);

  const handleSave = useCallback(
    async (statusToSet = "publicado") => {
      if (!titulo.trim() && statusToSet !== "draft") {
        setError("O campo Título é obrigatório.");
        showFeedback("error", "O campo Título é obrigatório.");
        return;
      }
      if (imageSrc) {
        setError(
          "Confirme ou cancele o corte da imagem de destaque antes de salvar."
        );
        showFeedback(
          "warning",
          "Confirme ou cancele o corte da imagem antes de salvar."
        );
        return;
      }

      if (statusToSet === "draft") setAutoSaveStatus("saving");
      else setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("titulo", titulo.trim());
      formData.append("subtitulo", subtitulo.trim());
      formData.append("conteudo", editor.getHTML());
      formData.append("categoria", categoria);
      formData.append("autor", authorName || "Admin");
      formData.append("legendaImagemDestaque", featureImageCaption);
      formData.append("status", statusToSet);

      if (finalCroppedImage)
        formData.append("imagem", finalCroppedImage, "destaque.jpg");
      if (removeFeatureImage) formData.append("removerImagem", "true");

      if (scheduledDate && statusToSet !== "draft") {
        const fullScheduledDateTime = `${scheduledDate}T${
          scheduledTime || "00:00"
        }:00`;
        formData.append(
          "dataAgendamento",
          new Date(fullScheduledDateTime).toISOString()
        );
      }

      try {
        const currentPostId = isEditMode ? postToEdit.id : draftId;
        const response = currentPostId
          ? await apiClient.put(`/api/postagens/${currentPostId}`, formData)
          : await apiClient.post("/api/postagens", formData);

        if (response.data?.success) {
          setIsDirty(false);
          if (statusToSet === "draft") {
            if (!currentPostId) {
              setDraftId(response.data.data.id);
            }
            setAutoSaveStatus("saved");
            const time = new Date().toLocaleTimeString("pt-BR");
            showFeedback("info", `Rascunho salvo às ${time}`);
            setTimeout(() => setAutoSaveStatus("idle"), 3000);
          } else {
            showFeedback(
              "success",
              `Postagem ${isEditMode ? "atualizada" : "criada"} com sucesso!`
            );
            if (isEditMode) {
              onPostUpdated();
            } else {
              onPostCreated();
              resetForm();
            }
          }
        } else {
          throw new Error(response.data?.message);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Erro de comunicação.";
        setError(errorMessage);
        showFeedback("error", errorMessage);
        if (statusToSet === "draft") setAutoSaveStatus("idle");
      } finally {
        if (statusToSet !== "draft") setIsSubmitting(false);
      }
    },
    [
      editor,
      titulo,
      subtitulo,
      categoria,
      authorName,
      featureImageCaption,
      finalCroppedImage,
      removeFeatureImage,
      scheduledDate,
      scheduledTime,
      imageSrc,
      isSubmitting, // Removido isSubmitting da dependência para evitar loop
      postToEdit,
      draftId,
      isEditMode,
      apiClient,
      onPostUpdated,
      onPostCreated,
      showFeedback,
      resetForm,
    ]
  );

  useEffect(() => {
    if (isDirty && titulo) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        handleSave("draft");
      }, AUTOSAVE_DELAY);
    }
    return () => clearTimeout(autoSaveTimer.current);
  }, [isDirty, titulo, handleSave]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(autoSaveTimer.current);
    handleSave("publicado");
  };

  const handleManualDraftSave = () => {
    clearTimeout(autoSaveTimer.current);
    handleSave("draft");
  };

  const handleInputChange = (setter) => (e) => {
    setIsDirty(true);
    setter(e.target.value);
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL", editor.getAttributes("link").href || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleAddImageClick = useCallback(
    () => tiptapImageInputRef.current?.click(),
    []
  );

  const setEmbed = useCallback(() => {
    if (!editor) return;

    const input = window.prompt(
      "Cole a URL ou o código <iframe> (YouTube, LinkedIn, Instagram, etc.):",
      ""
    );
    if (!input) return;

    const trimmed = input.trim();

    // 1. Prioridade Máxima: É uma tag <iframe> colada diretamente?
    if (trimmed.startsWith("<iframe")) {
      const doc = new DOMParser().parseFromString(trimmed, "text/html");
      const iframe = doc.querySelector("iframe");
      if (iframe) {
        const attrs = {};
        [
          "src",
          "width",
          "height",
          "style",
          "allow",
          "allowfullscreen",
          "frameborder",
        ].forEach((key) => {
          const val = iframe.getAttribute(key);
          if (val) attrs[key] = val;
        });
        editor.chain().focus().setIframe(attrs).run();
        return;
      }
    }

    // Tenta converter URLs para um formato de embed antes de continuar
    let embedUrl = trimmed;
    let isInstagram = false;

    // 2. É um link do Instagram?
    if (
      trimmed.includes("instagram.com/p/") ||
      trimmed.includes("instagram.com/reel/")
    ) {
      const permalinkMatch = trimmed.match(
        /(https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/[\w-]+)/
      );
      if (permalinkMatch?.[0]) {
        isInstagram = true;
        embedUrl = permalinkMatch[0];
      }
    }
    // 3. É um link do YouTube? Converte para a URL de embed "no-cookie".
    else if (trimmed.includes("youtube.com/watch?v=")) {
      const videoId = new URL(trimmed).searchParams.get("v");
      if (videoId) {
        embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    } else if (trimmed.includes("youtu.be/")) {
      const videoId = new URL(trimmed).pathname.substring(1);
      if (videoId) {
        embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    }

    // Agora, executa o comando correto com base no que foi encontrado
    if (isInstagram) {
      editor.chain().focus().setInstagram({ permalink: embedUrl }).run();
    } else if (embedUrl.startsWith("http")) {
      // Para YouTube, LinkedIn, etc.
      editor.chain().focus().setIframe({ src: embedUrl }).run();
    } else {
      alert("Formato de embed não reconhecido ou URL inválida.");
    }
  }, [editor]);

  const handleTiptapImageUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;
      if (file.size > MAX_INLINE_IMAGE_SIZE_MB * 1024 * 1024) {
        alert(`Imagem excede ${MAX_INLINE_IMAGE_SIZE_MB}MB.`);
        return;
      }
      setIsDirty(true);
      const formData = new FormData();
      formData.append("imagem", file);
      try {
        const response = await apiClient.post("/api/upload/imagem", formData);
        if (response.data?.data?.imageUrl)
          editor
            .chain()
            .focus()
            .setImage({ src: response.data.data.imageUrl })
            .run();
      } catch (err) {
        console.error(err);
        alert("Falha no upload da imagem.");
      }
    },
    [editor, apiClient]
  );

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FEATURE_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Imagem excede ${MAX_FEATURE_IMAGE_SIZE_MB}MB.`);
      return;
    }
    setIsDirty(true);
    setRemoveFeatureImage(false);
    setFinalCroppedImage(null);
    setFinalCroppedImageUrl("");
    setImageSrc(URL.createObjectURL(file));
  };

  const onCropComplete = useCallback(
    (_, pixels) => setCroppedAreaPixels(pixels),
    []
  );

  const handleConfirmCrop = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImgUtil(imageSrc, croppedAreaPixels);
    if (croppedBlob) {
      setIsDirty(true);
      setFinalCroppedImage(croppedBlob);
      setFinalCroppedImageUrl(URL.createObjectURL(croppedBlob));
      setImageSrc(null);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleCancelCrop = useCallback(() => {
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleRemoveFinalImage = useCallback(() => {
    setIsDirty(true);
    setFinalCroppedImage(null);
    setFinalCroppedImageUrl("");
    if (isEditMode) setRemoveFeatureImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [isEditMode]);

  const categoriaOptions = [
    { label: "Notícias", value: "noticias" },
    { label: "Blog", value: "blog" },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="editor-layout">
      {/* Coluna Principal de Edição */}
      <main className="editor-principal">
        <div className="editor-content-area">
          <textarea
            id="post-titulo"
            className="input-titulo"
            placeholder="Título da Postagem"
            value={titulo}
            onChange={handleInputChange(setTitulo)}
            required
            disabled={isSubmitting}
            rows={1}
          />
          <textarea
            id="post-subtitulo"
            className="input-subtitulo"
            placeholder="Subtítulo"
            value={subtitulo}
            onChange={handleInputChange(setSubtitulo)}
            disabled={isSubmitting}
            rows={1}
          />

          <div className="tiptap-editor-wrapper">
            {editor && (
              <TiptapToolbar
                editor={editor}
                onSetLink={setLink}
                onAddImageFromFile={handleAddImageClick}
                onInsertEmbed={setEmbed}
              />
            )}
            <EditorContent editor={editor} className="tiptap-content" />

            {editor && (
              <BubbleMenu
                className="bubble-menu"
                editor={editor}
                shouldShow={({ editor, view, state, from, to }) => {
                  // Não mostra o menu se a seleção estiver vazia
                  if (from === to) {
                    return false;
                  }

                  // Não mostra este menu se um nó de imagem ou iframe estiver ativo
                  if (
                    editor.isActive("image") ||
                    editor.isActive("iframe") ||
                    editor.isActive("instagram")
                  ) {
                    return false;
                  }

                  // Mostra apenas para seleção de texto
                  return true;
                }}
              >
                {/* Melhoria: Adicionando mais opções ao BubbleMenu */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "is-active" : ""}
                  title="Negrito"
                >
                  <FaBold />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "is-active" : ""}
                  title="Itálico"
                >
                  <FaItalic />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 }) ? "is-active" : ""
                  }
                  title="Título 2"
                >
                  <FaHeading />2
                </button>
                <button
                  type="button"
                  onClick={setLink}
                  className={editor.isActive("link") ? "is-active" : ""}
                  title="Adicionar Link"
                >
                  <FaLink />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={
                    editor.isActive({ textAlign: "left" }) ? "is-active" : ""
                  }
                  title="Alinhar à Esquerda"
                >
                  <FaAlignLeft />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={
                    editor.isActive({ textAlign: "center" }) ? "is-active" : ""
                  }
                  title="Alinhar ao Centro"
                >
                  <FaAlignCenter />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={
                    editor.isActive({ textAlign: "right" }) ? "is-active" : ""
                  }
                  title="Alinhar à Direita"
                >
                  <FaAlignRight />
                </button>
                {/* CORREÇÃO: Adicionada a opção de justificar */}
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  className={
                    editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
                  }
                  title="Justificar"
                >
                  <FaAlignJustify />
                </button>
              </BubbleMenu>
            )}

            {editor && (
              <FloatingMenu className="floating-menu" editor={editor}>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  title="Título 2"
                >
                  <FaHeading />2
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  title="Título 3"
                >
                  <FaHeading />3
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={editor.isActive("bulletList") ? "is-active" : ""}
                  title="Lista"
                >
                  <FaListUl />
                </button>
                {/* CORREÇÃO: Adicionadas opções de alinhamento */}
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={
                    editor.isActive({ textAlign: "left" }) ? "is-active" : ""
                  }
                  title="Alinhar à Esquerda"
                >
                  <FaAlignLeft />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={
                    editor.isActive({ textAlign: "center" }) ? "is-active" : ""
                  }
                  title="Alinhar ao Centro"
                >
                  <FaAlignCenter />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={
                    editor.isActive({ textAlign: "right" }) ? "is-active" : ""
                  }
                  title="Alinhar à Direita"
                >
                  <FaAlignRight />
                </button>
                <button
                  type="button"
                  onClick={handleAddImageClick}
                  title="Adicionar Imagem"
                >
                  <FaImage />
                </button>
                <button
                  type="button"
                  onClick={setEmbed}
                  title="Inserir Vídeo/Embed"
                >
                  <FaVideo />
                </button>
              </FloatingMenu>
            )}

            {editor && (
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100, placement: "top-start" }}
                // A chave é esta função: ela decide quando o menu deve aparecer.
                shouldShow={({ editor }) => {
                  // Mostra o menu apenas se o nó ativo for uma imagem ou um iframe.
                  return (
                    editor.isActive("image") ||
                    editor.isActive("iframe") ||
                    editor.isActive("instagram")
                  );
                }}
              >
                <div className="node-selection-menu">
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().deleteSelection().run()
                    }
                    className="button-post danger small"
                    title="Deletar Item"
                  >
                    <FaTrashAlt /> Deletar
                  </button>
                </div>
              </BubbleMenu>
            )}
          </div>
        </div>
      </main>

      {/* Barra Lateral de Configurações */}
      <aside className="editor-barra-lateral">
        <div className="sidebar-section form-actions">
          <button
            type="submit"
            disabled={isSubmitting || autoSaveStatus === "saving"}
            className="button-post primary"
          >
            <FaPaperPlane />{" "}
            {isSubmitting
              ? isEditMode
                ? "Salvando..."
                : "Publicando..."
              : isEditMode
                ? "Salvar"
                : "Publicar"}
          </button>
          <button
            type="button"
            onClick={handleManualDraftSave}
            disabled={isSubmitting || autoSaveStatus === "saving"}
            className="button-post secundary "
          >
            <FaSave />{" "}
            {autoSaveStatus === "saving" ? "Salvando..." : "Rascunho"}
          </button>
        </div>
        {isEditMode && (
          <div className="sidebar-section">
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="button-post tertiary link-like"
            >
              Cancelar edição
            </button>
          </div>
        )}

        <div className="sidebar-section">
          <h3 className="sidebar-title">Configurações</h3>
          <div className="post-input-group">
            <label>Categoria</label>{" "}
            {/* O 'htmlFor' não é mais necessário aqui */}
            <CustomSelect
              options={categoriaOptions}
              selectedValue={categoria}
              onChange={(value) => {
                setCategoria(value);
                setIsDirty(true);
              }}
            />
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Imagem de Destaque</h3>
          <div className="post-input-group">
            <label htmlFor="post-imagem" className="post-file-label">
              {finalCroppedImageUrl ? "Substituir Imagem" : "Selecionar Imagem"}
            </label>
            <input
              id="post-imagem"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              disabled={isSubmitting}
              style={{ display: "none" }}
            />
            <small className="post-input-hint">
              JPG, PNG. Máx: {MAX_FEATURE_IMAGE_SIZE_MB}MB.
            </small>
          </div>

          {imageSrc && (
            <div className="cropper-post-section">
              <div className="cropper-post-container">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  objectFit="contain"
                />
              </div>
              <div className="cropper-post-controls">
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  disabled={isSubmitting}
                />
                <div className="control-actions">
                  <button
                    type="button"
                    className="button-post success small"
                    onClick={handleConfirmCrop}
                    disabled={isSubmitting}
                  >
                    {" "}
                    <FaCheck /> Confirmar{" "}
                  </button>
                  <button
                    type="button"
                    className="button-post secondary small"
                    onClick={handleCancelCrop}
                    disabled={isSubmitting}
                  >
                    {" "}
                    <FaTimes /> Cancelar{" "}
                  </button>
                </div>
              </div>
            </div>
          )}

          {finalCroppedImageUrl && (
            <div className="image-preview">
              <div className="preview-content">
                <img
                  src={finalCroppedImageUrl}
                  alt="Preview da Imagem de Destaque"
                />
                <button
                  type="button"
                  className="button-post danger small icon-only"
                  onClick={handleRemoveFinalImage}
                  disabled={isSubmitting}
                  title="Remover Imagem"
                >
                  <FaTrashAlt />
                </button>
              </div>
              <div className="post-input-group">
                <label htmlFor="feature-image-caption">Legenda da imagem</label>
                <input
                  id="feature-image-caption"
                  type="text"
                  value={featureImageCaption}
                  onChange={handleInputChange(setFeatureImageCaption)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Agendamento</h3>
          <div className="post-input-group">
            <label htmlFor="scheduled-date">Data</label>
            <input
              id="scheduled-date"
              type="date"
              value={scheduledDate}
              onChange={handleInputChange(setScheduledDate)}
              disabled={isSubmitting}
            />
          </div>
          <div className="post-input-group">
            <label htmlFor="scheduled-time">Hora</label>
            <input
              id="scheduled-time"
              type="time"
              value={scheduledTime}
              onChange={handleInputChange(setScheduledTime)}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </aside>

      {/* Hidden input for Tiptap image uploads */}
      <input
        type="file"
        accept="image/*"
        ref={tiptapImageInputRef}
        onChange={handleTiptapImageUpload}
        style={{ display: "none" }}
      />
    </form>
  );
};

CriarPost.propTypes = {
  onPostCreated: PropTypes.func,
  onPostUpdated: PropTypes.func,
  onCancelEdit: PropTypes.func,
  apiClient: PropTypes.object.isRequired,
  authorName: PropTypes.string,
  postToEdit: PropTypes.object,
  showFeedback: PropTypes.func,
};

export default CriarPost;
