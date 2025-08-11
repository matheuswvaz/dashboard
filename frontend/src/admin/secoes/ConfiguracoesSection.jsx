import React, { useState, useCallback, useRef, useEffect } from "react";
import apiClient from "../../utils/axios";
import { getCroppedImgUtil } from "../../utils/imageUtils";
import Cropper from "react-easy-crop";
import { Button } from "../ui/Button";
import {
  FaUserCircle,
  FaEnvelope,
  FaKey,
  FaUpload,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaCog,
} from "react-icons/fa";

/* --- Início: Componente AccountSettings --- */
// Seção de configurações da conta do usuário administrador.
const AccountSettings = ({ userData, showFeedback, onUserUpdate }) => {
  // Estados para gerenciar os formulários e o processo de upload de foto.
  const [name, setName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalCroppedImage, setFinalCroppedImage] = useState(null);
  const [finalCroppedImageUrl, setFinalCroppedImageUrl] = useState("");
  const photoInputRef = useRef(null);
  const isMountedRef = useRef(true);

  // Hook para garantir que o componente está montado antes de atualizar o estado.
  useEffect(() => {
    isMountedRef.current = true;
    const currentImageSrcUrl = imageSrc;
    const currentFinalUrl = finalCroppedImageUrl;
    return () => {
      isMountedRef.current = false;
      if (currentImageSrcUrl?.startsWith("blob:"))
        URL.revokeObjectURL(currentImageSrcUrl);
      if (currentFinalUrl?.startsWith("blob:"))
        URL.revokeObjectURL(currentFinalUrl);
    };
  }, [imageSrc, finalCroppedImageUrl]);

  // Limpa a seleção de imagem.
  const clearImageSelection = useCallback(() => {
    if (imageSrc?.startsWith("blob:")) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    if (finalCroppedImageUrl?.startsWith("blob:"))
      URL.revokeObjectURL(finalCroppedImageUrl);
    setFinalCroppedImage(null);
    setFinalCroppedImageUrl("");
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }, [imageSrc, finalCroppedImageUrl]);

  // Manipula a seleção de um arquivo de foto.
  const handlePhotoSelect = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      clearImageSelection();
      if (!file) return;
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        showFeedback(
          "error",
          "Tipo de arquivo inválido (JPG, PNG, GIF, WEBP)."
        );
        clearImageSelection();
        return;
      }
      if (file.size > maxSize) {
        showFeedback("error", `Imagem muito grande (Máx: 5MB).`);
        clearImageSelection();
        return;
      }
      setImageSrc(URL.createObjectURL(file));
    },
    [clearImageSelection, showFeedback]
  );

  // Confirma o recorte da imagem.
  const handleConfirmCrop = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) {
      showFeedback("warning", "Ajuste a imagem antes de confirmar.");
      return;
    }
    try {
      const croppedBlob = await getCroppedImgUtil(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      if (!croppedBlob) throw new Error("Falha ao cortar.");
      const finalFile = new File(
        [croppedBlob],
        `profile_crop_${Date.now()}.jpg`,
        {
          type: croppedBlob.type || "image/jpeg",
        }
      );
      if (isMountedRef.current) {
        if (finalCroppedImageUrl?.startsWith("blob:"))
          URL.revokeObjectURL(finalCroppedImageUrl);
        setFinalCroppedImage(finalFile);
        setFinalCroppedImageUrl(URL.createObjectURL(finalFile));
        if (imageSrc?.startsWith("blob:")) URL.revokeObjectURL(imageSrc);
        setImageSrc(null);
        if (photoInputRef.current) photoInputRef.current.value = "";
      }
    } catch (e) {
      if (isMountedRef.current)
        showFeedback("error", `Erro ao preparar imagem: ${e.message}`);
      clearImageSelection();
    }
  }, [
    imageSrc,
    croppedAreaPixels,
    rotation,
    finalCroppedImageUrl,
    showFeedback,
    clearImageSelection,
  ]);

  // Cancela a operação de recorte.
  const handleCancelCrop = useCallback(
    () => clearImageSelection(),
    [clearImageSelection]
  );

  // Remove a imagem preparada para upload.
  const handleRemoveFinalPreparedImage = useCallback(
    () => clearImageSelection(),
    [clearImageSelection]
  );

  // Remove a foto de perfil existente do usuário.
  const handleRemoveExistingPhoto = useCallback(async () => {
    if (!userData?.foto_url || isRemovingPhoto || isUploadingPhoto) return;
    if (window.confirm("Remover sua foto de perfil atual?")) {
      setIsRemovingPhoto(true);
      showFeedback("info", "Removendo foto...");
      try {
        const res = await apiClient.delete("/api/admin/profile/photo");
        if (res.data?.success) {
          showFeedback("success", "Foto removida!");
          if (onUserUpdate) onUserUpdate({ ...userData, foto_url: null });
        } else {
          throw new Error(res.data?.message || "Falha ao remover.");
        }
      } catch (e) {
        showFeedback(
          "error",
          `Erro: ${e.response?.data?.message || e.message}`
        );
      } finally {
        if (isMountedRef.current) setIsRemovingPhoto(false);
      }
    }
  }, [userData, showFeedback, onUserUpdate, isRemovingPhoto, isUploadingPhoto]);

  // Realiza o upload da nova foto de perfil.
  const handlePhotoUpload = useCallback(async () => {
    if (!finalCroppedImage || isUploadingPhoto || isRemovingPhoto) {
      if (!finalCroppedImage) showFeedback("warning", "Nada para enviar.");
      return;
    }
    setIsUploadingPhoto(true);
    showFeedback("info", "Enviando foto...");
    const fd = new FormData();
    fd.append("profilePhoto", finalCroppedImage, finalCroppedImage.name);
    try {
      const res = await apiClient.post("/api/admin/profile/photo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success && res.data.data?.foto_url) {
        showFeedback("success", "Foto atualizada!");
        clearImageSelection();
        if (onUserUpdate)
          onUserUpdate({ ...userData, foto_url: res.data.data.foto_url });
      } else {
        throw new Error(res.data?.message || "Falha no upload.");
      }
    } catch (e) {
      showFeedback("error", `Erro: ${e.response?.data?.message || e.message}`);
    } finally {
      if (isMountedRef.current) setIsUploadingPhoto(false);
    }
  }, [
    finalCroppedImage,
    showFeedback,
    clearImageSelection,
    onUserUpdate,
    userData,
    isUploadingPhoto,
    isRemovingPhoto,
  ]);

  // Submete as alterações de perfil (nome e email).
  const handleProfileSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        isSavingProfile ||
        isSavingPassword ||
        isUploadingPhoto ||
        isRemovingPhoto ||
        imageSrc
      )
        return;
      setIsSavingProfile(true);
      showFeedback("info", "Salvando perfil...");
      try {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          throw new Error("Email inválido.");
        if (!name || name.trim().length === 0)
          throw new Error("Nome obrigatório.");
        const res = await apiClient.put("/api/admin/profile", {
          name: name.trim(),
          email: email.trim(),
        });
        if (res.data?.success) {
          showFeedback("success", "Perfil atualizado!");
          if (onUserUpdate)
            onUserUpdate({
              ...userData,
              name: name.trim(),
              email: email.trim(),
            });
        } else {
          throw new Error(res.data?.message || "Falha ao salvar.");
        }
      } catch (e) {
        showFeedback(
          "error",
          `Erro: ${e.response?.data?.message || e.message}`
        );
      } finally {
        if (isMountedRef.current) setIsSavingProfile(false);
      }
    },
    [
      name,
      email,
      showFeedback,
      onUserUpdate,
      userData,
      isSavingProfile,
      isSavingPassword,
      isUploadingPhoto,
      isRemovingPhoto,
      imageSrc,
    ]
  );

  // Submete a alteração de senha.
  const handlePasswordSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        isSavingProfile ||
        isSavingPassword ||
        isUploadingPhoto ||
        isRemovingPhoto ||
        imageSrc
      )
        return;
      if (!currentPassword || !newPassword || !confirmPassword) {
        showFeedback("error", "Preencha todas as senhas.");
        return;
      }
      if (newPassword.length < 6) {
        showFeedback("error", "Nova senha curta (mín. 6).");
        return;
      }
      if (newPassword !== confirmPassword) {
        showFeedback("error", "Senhas não batem.");
        return;
      }
      if (newPassword === currentPassword) {
        showFeedback("warning", "Nova senha igual à atual.");
        return;
      }
      setIsSavingPassword(true);
      showFeedback("info", "Alterando senha...");
      try {
        const res = await apiClient.put("/api/admin/profile/password", {
          currentPassword,
          newPassword,
        });
        if (res.data?.success) {
          showFeedback("success", "Senha alterada!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          throw new Error(res.data?.message || "Falha ao alterar.");
        }
      } catch (e) {
        showFeedback(
          "error",
          `Erro: ${e.response?.data?.message || e.message}`
        );
        setNewPassword("");
        setConfirmPassword("");
      } finally {
        if (isMountedRef.current) setIsSavingPassword(false);
      }
    },
    [
      currentPassword,
      newPassword,
      confirmPassword,
      showFeedback,
      isSavingProfile,
      isSavingPassword,
      isUploadingPhoto,
      isRemovingPhoto,
      imageSrc,
    ]
  );

  return (
    <div className="app-dashboard-section">
      <h2 className="app-section-title">
        <span>
          <FaCog />
        </span>{" "}
        <span>Configurações da Conta</span>
      </h2>
      <div className="app-form-section">
        <h3 className="app-form-subheader">
          <FaUserCircle /> Foto de Perfil
        </h3>
        <div className="profile-photo-area">
          <div className="profile-photo-preview-container">
            <img
              src={
                finalCroppedImageUrl ||
                userData?.foto_url ||
                "/placeholder-avatar.jpg"
              }
              alt="Avatar"
              className="profile-photo-preview"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-avatar.jpg";
              }}
            />
          </div>
          <input
            type="file"
            id="photo-upload-input"
            accept="image/*"
            onChange={handlePhotoSelect}
            style={{ display: "none" }}
            ref={photoInputRef}
            disabled={
              isUploadingPhoto ||
              isRemovingPhoto ||
              isSavingProfile ||
              isSavingPassword ||
              !!imageSrc
            }
          />
          <div className="profile-photo-actions">
            {!imageSrc && !finalCroppedImage && (
              <label
                htmlFor="photo-upload-input"
                className={`app-button secondary small ${isUploadingPhoto || isRemovingPhoto || isSavingProfile || isSavingPassword ? "disabled" : ""}`}
                aria-disabled={
                  isUploadingPhoto ||
                  isRemovingPhoto ||
                  isSavingProfile ||
                  isSavingPassword
                }
              >
                <FaUpload />{" "}
                <span className="app-button-text">
                  {userData?.foto_url ? "Trocar Foto" : "Selecionar Foto"}
                </span>
              </label>
            )}
            {!imageSrc && !finalCroppedImage && userData?.foto_url && (
              <Button
                className="remove-photo-button"
                variant="danger"
                size="small"
                onClick={handleRemoveExistingPhoto}
                isLoading={isRemovingPhoto}
                disabled={
                  isUploadingPhoto ||
                  isRemovingPhoto ||
                  isSavingProfile ||
                  isSavingPassword
                }
                textIcon={<FaTrashAlt />}
              >
                Remover Foto Atual
              </Button>
            )}
            {(imageSrc || finalCroppedImage) && (
              <Button
                variant="secondary"
                size="small"
                onClick={
                  imageSrc ? handleCancelCrop : handleRemoveFinalPreparedImage
                }
                disabled={isUploadingPhoto || isRemovingPhoto}
                textIcon={<FaTimes />}
              >
                {imageSrc ? "Cancelar Corte" : "Cancelar Nova Foto"}
              </Button>
            )}
          </div>
        </div>
        {imageSrc && (
          <div className="cropper-container-section">
            <h4>Ajuste a Imagem</h4>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "400px",
                height: "350px",
                margin: "0 auto 1rem auto",
                background: "var(--surface-alt)",
              }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                cropShape="round"
                showGrid={false}
              />
            </div>
            <div
              className="cropper-controls-inline"
              style={{ maxWidth: "400px", margin: "0 auto 1rem auto" }}
            >
              <div>
                <label>Zoom:</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  disabled={isUploadingPhoto || isRemovingPhoto}
                />
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <div>
                <label>Girar:</label>
                <input
                  type="range"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  disabled={isUploadingPhoto || isRemovingPhoto}
                />
                <span>{rotation}°</span>
              </div>
            </div>
            <div className="cropper-actions">
              <Button
                variant="success"
                onClick={handleConfirmCrop}
                disabled={
                  !croppedAreaPixels || isUploadingPhoto || isRemovingPhoto
                }
                textIcon={<FaCheck />}
              >
                Confirmar
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancelCrop}
                disabled={isUploadingPhoto || isRemovingPhoto}
                textIcon={<FaTimes />}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
        {finalCroppedImage && !imageSrc && (
          <div className="upload-final-action">
            <p>Nova foto pronta.</p>
            <Button
              variant="primary"
              onClick={handlePhotoUpload}
              isLoading={isUploadingPhoto}
              disabled={
                isUploadingPhoto || isRemovingPhoto || !finalCroppedImage
              }
              textIcon={<FaUpload />}
            >
              {isUploadingPhoto ? "Enviando..." : "Enviar Foto"}
            </Button>
          </div>
        )}
      </div>
      <form
        className="app-form app-form-section"
        onSubmit={handleProfileSubmit}
      >
        <h3 className="app-form-subheader">
          <FaEnvelope /> Informações
        </h3>
        <div className="app-input-group">
          <label htmlFor="profileName">Nome</label>
          <input
            id="profileName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={
              isSavingProfile ||
              isSavingPassword ||
              isUploadingPhoto ||
              isRemovingPhoto ||
              !!imageSrc
            }
          />
        </div>
        <div className="app-input-group">
          <label htmlFor="profileEmail">Email</label>
          <input
            id="profileEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={
              isSavingProfile ||
              isSavingPassword ||
              isUploadingPhoto ||
              isRemovingPhoto ||
              !!imageSrc
            }
          />
        </div>
        <div className="app-form-actions">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSavingProfile}
            disabled={
              isSavingProfile ||
              isSavingPassword ||
              isUploadingPhoto ||
              isRemovingPhoto ||
              !!imageSrc
            }
            textIcon={<FaCheck />}
          >
            {isSavingProfile ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
      <form
        className="app-form app-form-section"
        onSubmit={handlePasswordSubmit}
      >
        <h3 className="app-form-subheader">
          <FaKey /> Alterar Senha
        </h3>
        <div className="app-input-group">
          <label htmlFor="currentPass">Senha Atual</label>
          <input
            id="currentPass"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={
              isSavingPassword ||
              isSavingProfile ||
              isUploadingPhoto ||
              isRemovingPhoto ||
              !!imageSrc
            }
          />
        </div>
        <div className="app-form-row">
          <div className="app-input-group">
            <label htmlFor="newPass">Nova Senha</label>
            <input
              id="newPass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
              disabled={
                isSavingPassword ||
                isSavingProfile ||
                isUploadingPhoto ||
                isRemovingPhoto ||
                !!imageSrc
              }
            />
          </div>
          <div className="app-input-group">
            <label htmlFor="confirmPass">Confirmar</label>
            <input
              id="confirmPass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              disabled={
                isSavingPassword ||
                isSavingProfile ||
                isUploadingPhoto ||
                isRemovingPhoto ||
                !!imageSrc
              }
            />
          </div>
        </div>
        <div className="app-form-actions">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSavingPassword}
            disabled={
              isSavingPassword ||
              isSavingProfile ||
              isUploadingPhoto ||
              isRemovingPhoto ||
              !!imageSrc
            }
            textIcon={<FaCheck />}
          >
            {isSavingPassword ? "Alterando..." : "Alterar Senha"}
          </Button>
        </div>
      </form>
    </div>
  );
};
/* --- Fim: Componente AccountSettings --- */

export default AccountSettings;
