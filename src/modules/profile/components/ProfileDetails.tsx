'use client';

import { Button } from '@/components/ux/Button';
import { Input } from '@/components/ux/Input'; 
import { useAuth } from '@/contexts/authContext';
import { deleteUserFile, uploadUserFile } from '@/services/media/mediaService';
import { updateUser } from '@/services/user/userService';
import { SquarePen, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ProfileData } from '../schemas/profileSchema';
import Spinner from '@/components/ux/Spinner';
import { Toast } from '@/components/ux/Toast';
import { AlertDialog } from '@/components/ux/AlertDialog';

/**
 * Interfaz para representar los campos editables del usuario en el formulario.
 */
interface EditableUser {
  id: number
  name: string
  lastname: string
  dni: string
  email: string
  gender: string
  profileImage?: string
  phone: string
  birthDate: string
}

const genders = [
  { label: "Masculino", value: "MALE" },
  { label: "Femenino", value: "FEMALE" },
  { label: "Otro", value: "UNSPECIFIED" },
];

/**
 * Componente ProfileDetails
 *
 * Muestra y permite editar el perfil del usuario.
 * - Campos editables: género, correo, teléfono.
 * - Campos de solo lectura: nombre, apellido, DNI.
 * - Permite editar o eliminar la foto de perfil.
 *
 * Funcionalidades:
 * - Obtiene los datos del usuario desde el contexto Auth.
 * - Carga los géneros disponibles desde el backend.
 * - Detecta cambios para habilitar/deshabilitar el botón "Guardar cambios".
 * - Actualiza el perfil usando el servicio `updateUser`.
 * - Refresca los datos del usuario y redirige a `/profile` después de guardar.
 */
export default function ProfileDetails() {
  const { user, fetchUser, setPrevImage } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const { resetPrevImage } = useAuth();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  const [editableUser, setEditableUser] = useState<EditableUser>({
    id: 0,
    name: '',
    lastname: '',
    dni: '',
    email: '',
    gender: '',
    profileImage: '',
    phone: '',
    birthDate:'',
    });
  
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    return () => {
      if (selectedFile) URL.revokeObjectURL(selectedFile.name);
    };
  }, [selectedFile]);


  useEffect(() => {
    if (user) {
      setEditableUser({
        id: user.id ?? 0,
        name: user.name ?? '',
        lastname: user.lastname ?? '',
        dni: user.dni ?? '',
        email: user.email ?? '',
        gender: user.gender ?? 'UNSPECIFIED',
        profileImage: user.profileImage ?? '',
        phone: user.phone ?? '',
        birthDate: user.birthDate ?? '',
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      resetPrevImage(); 
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setIsChanged(false);
      return;
    }
    const profileImageChanged = !!selectedFile || editableUser.profileImage !== (user.profileImage ?? '');
    const changed =
      editableUser.email !== (user.email ?? '') ||
      editableUser.gender !== (user.gender ?? '') ||
      editableUser.phone !== (user.phone ?? '') ||
      profileImageChanged
    setIsChanged(changed);
  }, [editableUser, user, selectedFile]);

  const handleChange = (field: keyof typeof editableUser, value: string) => {
    setEditableUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!user) return;

      if (selectedFile) {
        await uploadUserFile(user.id!, selectedFile);
      }

      const genderValue = editableUser.gender as ProfileData['gender'];

      const response = await updateUser({
        phone: editableUser.phone,
        gender: genderValue,
        removeProfileImage: false,
        file: selectedFile ?? undefined,
      });

      if (response.state === 'ERROR') {
        setLoading(false)
        setToast({ message: response.messages?.[0] ?? 'Error al guardar el perfil', type: 'error' });
        console.error(response.messages[0]);
        return;
      }

      await fetchUser();
      setLoading(false);
      router.push('/profile');
    } catch (error: unknown) {
      setLoading(false)
      setToast({ message:'Error al guardar el perfil', type: 'error' });
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;

      return { data: null, messages: [message], state: "ERROR" };
    }
  };

  const handleEditPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Se valida el tipo de formato de la imagen
    if(!ALLOWED_TYPES.includes(file.type)){
      setToast({ message:'Formato inválido. Solo se permiten PNG, JPG, JPEG y WEBP.', type: 'error' });
      e.target.value = "";
      return
    }

    if(file.size > MAX_FILE_SIZE_BYTES){
      setToast({ message:'La imagen supera el tamaño máximo permitido de 2 MB', type: 'error' });
      e.target.value = "";
      return
    }

    setSelectedFile(file);

    // preview para el header
    const previewUrl = URL.createObjectURL(file);
    setPrevImage(previewUrl);
  };

  const handleDeletePhoto = async () => {
    if (!user) return;

    try {
      await deleteUserFile(user.id!)

      const genderValue= editableUser.gender as ProfileData['gender'];

      const response = await updateUser({
        phone: editableUser.phone,
        gender: genderValue,
        removeProfileImage: true, // borra la imagen en el backend
      });

      if (response.state === 'ERROR') {
        console.error(response.messages[0]);
        return;
      }

      // Actualizar el usuario en el contexto
      await fetchUser();

      // Limpiar la preview en el header
      setPrevImage(null);

      // Opcional: resetear selectedFile
      setSelectedFile(null);

    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;

      return { data: null, messages: [message], state: "ERROR" };
    }
  };

  if (!user ) return <p>Cargando usuario...</p>;

  return (
    <div className="space-y-4 max-w-md">
      {/* Botones para foto */}
      <div className="flex justify-center gap-4">
        <label className="px-4 text-sm flex items-center gap-1 border rounded cursor-pointer">
          <SquarePen size={14} />
          Editar foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleEditPhoto}
          />
        </label>
        <Button
          onClick={handleDeletePhoto}
          className="text-sm flex items-center gap-1"
          variant="danger"
        >
          <Trash size={14} />
          Quitar foto
        </Button>
      </div>

      {/* Formulario */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isChanged) handleSave();
        }}
        className="space-y-4"
      >
        {/* Nombre y Apellido (disabled) */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            value={editableUser.name}
            disabled
          />
          <Input
            label="Apellido"
            value={editableUser.lastname}
            disabled
          />
        </div>



        <div className="grid grid-cols-2 gap-4">
          <Input
            label="DNI"
            value={editableUser.dni}
            disabled
          />

          <Input
            label="Fecha de nacimiento"
            value={editableUser.birthDate}
            disabled
          />

        </div>
        

        <Input
          label="Correo"
          type="email"
          value={editableUser.email}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled
          className="w-full"
        />


        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Celular"
            value={editableUser.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />

          <div className="flex flex-col">
            <label className="mb-1 text-dark-4 dark:text-gray-1 font-regular font-inter text-sm">
              Género
            </label>
            <select
              value={editableUser.gender}
              onChange={(e) => {
                handleChange("gender", e.target.value);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-dark-5 dark:border-gray-2 dark:text-white"
            >
              <option value="">Seleccionar</option>
              {genders.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>

          </div>
        </div>

        <button
          type="submit"
          disabled={!isChanged}
          className={`w-full px-4 py-2 rounded-lg , ${
            isChanged ? 
                'bg-transparent border border-gray-400 text-gray-700 dark:border-gray-5 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-2 focus:ring-gray-400 cursor-pointer' 
            : 
                ' cursor-not-allowed text-gray-700 dark:text-gray-3 dark:bg-gray-2 focus:ring-gray-400'
          }`}
        >
          {loading ? (
              <div className="flex items-center justify-center gap-2">
                  <Spinner size={20} />
                  <span>Guardando...</span>
              </div>
          ) : (
              'Guardar cambios'
          )}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        title="Tienes cambios sin guardar"
        description="Si sales de esta página perderás los cambios realizados, incluida la foto de perfil."
        confirmText="Salir sin guardar"
        cancelText="Cancelar"
        onConfirm={() => {
          resetPrevImage();
          setIsChanged(false);

          if (pendingNavigation === "back") {
            router.back();
          } else if (pendingNavigation) {
            router.push(pendingNavigation);
          }

          setPendingNavigation(null);
          setIsAlertOpen(false);
        }}
        onClose={() => {
          setPendingNavigation(null);
          setIsAlertOpen(false);
        }}
      />
    </div>
  );
}
